// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { initSDK } from "../../../components/brok-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	const sdk = await initSDK()

	const capTables = await sdk.getCapTableList(0,999);

	return res.status(200).json(capTables);
}
