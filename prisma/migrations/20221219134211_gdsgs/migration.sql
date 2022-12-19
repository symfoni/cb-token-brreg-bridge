/*
  Warnings:

  - Changed the type of `token` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "token",
ADD COLUMN     "token" "Token" NOT NULL;
