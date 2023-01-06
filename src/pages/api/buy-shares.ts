// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BRIDGE_CHAIN_CONFIG } from "../../constants";

type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	/* 
	sdk:listCaptable.filter(myaddress)
Legg til random historiske priser
 */
	if (req.method === "GET") {
		console.log("query params", req.query);
	}
	if (req.method === "POST") {
		// DO thing here
		console.log("req, body", req.body);
	}

	return res.status(200).json({ name: "John Doe" });
}
