import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
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
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @ApiProperty({
    description: 'Rôle',
    example: false,
    maxLength: 200,
  })
  
  @IsBoolean()
  @IsOptional()
  is_seller?: boolean;
  @ApiProperty({
    description: 'Nom de la société',
    example: 'Société de test',
    maxLength: 200,
  })

  @IsString()
  @IsOptional()
  company_name?: string;
  @ApiProperty({
    description: 'Pays',
    example: 'France',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  country?: string;
} 