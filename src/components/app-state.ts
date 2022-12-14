import { Address } from "wagmi";
import { TypeOf } from "zod";
import create from "zustand";
import { persist } from "zustand/middleware";
import { ARBITRUM_GOERLI, LOCAL_HARDHAT, NORGES_BANK_CHAIN } from "./constants";

export interface AppState {
	cbTokenAddress: Address;
	currentNetwork: CurrentNetwork;
	isGasless: boolean;
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
const CONTRACT_ADDRESSES: Record<CurrentNetwork, ContractAddresses> = {
	[ARBITRUM_GOERLI.id]: {
		CB_TOKEN_ADDRESS: "0x55dF8Ff5D598c5C24CfAe2f611835C445f8235d4",
		CBS_TOKEN_ADDRESS: "0x47dfb375c15fBea7c29b50a721C6294211C5f928",
		VC_REGISTRY_ADDRESS: "0x159AB36B385C78A7EC6d4CeCe8299B38b7085088",
		DISPERSE_WITH_DATA_ADDRESS: "0x24d11eB06f93780FeA023C19778b0ec5F8de2B89",
		TOKEN_SWAP_ADDRESS: "0x2c8300f29ae4E21A549F0c973Acc863Ff3356f34",
		BRIDGE_SOURCE_ADDRESS: "0x565Fb80E4D8191b91e788FEb5B11ADf9C35dBc9F",
		BRIDGE_DESTINATION_ADDRESS: "0x159dBD188A98d4B0eDbdD2F8bed2b008973200dA",
		CB_TOKEN_BRIDGE_ADDRESS: "0x86F2f01aEDC876f72f169Bc71371c60A65305cd9",
	},
	[NORGES_BANK_CHAIN.id]: {
		CB_TOKEN_ADDRESS: "0x45551c581235E9E323e65A9406a8dE70C3FE5EDF",
		CBS_TOKEN_ADDRESS: "0x00D522C63B01D9B6AA443d6d961EBC7042154cC5",
		VC_REGISTRY_ADDRESS: "0xB70782cA43b34d660d0AD8529D1898bE51033184",
		DISPERSE_WITH_DATA_ADDRESS: "0xB8e5eD07a218876f2eC2E7c09DF4fa21F61Ba4fb",
		TOKEN_SWAP_ADDRESS: "0xB8217dFD0eDAb82C08C4bcAB3Be0d7660c29C74C",
		BRIDGE_SOURCE_ADDRESS: "0x8B7FB99625173A44DccD416961F20dB07dFf1fF0",
		BRIDGE_DESTINATION_ADDRESS: "0xF156bE347d091e6dCb35f44A9c4cB38840dDDF2E",
		CB_TOKEN_BRIDGE_ADDRESS: "0x14eB6BC381e4245CE55c959BA0F5fb3DFa7176bA",
	},
	[LOCAL_HARDHAT.id]: {
		CB_TOKEN_ADDRESS: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
		CBS_TOKEN_ADDRESS: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
		VC_REGISTRY_ADDRESS: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
		DISPERSE_WITH_DATA_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
		TOKEN_SWAP_ADDRESS: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
		BRIDGE_SOURCE_ADDRESS: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
		BRIDGE_DESTINATION_ADDRESS: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
		CB_TOKEN_BRIDGE_ADDRESS: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
	},
};

export const useAppState = create<AppState>()(
	// persist(
	// Cant run persist to have a default state. See issue: https://github.com/pmndrs/zustand/issues/366#issuecomment-845497855
	(set, get) => {
		return {
			currentNetwork: DEFAULT_NETWORK,
			networkContractAddresses: CONTRACT_ADDRESSES,
			cbTokenAddress: CONTRACT_ADDRESSES[DEFAULT_NETWORK].CB_TOKEN_ADDRESS,
			isGasless: DEFAULT_NETWORK === Networks.BERGEN,
			updateCurrentNetwork: (network: CurrentNetwork) => {
				set({
					currentNetwork: network,
					cbTokenAddress: CONTRACT_ADDRESSES[network].CB_TOKEN_ADDRESS,
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
