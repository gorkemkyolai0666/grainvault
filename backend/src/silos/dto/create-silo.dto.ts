import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { GrainType, SiloStatus } from '@prisma/client';

export class CreateSiloDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(GrainType)
  grainType?: GrainType;

  @IsNumber()
  @Min(0)
  capacityTons: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentLevelTons?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  moisturePct?: number;

  @IsOptional()
  @IsEnum(SiloStatus)
  status?: SiloStatus;
}
