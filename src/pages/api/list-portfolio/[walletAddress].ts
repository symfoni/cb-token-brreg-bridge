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
	persentOfTotalShares: Number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const sdk = await initSDK();
	const { walletAddress } = req.query

	if (!walletAddress) {
		throw new Error("walletAddress is missing")
	}

	try {
		const allCapTables = await sdk.getCapTableList(0,999);
		const portfolioAllData = allCapTables.filter( 
			(shares) => {
				return shares.tokenHolders.some(
					(tokenHolder) => {
						return tokenHolder.address === walletAddress.toString()
					}
				)
		})
		
		let data = portfolioAllData.map((obj => <Portfolio>{
			captableAddress: obj.id,
			companyName: obj.name,
			orgNumber: obj.orgnr,
			numberOfShares: numberOfShares(obj.tokenHolders, walletAddress),
			persentOfTotalShares: percentOfTotalShares(obj, walletAddress)
		}))

		return res.status(200).json(data);

	} catch (error) {
		console.log("===== ERROR api/bot...");
		console.error(error);
		return res.status(500).json({ error});
	}
}

function numberOfShares(tokenHolders: TokenHolderGraphQL[], shareholderID: String | String[]) : Number {
	let shares = 0
	tokenHolders.filter((s) => s.address === shareholderID).map(s => shares = +s.balances[0].amount/1000000000000000000)
	return shares
}

function percentOfTotalShares(capTable: CapTableGraphQL, shareholderID: String | String[]) : Number {
	let shares = 0
	const totaltShares = +capTable.totalSupply/1000000000000000000;
	capTable.tokenHolders.filter((s) => s.address === shareholderID).map(s => shares = +s.balances[0].amount/1000000000000000000)
	return +((shares/totaltShares)*100).toFixed(2)
}