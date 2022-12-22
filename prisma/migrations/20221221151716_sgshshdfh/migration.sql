/*
  Warnings:

  - A unique constraint covering the columns `[txHashBurn]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[txHashWithdrawel]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "txHashBurn" TEXT,
ADD COLUMN     "txHashWithdrawel" TEXT,
ALTER COLUMN "txHashDeposit" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHashBurn_key" ON "Transaction"("txHashBurn");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_txHashWithdrawel_key" ON "Transaction"("txHashWithdrawel");
