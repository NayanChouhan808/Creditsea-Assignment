/*
  Warnings:

  - Added the required column `userId` to the `LoanApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoanApplication" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
