import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.maintenance.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.maintenance.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Bakım kaydı bulunamadı');
    return item;
  }

  create(dto: CreateMaintenanceDto) {
    return this.prisma.maintenance.create({
      data: {

        siloId: dto.siloId,
        type: dto.type,
        scheduledAt: new Date(dto.scheduledAt),
        status: dto.status || 'scheduled',
        notes: dto.notes || '',

      },
    });
  }

  async update(id: string, dto: UpdateMaintenanceDto) {
    await this.findOne(id);
    return this.prisma.maintenance.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.maintenance.delete({ where: { id } });
  }
}
