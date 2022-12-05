import { ethers } from "ethers";
import { Chain } from "wagmi";

export const NORGES_BANK_CHAIN: Chain = {
	id: 1729,
	name: "NorwegianCentralBank",
	network: "ncb",
	nativeCurrency: {
		decimals: 18,
		name: "NCB",
		symbol: "ETH",
	},
	rpcUrls: {
		default: "NOT APPLICABLE", // Wagmi does not support basic auth for RPC, so we configure this directly in the configureChains
	},
	blockExplorers: {
		default: { name: "Blockscout", url: "https://blockscout.bergen.nahmii.io" },
	},
	testnet: false,
};

export const GET_PROVIDER = (params: { withNetwork: boolean } = { withNetwork: false }) => {
	const IS_LOCAL_ENV = process.env.NEXT_PUBLIC_RPC_USER === "" || process.env.NEXT_PUBLIC_RPC_PASSWORD === "";
	return new ethers.providers.JsonRpcProvider(
		{
			url: process.env.NEXT_PUBLIC_RPC_URL!,
			user: IS_LOCAL_ENV ? undefined : process.env.NEXT_PUBLIC_RPC_USER,
			password: IS_LOCAL_ENV ? undefined : process.env.NEXT_PUBLIC_RPC_PASSWORD,
		},
		params.withNetwork
			? {
					chainId: parseInt(process.env.NEXT_PUBLIC_RPC_CHAIN_ID!),
					name: process.env.NEXT_PUBLIC_RPC_CHAIN_NAME!,
			  }
			: undefined,
	);
};
