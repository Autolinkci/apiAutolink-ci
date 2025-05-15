import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;
  
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @IsOptional()
  phone_number?: string;
  
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  
  @IsString()
  @IsOptional()
  role?: string;
} 