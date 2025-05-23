import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSellerDto {
  @ApiProperty({
    description: 'Nom de l\'entreprise du vendeur',
    example: 'Auto Premium CI',
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