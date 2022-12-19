import { ethers } from "ethers";
import { Address, Chain } from "wagmi";
import { ContractAddresses, CurrentNetwork } from "./components/app-state";

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

export const CONTRACT_ADDRESSES: Record<CurrentNetwork, ContractAddresses> = {
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
