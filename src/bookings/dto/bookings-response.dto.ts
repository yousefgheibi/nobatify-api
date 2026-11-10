import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../../../generated/prisma/enums.js';
import { ServiceResponseDto } from '../../service/dto/service-response.dto.js';

export class BookingListItemDto {
  @ApiProperty() id: string;
  @ApiProperty() trackingCode: string;
  @ApiProperty({ enum: BookingStatus }) status: string;
  @ApiProperty() customerName: string;
  @ApiProperty() customerPhone: string;
  @ApiProperty() serviceName: string;
  @ApiProperty() priceToman: number;
  @ApiProperty({ type: String, format: 'date-time' }) startsAt: string;
  @ApiProperty({ type: String, format: 'date-time' }) endsAt: string;
}

export class BookingDetailsDto {
  @ApiProperty() id: string;
  @ApiProperty() trackingCode: string;
  @ApiProperty({ enum: BookingStatus }) status: string;
  @ApiProperty() businessId: string;
  @ApiProperty() serviceId: string;
  @ApiProperty() customerName: string;
  @ApiProperty() customerPhone: string;
  @ApiProperty() serviceName: string;
  @ApiProperty() priceToman: number;
  @ApiProperty({ type: String, format: 'date-time' }) startsAt: string;
  @ApiProperty({ type: String, format: 'date-time' }) endsAt: string;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt: string;
  @ApiProperty({ type: String, format: 'date-time' }) updatedAt: string;
  @ApiProperty({ type: () => ServiceResponseDto }) service: ServiceResponseDto;
}

export class BookingStatusChangeDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: BookingStatus }) status: string;
}

export class AvailabilitySlotDto {
  @ApiProperty({ type: String, format: 'date-time' }) startsAt: string;
  @ApiProperty({ example: '09:00' }) time: string;
}

export class AvailabilityResponseDto {
  @ApiProperty({ example: '2026-11-15' }) date: string;
  @ApiProperty({ type: () => [AvailabilitySlotDto] }) slots: AvailabilitySlotDto[];
}

export class BookingViewDto {
  @ApiProperty() trackingCode: string;
  @ApiProperty({ enum: BookingStatus }) status: string;
  @ApiProperty() businessName: string;
  @ApiProperty() serviceName: string;
  @ApiProperty() priceToman: number;
  @ApiProperty({ type: String, format: 'date-time' }) startsAt: string;
  @ApiProperty({ type: String, format: 'date-time' }) endsAt: string;
}
