import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplyCompanyDto {
  @ApiProperty({ example: 'Garage AutoPro', description: 'Nom de la société candidate' })
  @IsString()
  @IsNotEmpty()
  company_name: string;

  @ApiProperty({ example: "Côte d'Ivoire", description: 'Pays de la société' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'contact@autopro.ci', description: 'Email de contact' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2250707070707', description: 'Numéro de téléphone', required: false })
  @IsString()
  @IsOptional()
  phone_number?: string;
} 