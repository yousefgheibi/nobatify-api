import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { BookingStatus } from '../../../generated/prisma/client.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export class AvailabilityQueryDto {
  @ApiProperty({ description: 'شناسه‌ی خدمت', minLength: 10, maxLength: 40 })
  @IsString()
  @Length(10, 40)
  serviceId!: string;

  @ApiProperty({ description: 'تاریخ میلادی به وقت تهران (YYYY-MM-DD)', example: '2026-11-15', pattern: DATE.source })
  @Matches(DATE, { message: 'date must be YYYY-MM-DD' })
  date!: string;
}

export class BookingRequestDto {
  @ApiProperty({ description: 'شناسه‌ی خدمت', minLength: 10, maxLength: 40 })
  @IsString()
  @Length(10, 40)
  serviceId!: string;

  @ApiProperty({ description: 'زمان شروع نوبت (ISO 8601)', format: 'date-time', example: '2026-11-15T09:00:00+03:30' })
  @IsDateString()
  startsAt!: string;

  @ApiProperty({ description: 'نام مشتری', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  customerName!: string;

  @ApiProperty({ description: 'شماره موبایل مشتری', minLength: 7, maxLength: 20 })
  @IsString()
  @Length(7, 20)
  customerPhone!: string;
}

export class ListBookingsQueryDto {
  @ApiPropertyOptional({ description: 'فیلتر بر اساس تاریخ میلادی (YYYY-MM-DD)', example: '2026-11-15', pattern: DATE.source })
  @IsOptional()
  @Matches(DATE, { message: 'date must be YYYY-MM-DD' })
  date?: string;

  @ApiPropertyOptional({ description: 'فیلتر بر اساس وضعیت', enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
