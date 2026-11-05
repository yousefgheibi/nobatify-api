import { IsBoolean, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";

export class CreateServiceDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsInt()
  @Min(0)
  @Max(100_000_000)
  priceToman!: number;

  @IsInt()
  @Min(5)
  @Max(600)
  durationMin!: number;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100_000_000)
  priceToman?: number;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(600)
  durationMin?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
