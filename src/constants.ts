import { ethers } from "ethers";
import { Address, Chain } from "wagmi";
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
		CB_TOKEN_ADDRESS: "0xbcdf1c7e3B6D8C23A369459769D1aBaadC8888a7",
		CBS_TOKEN_ADDRESS: "0xB6EA47bA32b3ee2C5029f2ec9Bf2d57B45007989",
		VC_REGISTRY_ADDRESS: "0x94E33Fd1C71784E30A1672E5c8a64FbD91e35D7B",
		DISPERSE_WITH_DATA_ADDRESS: "0x379F5D19A4a2F5B67A906d90656B754aba4a5623",
		TOKEN_SWAP_ADDRESS: "0x7fbDd5F1CAA0b8ec99808d105BC04904915AA412",
		BRIDGE_SOURCE_ADDRESS: "0x4dC920a9E1b13ec76b34AE1e0994A41524141b68",
		BRIDGE_DESTINATION_ADDRESS: "0x99650f69074bdAdE11DE159CC5429D4dCC120d99",
		CB_TOKEN_BRIDGE_ADDRESS: "0xFADe9505eECb0A7d7fF5De2b2Cd1b25f7faf57f7",
	},
	[NORGES_BANK_CHAIN.id]: {
		CB_TOKEN_ADDRESS: "0x51AD2F50D3e66C625694c339871634F1C75B6AC7",
		CBS_TOKEN_ADDRESS: "0xB70fb952a9CA4F73D64Bbc65AE1D54DC38adBe3c",
		VC_REGISTRY_ADDRESS: "0x6bE8b9fC308719f2f9EB5867e7a2ed75039D7E12",
		DISPERSE_WITH_DATA_ADDRESS: "0x211F245bC715E512a028B8A4fe1FcE087c965Bc4",
		TOKEN_SWAP_ADDRESS: "0xb04492b3868e221824ECea6D55271f39029E18C5",
		BRIDGE_SOURCE_ADDRESS: "0x08cb8FCd6ef1eB03838651Cb4Eb161BF62807f42",
		BRIDGE_DESTINATION_ADDRESS: "0xc45dBd540d084F4324ff78D2284B4dE2219FB223",
		CB_TOKEN_BRIDGE_ADDRESS: "0xe82004383dA68e2D3b34fdF8da51be2a6B5D84da",
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
