import { readDeposits, mintBridgedTokensFromDeposits, readWithdrawels, burnBridgedTokensFromWithdrawels } from "./jobs";
import { loadEnvConfig } from "@next/env";

export default async function handler() {
	console.log("===== START Bot...");
	const projectDir = process.cwd();
	loadEnvConfig(projectDir);
	try {
		const sourceDeposits = await readDeposits();
		const mintBridgedTokens = await mintBridgedTokensFromDeposits();
		const destinationWithdrawals = await readWithdrawels();
		const burnBridgedTokens = await burnBridgedTokensFromWithdrawels();
	} catch (error) {
		console.log("===== ERROR bot...");
		console.error(error);
	}
	console.log("===== END Bot...");
}

handler();
