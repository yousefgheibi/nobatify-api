import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service.js';
import { CurrentOwner } from '../common/current-user.decorator.js';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto.js';

@Controller('services')
@UseGuards(OwnerGuard)
export class ServiceController {
    constructor(private readonly service: ServiceService){}

  @Get('')
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
