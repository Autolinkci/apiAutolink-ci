import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email',
    example: 'testutori@gmail.com',
    maxLength: 200,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'password123',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
} 