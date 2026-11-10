import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

const SLUG = /^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])$/;

export class RegisterDto {
  @ApiProperty({ description: 'نام کسب‌وکار', example: 'آرایشگاه نمونه', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  businessName!: string;

  @ApiProperty({ description: 'دسته‌بندی کسب‌وکار', example: 'آرایشگاه', minLength: 2, maxLength: 60 })
  @IsString()
  @Length(2, 60)
  category!: string;

  @ApiProperty({ description: 'شهر', example: 'تهران', minLength: 2, maxLength: 60 })
  @IsString()
  @Length(2, 60)
  city!: string;

  @ApiProperty({ description: 'آدرس صفحه‌ی رزرو', example: 'nemoone-salon', pattern: SLUG.source })
  @Matches(SLUG, { message: 'slug: 3-64 chars, a-z 0-9 and dashes' })
  slug!: string;

  @ApiProperty({ description: 'شماره موبایل', example: '09121234567', minLength: 7, maxLength: 20 })
  @IsString()
  @Length(7, 20)
  phone!: string;

  @ApiProperty({ description: 'نام و نام خانوادگی صاحب کسب‌وکار', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  fullName!: string;

  @ApiProperty({ description: 'رمز عبور', minLength: 8, maxLength: 72 })
  @IsString()
  @Length(8, 72)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ description: 'شماره موبایل', example: '09121234567', minLength: 7, maxLength: 20 })
  @IsString()
  @Length(7, 20)
  phone!: string;

  @ApiProperty({ description: 'رمز عبور', minLength: 1, maxLength: 72 })
  @IsString()
  @Length(1, 72)
  password!: string;
}
