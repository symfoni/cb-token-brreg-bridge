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
		CB_TOKEN_ADDRESS: "0xDEcC62038c51fd13a630808213078E45aA766992",
		CBS_TOKEN_ADDRESS: "0x04dC6F70233C1838B543Ce896A8fB879B763E953",
		VC_REGISTRY_ADDRESS: "0x20b3bB19681C88687a729546c7733343c494B541",
		DISPERSE_WITH_DATA_ADDRESS: "0xA3F71C771007bd422c0D196b0353A618d7569F53",
		TOKEN_SWAP_ADDRESS: "0x07e26a0DdEcbe85C57ce2aaE2223Ea51A16b0C89",
		BRIDGE_SOURCE_ADDRESS: "0xb8578ac7eAbc94bbE20de61ef466481891482b74",
		BRIDGE_DESTINATION_ADDRESS: "0x7D121B848b651Cfbb41044dDdCCFb35925435A9c",
		CB_TOKEN_BRIDGE_ADDRESS: "0x796d2f5A555a070580DDab135F53d9aFC42BbBa0",
	},
	[NORGES_BANK_CHAIN.id]: {
		CB_TOKEN_ADDRESS: "0xDDE530238C0F496109795E0a87A76b6B5eD15B4e",
		CBS_TOKEN_ADDRESS: "0x4156A5FDADAe688Be8D860985b550b26213C7F2C",
		VC_REGISTRY_ADDRESS: "0xCa8C4a7381D7Cb661aa1D52Ed3481Ea5B98b4072",
		DISPERSE_WITH_DATA_ADDRESS: "0xE9a480E3DB105Fb793c287156AaAF8A13eec62b4",
		TOKEN_SWAP_ADDRESS: "0x9E73Bc4C6489f15952e102644121b42718810C30",
		BRIDGE_SOURCE_ADDRESS: "0x12ae4CE91E10407b4d113F7e80E2f7B92a3B4979",
		BRIDGE_DESTINATION_ADDRESS: "0xB86b74adDc5198f101926c20cA990778b4CCbb1A",
		CB_TOKEN_BRIDGE_ADDRESS: "0x62B59A2A02274EA03D3618607A4E35cCd907a943",
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
