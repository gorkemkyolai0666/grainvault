import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiloDto } from './dto/create-silo.dto';
import { UpdateSiloDto } from './dto/update-silo.dto';

@Injectable()
export class SilosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.silo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.silo.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Silo bulunamadı');
    return item;
  }

  create(dto: CreateSiloDto) {
    return this.prisma.silo.create({
      data: {

        name: dto.name,
        grainType: dto.grainType || 'wheat',
        capacityTons: dto.capacityTons,
        currentLevelTons: dto.currentLevelTons ?? 0,
        moisturePct: dto.moisturePct ?? 0,
        status: dto.status || 'active',

      },
    });
  }

  async update(id: string, dto: UpdateSiloDto) {
    await this.findOne(id);
    return this.prisma.silo.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.silo.delete({ where: { id } });
  }
}
