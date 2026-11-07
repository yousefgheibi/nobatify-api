import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsBoolean, IsInt, IsOptional, IsString, Length, Matches, Max, Min, ValidateNested } from 'class-validator';

const SLUG = /^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])$/;

export class UpdateBusinessDto {
  @IsOptional() 
  @IsString() 
  @Length(2, 120) 
  name?: string;
  
  @IsOptional() 
  @IsString() 
  @Length(2, 60) 
  category?: string;
  
  @IsOptional() 
  @IsString() 
  @Length(2, 60) 
  city?: string;
  
  @IsOptional() 
  @IsString() 
  @Length(0, 255) 
  address?: string;
  
  @IsOptional() 
  @IsString() 
  @Length(7, 20) 
  phone?: string;
  
  @IsOptional() 
  @IsString() 
  @Length(0, 2000) 
  description?: string;
  
  @IsOptional() 
  @Matches(SLUG) 
  slug?: string;
}