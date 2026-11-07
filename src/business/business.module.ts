import { Module } from '@nestjs/common';
import { BusinessService } from './business.service.js';
import { OwnerBusinessController, PublicBusinessController } from './business.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [OwnerBusinessController, PublicBusinessController],
  providers: [BusinessService, PrismaService],
  exports: [BusinessService],
})
export class BusinessModule {}
