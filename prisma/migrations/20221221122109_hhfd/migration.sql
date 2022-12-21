/*
  Warnings:

  - You are about to drop the column `txHash` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[txHashDeposit]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[txHashMint]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txHashDeposit` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DEPOSIT_RECEIVED', 'MINT_INITIATED', 'MINT_SUCCESS', 'ERROR');

-- DropIndex
DROP INDEX "Transaction_txHash_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "txHash",
ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "txHashDeposit" TEXT NOT NULL,
ADD COLUMN     "txHashMint" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHashDeposit_key" ON "Transaction"("txHashDeposit");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHashMint_key" ON "Transaction"("txHashMint");
