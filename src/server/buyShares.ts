import { SharesForSale } from "@prisma/client";
import { ethers } from "ethers";
import { initSDK } from "../components/brok-sdk";
import { GET_PROVIDER, BRIDGE_CHAIN_CONFIG, CONTRACT_ADDRESSES } from "../constants";
import { CBToken__factory } from "../typechain-types";
import prisma from "./prisma";

export type BuyOrder = {
  transactionID: number,
  buyerID: string,
  numberOfStocksToBuy: string
}

const taxERC20Address = "0x1BD2AfE3d185C4Aa0a667759A5652Ad41405A1B7";

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
  
  const totalPrice = calculateTotalPrice(sharesForSale, buyOrder);
  const taxToBePaid  = calculateTax(sharesForSale);
  const profit = calculateProfit(sharesForSale)

  // check if buyer have sufficient funds
  if (! (await checkNokBalance(totalPrice))) {
    console.log("insufficient funds to buy shares")
    return false
  }

   // transfer money from buyer to tax office
   if (! (await moveMoney(taxERC20Address, taxToBePaid))) {
    console.log("could not transer money to wallet %d", buyOrder.buyerID)
    return false
  }

  // transfer money from buyer to seller
  if (! (await moveMoney(buyOrder.buyerID, profit))) {
    console.log("could not transer money to wallet %d", buyOrder.buyerID)
    return false
  }

  // transfer shares
  if (! (await transferSharesFromSellerToBuyer(sharesForSale, buyOrder))) {
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
      amount: buyOrder.numberOfStocksToBuy.toString(),
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
      price: sharesForSale.price.toNumber(),
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
  return (+sharesForSale.price * +buyOrder.numberOfStocksToBuy).toString()
}

function calculateProfit(sharesForSale: SharesForSale) : string {
  return (+sharesForSale.price - +sharesForSale.lastPrice).toString()
}

async function checkNokBalance(amount: string) {
  const { destinationChain } = BRIDGE_CHAIN_CONFIG();
  const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
    GET_PROVIDER( destinationChain, { withNetwork: true }),
  );

  const destinationToken = CBToken__factory.connect(
    CONTRACT_ADDRESSES[destinationChain.id].CB_TOKEN_BRIDGE_ADDRESS,
    walletDestination,
  );

  const balance = await destinationToken.balanceOf(walletDestination.address)
  const abountBigNumber = ethers.utils.parseUnits(amount, 4)

  if (balance.gte(abountBigNumber)) {
    return true
  } else {
    return false
  }
}

async function moveMoney(to: string, amount: string) {
  try {
    const { destinationChain } = BRIDGE_CHAIN_CONFIG();
    const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
      GET_PROVIDER( destinationChain, { withNetwork: true }),
    );
  
    const destinationToken = CBToken__factory.connect(
      CONTRACT_ADDRESSES[destinationChain.id].CB_TOKEN_BRIDGE_ADDRESS,
      walletDestination,
    );
  
    const tx = await destinationToken.transfer(to, ethers.utils.parseUnits(amount, 4))
  
    await tx.wait()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}