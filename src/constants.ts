import { ethers } from "ethers";
import { Chain } from "wagmi";
import { ContractAddresses, CurrentNetwork } from "./components/app-state";

export const IS_GASSLESS = (chain: Chain) => chain.id === NORGES_BANK_CHAIN.id;

export const TX_OVERRIDE = {
	gasPrice: ethers.utils.parseUnits("0.0", "gwei"),
	gasLimit: ethers.BigNumber.from(199462),
};

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

export const CHAINS: Chain[] = [NORGES_BANK_CHAIN, ARBITRUM_GOERLI, LOCAL_HARDHAT];

export const CONTRACT_ADDRESSES: Record<CurrentNetwork, ContractAddresses> = {
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
	[ARBITRUM_GOERLI.id]: {
		CB_TOKEN_ADDRESS: "0x59dA772090179e51b39F8106fEC12088E36B1C71",
		CBS_TOKEN_ADDRESS: "0x1252d47cB5FA2881907191d9E87E765a81bACbbD",
		VC_REGISTRY_ADDRESS: "0xDefEB7a20b1Df152892813F34E0dCb7f7Ec71647",
		DISPERSE_WITH_DATA_ADDRESS: "0x66E9955EfDF3629B78cE4e9248d59E0ee4f3eF67",
		TOKEN_SWAP_ADDRESS: "0x0d37459843A181897910E506f5789f295Caade19",
		BRIDGE_SOURCE_ADDRESS: "0x93e914936160D30a453BbDA4Bd34F85DaCae8E00",
		BRIDGE_DESTINATION_ADDRESS: "0x1b0d0C528477fA17e37b8Bf36c77dD43175B2C05",
		CB_TOKEN_BRIDGE_ADDRESS: "0xbb7c297e79d338b8aA0a6BBa0BdFb817B8f5E3A5",
	},
	[NORGES_BANK_CHAIN.id]: {
		CB_TOKEN_ADDRESS: "0xC493a9B755714079A7E940cbceCdd5a02c938203",
		CBS_TOKEN_ADDRESS: "0x38Cdcc3CeA4a34dC38aFfA16F408446C26D11a50",
		VC_REGISTRY_ADDRESS: "0xEF6C494f5F60ada94B36763E585219BAe623c3f7",
		DISPERSE_WITH_DATA_ADDRESS: "0x5869aB578070FA1f02f0f43cad8B952432E76eF9",
		TOKEN_SWAP_ADDRESS: "0xd5385BdaD1F27b8fc77271aceE8118004aC89EA5",
		BRIDGE_SOURCE_ADDRESS: "0xfe99927463B0c6789dc7Ae06bA43EC9c1eB6A091",
		BRIDGE_DESTINATION_ADDRESS: "0xBc1d95E121462e2EEd8b8c159b5538776A9814da",
		CB_TOKEN_BRIDGE_ADDRESS: "0x95C1cE5d1CD3b4608ef07c30B9C606e31BbA2280",
	},
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

export const BRIDGE_CHAIN_CONFIG = () => {
	const sourceChainConfig =
		process.env.NEXT_PUBLIC_SOURCE_CHAIN && !Number.isNaN(process.env.NEXT_PUBLIC_SOURCE_CHAIN)
			? parseInt(process.env.NEXT_PUBLIC_SOURCE_CHAIN)
			: false;
	const destinationChainConfig =
		process.env.NEXT_PUBLIC_DESTINATION_CHAIN && !Number.isNaN(process.env.NEXT_PUBLIC_DESTINATION_CHAIN)
			? parseInt(process.env.NEXT_PUBLIC_DESTINATION_CHAIN)
			: false;

	const SOURCE_CHAIN = sourceChainConfig ? CHAINS.find((chain) => chain.id === sourceChainConfig) : LOCAL_HARDHAT;
	const DESTINATION_CHAIN = destinationChainConfig
		? CHAINS.find((chain) => chain.id === destinationChainConfig)
		: NORGES_BANK_CHAIN;
	if (!SOURCE_CHAIN) {
		throw new Error("Invalid source chain");
	}
	if (!DESTINATION_CHAIN) {
		throw new Error("Invalid destination chain");
	}
	const MIN_BLOCK_NUMBER = {
		[LOCAL_HARDHAT.id]:
			process.env.FROM_BLOCK_LOCAL_BLOCKCHAIN && !Number.isNaN(process.env.FROM_BLOCK_LOCAL_BLOCKCHAIN)
				? parseInt(process.env.FROM_BLOCK_LOCAL_BLOCKCHAIN)
				: 0,
		[NORGES_BANK_CHAIN.id]:
			process.env.FROM_BLOCK_NORGES_BANK && !Number.isNaN(process.env.FROM_BLOCK_NORGES_BANK)
				? parseInt(process.env.FROM_BLOCK_NORGES_BANK)
				: 3755065,
		[ARBITRUM_GOERLI.id]:
			process.env.FROM_BLOCK_ARBITRUM_GOERLI && !Number.isNaN(process.env.FROM_BLOCK_ARBITRUM_GOERLI)
				? parseInt(process.env.FROM_BLOCK_ARBITRUM_GOERLI)
				: 3336808,
	};
	return {
		sourceChain: SOURCE_CHAIN,
		destinationChain: DESTINATION_CHAIN,
		minBlockNumber: MIN_BLOCK_NUMBER,
	};
};

export type BridgeChainConfig = {
	sourceChain: Chain;
	destinationChain: Chain;
	minBlockNumber: Record<number, number>;
};
