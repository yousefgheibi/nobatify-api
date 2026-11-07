import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsBoolean, IsInt, Matches, Max, Min, ValidateNested } from "class-validator";

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export class HourDto {
  @IsInt() 
  @Min(0) 
  @Max(6) 
  weekday!: number; // 0 = Saturday ... 6 = Friday

  @IsBoolean() 
  isOpen!: boolean;
  
  @Matches(HHMM) 
  opensAt!: string;
  
  @Matches(HHMM) 
  closesAt!: string;
}

export class WorkingHoursDto {
  @ValidateNested({ each: true })
  @Type(() => HourDto)
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  days!: HourDto[];
}
