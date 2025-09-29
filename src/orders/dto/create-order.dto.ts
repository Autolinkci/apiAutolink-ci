import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID du véhicule à acheter',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty()
  vehicle_id: string;

 

  @ApiProperty({
    description: 'Statut de la commande',
    example: 'pending',
    default: 'pending',
    required: false
  })
  @IsString()
  @IsOptional()
  status?: string;
} 