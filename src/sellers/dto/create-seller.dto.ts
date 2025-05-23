import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSellerDto {
  @ApiProperty({
    description: 'ID de l\'utilisateur à convertir en vendeur',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Nom de l\'entreprise du vendeur',
    example: 'Auto Excellence',
    required: false
  })
  @IsString()
  @IsOptional()
  company_name?: string;
  
  @ApiProperty({
    description: 'Pays d\'origine du vendeur',
    example: 'Côte d\'Ivoire',
    required: false
  })
  @IsString()
  @IsOptional()
  country?: string;
} 