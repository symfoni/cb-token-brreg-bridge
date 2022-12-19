import { ethers } from "ethers";
import { GET_PROVIDER, LOCAL_HARDHAT, NORGES_BANK_CHAIN, ARBITRUM_GOERLI,  } from "../components/constants";
import { CBToken__factory } from "../typechain-types";

const SOURCE_CHAIN = LOCAL_HARDHAT;
const DESTINATION_CHAIN = NORGES_BANK_CHAIN;

export function readSourceDeposits() {
    console.log('===== START Reading source deposits...')
    try {
		const wallet = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(GET_PROVIDER(SOURCE_CHAIN, {withNetwork: true}));
		const contract = CBToken__factory.connect(VC_REGISTRY_ADDRESS, wallet);
		const tx = await contract.setAuthenticatedPerson(address, IS_LOCAL_ENV ? undefined : TX_OVERRIDE);
		const receipt = await tx.wait();

		const wallet = new ethers.Wallet(process.env.ISSUER_PRIVATE_KEY!).connect(getProvider(true));
		const contract = VCRegistry__factory.connect(VC_REGISTRY_ADDRESS, wallet);
		const res = await contract.checkAuthenticatedOnce(address, IS_LOCAL_ENV ? undefined : TX_OVERRIDE);
	} catch (error) {
		console.log("error on setAuthenticatedPerson", error);
		return false;
	}
    console.log('===== END Reading source deposits...')
}