-- CreateTable
CREATE TABLE "SharesForSale" (
    "id" SERIAL NOT NULL,
    "soldByAddress" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "orgNumber" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "lastPrice" DECIMAL(65,30) NOT NULL,
    "numberOfShares" INTEGER NOT NULL,

    CONSTRAINT "SharesForSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareTransaction" (
    "id" SERIAL NOT NULL,
    "soldByAddress" TEXT NOT NULL,
    "boughtByAddress" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "orgNumber" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "numberOfShares" INTEGER NOT NULL,
    "taxPayed" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareTransaction_pkey" PRIMARY KEY ("id")
);
