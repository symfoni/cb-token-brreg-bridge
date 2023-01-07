// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BRIDGE_CHAIN_CONFIG } from "../../constants";
import { createSharesForSale, SharesForSaleDto } from "../../server/sharesForSale";

type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		// DO thing here
		console.log("req, body", req.body);

		try {
			const shareDto : SharesForSaleDto = req.body

			const shares = await createSharesForSale(shareDto);

			return res.status(200).json({ shares });
		} catch (error) {
			console.log("===== ERROR api/bot...");
			console.error(error);
			return res.status(500).json({error});
		}
		

		
	}

	
}
