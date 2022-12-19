/*
  Warnings:

  - You are about to drop the column `lastRun` on the `BlockchainJob` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `BlockchainJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlockchainJob" DROP COLUMN "lastRun",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastRunAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
