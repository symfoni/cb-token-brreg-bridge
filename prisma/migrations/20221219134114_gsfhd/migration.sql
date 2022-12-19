/*
  Warnings:

  - Added the required column `destinationChain` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceChain` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Token" AS ENUM ('CB_TOKEN', 'CB_TOKEN_BRIDGED');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "destinationChain" INTEGER NOT NULL,
ADD COLUMN     "sourceChain" INTEGER NOT NULL;
