import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { BusinessService } from './business.service.js';
import { UpdateBusinessDto } from './dto/business.dto.js';
import { BusinessResponseDto, PublicBusinessResponseDto } from './dto/business-response.dto.js';
import { CurrentOwner } from '../common/current-user.decorator.js';

@ApiTags('business')
@Controller()
export class BusinessController {
  constructor(private readonly business: BusinessService) {}

  @Get('business')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BusinessResponseDto })
  getMyBusiness(@CurrentOwner() owner: Owner) {
    return this.business.getBusiness(owner.businessId);
  }

  @Patch('business')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BusinessResponseDto })
  updateMyBusiness(
    @CurrentOwner() owner: Owner,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.business.updateBusiness(owner.businessId, dto);
  }

  @Get('public/businesses/:slug')
  @ApiOkResponse({ type: PublicBusinessResponseDto })
  getPublicBusiness(@Param('slug') slug: string) {
    return this.business.getPublicBusiness(slug);
  }
}