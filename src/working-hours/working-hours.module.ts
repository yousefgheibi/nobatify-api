import { Module } from '@nestjs/common';
import { WorkingHoursService } from './working-hours.service.js';
import { WorkingHoursController } from './working-hours.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  imports: [AuthModule],
  providers: [WorkingHoursService,PrismaService],
  controllers: [WorkingHoursController]
})
export class WorkingHoursModule {}
