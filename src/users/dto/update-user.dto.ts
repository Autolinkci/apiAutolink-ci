import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  full_name?: string;
  
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @IsString()
  @IsOptional()
  phone_number?: string;
  
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
  
  @IsString()
  @IsOptional()
  role?: string;
} 