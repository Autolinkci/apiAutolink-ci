import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  estimated_total?: number;

  @IsString()
  @IsOptional()
  status?: string;
} 