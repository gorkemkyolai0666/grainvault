import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };
  let jwt: { sign: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwt = { sign: jest.fn().mockReturnValue('test-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      name: 'Test',
      role: 'operator',
    });

    const result = await service.register({
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    });

    expect(result.accessToken).toBe('test-token');
    expect(result.user.email).toBe('test@test.com');
  });

  it('should throw ConflictException for duplicate email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1' });
    await expect(
      service.register({ email: 'test@test.com', password: '123456', name: 'Test' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should return token on successful login', async () => {
    const hash = await bcrypt.hash('123456', 12);
    prisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: hash,
      name: 'Test',
      role: 'admin',
    });

    const result = await service.login({ email: 'test@test.com', password: '123456' });
    expect(result.accessToken).toBe('test-token');
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      service.login({ email: 'wrong@test.com', password: '123456' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
