import { getCompanyInformation, isSharesOwnedByTheWallet } from "./brokSdk";
import prisma from "./prisma";

export type SellSharesRequest = {
	captableAddress: string,
	soldByAddress: string,
	price: number,
	numberOfShares: number
};

export async function getSharesForSale() {
	return await prisma.sharesForSale.findMany();
}

export async function createSharesForSale(sellShares: SellSharesRequest) {
	const companyInfo = await getCompanyInformation(sellShares.captableAddress);
	const owned = await isSharesOwnedByTheWallet(sellShares.captableAddress, sellShares.soldByAddress)
	if(owned) {
		const db = await prisma.sharesForSale.create({
			data: {
				captableAddress: sellShares.captableAddress,
				soldByAddress: sellShares.soldByAddress,
				companyName: companyInfo.name,
				orgNumber: companyInfo.orgnr,
				price: sellShares.price,
				lastPrice: 1,
				numberOfShares: sellShares.numberOfShares
			},
		})
		console.log("Successfully create a new database entry for shares for sale with id: " + db.id)
		return true
	} else {
		console.log("Did not create a new database entry, share was not owned by the shareholder")
		return false
	}
}