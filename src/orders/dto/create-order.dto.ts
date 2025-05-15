import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  vehicle_id: string;

  @IsNumber()
  @IsPositive()
  estimated_total: number;

  @IsString()
  @IsOptional()
  status?: string;
} 