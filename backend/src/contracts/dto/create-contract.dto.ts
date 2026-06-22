import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';
import { GrainType, ContractStatus } from '@prisma/client';

export class CreateContractDto {
  @IsString()
  farmerName: string;

  @IsEnum(GrainType)
  grainType: GrainType;

  @IsNumber()
  @Min(0)
  quantityTons: number;

  @IsNumber()
  @Min(0)
  pricePerTon: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;
}
