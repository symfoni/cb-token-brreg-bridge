import { readDeposits } from "./jobs";

export default async function handler() {
	try {
		console.log("===== START Bot...");
		const sourceDeposits = readDeposits();

		const allPromises = await Promise.all([sourceDeposits]);
		console.log("===== END Bot...");
	} catch (error) {
		console.error(error);
	}
}

handler();
