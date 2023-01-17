import { SharesForSale } from "@prisma/client";
import { initSDK } from "../components/brok-sdk";
import prisma from "./prisma";

export type BuyOrder = {
  transactionID: number,
  buyerID: string,
  numberOfStocksToBuy: string
}

const taxERC20Address = "0x14fb5374d26c11010e264213ef6c7d6578b94bdc";

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

//temp data remove this
// const captableId = "0x9645b1b0b76543e2cfae001deeaea81b4d975915"
// const fromId = "0x18ea58c3ff111de7270461062ea9d21b12e9a072"
// const amount = "348"
// const result = await sdk.transfer(captableId, [
//   {
//     from: fromId,
//     to: buyOrder.buyerID.toString().toLowerCase(),
//     amount: amount,
//     partition: 'ordinære'
//   },
// ]);

  const result = await sdk.transfer(sharesForSale.captableAddress, [
    {
      from: sharesForSale.soldByAddress.toString(),
      to: buyOrder.buyerID.toString().toLowerCase(),
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
  console.log(`creating record ${sharesForSale.soldByAddress} ${buyOrder.buyerID}` )
  const db = await prisma.shareTransaction.create({
    data: {
      captableAddress: sharesForSale.captableAddress,
      soldByAddress: sharesForSale.soldByAddress.toLowerCase(),
      boughtByAddress: buyOrder.buyerID.toLowerCase(),
      companyName: sharesForSale.companyName,
      orgNumber: sharesForSale.orgNumber,
      price: sharesForSale.price.toNumber(),
      totalPrice: calculateTotalPrice(sharesForSale),
      totalProfit: calculateProfit(sharesForSale),
      numberOfShares: sharesForSale.numberOfShares,
      taxPayed: calculateTax(sharesForSale)
    },
  })
  console.log("Create a new database entry for this transaction with id: " + db.id)
}

function calculateTax(sharesForSale: SharesForSale) : number {
  return Math.round(calculateProfit(sharesForSale) * 1.72 * 0.22)
}

function calculateTotalPrice(sharesForSale: SharesForSale) : number {
  return (Number(sharesForSale.price)* Number(sharesForSale.numberOfShares))
}

function calculateProfit(sharesForSale: SharesForSale) : number {
  return (Number(sharesForSale.price) - Number(sharesForSale.lastPrice))* Number(sharesForSale.numberOfShares)
}

// async function checkNokBalance(amount: string, address: string) {
//   const { destinationChain } = BRIDGE_CHAIN_CONFIG();
//   const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
//     GET_PROVIDER( destinationChain, { withNetwork: true }),
//   );

//   const destinationToken = CBToken__factory.connect(
//     CONTRACT_ADDRESSES[destinationChain.id].CB_TOKEN_BRIDGE_ADDRESS,
//     walletDestination,
//   );

//   const balance = await destinationToken.balanceOf(address)
//   const abountBigNumber = ethers.utils.parseUnits(amount, 4)

//   if (balance.gte(abountBigNumber)) {
//     return true
//   } else {
//     console.log("insufficient funds in wallet %s to buy shares for %d", walletDestination.address, amount)
//     return false
//   }
// }

// async function moveMoney(to: string, amount: string) {
//   try {
//     const { destinationChain } = BRIDGE_CHAIN_CONFIG();

//     const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
//       GET_PROVIDER( destinationChain, { withNetwork: true }),
//     );
  
//     const destinationToken = CBToken__factory.connect(
//       CONTRACT_ADDRESSES[destinationChain.id].CB_TOKEN_BRIDGE_ADDRESS,
//       walletDestination,
//     );
  
//     const tx = await destinationToken.transfer(to, ethers.utils.parseUnits(amount, 4))
  
//     await tx.wait()
//     return true
//   } catch (error) {
//     console.error(error)
//     return false
//   }
// }