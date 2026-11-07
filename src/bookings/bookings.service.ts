import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AvailabilityQueryDto, BookingRequestDto, ListBookingsQueryDto } from './dto/bookings.dto.js';
import { DAY_MS, formatHHmm, iranianWeekday, tehranDateOf, tehranDayStart } from '../common/date-helper.js';
import { BookingStatus, Prisma } from '../../generated/prisma/client.js';
import { normalizeIranMobile } from '../common/phone.js';
import { randomInt } from 'crypto';
import { freeSlots } from '../common/slots.js';

const BLOCKING: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED];
const CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; 

export interface BookingViewSource {
  trackingCode: string;
  status: BookingStatus;
  serviceName: string;
  priceToman: number;
  startsAt: Date;
  endsAt: Date;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForOwner(businessId: string, q: ListBookingsQueryDto) {
    const where: Prisma.BookingWhereInput = { businessId };

    if (q.status) where.status = q.status as BookingStatus;
    if (q.date) {
      const dayStart = tehranDayStart(q.date);
      if (!dayStart) throw new BadRequestException('تاریخ نامعتبر است');
      where.startsAt = { gte: dayStart, lt: new Date(dayStart.getTime() + DAY_MS) };
    }

    const rows = await this.prisma.booking.findMany({
      where,
      orderBy: { startsAt: 'asc' },
    });
    return rows.map((b) => toView(b, ''));
  }

  confirm(businessId: string, id: string) {
    return this.move(businessId, id, BookingStatus.CONFIRMED, [BookingStatus.PENDING]);
  }

  cancel(businessId: string, id: string) {
    return this.move(businessId, id, BookingStatus.CANCELLED, [BookingStatus.PENDING, BookingStatus.CONFIRMED]);
  }

  private async move(businessId: string, id: string, to: BookingStatus, from: BookingStatus[]) {
    const b = await this.prisma.booking.findFirst({
      where: { id, businessId },
      include: { business: { select: { name: true } } },
    });
    if (!b) throw new NotFoundException('نوبت پیدا نشد');

    const res = await this.prisma.booking.updateMany({
      where: { id, businessId, status: { in: from } },
      data: { status: to },
    });
    if (res.count === 0)
      throw new ConflictException('وضعیت این نوبت قابل تغییر نیست');

    // TODO: send sms
    return { id, status: to };
  }


  // public 
  async availability(slug: string, q: AvailabilityQueryDto) {
    const dayStart = tehranDayStart(q.date);
    if (!dayStart) throw new BadRequestException('تاریخ نامعتبر است');

    const business = await this.findBusiness(slug);
    const service = await this.findService(business.id, q.serviceId);
    const day = business.hours.find((h) => h.weekday === iranianWeekday(q.date));
    const busy = await this.busyBetween(business.id, dayStart);

    const free = freeSlots({ dateOnly: q.date, hours: day, durationMin: service.durationMin, busy, now: new Date() });
    return {
      date: q.date,
      slots: free.map((s) => ({
        startsAt: s.toISOString(),
        time: formatHHmm((s.getTime() - dayStart.getTime()) / 60_000),
      })),
    };
  }

  async createRequest(slug: string, dto: BookingRequestDto) {
    const phone = normalizeIranMobile(dto.customerPhone);
    if (!phone) throw new BadRequestException('شماره موبایل معتبر نیست');

    const startsAt = new Date(dto.startsAt);
    if (startsAt.getTime() <= Date.now()) throw new BadRequestException('زمان انتخاب‌شده گذشته است');

    const business = await this.findBusiness(slug);
    const service = await this.findService(business.id, dto.serviceId);
    const dateOnly = tehranDateOf(startsAt);
    const dayStart = tehranDayStart(dateOnly)!;
    const day = business.hours.find((h) => h.weekday === iranianWeekday(dateOnly));
    const endsAt = new Date(startsAt.getTime() + service.durationMin * 60_000);

    const booking = await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM "Business" WHERE id = ${business.id} FOR UPDATE`;

      const busy = await tx.booking.findMany({
        where: {
          businessId: business.id,
          status: { in: BLOCKING },
          startsAt: { lt: new Date(dayStart.getTime() + DAY_MS) },
          endsAt: { gt: dayStart },
        },
        select: { startsAt: true, endsAt: true },
      });

      const free = freeSlots({ dateOnly, hours: day, durationMin: service.durationMin, busy, now: new Date() });
      if (!free.some((s) => s.getTime() === startsAt.getTime())) {
        throw new ConflictException('این ساعت دیگر آزاد نیست. لطفاً ساعت دیگری انتخاب کنید.');
      }

      return tx.booking.create({
        data: {
          trackingCode: newTrackingCode(),
          businessId: business.id,
          serviceId: service.id,
          customerName: dto.customerName.trim(),
          customerPhone: phone,
          serviceName: service.name,
          priceToman: service.priceToman,
          startsAt,
          endsAt,
        },
      });
    });

    return toView(booking, business.name);
  }

  async track(code: string) {
    const b = await this.prisma.booking.findUnique({
      where: { trackingCode: code },
      include: { business: { select: { name: true } } },
    });
    if (!b) throw new NotFoundException('درخواستی با این کد پیدا نشد');
    return toView(b, b.business.name);
  }
  
 // hepler method
 private async findBusiness(slug: string) {
    const b = await this.prisma.business.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        hours: { select: { weekday: true, isOpen: true, opensMin: true, closesMin: true } },
      },
    });
    if (!b) throw new NotFoundException('صفحه‌ای با این آدرس پیدا نشد');
    return b;
  }

  private async findService(businessId: string, serviceId: string) {
    const s = await this.prisma.service.findFirst({
      where: { id: serviceId, businessId, isActive: true },
      select: { id: true, name: true, priceToman: true, durationMin: true },
    });
    if (!s) throw new NotFoundException('خدمت پیدا نشد');
    return s;
  }

  private busyBetween(businessId: string, dayStart: Date) {
    return this.prisma.booking.findMany({
      where: {
        businessId,
        status: { in: BLOCKING },
        startsAt: { lt: new Date(dayStart.getTime() + DAY_MS) },
        endsAt: { gt: dayStart },
      },
      select: { startsAt: true, endsAt: true },
    });
  }

}

function toView(b: BookingViewSource, businessName: string) {
  return {
    trackingCode: b.trackingCode,
    status: b.status,
    businessName,
    serviceName: b.serviceName,
    priceToman: b.priceToman,
    startsAt: b.startsAt.toISOString(),
    endsAt: b.endsAt.toISOString(),
  };
}

function newTrackingCode(): string {
  return Array.from({ length: 10 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join('');
}
