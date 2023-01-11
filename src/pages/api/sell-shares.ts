// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createSharesForSale, SellSharesRequest } from "../../server/sharesForSale";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		if (req.method !== "POST") {
			return res.status(400).json({ error: "unexpected type of request, try using HTTP POST" });
		}
		
		if (!req.body.captableAddress) {
			return res.status(400).json({ error: "missing captableAddress in POST request" });
		}
		if (!req.body.soldByAddress) {
			return res.status(400).json({ error: "missing soldByAddress in POST request" });
		}
		if (!req.body.price) {
			return res.status(400).json({ error: "missing price in POST request" });
		}
		if (!req.body.numberOfShares) {
			return res.status(400).json({ error: "missing captableAddress in POST request" });
		}

		const sharesToBeSold : SellSharesRequest = req.body

		const result = await createSharesForSale(sharesToBeSold);

		if (result) {
			return res.status(200).json("ok");
		} else {
			return res.status(400).json("error")
		}

	} catch (error) {
		console.log("===== ERROR api/bot...");
		console.error(error);
		return res.status(500).json({error});
	}
}
