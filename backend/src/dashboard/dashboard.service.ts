import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      silos,
      intakes,
      dispatches,
      qualityTests,
      contracts,
      maintenance,
    ] = await Promise.all([
      this.prisma.silo.findMany(),
      this.prisma.intake.findMany({ orderBy: { receivedAt: 'desc' }, take: 5 }),
      this.prisma.dispatch.findMany({ orderBy: { dispatchedAt: 'desc' }, take: 5 }),
      this.prisma.qualityTest.findMany({ orderBy: { testedAt: 'desc' }, take: 5 }),
      this.prisma.contract.findMany({ where: { status: 'active' } }),
      this.prisma.maintenance.findMany({
        where: { status: { in: ['scheduled', 'in_progress'] } },
      }),
    ]);

    const totalCapacity = silos.reduce((sum, s) => sum + s.capacityTons, 0);
    const totalStock = silos.reduce((sum, s) => sum + s.currentLevelTons, 0);
    const occupancyRate = totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0;
    const avgMoisture =
      silos.length > 0
        ? silos.reduce((sum, s) => sum + s.moisturePct, 0) / silos.length
        : 0;

    return {
      totalSilos: silos.length,
      totalCapacityTons: totalCapacity,
      totalStockTons: totalStock,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      avgMoisturePct: Math.round(avgMoisture * 10) / 10,
      activeContracts: contracts.length,
      pendingMaintenance: maintenance.length,
      recentIntakes: intakes,
      recentDispatches: dispatches,
      recentQualityTests: qualityTests,
    };
  }
}
