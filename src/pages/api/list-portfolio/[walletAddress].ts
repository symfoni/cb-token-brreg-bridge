// Wallet who owns two shares: 0x30c79019b9be4b0197d95a9cfc79fdffd8275af9
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { initSDK } from "../../../components/brok-sdk";
import { CapTableGraphQL, TokenHolderGraphQL } from "@brok/sdk";

interface Portfolio {
	captableAddress: String
	companyName: String
	orgNumber: String
	numberOfShares: Number
	percentOfTotalShares: Number
	lastPricePerShare: Number
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const sdk = await initSDK();
	const { walletAddress } = req.query

	if (!walletAddress) {
		throw new Error("walletAddress is missing")
	}

	try {
		const allCapTables = await sdk.getCapTableList(0,999);
		console.log(walletAddress.toString().toLowerCase());
		const portfolioAllData = allCapTables.filter( 
			(shares) => {
				return shares.tokenHolders.some(
					(tokenHolder) => {
						return tokenHolder.address === walletAddress?.toString().toLowerCase()
					}
				)
		})
		
		// portfolioAllData[0].fagsystem
		// const correctSystem = allCapTables.filter((shares) => shares.fagsystem == portfolioAllData[0].fagsystem)

		// for(let i = 0; i < 20; i++) {
		// 	let item = correctSystem[i+20];
		// 	console.log(`${item.name} ${item.id} -- ${item.tokenHolders[0].address} ${item.tokenHolders[0].balances[0].amount}`)
		// }
		
		let data = portfolioAllData.map((obj => <Portfolio>{
			captableAddress: obj.id,
			companyName: obj.name,
			orgNumber: fixOrgNumber(obj.orgnr),
			numberOfShares: numberOfShares(obj.tokenHolders, walletAddress?.toString().toLowerCase()),
			percentOfTotalShares: percentOfTotalShares(obj, walletAddress?.toString().toLowerCase()),
			lastPricePerShare: Math.round(Math.random()*300)
		}))

		data = data.filter((shares) => shares.numberOfShares > 0);

		return res.status(200).json(data);

	} catch (error) {
		console.log("===== ERROR api/bot...");
		console.error(error);
		return res.status(500).json({ error});
	}
}

function numberOfShares(tokenHolders: TokenHolderGraphQL[], shareholderID: string) : number {
	let shares = 0
	tokenHolders.filter((s) => s.address === shareholderID).map(s => shares = +s.balances[0].amount/1000000000000000000)
	return shares
}

function percentOfTotalShares(capTable: CapTableGraphQL, shareholderID: string) : number {
	let shares = 0
	const totaltShares = +capTable.totalSupply/1000000000000000000;
	capTable.tokenHolders.filter((s) => s.address === shareholderID).map(s => shares = +s.balances[0].amount/1000000000000000000)
	return +((shares/totaltShares)*100).toFixed(2)
}