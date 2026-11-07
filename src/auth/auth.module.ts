import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { OwnerGuard } from './auth.guard.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, OwnerGuard],
  controllers: [AuthController],
  exports: [JwtModule, OwnerGuard],
})
export class AuthModule {}
