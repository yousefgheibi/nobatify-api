import { IsString, Length, Matches } from 'class-validator';

const SLUG = /^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])$/;

export class RegisterDto {
  @IsString()
  @Length(2, 120)
  businessName!: string;

  @IsString()
  @Length(2, 60)
  category!: string;

  @IsString()
  @Length(2, 60)
  city!: string;

  @Matches(SLUG, { message: 'slug: 3-64 chars, a-z 0-9 and dashes' })
  slug!: string;

  @IsString()
  @Length(7, 20)
  phone!: string;

  @IsString()
  @Length(2, 120)
  fullName!: string;

  @IsString()
  @Length(8, 72)
  password!: string;
}

export class LoginDto {
  @IsString()
  @Length(7, 20)
  phone!: string;

  @IsString()
  @Length(1, 72)
  password!: string;
}
