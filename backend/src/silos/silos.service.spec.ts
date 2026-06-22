import { Test, TestingModule } from '@nestjs/testing';
import { SilosService } from './silos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SilosService', () => {
  let service: SilosService;
  let prisma: Record<string, Record<string, jest.Mock>>;

  beforeEach(async () => {
    prisma = {
      silo: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SilosService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SilosService>(SilosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all records', async () => {
    const result = await service.findAll();
    expect(prisma.silo.findMany).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should create a record', async () => {
    const dto = { name: 'Test Silo' } as any;
    prisma.silo.create.mockResolvedValue({ id: '1', ...dto });
    const result = await service.create(dto);
    expect(prisma.silo.create).toHaveBeenCalled();
    expect(result.id).toBe('1');
  });
});
