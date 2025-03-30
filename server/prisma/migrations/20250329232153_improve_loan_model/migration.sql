-- AlterTable
ALTER TABLE "LoanApplication" ADD COLUMN     "approvedById" TEXT;

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
