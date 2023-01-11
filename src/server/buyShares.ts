import { SharesForSale } from "@prisma/client";
import { initSDK } from "../components/brok-sdk";
import prisma from "./prisma";

export type BuyOrder = {
  transactionID: number,
  buyerID: string,
  amountOfStocsToBuy: string
}

export async function buyShare(buyOrder: BuyOrder) {
  // get sell order from db
  const sharesForSale = await getSellOrderFromDb(buyOrder.transactionID);

  // check if sellOrder exsist
  if (!sharesForSale) {
    console.log("Sell order with id: %d does not exist", buyOrder.transactionID);
    return false
  }

  // check if sell order is still active
  if (sharesForSale?.sold) {
    console.log("Sell order with id: %d is no longer active", sharesForSale.id);
    return false;
  }

  // check if buyer have sufficient funds
  // TODO

  // transfer money
  // TODO

  // transfer shares
  if (! await transferSharesFromSellerToBuyer(sharesForSale, buyOrder)) {
    return false
  }

  // set sell order to false
  await setSellOrderToSoldInDatabase(sharesForSale)

  // create transaction db entry
  await createTransactionRecord(sharesForSale, buyOrder);

  return true
}

async function getSellOrderFromDb(orderId: number) {
  return await prisma.sharesForSale.findUnique({
    where: {
      id: orderId
    }
  })
}

async function transferSharesFromSellerToBuyer(sharesForSale: SharesForSale, buyOrder: BuyOrder) {
  const sdk = await initSDK();
  const result = await sdk.transfer(sharesForSale.captableAddress, [
    {
      from: sharesForSale.soldByAddress.toString(),
      to: buyOrder.buyerID.toString(),
      amount: buyOrder.amountOfStocsToBuy.toString(),
      partition: 'ordinære'
    },
  ]);

  if (result[0].success) {
    console.log("Transfered shares for org: %s from wallet %s to %s", sharesForSale.companyName, sharesForSale.soldByAddress, buyOrder.buyerID);
    return true
  } else {
    console.error("Transfer failed", result)
    return false
  }
}

async function setSellOrderToSoldInDatabase(sharesForSale: SharesForSale) {
  await prisma.sharesForSale.update({
    where: {
      id: sharesForSale.id
    },
    data: {
      sold: true
    }
  })
  console.log("Sell order with id: %d is set to sold", sharesForSale.id)
}

async function createTransactionRecord(sharesForSale: SharesForSale, buyOrder: BuyOrder) {
  const db = await prisma.shareTransaction.create({
    data: {
      captableAddress: sharesForSale.captableAddress,
      soldByAddress: sharesForSale.soldByAddress,
      boughtByAddress: buyOrder.buyerID,
      companyName: sharesForSale.companyName,
      orgNumber: sharesForSale.orgNumber,
      price: sharesForSale.price,
      totalPrice: calculateTotalPrice(sharesForSale, buyOrder),
      totalProfit: calculateProfit(sharesForSale),
      numberOfShares: sharesForSale.numberOfShares,
      taxPayed: calculateTax(sharesForSale)
    },
  })
  console.log("Create a new database entry for this transaction with id: " + db.id)
}

function calculateTax(sharesForSale: SharesForSale) : string {
  return (+calculateProfit(sharesForSale) * 1.72 * 0.22).toString()
}

function calculateTotalPrice(sharesForSale: SharesForSale, buyOrder: BuyOrder) : string {
  return (+sharesForSale.price * +buyOrder.amountOfStocsToBuy).toString()
}

function calculateProfit(sharesForSale: SharesForSale) : string {
  return (+sharesForSale.price - +sharesForSale.lastPrice).toString()
}