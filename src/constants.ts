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
		CB_TOKEN_ADDRESS: "0xBA6b14f02214BCe456EA762D5a1Ed3DaD2fDE714",
		CBS_TOKEN_ADDRESS: "0x78F264c87eA058542fBede424B2592EDf53f5014",
		VC_REGISTRY_ADDRESS: "0xCb58fAEFd0b3D04531cF86bcbB6e99FF1409b00C",
		DISPERSE_WITH_DATA_ADDRESS: "0xd6368f767bE7E33354D6bBf5C676e128841cF613",
		TOKEN_SWAP_ADDRESS: "0xFcDA2cb9C6064230991640acfD8D443a4761D54f",
		BRIDGE_SOURCE_ADDRESS: "0x82e15237A019D28c13e43A0fe939f55a864C0E84",
		BRIDGE_DESTINATION_ADDRESS: "0xFBA9bC1D9FdFf7CC15d7867a52B0610B9cD0f1B0",
		CB_TOKEN_BRIDGE_ADDRESS: "0xbFf5E117403CD8F973A02F350679C970CDe2C066",
	},
	[NORGES_BANK_CHAIN.id]: {
		CB_TOKEN_ADDRESS: "0x89638B9028b0b9A768e274Df815226Bfc741cd8b",
		CBS_TOKEN_ADDRESS: "0xC6fDE40Ae97A50002793bf8Ec24CF49b2Ff8296d",
		VC_REGISTRY_ADDRESS: "0x24Df1f39C9A5B5f9B96efE38b14fffd79B41FF49",
		DISPERSE_WITH_DATA_ADDRESS: "0xC05fe886d8C0846e9Dad28b5D58b04aa05B5A742",
		TOKEN_SWAP_ADDRESS: "0x83Ae325227415D0b1C86ECfF2d124f66fC4132CC",
		BRIDGE_SOURCE_ADDRESS: "0x31A5c6668DbB7fA345D4a791AC96B9b3960Ff584",
		BRIDGE_DESTINATION_ADDRESS: "0xA240e41787Bb79b8Fc59cA94d72339390B950cc5",
		CB_TOKEN_BRIDGE_ADDRESS: "0xAa51d4aB4F37A5328583F41412d72Cb1bc91797E",
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
