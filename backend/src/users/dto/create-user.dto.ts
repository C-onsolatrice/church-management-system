import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'member@church.rw' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Alphonse Nshuti' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'P@ssword123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '+250788000000', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: ['SUPER_ADMIN', 'ADMIN', 'PASTOR', 'TREASURER', 'MEMBER'], default: 'MEMBER' })
  @IsString()
  @IsIn(['SUPER_ADMIN', 'ADMIN', 'PASTOR', 'TREASURER', 'MEMBER'])
  role: string;

  @ApiProperty({ example: 'branch-uuid-placeholder' })
  @IsString()
  @IsNotEmpty()
  branchId: string;
}
