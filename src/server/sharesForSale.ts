import prisma from "./prisma";

export async function getSharesForSale() {
	let shares = await prisma.sharesForSale.findMany();
	
	return shares;
}

export type SharesForSaleDto = {
	soldByAddress: string;
	companyName: string;
	orgNumber: string;
	price: number;
	lastPrice: number
	numberOfShares: number
  }

export async function createSharesForSale(sharesDto: SharesForSaleDto) {
	let shares = await prisma.sharesForSale.create({
		data: {
			soldByAddress: sharesDto.soldByAddress,
		  companyName: sharesDto.companyName,
		  orgNumber: sharesDto.orgNumber,
		  price: sharesDto.price,
		  lastPrice: sharesDto.lastPrice,
		  numberOfShares: sharesDto.numberOfShares
		},
	  })
	return shares;
}
