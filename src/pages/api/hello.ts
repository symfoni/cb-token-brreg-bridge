// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { readSourceDeposits, mintBridgedTokensFromDeposits } from "../../server/jobs";

type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const result = await readSourceDeposits();
	const result2 = await mintBridgedTokensFromDeposits();
	if (result) {
		return res.status(200).json(result);
	}
	return res.status(200).json({ name: "John Doe" });
}
