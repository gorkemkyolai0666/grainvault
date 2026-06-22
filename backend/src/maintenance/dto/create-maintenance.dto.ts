import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { MaintenanceType, MaintenanceStatus } from '@prisma/client';

export class CreateMaintenanceDto {
  @IsString()
  siloId: string;

  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
