import { ethers } from "ethers";
import { GET_PROVIDER, LOCAL_HARDHAT, NORGES_BANK_CHAIN, ARBITRUM_GOERLI, CONTRACT_ADDRESSES } from "../constants";
import { Bridge__factory, CBToken__factory } from "../typechain-types";

const SOURCE_CHAIN = LOCAL_HARDHAT;
const DESTINATION_CHAIN = NORGES_BANK_CHAIN;

export async function readSourceDeposits() {
	console.log("===== START Reading source deposits...");
	try {
		const wallet = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(SOURCE_CHAIN, { withNetwork: true }),
		);
		// const bridge = Bridge__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS, wallet);
		const sourceToken = CBToken__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].CB_TOKEN_ADDRESS, wallet);

		const events = await sourceToken.queryFilter(
			sourceToken.filters.Transfer(null, CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS, null),
			0,
			"latest",
		);
		console.log("events", events);
	} catch (error) {
		console.log("error on setAuthenticatedPerson", error);
		return false;
	}
	console.log("===== END Reading source deposits...");
}
