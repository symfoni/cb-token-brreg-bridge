/*
  Warnings:

  - The values [MINT_INITIATED,MINT_SUCCESS] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('DEPOSIT_RECEIVED', 'DEPOSIT_INITIATED', 'DEPOSIT_SUCCESS', 'ERROR', 'WITHDRAWEL_RECEIEVED', 'WITHDRAWEL_INITIATED', 'WITHDRAWEL_SUCCESS');
ALTER TABLE "Transaction" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;
