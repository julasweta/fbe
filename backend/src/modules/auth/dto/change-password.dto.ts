import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'currentPassword123',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Новий пароль повинен містити мінімум 6 символів' })
  @IsNotEmpty()
  newPassword: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Невалідний email адрес' })
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Невалідний email адрес' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Reset code sent to email',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  resetCode: string;

  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Новий пароль повинен містити мінімум 6 символів' })
  @IsNotEmpty()
  newPassword: string;
}