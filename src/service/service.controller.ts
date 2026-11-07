import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service.js';
import { CurrentOwner } from '../common/current-user.decorator.js';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('services')
@UseGuards(OwnerGuard)
@ApiBearerAuth()
export class ServiceController {
    constructor(private readonly service: ServiceService){}

  @Get()
  listServices(@CurrentOwner() owner: Owner, @Body() dto: CreateServiceDto) {
    return this.service.listServices(owner.businessId);
  }

  @Post()
  createService(@CurrentOwner() owner: Owner, @Body() dto: CreateServiceDto) {
    return this.service.createService(owner.businessId, dto);
  }

  @Patch(':id')
  updateService(
    @CurrentOwner() owner: Owner,
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.service.updateService(owner.businessId, id, dto);
  }

  @Delete(':id')
  deactivateService(@CurrentOwner() owner: Owner, @Param('id') id: string) {
    return this.service.deactivateService(owner.businessId, id);
  }

}
