import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.contract.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.contract.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Sözleşme bulunamadı');
    return item;
  }

  create(dto: CreateContractDto) {
    return this.prisma.contract.create({
      data: {

        farmerName: dto.farmerName,
        grainType: dto.grainType,
        quantityTons: dto.quantityTons,
        pricePerTon: dto.pricePerTon,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: dto.status || 'draft',

      },
    });
  }

  async update(id: string, dto: UpdateContractDto) {
    await this.findOne(id);
    return this.prisma.contract.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contract.delete({ where: { id } });
  }
}
