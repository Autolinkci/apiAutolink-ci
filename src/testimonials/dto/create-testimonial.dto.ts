import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
} 