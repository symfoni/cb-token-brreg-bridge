// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BuyOrder, buyShare } from "../../server/buyShares";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	try {
		if (req.method !== "POST") {
			return res.status(400).json({ error: "unexpected type of request, try using HTTP POST" });
		}
		
		if (!req.body.transactionID) {
			return res.status(400).json({ error: "missing transactionID in POST request" });
		}
		if (!req.body.buyerID) {
			return res.status(400).json({ error: "missing buyerID in POST request" });
		}
		if (!req.body.numberOfStocksToBuy) {
			return res.status(400).json({ error: "missing numberOfStocksToBuy in POST request" });
		}

		const buyOrder : BuyOrder = req.body

		const result = await buyShare(buyOrder);

		if (result) {
			return res.status(200).json("ok");
		} else {
			return res.status(400).json("error")
		}

	} catch (error) {
		console.log("===== ERROR api/buy-shares...");
		console.error(error);
		return res.status(500).json({ error});
	}
}
