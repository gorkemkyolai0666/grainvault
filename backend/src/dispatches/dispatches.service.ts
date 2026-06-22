import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';

@Injectable()
export class DispatchesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.dispatch.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.dispatch.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Sevkiyat kaydı bulunamadı');
    return item;
  }

  create(dto: CreateDispatchDto) {
    return this.prisma.dispatch.create({
      data: {

        destination: dto.destination,
        netWeightTons: dto.netWeightTons,
        grainType: dto.grainType,
        siloId: dto.siloId,
        dispatchedAt: new Date(dto.dispatchedAt),
        status: dto.status || 'scheduled',

      },
    });
  }

  async update(id: string, dto: UpdateDispatchDto) {
    await this.findOne(id);
    return this.prisma.dispatch.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.dispatch.delete({ where: { id } });
  }
}
