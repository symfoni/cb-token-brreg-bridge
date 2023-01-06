// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BRIDGE_CHAIN_CONFIG } from "../../constants";
import { readDeposits } from "../../server/readDeposits";
import { writeDeposits } from "../../server/writeDeposits";
import { readWithdrawels } from "../../server/readWithdrawels";
import { wirteWithdrawels } from "../../server/writeWithdrawels";
import { writeAuthenticatedAddresses } from "../../server/writeAuthenticatedAddresses";
import { readAuthenticatedAddresses } from "../../server/readAuthenticatedAddresses";
import { checkAccesss } from "../../server/checkAccesss";

type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("===== START api/bot...");
	const chainConfig = BRIDGE_CHAIN_CONFIG();
	try {
		await checkAccesss(chainConfig);
		try {
			await readAuthenticatedAddresses(chainConfig);
			await writeAuthenticatedAddresses(chainConfig);
			await readDeposits(chainConfig);
			await writeDeposits(chainConfig);
			await readWithdrawels(chainConfig);
			await wirteWithdrawels(chainConfig);
		} catch (error) {
			console.log("===== ERROR api/bot...");
			console.error(error);
		}
	} catch (error) {
		console.log("===== ERROR checkAccess api/bot...");
		console.error(error);
	}
	console.log("===== END api/bot...");

	return res.status(200).json({ name: "John Doe" });
}
