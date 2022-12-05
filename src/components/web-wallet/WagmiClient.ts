import { Chain, configureChains, createClient } from "wagmi";
import { GET_PROVIDER, NORGES_BANK_CHAIN } from "./constants";
import { WebWalletConnector } from "./WebWalletConnector";
import debug from "debug";

const log = debug("WebWallet:wagmi");

const { provider } = configureChains(
	[NORGES_BANK_CHAIN],
	[
		(chain: Chain) => {
			return {
				chain: chain,
				provider: () => {
					// We need to configure this "fallback" provider manually because we need to use ethers basic auth for provider functionality which Wagmi do not expose.
					return GET_PROVIDER({ withNetwork: true });
				},
			};
		},
	],
);

const webWalletConnector = new WebWalletConnector({
	chains: [NORGES_BANK_CHAIN],
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
