import { getCompanyInformation, isSharesOwnedByTheWallet } from "./brokSdk";
import prisma from "./prisma";

export type SellSharesRequest = {
	captableAddress: string,
	soldByAddress: string,
	price: number,
	numberOfShares: number
};

export async function getSharesForSale() {
	return await prisma.sharesForSale.findMany({
		where: {
			sold: false
		}
	});
}

function fixOrgNumber(orgNumber: string) {
	if(orgNumber == "312176633123") {
		return "312176633"
	}
	else if(orgNumber == "custody_custard_abga") {
		return "843928311"
	}
	else if(orgNumber == "custody_custard_bhp") {
		return "829433262"
	}
	else {
		return orgNumber
	}
}

export async function createSharesForSale(sellShares: SellSharesRequest) {
	const companyInfo = await getCompanyInformation(sellShares.captableAddress);
	const owned = await isSharesOwnedByTheWallet(sellShares.captableAddress.toLowerCase(), sellShares.soldByAddress.toLowerCase())
	// if(owned) {
		const db = await prisma.sharesForSale.create({
			data: {
				captableAddress: sellShares.captableAddress,
				soldByAddress: sellShares.soldByAddress,
				companyName: companyInfo.name,
				orgNumber: fixOrgNumber(companyInfo.orgnr), //fix her
				price: sellShares.price,
				lastPrice: 1,
				sold: false,
				numberOfShares: sellShares.numberOfShares
			},
		})
		console.log("Successfully create a new database entry for shares for sale with id: " + db.id)
		return true
	// } else {
	// 	console.log("Did not create a new database entry, share was not owned by the shareholder")
	// 	return false
	// }
}