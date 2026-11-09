import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() city?: string;
  @ApiPropertyOptional() phone?: string;
  @ApiPropertyOptional() address?: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() slug: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class PublicBusinessResponseDto {
  @ApiProperty() name: string;
  @ApiPropertyOptional() city?: string;
  @ApiPropertyOptional() phone?: string;
  @ApiPropertyOptional() address?: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() slug: string;
}