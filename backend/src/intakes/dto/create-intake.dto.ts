import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';
import { GrainGrade } from '@prisma/client';

export class CreateIntakeDto {
  @IsString()
  truckPlate: string;

  @IsString()
  farmerName: string;

  @IsNumber()
  @Min(0)
  netWeightTons: number;

  @IsOptional()
  @IsEnum(GrainGrade)
  grade?: GrainGrade;

  @IsString()
  siloId: string;

  @IsDateString()
  receivedAt: string;
}
