import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  country_of_origin: string;

  @IsNumber()
  @IsPositive()
  year: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  seller_id?: string;
} 