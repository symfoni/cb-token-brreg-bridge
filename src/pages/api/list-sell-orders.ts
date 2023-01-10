// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSharesForSale } from "../../server/sharesForSale";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		let shares = await getSharesForSale();
		return res.status(200).json({shares});

	} catch (error) {
		console.log("===== ERROR api/bot...");
		console.error(error);
		return res.status(500).json({ error});
	}
}