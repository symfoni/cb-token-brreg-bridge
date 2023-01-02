import { readDeposits, mintBridgedTokensFromDeposits, readWithdrawels, burnBridgedTokensFromWithdrawels } from "./jobs";
import { loadEnvConfig } from "@next/env";
import { LOCAL_HARDHAT, NORGES_BANK_CHAIN, ARBITRUM_GOERLI, CHAINS, BRIDGE_CHAIN_CONFIG } from "../constants";

export default async function handler() {
	console.log("===== START Bot...");
	const projectDir = process.cwd();
	loadEnvConfig(projectDir);
	const chainConfig = BRIDGE_CHAIN_CONFIG();
	console.log("--- chainConfig ---");
	console.log(chainConfig);
	try {
		const sourceDeposits = await readDeposits(chainConfig);
		const mintBridgedTokens = await mintBridgedTokensFromDeposits(chainConfig);
		const destinationWithdrawals = await readWithdrawels(chainConfig);
		const burnBridgedTokens = await burnBridgedTokensFromWithdrawels(chainConfig);
	} catch (error) {
		console.log("===== ERROR bot...");
		console.error(error);
	}
	console.log("===== END Bot...");
}

handler();
