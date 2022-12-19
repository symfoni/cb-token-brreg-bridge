-- CreateTable
CREATE TABLE "BlockchainJob" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latestBlockNumber" INTEGER NOT NULL DEFAULT 0,
    "running" BOOLEAN NOT NULL DEFAULT false,
    "lastRun" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockchainJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainJob_name_key" ON "BlockchainJob"("name");
