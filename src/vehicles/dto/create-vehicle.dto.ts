import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Description du véhicule',
    example: 'Berline 4 portes en excellent état avec intérieur cuir'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Marque du véhicule',
    example: 'Toyota'
  })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    description: 'Modèle du véhicule',
    example: 'Camry'
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: 'Prix du véhicule en FCFA',
    example: 12000000
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Pays d\'origine du véhicule',
    example: 'Japon'
  })
  @IsString()
  @IsNotEmpty()
  country_of_origin: string;

  @ApiProperty({
    description: 'Année de fabrication',
    example: 2020
  })
  @IsNumber()
  @IsPositive()
  year: number;

  @ApiProperty({
    description: 'Statut du véhicule (disponible, vendu, réservé)',
    example: 'available',
    required: false,
    default: 'available'
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'ID du vendeur',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false
  })
  @IsString()
  @IsOptional()
  seller_id?: string;
} 