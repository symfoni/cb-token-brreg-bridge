import { loadEnvConfig } from "@next/env";
import { BRIDGE_CHAIN_CONFIG } from "../constants";
import { readDeposits } from "./readDeposits";
import { writeDeposits } from "./writeDeposits";
import { readWithdrawels } from "./readWithdrawels";
import { wirteWithdrawels } from "./writeWithdrawels";
import { writeAuthenticatedAddresses } from "./writeAuthenticatedAddresses";
import { readAuthenticatedAddresses } from "./readAuthenticatedAddresses";
import { checkAccesss } from "./checkAccesss";

export default async function handler() {
	console.log("===== START Bot...");
	const projectDir = process.cwd();
	loadEnvConfig(projectDir);
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
			console.log("===== ERROR bot...");
			console.error(error);
		}
	} catch (error) {
		console.log("===== ERROR checkAccess bot...");
		console.error(error);
	}

	console.log("===== END Bot...");
}

handler();
