import { ethers } from "ethers";
import { Address, Chain } from "wagmi";

export const NORGES_BANK_CHAIN: Chain = {
	id: 1729,
	name: "Norwegian Central Bank Network",
	network: "ncb",
	nativeCurrency: {
		decimals: 18,
		name: "NCB",
		symbol: "ETH",
	},
	rpcUrls: {
		default: "CUSTOM_WORKAROUND", // Wagmi does not support basic auth for RPC, so we configure this directly in the configureChains
	},
	blockExplorers: {
		default: { name: "Blockscout", url: "https://blockscout.bergen.nahmii.io" },
	},
	testnet: false,
};

export const ARBITRUM_GOERLI: Chain = {
	id: 421613,
	name: "Arbitrum Goerli",
	network: "arbitrum",
	rpcUrls: {
		default: process.env.NEXT_PUBLIC_RPC_URL_ARBITRUM_GOERLI!,
	},
	blockExplorers: {
		default: { name: "Arbiscan Goerli", url: "https://goerli.arbiscan.io/" },
	},
	testnet: false,
};

export const LOCAL_HARDHAT: Chain = {
	id: 31337,
	name: "Local",
	network: "local",
	rpcUrls: {
		default: process.env.NEXT_PUBLIC_RPC_URL_LOCAL!,
	},
	testnet: false,
};

export const GET_PROVIDER = (chain: Chain, _params: { withNetwork?: boolean }) => {
	const params = { withNetwork: false, ..._params };
	if (chain.rpcUrls.default === "CUSTOM_WORKAROUND") {
		const user = process.env.NEXT_PUBLIC_RPC_USER_BERGEN;
		const password = process.env.NEXT_PUBLIC_RPC_PASSWORD_BERGEN;
		const url = process.env.NEXT_PUBLIC_RPC_URL_BERGEN;
		if (!user) {
			throw new Error("Missing NEXT_PUBLIC_RPC_USER_BERGEN");
		}
		if (!password) {
			throw new Error("Missing NEXT_PUBLIC_RPC_PASSWORD_BERGEN");
		}
		if (!url) {
			throw new Error("Missing NEXT_PUBLIC_RPC_URL_BERGEN");
		}
		return new ethers.providers.JsonRpcProvider(
			{
				url,
				user,
				password,
			},
			params.withNetwork
				? {
						chainId: chain.id,
						name: chain.name,
				  }
				: undefined,
		);
	} else {
		return new ethers.providers.JsonRpcProvider(
			chain.rpcUrls.default,
			params.withNetwork
				? {
						chainId: chain.id,
						name: chain.name,
				  }
				: undefined,
		);
	}
};
