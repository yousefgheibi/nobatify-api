import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() businessId: string;
  @ApiProperty() name: string;
  @ApiProperty({ description: 'قیمت به تومان' }) priceToman: number;
  @ApiProperty({ description: 'مدت زمان به دقیقه' }) durationMin: number;
  @ApiProperty() isActive: boolean;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt: string;
  @ApiProperty({ type: String, format: 'date-time' }) updatedAt: string;
}
