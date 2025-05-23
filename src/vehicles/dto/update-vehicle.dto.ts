import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVehicleDto {
  @ApiProperty({
    description: 'Description du véhicule',
    example: 'Berline 4 portes en excellent état avec intérieur cuir et GPS',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Marque du véhicule',
    example: 'Toyota',
    required: false
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({
    description: 'Modèle du véhicule',
    example: 'Camry',
    required: false
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    description: 'Prix du véhicule en FCFA',
    example: 11500000,
    required: false
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Pays d\'origine du véhicule',
    example: 'Japon',
    required: false
  })
  @IsString()
  @IsOptional()
  country_of_origin?: string;

  @ApiProperty({
    description: 'Statut du véhicule (disponible, vendu, réservé)',
    example: 'reserved',
    required: false
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Année de fabrication',
    example: 2021,
    required: false
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  year?: number;
} 