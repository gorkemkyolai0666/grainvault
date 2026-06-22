import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQualityTestDto } from './dto/create-quality-test.dto';
import { UpdateQualityTestDto } from './dto/update-quality-test.dto';

@Injectable()
export class QualityTestsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.qualityTest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.qualityTest.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Kalite testi bulunamadı');
    return item;
  }

  create(dto: CreateQualityTestDto) {
    return this.prisma.qualityTest.create({
      data: {

        moisture: dto.moisture,
        protein: dto.protein ?? 0,
        foreignMatter: dto.foreignMatter ?? 0,
        grade: dto.grade || 'grade_a',
        siloId: dto.siloId,
        testedAt: new Date(dto.testedAt),

      },
    });
  }

  async update(id: string, dto: UpdateQualityTestDto) {
    await this.findOne(id);
    return this.prisma.qualityTest.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.qualityTest.delete({ where: { id } });
  }
}
