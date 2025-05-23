import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nom complet',
    example: 'Thomas Kouassi',
    required: false
  })
  @IsString()
  @IsOptional()
  full_name?: string;
  
  @ApiProperty({
    description: 'Email',
    example: 'thomas.k@gmail.com',
    required: false
  })
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @ApiProperty({
    description: 'Numéro de téléphone',
    example: '07 07 07 07 07',
    required: false
  })
  @IsString()
  @IsOptional()
  phone_number?: string;
  
  @ApiProperty({
    description: 'Mot de passe (minimum 6 caractères)',
    example: 'nouveauPassword123',
    required: false
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
  
  @ApiProperty({
    description: 'Rôle (admin, client, seller, pending_seller)',
    example: 'client',
    required: false
  })
  @IsString()
  @IsOptional()
  role?: string;
} 