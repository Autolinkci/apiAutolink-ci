import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsOptional()
  company_name?: string;
  
  @IsString()
  @IsOptional()
  country?: string;
} 