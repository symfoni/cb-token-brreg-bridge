import { readDeposits, mintBridgedTokensFromDeposits, readWithdrawels, burnBridgedTokensFromWithdrawels } from "./jobs";

export default async function handler() {
	console.log("===== START Bot...");
	try {
		const sourceDeposits = await readDeposits();
		const mintBridgedTokens = await mintBridgedTokensFromDeposits();
		const destinationWithdrawals = await readWithdrawels();
		const burnBridgedTokens = await burnBridgedTokensFromWithdrawels();

		const allPromises = await Promise.all([
			sourceDeposits,
			mintBridgedTokens,
			destinationWithdrawals,
			burnBridgedTokens,
		]);
	} catch (error) {
		console.log("===== ERROR bot...");
		console.error(error);
	}
	console.log("===== END Bot...");
}

handler();
