import { IsOptional, IsString } from 'class-validator';

export class UpdateSellerDto {
  @IsString()
  @IsOptional()
  company_name?: string;
  
  @IsString()
  @IsOptional()
  country?: string;
} 