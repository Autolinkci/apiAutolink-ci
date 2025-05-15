import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackingDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsString()
  @IsNotEmpty()
  status: string;
} 