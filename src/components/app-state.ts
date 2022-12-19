import { Address } from "wagmi";
import create from "zustand";
import { ARBITRUM_GOERLI, CONTRACT_ADDRESSES, LOCAL_HARDHAT, NORGES_BANK_CHAIN } from "../constants";

export interface AppState {
	cbTokenAddress: Address;
	currentNetwork: CurrentNetwork;
	isGasless: boolean;
	currentNetworkName: string;
	networkContractAddresses: Record<CurrentNetwork, ContractAddresses>;
	updateCurrentNetwork: (network: CurrentNetwork) => void;
}

const Networks = {
	BERGEN: NORGES_BANK_CHAIN.id,
	ARBITRUM_GOERLI: ARBITRUM_GOERLI.id,
	LOCAL_HARDHAT: LOCAL_HARDHAT.id,
} as const;

export type CurrentNetwork = typeof Networks[keyof typeof Networks];

export type ContractAddresses = {
	DISPERSE_WITH_DATA_ADDRESS: Address;
	VC_REGISTRY_ADDRESS: Address;
	CB_TOKEN_ADDRESS: Address;
	CBS_TOKEN_ADDRESS: Address;
	TOKEN_SWAP_ADDRESS: Address;
	BRIDGE_SOURCE_ADDRESS: Address;
	BRIDGE_DESTINATION_ADDRESS: Address;
	CB_TOKEN_BRIDGE_ADDRESS: Address;
};

const DEFAULT_NETWORK = process.env.NODE_ENV === "development" ? Networks.LOCAL_HARDHAT : Networks.BERGEN;

export const useAppState = create<AppState>()(
	// persist(
	// Cant run persist to have a default state. See issue: https://github.com/pmndrs/zustand/issues/366#issuecomment-845497855
	(set, get) => {
		return {
			currentNetwork: DEFAULT_NETWORK,
			currentNetworkName:
				Object.entries(Networks)
					.find(([name, chainId]) => chainId === DEFAULT_NETWORK)?.[0]
					.replace("_", " ") ?? "Unknown",
			networkContractAddresses: CONTRACT_ADDRESSES,
			cbTokenAddress: CONTRACT_ADDRESSES[DEFAULT_NETWORK].BRIDGE_DESTINATION_ADDRESS,
			isGasless: DEFAULT_NETWORK === Networks.BERGEN,
			updateCurrentNetwork: (network: CurrentNetwork) => {
				set({
					currentNetwork: network,
					currentNetworkName:
						Object.entries(Networks)
							.find(([name, chainId]) => chainId === network)?.[0]
							.replace("_", " ") ?? "Unknown",
				});
			},
		};
	},
	// 	{
	// 		name: "cb-token-bridge-storage",
	// 		partialize: (state) => ({ currentNetwork: state.currentNetwork }),
	// 	},
	// ),
);
