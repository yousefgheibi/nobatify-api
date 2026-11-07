import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { CurrentOwner } from '../common/current-user.decorator.js';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { ListBookingsQueryDto } from './dto/bookings.dto.js';
import { AvailabilityQueryDto, BookingRequestDto } from './dto/bookings.dto.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Get('bookings')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  list(@CurrentOwner() owner: Owner, @Query() query: ListBookingsQueryDto) {
    return this.bookings.listForOwner(owner.userId, query);
  }

  @Get('bookings/:id')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  getBookingDetails(@CurrentOwner() owner: Owner, @Param('id') id: string) {
    return this.bookings.getDetails(owner.businessId, id);
  }

  @Post('bookings/:id/confirm')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  confirm(@CurrentOwner() owner: Owner, @Param('id') id: string) {
    return this.bookings.confirm(owner.businessId, id);
  }

  @Post('bookings/:id/cancel')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  cancel(@CurrentOwner() owner: Owner, @Param('id') id: string) {
    return this.bookings.cancel(owner.businessId, id);
  }

  @Get('public/businesses/:slug/availability')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  availability(@Param('slug') slug: string, @Query() query: AvailabilityQueryDto) {
    return this.bookings.availability(slug, query);
  }

  @Post('public/businesses/:slug/bookings')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  request(@Param('slug') slug: string, @Body() dto: BookingRequestDto) {
    return this.bookings.createRequest(slug, dto);
  }

  @Get('public/bookings/:trackingCode')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  track(@Param('trackingCode') trackingCode: string) {
    return this.bookings.track(trackingCode);
  }
}