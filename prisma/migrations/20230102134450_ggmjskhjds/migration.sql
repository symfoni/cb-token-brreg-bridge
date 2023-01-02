/*
  Warnings:

  - A unique constraint covering the columns `[name,sourceChain,destinationChain]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Job_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Job_name_sourceChain_destinationChain_key" ON "Job"("name", "sourceChain", "destinationChain");
