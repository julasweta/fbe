import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
} from 'class-validator';
import { Role } from '@prisma/client';

export class BaseUserDto {
  id: number;

  @IsNotEmpty()
  @IsString()
  first_name: string | null;


  @IsNotEmpty()
  @IsString()
  last_name: string | null;


  @IsEmail()
  email: string | null;


  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password: string;


  @IsOptional()
  @IsString()
  phone?: string | null;


  @IsOptional()
  @IsString()
  address?: string | null;


  @IsOptional()
  @IsString()
  city?: string | null;


  @IsOptional()
  @IsString()
  country?: string | null;


  @IsOptional()
  @IsString()
  postalCode?: string | null;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date | null;


  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  accessToken?: string | null;
  refreshToken?: string | null;
}