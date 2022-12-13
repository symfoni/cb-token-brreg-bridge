import { Address } from "wagmi";
import { TypeOf } from "zod";
import create from "zustand";
import { persist } from "zustand/middleware";
import { ARBITRUM_GOERLI, LOCAL_HARDHAT, NORGES_BANK_CHAIN } from "./constants";

export interface AppState {
	cbTokenAddress?: Address;
	currentNetwork?: CurrentNetwork;
	networkContractAddresses?: Record<CurrentNetwork, ContractAddresses>;
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
};

const DEFAULT_NETWORK = process.env.NODE_ENV === "development" ? Networks.LOCAL_HARDHAT : Networks.BERGEN;
const CONTRACT_ADDRESSES: Record<CurrentNetwork, ContractAddresses> = {
	[ARBITRUM_GOERLI.id]: {
		CB_TOKEN_ADDRESS: "0x976fcd02f7C4773dd89C309fBF55D5923B4c98a1",
		CBS_TOKEN_ADDRESS: "0x927b167526bAbB9be047421db732C663a0b77B11",
		VC_REGISTRY_ADDRESS: "0xCA8c8688914e0F7096c920146cd0Ad85cD7Ae8b9",
		DISPERSE_WITH_DATA_ADDRESS: "0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f",
		TOKEN_SWAP_ADDRESS: "0x32EEce76C2C2e8758584A83Ee2F522D4788feA0f",
	},
	[NORGES_BANK_CHAIN.id]: {
		CB_TOKEN_ADDRESS: "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF",
		CBS_TOKEN_ADDRESS: "0x36C02dA8a0983159322a80FFE9F24b1acfF8B570",
		VC_REGISTRY_ADDRESS: "0x70e0bA845a1A0F2DA3359C97E0285013525FFC49",
		DISPERSE_WITH_DATA_ADDRESS: "0x95401dc811bb5740090279Ba06cfA8fcF6113778",
		TOKEN_SWAP_ADDRESS: "0x809d550fca64d94Bd9F66E60752A544199cfAC3D",
	},
	[LOCAL_HARDHAT.id]: {
		CB_TOKEN_ADDRESS: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
		CBS_TOKEN_ADDRESS: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
		VC_REGISTRY_ADDRESS: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
		DISPERSE_WITH_DATA_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
		TOKEN_SWAP_ADDRESS: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
	},
};

export const useAppState = create<AppState>()(
	persist(
		(set, get) => ({
			currentNetwork: DEFAULT_NETWORK,
			networkContractAddresses: undefined,
			cbTokenAddress: undefined,
			updateCurrentNetwork: (network: CurrentNetwork) => {
				set({
					currentNetwork: network,
					networkContractAddresses: CONTRACT_ADDRESSES[Networks.ARBITRUM_GOERLI],
					cbTokenAddress: CONTRACT_ADDRESSES[network].CB_TOKEN_ADDRESS,
				});
			},
		}),
		{
			name: "cb-token-bridge-storage",
			partialize: (state) => ({ currentNetwork: state.currentNetwork }),
		},
	),
);
