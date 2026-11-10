import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkingHourItemDto } from '../../working-hours/dto/working-hours-response.dto.js';

export class BusinessResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() category: string;
  @ApiProperty() city: string;
  @ApiProperty() phone: string;
  @ApiPropertyOptional({ nullable: true, type: String }) address?: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) description?: string | null;
  @ApiProperty() slug: string;
  @ApiProperty({ type: String, format: 'date-time' }) createdAt: string;
  @ApiProperty({ type: String, format: 'date-time' }) updatedAt: string;
}

export class PublicServiceDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() priceToman: number;
  @ApiProperty() durationMin: number;
}

export class PublicBusinessResponseDto {
  @ApiProperty() name: string;
  @ApiProperty() category: string;
  @ApiProperty() city: string;
  @ApiProperty() phone: string;
  @ApiPropertyOptional({ nullable: true, type: String }) address?: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) description?: string | null;
  @ApiProperty() slug: string;
  @ApiProperty({ type: () => [PublicServiceDto] }) services: PublicServiceDto[];
  @ApiProperty({ type: () => [WorkingHourItemDto] }) hours: WorkingHourItemDto[];
}
