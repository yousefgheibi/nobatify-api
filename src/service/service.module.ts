import { Module } from '@nestjs/common';
import { ServiceService } from './service.service.js';
import { ServiceController } from './service.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  imports: [AuthModule],
  providers: [ServiceService,PrismaService],
  controllers: [ServiceController]
})
export class ServiceModule {}
