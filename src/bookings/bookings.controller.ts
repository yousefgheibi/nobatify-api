import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { CurrentOwner } from '../common/current-user.decorator.js';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { ListBookingsQueryDto } from './dto/bookings.dto.js';
import { AvailabilityQueryDto, BookingRequestDto } from './dto/bookings.dto.js';

@Controller()
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Get('me/bookings')
  @UseGuards(OwnerGuard)
  list(@CurrentOwner() owner: Owner, @Query() query: ListBookingsQueryDto) {
    return this.bookings.listForOwner(owner.userId, query);
  }

  @Post('me/bookings/:id/confirm')
  @UseGuards(OwnerGuard)
  confirm(@CurrentOwner() owner: Owner, @Param('id') id: string) {
    return this.bookings.confirm(owner.businessId, id);
  }

  @Post('me/bookings/:id/cancel')
  @UseGuards(OwnerGuard)
  cancel(@CurrentOwner() owner: Owner, @Param('id') id: string) {
    return this.bookings.cancel(owner.businessId, id);
  }

  @Get('public/businesses/:slug/availability')
  availability(@Param('slug') slug: string, @Query() query: AvailabilityQueryDto) {
    return this.bookings.availability(slug, query);
  }

  @Post('public/businesses/:slug/bookings')
  request(@Param('slug') slug: string, @Body() dto: BookingRequestDto) {
    return this.bookings.createRequest(slug, dto);
  }

  @Get('public/bookings/:trackingCode')
  track(@Param('trackingCode') trackingCode: string) {
    return this.bookings.track(trackingCode);
  }
}