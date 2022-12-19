import { Chain, configureChains, createClient } from "wagmi";
import { ARBITRUM_GOERLI, GET_PROVIDER, LOCAL_HARDHAT, NORGES_BANK_CHAIN } from "../../constants";
import { WebWalletConnector } from "./web-wallet-connector";
import debug from "debug";

const log = debug("bridge:wagmi-client");

const { provider } = configureChains(
	[NORGES_BANK_CHAIN, ARBITRUM_GOERLI, LOCAL_HARDHAT],
	[
		(chain: Chain) => {
			return {
				chain: chain,
				provider: () => GET_PROVIDER(chain, { withNetwork: true }),
			};
		},
	],
);

const webWalletConnector = new WebWalletConnector({
	chains: [NORGES_BANK_CHAIN, ARBITRUM_GOERLI, LOCAL_HARDHAT],
	options: {},
});

export const client = createClient({
	autoConnect: true,
	connectors: [webWalletConnector],
	provider,
	logger: {
		warn: (message) => log(message),
	},
});
