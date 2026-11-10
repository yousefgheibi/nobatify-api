import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsBoolean, IsInt, Matches, Max, Min, ValidateIf, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export class HourDto {
  @ApiProperty({ minimum: 0, maximum: 6, description: '0 = Saturday ... 6 = Friday' })
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @ApiProperty()
  @IsBoolean()
  isOpen!: boolean;

  @ApiProperty({ example: '09:00' })
  @ValidateIf((o) => o.isOpen)
  @Matches(HHMM, { message: 'ساعت باز شدن باید به شکل HH:mm باشد' })
  opensAt!: string;

  @ApiProperty({ example: '18:00' })
  @ValidateIf((o) => o.isOpen)
  @Matches(HHMM, { message: 'ساعت بسته شدن باید به شکل HH:mm باشد' })
  closesAt!: string;
}

export class WorkingHoursDto {
  @ApiProperty({ type: [HourDto], minItems: 7, maxItems: 7 })
  @ValidateNested({ each: true })
  @Type(() => HourDto)
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  days!: HourDto[];
}