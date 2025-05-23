import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nom',
    example: 'Thomas',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;
  @ApiProperty({
    description: 'Email',
    example: 'testutori@gmail.com',
    maxLength: 200,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    description: 'Numéro de téléphone',
    example: '07 69 69 69 69',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  phone_number?: string;
  @ApiProperty({
    description: 'Mot de passe',
    example: 'password123',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @ApiProperty({
    description: 'Rôle',
    example: 'client',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  role?: string;
} 