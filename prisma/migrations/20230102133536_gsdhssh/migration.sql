/*
  Warnings:

  - Added the required column `destinationChain` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceChain` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "destinationChain" INTEGER NOT NULL,
ADD COLUMN     "sourceChain" INTEGER NOT NULL;
