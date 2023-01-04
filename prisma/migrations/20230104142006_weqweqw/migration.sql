/*
  Warnings:

  - A unique constraint covering the columns `[sourceTx]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "sourceTx" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_sourceTx_key" ON "Transaction"("sourceTx");
