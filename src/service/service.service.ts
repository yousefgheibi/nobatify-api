import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto.js';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async listServices(businessId: string) {
    return await this.prisma.service.findMany({
      where: { businessId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createService(businessId: string, dto: CreateServiceDto) {
    return await this.prisma.service.create({
      data: {
        ...dto,
        businessId,
      },
    });
  }

  async updateService(businessId: string, serviceId: string, dto: UpdateServiceDto) {
    await this.ensureServiceOwned(businessId, serviceId);

    return await this.prisma.service.update({
      where: { id: serviceId },
      data: dto,
    });
  }

  async deactivateService(businessId: string, serviceId: string) {
    await this.ensureServiceOwned(businessId, serviceId);

    return await this.prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });
  }

  private async ensureServiceOwned(businessId: string, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, businessId },
      select: { id: true },
    });

    if (!service) {
      throw new NotFoundException('خدمت پیدا نشد');
    }
  }
}