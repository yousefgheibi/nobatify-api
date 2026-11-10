import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service.js';
import { CurrentOwner } from '../common/current-user.decorator.js';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto.js';
import { ServiceResponseDto } from './dto/service-response.dto.js';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
@UseGuards(OwnerGuard)
@ApiBearerAuth()
export class ServiceController {
  constructor(private readonly service: ServiceService) {}

  @Get()
  @ApiOkResponse({ type: [ServiceResponseDto] })
  listServices(@CurrentOwner() owner: Owner): Promise<ServiceResponseDto[]> {
    return this.service.listServices(owner.businessId) as Promise<any>;
  }

  @Post()
  @ApiCreatedResponse({ type: ServiceResponseDto })
  createService(@CurrentOwner() owner: Owner, @Body() dto: CreateServiceDto): Promise<ServiceResponseDto> {
    return this.service.createService(owner.businessId, dto) as Promise<any>;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ServiceResponseDto })
  updateService(
    @CurrentOwner() owner: Owner,
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.service.updateService(owner.businessId, id, dto) as Promise<any>;
  }

  @Delete(':id')
  @ApiOkResponse({ type: ServiceResponseDto, description: 'خدمت غیرفعال‌شده' })
  deactivateService(@CurrentOwner() owner: Owner, @Param('id') id: string): Promise<ServiceResponseDto> {
    return this.service.deactivateService(owner.businessId, id) as Promise<any>;
  }
}
