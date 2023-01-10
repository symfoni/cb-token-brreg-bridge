// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { initSDK } from "../../../components/brok-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	const sdk = await initSDK()

  const { captableAddress } = req.query

  if (!captableAddress) {
    return res.status(400).json("Missing captableAddress");
  }

	const capTables = await sdk.getCapTable(captableAddress?.toString());

	return res.status(200).json(capTables);
}
