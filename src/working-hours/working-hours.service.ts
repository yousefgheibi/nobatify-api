import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkingHoursDto } from './dto/working-hours.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { formatHHmm, parseHHmm } from '../common/date-helper.js';
import { WorkingHourItemDto } from './dto/working-hours-response.dto.js';

@Injectable()
export class WorkingHoursService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkingHours(businessId: string): Promise<WorkingHourItemDto[]>{
    const rows = await this.prisma.workingHour.findMany({
      where: { businessId },
      orderBy: { weekday: 'asc' },
    });
    return rows.map(toHourView);
  }

  async setWorkingHours(businessId: string, dto: WorkingHoursDto): Promise<WorkingHourItemDto[]> {
    if (new Set(dto.days.map((d) => d.weekday)).size !== 7) {
      throw new BadRequestException('همه‌ی ۷ روز هفته باید ارسال شوند');
    }
    const rows = dto.days.map((d) => {
      const opensMin = parseHHmm(d.opensAt);
      const closesMin = parseHHmm(d.closesAt);
      if (opensMin === null || closesMin === null)
        throw new BadRequestException('فرمت ساعت نادرست است');
      if (d.isOpen && closesMin <= opensMin)
        throw new BadRequestException('ساعت پایان باید بعد از شروع باشد');
      return { weekday: d.weekday, isOpen: d.isOpen, opensMin, closesMin };
    });

    await this.prisma.$transaction(
      rows.map((r) =>
        this.prisma.workingHour.upsert({
          where: { businessId_weekday: { businessId, weekday: r.weekday } },
          create: { businessId, ...r },
          update: {
            isOpen: r.isOpen,
            opensMin: r.opensMin,
            closesMin: r.closesMin,
          },
        }),
      ),
    );
    return this.getWorkingHours(businessId);
  }
}

/** Stored minutes -> "HH:mm" strings, the same format PUT accepts. */
export function toHourView(hour: {
  weekday: number;
  isOpen: boolean;
  opensMin: number;
  closesMin: number;
}) {
  return {
    weekday: hour.weekday,
    isOpen: hour.isOpen,
    opensAt: formatHHmm(hour.opensMin),
    closesAt: formatHHmm(hour.closesMin),
  };
}
