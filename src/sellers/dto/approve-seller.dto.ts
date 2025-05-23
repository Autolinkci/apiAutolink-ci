import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveSellerDto {
  @ApiProperty({
    description: 'Statut d\'approbation du vendeur',
    example: true
  })
  @IsBoolean()
  is_approved: boolean;
} 