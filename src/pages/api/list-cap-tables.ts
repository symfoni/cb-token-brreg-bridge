// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BRIDGE_CHAIN_CONFIG } from "../../constants";
import { initSDK } from "../../components/brok-sdk";

type Data = {
	name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	/* 
	sdk:listCaptable.filter(myaddress)
Legg til random historiske priser
 */

	const sdk = await initSDK()

	const capTables = await sdk.getCapTableList();

	return res.status(200).json(capTables);
}
