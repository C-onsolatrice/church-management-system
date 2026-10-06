import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export enum AssetCategory {
  MUSICAL_INSTRUMENT = 'MUSICAL_INSTRUMENT',
  AUDIO_EQUIPMENT = 'AUDIO_EQUIPMENT',
  VIDEO_EQUIPMENT = 'VIDEO_EQUIPMENT',
  FURNITURE = 'FURNITURE',
  VEHICLE = 'VEHICLE',
  BUILDING = 'BUILDING',
  OFFICE_EQUIPMENT = 'OFFICE_EQUIPMENT',
  OTHER = 'OTHER',
}

export enum AssetState {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  DAMAGED = 'DAMAGED',
}

export class CreateAssetDto {
  @ApiProperty({ example: 'Yamaha Montage 8 Keyboard' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: AssetCategory, example: AssetCategory.MUSICAL_INSTRUMENT })
  @IsString()
  @IsIn(Object.values(AssetCategory))
  category: string;

  @ApiProperty({ example: 'SN-9948271', required: false })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiProperty({ example: '2026-01-10T00:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  purchaseDate: string;

  @ApiProperty({ example: 4500.00 })
  @IsNumber()
  @Min(0)
  purchaseCost: number;

  @ApiProperty({ example: 500.00, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salvageValue?: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  @Min(1)
  usefulLifeYears: number;

  @ApiProperty({ enum: AssetState, example: AssetState.EXCELLENT, required: false })
  @IsString()
  @IsIn(Object.values(AssetState))
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Main Choir Loft' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'branch-uuid-placeholder' })
  @IsString()
  @IsNotEmpty()
  branchId: string;
}