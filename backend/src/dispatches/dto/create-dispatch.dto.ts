import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';
import { GrainType, DispatchStatus } from '@prisma/client';

export class CreateDispatchDto {
  @IsString()
  destination: string;

  @IsNumber()
  @Min(0)
  netWeightTons: number;

  @IsEnum(GrainType)
  grainType: GrainType;

  @IsString()
  siloId: string;

  @IsDateString()
  dispatchedAt: string;

  @IsOptional()
  @IsEnum(DispatchStatus)
  status?: DispatchStatus;
}
