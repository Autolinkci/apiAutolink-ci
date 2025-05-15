import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  country_of_origin?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  status?: string;
} 