import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BusinessModule } from './business/business.module.js';
import { ServiceModule } from './service/service.module.js';
import { WorkingHoursModule } from './working-hours/working-hours.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BusinessModule,
    ServiceModule,
    WorkingHoursModule,
    BookingsModule,
    ThrottlerModule.forRoot([{name: 'default', ttl: 60000, limit: 100 }]),
  ],
  providers: [
     {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
