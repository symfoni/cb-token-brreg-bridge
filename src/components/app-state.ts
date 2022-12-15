import { Address } from "wagmi";
import { TypeOf } from "zod";
import create from "zustand";
import { persist } from "zustand/middleware";
import { ARBITRUM_GOERLI, LOCAL_HARDHAT, NORGES_BANK_CHAIN } from "./constants";

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
const CONTRACT_ADDRESSES: Record<CurrentNetwork, ContractAddresses> = {
	[ARBITRUM_GOERLI.id]: {
		CB_TOKEN_ADDRESS: "0xF28696bc0650dA1b0Ee44a6Dd13833b22774af5e",
		CBS_TOKEN_ADDRESS: "0xae1754d8cBe8360aa08aE8A75Cc2FEF2e7155c60",
		VC_REGISTRY_ADDRESS: "0x17c5183f4e56e500365492DA6cCD91aa7891883b",
		DISPERSE_WITH_DATA_ADDRESS: "0x566310F30211752083992218f6c3B8158042404b",
		TOKEN_SWAP_ADDRESS: "0x7DeC5C9E3c295a8c07865395141CAe2AFbe2519E",
		BRIDGE_SOURCE_ADDRESS: "0xcDdFBb5754039962577E6d112cA3Ce0fEf7a773C",
		BRIDGE_DESTINATION_ADDRESS: "0x5f3C4bBB38f62df018fE5D3dDd5b699099867e9B",
		CB_TOKEN_BRIDGE_ADDRESS: "0xcCcC2f0839a140790C1D935f5C799F9be9D08f3b",
	},
	[NORGES_BANK_CHAIN.id]: {
		CB_TOKEN_ADDRESS: "0xb11f968b6b68e4e9aC2384E6B8d7fDE97203d0Ff",
		CBS_TOKEN_ADDRESS: "0xC013fE11650cA39344318239E36E85b921dF1298",
		VC_REGISTRY_ADDRESS: "0xA013f300022d9AD256311ADe78d8578695ae0678",
		DISPERSE_WITH_DATA_ADDRESS: "0xf3E9C09D2b520dFa4dE0Fe61b6c031acFA9cCFa8",
		TOKEN_SWAP_ADDRESS: "0xbaA174E8C8ef991A84F10aB8926734cF52AEDb28",
		BRIDGE_SOURCE_ADDRESS: "0xddbB593cb84BFbaa7069146D87bC623520619caF",
		BRIDGE_DESTINATION_ADDRESS: "0x147Ce3d64aC5780C16486cDdFE06414b5E1134Ac",
		CB_TOKEN_BRIDGE_ADDRESS: "0x21115ffe01a196fFC19d9B363cCbBA3D3BBb08f1",
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
