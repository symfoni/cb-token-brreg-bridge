import { ethers } from "ethers";
import { GET_PROVIDER, BridgeChainConfig, CONTRACT_ADDRESSES } from "../constants";
import { Bridge__factory, CBToken__factory, VCRegistry__factory } from "../typechain-types";

export async function checkAccesss(params: BridgeChainConfig) {
	const { sourceChain, destinationChain, minBlockNumber } = params;
	const walletSource = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
		GET_PROVIDER(sourceChain, { withNetwork: true }),
	);
	const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
		GET_PROVIDER(destinationChain, { withNetwork: true }),
	);
	const destinationVCRegistry = VCRegistry__factory.connect(
		CONTRACT_ADDRESSES[destinationChain.id].VC_REGISTRY_ADDRESS,
		walletDestination,
	);
	const hasBankRoleInDestinationChain = await destinationVCRegistry.hasRole(
		ethers.utils.id("BANK_ROLE"),
		walletDestination.address,
	);
	console.log("hasBankRoleInDestinationChain", hasBankRoleInDestinationChain);
	if (!hasBankRoleInDestinationChain) {
		throw new Error("Destination chain does not have BANK_ROLE");
	}

	const destinationBridge = Bridge__factory.connect(
		CONTRACT_ADDRESSES[destinationChain.id].BRIDGE_DESTINATION_ADDRESS,
		walletDestination,
	);
	const ownerDestinationBridge = await destinationBridge.owner();
	console.log("ownerDestinationBridge", ownerDestinationBridge);
	if (ownerDestinationBridge !== walletDestination.address) {
		throw new Error("Bridge owner is not owner of destination bridge");
	}

	const destinationToken = CBToken__factory.connect(
		CONTRACT_ADDRESSES[destinationChain.id].CB_TOKEN_BRIDGE_ADDRESS,
		walletDestination,
	);
	const destinationBridgeHasMinterRole = await destinationToken.hasRole(
		ethers.utils.id("MINTER_ROLE"),
		destinationBridge.address,
	);
	console.log("destinationBridgeHasMinterRole", destinationBridgeHasMinterRole);
	if (!destinationBridgeHasMinterRole) {
		throw new Error("Destination bridge does not have MINTER_ROLE");
	}
	const destinationBridgeHasBurnerRole = await destinationToken.hasRole(
		ethers.utils.id("BURNER_ROLE"),
		destinationBridge.address,
	);
	console.log("destinationBridgeHasBurnerRole", destinationBridgeHasBurnerRole);
	if (!destinationBridgeHasBurnerRole) {
		throw new Error("Destination bridge does not have BURNER_ROLE");
	}

	const sourceBridge = Bridge__factory.connect(CONTRACT_ADDRESSES[sourceChain.id].BRIDGE_SOURCE_ADDRESS, walletSource);
	const ownerSourceBridge = await sourceBridge.owner();
	console.log("ownerSourceBridge", ownerSourceBridge);
	if (ownerSourceBridge !== walletSource.address) {
		throw new Error("Bridge owner is not owner of source bridge");
	}
}
