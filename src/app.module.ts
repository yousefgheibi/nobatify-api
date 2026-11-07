import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BusinessModule } from './business/business.module.js';
import { ServiceModule } from './service/service.module.js';
import { WorkingHoursModule } from './working-hours/working-hours.module.js';
import { BookingsModule } from './bookings/bookings.module.js';


@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BusinessModule,
    ServiceModule,
    WorkingHoursModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
