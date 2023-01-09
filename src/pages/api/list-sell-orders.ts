// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BRIDGE_CHAIN_CONFIG } from "../../constants";
import { getSharesForSale } from "../../server/sharesForSale";

type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	let shares = []
	try {
		shares = await getSharesForSale();
		return res.status(200).json({ shares});

	} catch (error) {
		console.log("===== ERROR api/bot...");
		console.error(error);
		return res.status(500).json({ error});
	}

}
