import { Address } from "wagmi";
import { TypeOf } from "zod";
import create from "zustand";
import { persist } from "zustand/middleware";
import { ARBITRUM_GOERLI, LOCAL_HARDHAT, NORGES_BANK_CHAIN } from "./constants";

export interface AppState {
	cbTokenAddress: Address;
	currentNetwork: CurrentNetwork;
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
};

const DEFAULT_NETWORK = process.env.NODE_ENV === "development" ? Networks.LOCAL_HARDHAT : Networks.BERGEN;
const CONTRACT_ADDRESSES: Record<CurrentNetwork, ContractAddresses> = {
	[ARBITRUM_GOERLI.id]: {
		CB_TOKEN_ADDRESS: "0xeCf4537f5B6248166f23587754498Fd3CDD948D5",
		CBS_TOKEN_ADDRESS: "0xc4a4512c870Ad3988E23055Eb4628f8f8fb3815D",
		VC_REGISTRY_ADDRESS: "0x919EC7bd77C95D4a4934fE6a5031c1295444144B",
		DISPERSE_WITH_DATA_ADDRESS: "0xBcDb90F56c4885F3216b05BbDaD3C39bEBCebb0E",
		TOKEN_SWAP_ADDRESS: "0x67c4B9036C8FFB23AcCc39b556d03d76b589321d",
	},
	[NORGES_BANK_CHAIN.id]: {
		CB_TOKEN_ADDRESS: "0x328d27B2C81781871e87C6617d07AC9ce85714f0",
		CBS_TOKEN_ADDRESS: "0x74CB37519e332E4EfAb8D58367a88E132e852E24",
		VC_REGISTRY_ADDRESS: "0xe2699fc361384A934BE0Ad1a3bDf235Ac43C122d",
		DISPERSE_WITH_DATA_ADDRESS: "0xd8A32038AcDC877B17e5b80Ce4552c2b1CBC9b63",
		TOKEN_SWAP_ADDRESS: "0xBAa41CC14dCa392bFe1B9a64177b055cbFd76144",
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
			networkContractAddresses: CONTRACT_ADDRESSES,
			cbTokenAddress: CONTRACT_ADDRESSES[DEFAULT_NETWORK].CB_TOKEN_ADDRESS,
			updateCurrentNetwork: (network: CurrentNetwork) => {
				set({
					currentNetwork: network,
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
