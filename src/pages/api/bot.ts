// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BRIDGE_CHAIN_CONFIG } from "../../constants";
import {
	readDeposits,
	mintBridgedTokensFromDeposits,
	readWithdrawels,
	burnBridgedTokensFromWithdrawels,
	readAuthenticatedAddresses,
	syncAuthenticatedAddresses,
} from "../../server/jobs";

type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const chainConfig = BRIDGE_CHAIN_CONFIG();
	await readAuthenticatedAddresses(chainConfig);
	await syncAuthenticatedAddresses(chainConfig);
	await readDeposits(chainConfig);
	await mintBridgedTokensFromDeposits(chainConfig);
	await readWithdrawels(chainConfig);
	await burnBridgedTokensFromWithdrawels(chainConfig);

	return res.status(200).json({ name: "John Doe" });
}
