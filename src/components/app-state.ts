import { Address } from "wagmi";
import create from "zustand";
import { persist } from "zustand/middleware";

export interface AppState {
	cbTokenAddress: Address | undefined;
	currentNetwork: CurrentNetwork;
}

export type CurrentNetwork = "BERGEN" | "ARBITRUM_GOERLI" | "LOCAL_HARDHAT";

export const useAppState = create<AppState>()(
	persist(
		(set) => ({
			cbTokenAddress: process.env.NEXT_PUBLIC_CB_TOKEN_ADDRESS_BERGEN! as Address,
			currentNetwork: "BERGEN",
		}),
		{
			name: "cb-token-bridge-storage",
			partialize: (state) => state,
		},
	),
);
