import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { CurrentOwner } from '../common/current-user.decorator.js';
import { Owner, OwnerGuard } from '../auth/auth.guard.js';
import { AvailabilityQueryDto, BookingRequestDto, ListBookingsQueryDto } from './dto/bookings.dto.js';
import {
  AvailabilityResponseDto,
  BookingDetailsDto,
  BookingListItemDto,
  BookingStatusChangeDto,
  BookingViewDto,
} from './dto/bookings-response.dto.js';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Get('bookings')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [BookingListItemDto] })
  list(@CurrentOwner() owner: Owner, @Query() query: ListBookingsQueryDto): Promise<BookingListItemDto[]> {
    return this.bookings.listForOwner(owner.businessId, query) as any;
  }

  @Get('bookings/:id')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BookingDetailsDto })
  getBookingDetails(@CurrentOwner() owner: Owner, @Param('id') id: string): Promise<BookingDetailsDto> {
    return this.bookings.getDetails(owner.businessId, id) as any;
  }

  @Post('bookings/:id/confirm')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BookingStatusChangeDto })
  confirm(@CurrentOwner() owner: Owner, @Param('id') id: string): Promise<BookingStatusChangeDto> {
    return this.bookings.confirm(owner.businessId, id) as any;
  }

  @Post('bookings/:id/cancel')
  @UseGuards(OwnerGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BookingStatusChangeDto })
  cancel(@CurrentOwner() owner: Owner, @Param('id') id: string): Promise<BookingStatusChangeDto> {
    return this.bookings.cancel(owner.businessId, id) as any;
  }

  @Get('public/businesses/:slug/availability')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @ApiOkResponse({ type: AvailabilityResponseDto })
  availability(@Param('slug') slug: string, @Query() query: AvailabilityQueryDto): Promise<AvailabilityResponseDto> {
    return this.bookings.availability(slug, query) as any;
  }

  @Post('public/businesses/:slug/bookings')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiCreatedResponse({ type: BookingViewDto })
  request(@Param('slug') slug: string, @Body() dto: BookingRequestDto): Promise<BookingViewDto> {
    return this.bookings.createRequest(slug, dto) as any;
  }

  @Get('public/bookings/:trackingCode')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOkResponse({ type: BookingViewDto })
  track(@Param('trackingCode') trackingCode: string): Promise<BookingViewDto> {
    return this.bookings.track(trackingCode) as any;
  }
}