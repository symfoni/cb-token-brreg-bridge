/*
  Warnings:

  - Added the required column `sold` to the `SharesForSale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SharesForSale" ADD COLUMN     "sold" BOOLEAN NOT NULL;
