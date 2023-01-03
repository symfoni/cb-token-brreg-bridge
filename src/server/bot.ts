import { loadEnvConfig } from "@next/env";
import { BRIDGE_CHAIN_CONFIG } from "../constants";
import {
	burnBridgedTokensFromWithdrawels,
	mintBridgedTokensFromDeposits,
	readAuthenticatedAddresses,
	readDeposits,
	readWithdrawels,
	syncAuthenticatedAddresses,
} from "./jobs";

export default async function handler() {
	console.log("===== START Bot...");
	const projectDir = process.cwd();
	loadEnvConfig(projectDir);
	const chainConfig = BRIDGE_CHAIN_CONFIG();
	console.log("--- chainConfig ---");
	console.log(chainConfig);
	try {
		await readAuthenticatedAddresses(chainConfig);
		await syncAuthenticatedAddresses(chainConfig);
		await readDeposits(chainConfig);
		await mintBridgedTokensFromDeposits(chainConfig);
		await readWithdrawels(chainConfig);
		await burnBridgedTokensFromWithdrawels(chainConfig);
	} catch (error) {
		console.log("===== ERROR bot...");
		console.error(error);
	}
	console.log("===== END Bot...");
}

handler();
