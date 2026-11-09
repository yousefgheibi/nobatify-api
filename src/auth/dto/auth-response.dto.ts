import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  businessId: string;
}

export class RegisterResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  businessId: string;
}
