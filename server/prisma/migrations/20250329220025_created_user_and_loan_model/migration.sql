-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VERIFIER', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'APPROVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanApplication" (
    "id" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "time" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "employmentAddress" TEXT,
    "purpose" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "verifiedById" TEXT,
    "rejectedById" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_rejectedById_fkey" FOREIGN KEY ("rejectedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
