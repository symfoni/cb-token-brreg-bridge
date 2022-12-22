// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
	readDeposits,
	mintBridgedTokensFromDeposits,
	readWithdrawels,
	burnBridgedTokensFromWithdrawels,
} from "../../server/jobs";

type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await readDeposits();
	await mintBridgedTokensFromDeposits();
	await readWithdrawels();
	await burnBridgedTokensFromWithdrawels();

	return res.status(200).json({ name: "John Doe" });
}
