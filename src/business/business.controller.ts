import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { BusinessService } from './business.service.js';
import { UpdateBusinessDto } from './dto/business.dto.js';
import { CurrentOwner } from '../common/current-user.decorator.js';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class BusinessController {
  constructor(private readonly business: BusinessService) {}

  @Get('business')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  getMyBusiness(@CurrentOwner() owner: Owner) {
    return this.business.getBusiness(owner.businessId);
  }

  @Patch('business')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  updateMyBusiness(
    @CurrentOwner() owner: Owner,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.business.updateBusiness(owner.businessId, dto);
  }

  @Get('public/businesses/:slug')
  getPublicBusiness(@Param('slug') slug: string) {
    return this.business.getPublicBusiness(slug);
  }
}
