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
		CB_TOKEN_ADDRESS: "0xFeaaf78Be96cFfA64A3E8E67D60200e73799ADd3",
		CBS_TOKEN_ADDRESS: "0xca3229df8460E0Abe749db23aC557953eE16F6E6",
		VC_REGISTRY_ADDRESS: "0xdb29052D619b441a379Ee80E1f73b3AB1C77A081",
		DISPERSE_WITH_DATA_ADDRESS: "0x4180473212E8d9376634CE42A396df4a0308b9C2",
		TOKEN_SWAP_ADDRESS: "0x39F25b723074B56bFCed22D5A1e8eA3cA93d0221",
		BRIDGE_SOURCE_ADDRESS: "0xFfCAaFf26710af9B3595aF7714398Cd39cde9725",
		BRIDGE_DESTINATION_ADDRESS: "0xa20E3dEe0decCa33A744E402230876DB9f021A56",
		CB_TOKEN_BRIDGE_ADDRESS: "0x0743b83ec16b5A2f7237a577f5d596056c899629",
	},
	[NORGES_BANK_CHAIN.id]: {
		CB_TOKEN_ADDRESS: "0x4f170dAF7037f3DDe4cD831387883aEC0f26291e",
		CBS_TOKEN_ADDRESS: "0xC77d3cCb88D7e1df077E6FFBEc9efD227629E7Db",
		VC_REGISTRY_ADDRESS: "0xc18B421b9760246244D126DAF915f7c77c4879Fa",
		DISPERSE_WITH_DATA_ADDRESS: "0xfC410D4F8d1Cad4d5298694Ab50dA63C86b5Cb83",
		TOKEN_SWAP_ADDRESS: "0xFB7A52eE53632a3d4e56f1950139028ad5D1B558",
		BRIDGE_SOURCE_ADDRESS: "0xEaA5735B9A6784F533a0811aC64141D4c2b79B8f",
		BRIDGE_DESTINATION_ADDRESS: "0xb20255e412526cE57dd953043F4577Cd1ADB57B0",
		CB_TOKEN_BRIDGE_ADDRESS: "0xDA4ba51cf390b2a6b2D03A9AAB97586b88630596",
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
		process.env.SOURCE_CHAIN && !Number.isNaN(process.env.SOURCE_CHAIN) ? parseInt(process.env.SOURCE_CHAIN) : false;
	const destinationChainConfig =
		process.env.DESTINATION_CHAIN && !Number.isNaN(process.env.DESTINATION_CHAIN)
			? parseInt(process.env.DESTINATION_CHAIN)
			: false;

	console.log(CHAINS);
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
	console.log("chain config");
	console.log({
		sourceChain: SOURCE_CHAIN,
		destinationChain: DESTINATION_CHAIN,
		minBlockNumber: MIN_BLOCK_NUMBER,
	});
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
