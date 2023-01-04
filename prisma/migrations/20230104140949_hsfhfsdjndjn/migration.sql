/*
  Warnings:

  - The values [DEPOSIT_RECEIVED,DEPOSIT_INITIATED,DEPOSIT_SUCCESS,ERROR,WITHDRAWEL_RECEIEVED,WITHDRAWEL_INITIATED,WITHDRAWEL_SUCCESS,BURN_INTIATED,BURN_SUCCESS,SYNC_RECEIVED,SYNC_INITIATED,SYNC_SUCCESS] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `txHashBurn` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `txHashDeposit` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `txHashMint` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `txHashWithdrawel` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receipt]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWEL', 'VC_SYNC');

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('RECEIVED', 'INITIATED', 'SUCCESS', 'ERROR_1', 'ERROR_2', 'ERROR_3');
ALTER TABLE "Transaction" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- DropIndex
DROP INDEX "Transaction_txHashBurn_key";

-- DropIndex
DROP INDEX "Transaction_txHashDeposit_key";

-- DropIndex
DROP INDEX "Transaction_txHashMint_key";

-- DropIndex
DROP INDEX "Transaction_txHashWithdrawel_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "txHashBurn",
DROP COLUMN "txHashDeposit",
DROP COLUMN "txHashMint",
DROP COLUMN "txHashWithdrawel",
ADD COLUMN     "message" TEXT,
ADD COLUMN     "receipt" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_receipt_key" ON "Transaction"("receipt");
