-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'operator', 'quality_inspector', 'accountant');

-- CreateEnum
CREATE TYPE "GrainType" AS ENUM ('wheat', 'barley', 'corn', 'sunflower', 'rye', 'oats', 'other');

-- CreateEnum
CREATE TYPE "SiloStatus" AS ENUM ('active', 'maintenance', 'full', 'empty', 'fumigation');

-- CreateEnum
CREATE TYPE "GrainGrade" AS ENUM ('grade_a', 'grade_b', 'grade_c', 'feed');

-- CreateEnum
CREATE TYPE "DispatchStatus" AS ENUM ('scheduled', 'loading', 'in_transit', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('draft', 'active', 'fulfilled', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('fumigation', 'cleaning', 'aeration', 'inspection', 'repair');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'operator',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Silo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grainType" "GrainType" NOT NULL DEFAULT 'wheat',
    "capacityTons" DOUBLE PRECISION NOT NULL,
    "currentLevelTons" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "moisturePct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "SiloStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Silo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Intake" (
    "id" TEXT NOT NULL,
    "truckPlate" TEXT NOT NULL,
    "farmerName" TEXT NOT NULL,
    "netWeightTons" DOUBLE PRECISION NOT NULL,
    "grade" "GrainGrade" NOT NULL DEFAULT 'grade_a',
    "siloId" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Intake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispatch" (
    "id" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "netWeightTons" DOUBLE PRECISION NOT NULL,
    "grainType" "GrainType" NOT NULL,
    "siloId" TEXT NOT NULL,
    "dispatchedAt" TIMESTAMP(3) NOT NULL,
    "status" "DispatchStatus" NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityTest" (
    "id" TEXT NOT NULL,
    "moisture" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "foreignMatter" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grade" "GrainGrade" NOT NULL DEFAULT 'grade_a',
    "siloId" TEXT NOT NULL,
    "testedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "farmerName" TEXT NOT NULL,
    "grainType" "GrainType" NOT NULL,
    "quantityTons" DOUBLE PRECISION NOT NULL,
    "pricePerTon" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "siloId" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Intake" ADD CONSTRAINT "Intake_siloId_fkey" FOREIGN KEY ("siloId") REFERENCES "Silo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispatch" ADD CONSTRAINT "Dispatch_siloId_fkey" FOREIGN KEY ("siloId") REFERENCES "Silo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityTest" ADD CONSTRAINT "QualityTest_siloId_fkey" FOREIGN KEY ("siloId") REFERENCES "Silo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_siloId_fkey" FOREIGN KEY ("siloId") REFERENCES "Silo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
