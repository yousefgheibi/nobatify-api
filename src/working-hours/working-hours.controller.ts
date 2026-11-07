import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { CurrentOwner } from '../common/current-user.decorator.js';
import { WorkingHoursDto } from './dto/working-hours.dto.js';
import { WorkingHoursService } from './working-hours.service.js';

@Controller('working-hours')
@UseGuards(OwnerGuard)
export class WorkingHoursController {
  constructor(private readonly workingHoursService: WorkingHoursService) {}
  
  @Get()
  getHours(@CurrentOwner() owner: Owner) {
    return this.workingHoursService.getWorkingHours(owner.businessId);
  }

  @Put()
  setHours(@CurrentOwner() owner: Owner, @Body() dto: WorkingHoursDto) {
    return this.workingHoursService.setWorkingHours(owner.businessId, dto);
  }
}
