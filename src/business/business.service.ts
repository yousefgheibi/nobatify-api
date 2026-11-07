import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { normalizeIranMobile } from '../common/phone.js';
import { UpdateBusinessDto } from './dto/business.dto.js';
import { toHourView } from '../working-hours/working-hours.service.js';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicBusiness(slug: string) {
    const business = await this.prisma.business.findUnique({
      where: { slug },
      select: {
        slug: true,
        name: true,
        category: true,
        city: true,
        address: true,
        phone: true,
        description: true,
        services: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            name: true,
            priceToman: true,
            durationMin: true,
          },
        },
        hours: {
          orderBy: { weekday: 'asc' },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('صفحه‌ای با این آدرس پیدا نشد');
    }

    return {
      ...business,
      hours: business.hours.map(toHourView),
    };
  }

  getBusiness(businessId: string) {
    return this.prisma.business.findUniqueOrThrow({
      where: { id: businessId },
    });
  }

  async updateBusiness(businessId: string, dto: UpdateBusinessDto) {
    const data = { ...dto };

    if (dto.phone) {
      data.phone = normalizeIranMobile(dto.phone) ?? dto.phone;
    }

    if (dto.slug) {
      const existingBusiness = await this.prisma.business.findFirst({
        where: {
          slug: dto.slug,
          NOT: { id: businessId },
        },
        select: { id: true },
      });

      if (existingBusiness) {
        throw new ConflictException('این آدرس رزرو قبلاً گرفته شده است');
      }
    }

    return this.prisma.business.update({
      where: { id: businessId },
      data,
    });
  }
}
