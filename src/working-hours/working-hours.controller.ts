import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { CurrentOwner } from '../common/current-user.decorator.js';
import { WorkingHoursDto } from './dto/working-hours.dto.js';
import {
  WorkingHourItemDto,
  WorkingHoursResponseDto,
} from './dto/working-hours-response.dto.js';
import { WorkingHoursService } from './working-hours.service.js';

@ApiTags('working-hours')
@Controller('working-hours')
@UseGuards(OwnerGuard)
@ApiBearerAuth()
export class WorkingHoursController {
  constructor(private readonly workingHoursService: WorkingHoursService) {}

  @Get()
  @ApiOkResponse({
    description: 'ساعات کاری هفته',
    type: [WorkingHourItemDto],
  })
  getHours(@CurrentOwner() owner: Owner): Promise<WorkingHourItemDto[]> {
    return this.workingHoursService.getWorkingHours(owner.businessId);
  }

  @Put()
  @ApiOkResponse({
    description: 'ساعات کاری ذخیره‌شده',
    type: [WorkingHourItemDto],
  })
  setHours(
    @CurrentOwner() owner: Owner,
    @Body() dto: WorkingHoursDto,
  ): Promise<WorkingHourItemDto[]> {
    return this.workingHoursService.setWorkingHours(owner.businessId, dto);
  }
}