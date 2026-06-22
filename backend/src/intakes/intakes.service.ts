import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntakeDto } from './dto/create-intake.dto';
import { UpdateIntakeDto } from './dto/update-intake.dto';

@Injectable()
export class IntakesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.intake.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.intake.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Giriş kaydı bulunamadı');
    return item;
  }

  create(dto: CreateIntakeDto) {
    return this.prisma.intake.create({
      data: {

        truckPlate: dto.truckPlate,
        farmerName: dto.farmerName,
        netWeightTons: dto.netWeightTons,
        grade: dto.grade || 'grade_a',
        siloId: dto.siloId,
        receivedAt: new Date(dto.receivedAt),

      },
    });
  }

  async update(id: string, dto: UpdateIntakeDto) {
    await this.findOne(id);
    return this.prisma.intake.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.intake.delete({ where: { id } });
  }
}
