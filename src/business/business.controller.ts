import { Body, Controller, Get, Param, Patch, UseGuards, } from '@nestjs/common';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { BusinessService } from './business.service.js';
import { UpdateBusinessDto } from './dto/business.dto.js';
import { CurrentOwner } from '../common/current-user.decorator.js';

@Controller('me')
@UseGuards(OwnerGuard)
export class OwnerBusinessController {
  constructor(private readonly business: BusinessService) {}

  @Get('business')
  getBusiness(@CurrentOwner() owner: Owner) {
    return this.business.getBusiness(owner.businessId);
  }

  @Patch('business')
  updateBusiness(@CurrentOwner() owner: Owner, @Body() dto: UpdateBusinessDto) {
    return this.business.updateBusiness(owner.businessId, dto);
  }
}


@Controller('public/businesses')
export class PublicBusinessController {
  constructor(private readonly business: BusinessService) {}

  @Get('slug')
  getBusiness(@Param('slug') slug: string) {
    return this.business.getPublicBusiness(slug);
  }
}
