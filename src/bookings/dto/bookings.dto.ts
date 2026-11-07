import { IsDateString, IsEnum, IsIn, IsOptional, IsString, Length, Matches } from 'class-validator';
import { BookingStatus } from '../../../generated/prisma/client.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class AvailabilityQueryDto {
  @IsString() 
  @Length(10, 40) 
  serviceId!: string;

  @Matches(DATE, { message: 'date must be YYYY-MM-DD' }) 
  date!: string;
}

export class BookingRequestDto {
  @IsString() 
  @Length(10, 40) 
  serviceId!: string;

  @IsDateString() 
  startsAt!: string;

  @IsString() 
  @Length(2, 120) 
  customerName!: string;

  @IsString() 
  @Length(7, 20) 
  customerPhone!: string;
}

export class ListBookingsQueryDto {
  @IsOptional()
  @Matches(DATE, { message: 'date must be YYYY-MM-DD' })
  date?: string;

  @IsOptional() 
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
