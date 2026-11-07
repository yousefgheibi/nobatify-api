import { Module } from '@nestjs/common';
import { BusinessService } from './business.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { BusinessController } from './business.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [BusinessController],
  providers: [BusinessService, PrismaService],
  exports: [BusinessService],
})
export class BusinessModule {}
