import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { SilosModule } from './silos/silos.module';
import { IntakesModule } from './intakes/intakes.module';
import { DispatchesModule } from './dispatches/dispatches.module';
import { QualityTestsModule } from './quality-tests/quality-tests.module';
import { ContractsModule } from './contracts/contracts.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    DashboardModule,
    SilosModule,
    IntakesModule,
    DispatchesModule,
    QualityTestsModule,
    ContractsModule,
    MaintenanceModule,
  ],
})
export class AppModule {}
