import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const demoEmail = 'demo@tahilelevatoru.com.tr';

  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (existingUser) {
    console.log('Demo kullanıcı zaten mevcut, seed atlanıyor.');
    return;
  }

  const passwordHash = await bcrypt.hash('demo123456', 12);

  await prisma.user.create({
    data: {
      email: demoEmail,
      password: passwordHash,
      name: 'Mehmet Yılmaz',
      role: 'admin',
    },
  });

  const silo1 = await prisma.silo.create({
    data: {
      name: 'Silo A-1',
      grainType: 'wheat',
      capacityTons: 5000,
      currentLevelTons: 3200,
      moisturePct: 12.4,
      status: 'active',
    },
  });

  const silo2 = await prisma.silo.create({
    data: {
      name: 'Silo B-2',
      grainType: 'barley',
      capacityTons: 3500,
      currentLevelTons: 1800,
      moisturePct: 11.8,
      status: 'active',
    },
  });

  const silo3 = await prisma.silo.create({
    data: {
      name: 'Silo C-3',
      grainType: 'corn',
      capacityTons: 4200,
      currentLevelTons: 4100,
      moisturePct: 13.1,
      status: 'full',
    },
  });

  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);
  const lastWeek = new Date(now.getTime() - 7 * 86400000);

  await prisma.intake.createMany({
    data: [
      {
        truckPlate: '34 ABC 123',
        farmerName: 'Ahmet Kaya',
        netWeightTons: 24.5,
        grade: 'grade_a',
        siloId: silo1.id,
        receivedAt: yesterday,
      },
      {
        truckPlate: '06 DEF 456',
        farmerName: 'Fatma Demir',
        netWeightTons: 18.2,
        grade: 'grade_b',
        siloId: silo2.id,
        receivedAt: lastWeek,
      },
      {
        truckPlate: '16 GHI 789',
        farmerName: 'Hasan Öztürk',
        netWeightTons: 32.0,
        grade: 'grade_a',
        siloId: silo1.id,
        receivedAt: now,
      },
    ],
  });

  await prisma.dispatch.createMany({
    data: [
      {
        destination: 'Un Fabrikası A.Ş. - Konya',
        netWeightTons: 120,
        grainType: 'wheat',
        siloId: silo1.id,
        dispatchedAt: yesterday,
        status: 'delivered',
      },
      {
        destination: 'Yem Sanayi Ltd. - Ankara',
        netWeightTons: 85,
        grainType: 'barley',
        siloId: silo2.id,
        dispatchedAt: now,
        status: 'loading',
      },
    ],
  });

  await prisma.qualityTest.createMany({
    data: [
      {
        moisture: 12.4,
        protein: 11.2,
        foreignMatter: 0.8,
        grade: 'grade_a',
        siloId: silo1.id,
        testedAt: now,
      },
      {
        moisture: 11.8,
        protein: 10.5,
        foreignMatter: 1.1,
        grade: 'grade_b',
        siloId: silo2.id,
        testedAt: yesterday,
      },
    ],
  });

  await prisma.contract.createMany({
    data: [
      {
        farmerName: 'Ahmet Kaya',
        grainType: 'wheat',
        quantityTons: 500,
        pricePerTon: 8500,
        startDate: lastWeek,
        endDate: new Date(now.getTime() + 90 * 86400000),
        status: 'active',
      },
      {
        farmerName: 'Zeynep Arslan',
        grainType: 'corn',
        quantityTons: 300,
        pricePerTon: 7200,
        startDate: now,
        endDate: new Date(now.getTime() + 60 * 86400000),
        status: 'draft',
      },
    ],
  });

  await prisma.maintenance.createMany({
    data: [
      {
        siloId: silo3.id,
        type: 'fumigation',
        scheduledAt: new Date(now.getTime() + 3 * 86400000),
        status: 'scheduled',
        notes: 'Haşere kontrolü — fosfin uygulaması',
      },
      {
        siloId: silo1.id,
        type: 'cleaning',
        scheduledAt: new Date(now.getTime() + 14 * 86400000),
        status: 'scheduled',
        notes: 'Sezon sonu silo temizliği',
      },
    ],
  });

  console.log('GrainVault demo verisi oluşturuldu.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
