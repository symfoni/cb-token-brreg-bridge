// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BRIDGE_CHAIN_CONFIG } from "../../../constants";
import { initSDK } from "../../../components/brok-sdk";

type Data = {
	name: string;
};

const sdk = initSDK()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	const { address } = req.query
	console.log(address);
	try {

		const sdk = await initSDK()

	const allCapTables = await sdk.getCapTableList();
	const portfolioAllData = allCapTables.filter( (shares) => {
		return shares.tokenHolders.some((tokenHolder) => tokenHolder.address === address?.toString())
	})

	

	// 	//legg inn i types det man forventer og få

	// 	// brukt dereetter map og få det over på den andre typen med randow tildligre pis
	// })

	/* 

Legg til random historiske priser
 */

	return res.status(200).json(portfolioAllData);

	} catch (error) {
		console.log("===== ERROR api/bot...");
		console.error(error);
		return res.status(500).json({ error});
	}
}

