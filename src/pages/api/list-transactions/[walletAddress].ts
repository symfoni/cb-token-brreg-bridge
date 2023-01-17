// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSharesTransactions } from "../../../server/sharesTransactions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { walletAddress } = req.query

	try {
		if(walletAddress != undefined) {
			let shares = await getSharesTransactions(walletAddress.toString().toLowerCase());
			console.log(walletAddress.toString().toLowerCase())
			return res.status(200).json({shares});
		}
		
		else {
			return res.status(500).json( "address not set");
		}

	} catch (error) {
		console.log("===== ERROR api/bot...");
		console.error(error);
		return res.status(500).json({ error});
	}
}