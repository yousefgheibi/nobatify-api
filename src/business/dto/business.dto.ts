import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

const SLUG = /^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])$/;

export class UpdateBusinessDto {
  @ApiPropertyOptional({ description: 'نام کسب‌وکار', minLength: 2, maxLength: 120 })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;

  @ApiPropertyOptional({ description: 'دسته‌بندی کسب‌وکار', minLength: 2, maxLength: 60 })
  @IsOptional()
  @IsString()
  @Length(2, 60)
  category?: string;

  @ApiPropertyOptional({ description: 'شهر', minLength: 2, maxLength: 60 })
  @IsOptional()
  @IsString()
  @Length(2, 60)
  city?: string;

  @ApiPropertyOptional({ description: 'آدرس', minLength: 0, maxLength: 255 })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  address?: string;

  @ApiPropertyOptional({ description: 'شماره موبایل', minLength: 7, maxLength: 20 })
  @IsOptional()
  @IsString()
  @Length(7, 20)
  phone?: string;

  @ApiPropertyOptional({ description: 'توضیحات', minLength: 0, maxLength: 2000 })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @ApiPropertyOptional({ description: 'آدرس صفحه‌ی رزرو', pattern: SLUG.source })
  @IsOptional()
  @Matches(SLUG)
  slug?: string;
}
