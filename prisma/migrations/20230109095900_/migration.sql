/*
  Warnings:

  - Added the required column `captableAddress` to the `ShareTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalProfit` to the `ShareTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `captableAddress` to the `SharesForSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShareTransaction" ADD COLUMN     "captableAddress" TEXT NOT NULL,
ADD COLUMN     "totalProfit" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "SharesForSale" ADD COLUMN     "captableAddress" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
