import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '../../../generated/prisma/enums.js';

export class BookingListItemDto {
  @ApiProperty() id: string;
  @ApiProperty() trackingCode: string;
  @ApiProperty({ enum:BookingStatus }) status: string;
  @ApiProperty() customerName: string;
  @ApiProperty() customerPhone: string;
  @ApiProperty() serviceName: string;
  @ApiProperty() priceToman: number;
  @ApiProperty() startsAt: string;
  @ApiProperty() endsAt: string;
}

export class BookingDetailsDto {
  @ApiProperty() id: string;
  @ApiProperty() trackingCode: string;
  @ApiProperty({ enum:BookingStatus }) status: string;
  @ApiProperty() businessId: string;
  @ApiProperty() serviceId: string;
  @ApiProperty() customerName: string;
  @ApiProperty() customerPhone: string;
  @ApiProperty() serviceName: string;
  @ApiProperty() priceToman: number;
  @ApiProperty() startsAt: string;
  @ApiProperty() endsAt: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
  @ApiPropertyOptional() service?: any;
}

export class BookingStatusChangeDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: BookingStatus }) status: string;
}

export class AvailabilitySlotDto {
  @ApiProperty() startsAt: string;
  @ApiProperty() time: string;
}

export class AvailabilityResponseDto {
  @ApiProperty() date: string;
  @ApiProperty({ type: [AvailabilitySlotDto] }) slots: AvailabilitySlotDto[];
}

export class BookingViewDto {
  @ApiProperty() trackingCode: string;
  @ApiProperty({ enum:BookingStatus }) status: string;
  @ApiProperty() businessName: string;
  @ApiProperty() serviceName: string;
  @ApiProperty() priceToman: number;
  @ApiProperty() startsAt: string;
  @ApiProperty() endsAt: string;
}