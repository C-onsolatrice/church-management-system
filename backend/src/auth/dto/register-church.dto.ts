import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterChurchDto {
  @ApiProperty({ example: 'Zion Temple Celebration Center', description: 'Name of the Church organization' })
  @IsString()
  @IsNotEmpty()
  churchName: string;

  @ApiProperty({ example: 'RGB-FBO-2026-00451', description: 'RGB Registration number for legal status' })
  @IsString()
  @IsNotEmpty()
  legalRegNo: string;

  @ApiProperty({ example: 'Kigali, Kicukiro', description: 'Address of the main headquarters' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Super Admin', description: 'Full name of the Super Administrator' })
  @IsString()
  @IsNotEmpty()
  adminName: string;

  @ApiProperty({ example: 'admin@ziontemple.org', description: 'Super Admin email' })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ example: 'P@ssword123!', description: 'Strong registration password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  adminPassword: string;
}