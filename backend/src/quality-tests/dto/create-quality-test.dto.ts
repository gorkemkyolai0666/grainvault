import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';
import { GrainGrade } from '@prisma/client';

export class CreateQualityTestDto {
  @IsNumber()
  @Min(0)
  moisture: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  protein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  foreignMatter?: number;

  @IsOptional()
  @IsEnum(GrainGrade)
  grade?: GrainGrade;

  @IsString()
  siloId: string;

  @IsDateString()
  testedAt: string;
}
