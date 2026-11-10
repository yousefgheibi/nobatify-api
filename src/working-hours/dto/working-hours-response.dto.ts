import { ApiProperty } from '@nestjs/swagger';

export class WorkingHourItemDto {
  @ApiProperty({ minimum: 0, maximum: 6 })
  weekday: number;

  @ApiProperty()
  isOpen: boolean;

  @ApiProperty({ example: '09:00' })
  opensAt: string;

  @ApiProperty({ example: '18:00' })
  closesAt: string;
}

export class WorkingHoursResponseDto {
  @ApiProperty({ type: [WorkingHourItemDto] })
  days: WorkingHourItemDto[];
}