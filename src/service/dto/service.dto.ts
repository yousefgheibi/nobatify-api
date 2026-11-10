import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'نام خدمت', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ description: 'قیمت به تومان', minimum: 0, maximum: 100000000 })
  @IsInt()
  @Min(0)
  @Max(100_000_000)
  priceToman!: number;

  @ApiProperty({ description: 'مدت زمان به دقیقه', minimum: 5, maximum: 600 })
  @IsInt()
  @Min(5)
  @Max(600)
  durationMin!: number;
}

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: 'نام خدمت', minLength: 2, maxLength: 120 })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;

  @ApiPropertyOptional({ description: 'قیمت به تومان', minimum: 0, maximum: 100000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100_000_000)
  priceToman?: number;

  @ApiPropertyOptional({ description: 'مدت زمان به دقیقه', minimum: 5, maximum: 600 })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(600)
  durationMin?: number;

  @ApiPropertyOptional({ description: 'فعال یا غیرفعال بودن خدمت' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
