import { Connector, Chain, ConnectorData, Address } from "wagmi";
import { ethers } from "ethers";
import { useWebWalletState } from "./web-wallet-state";
import { GET_PROVIDER } from "../../constants";
import debug from "debug";
const log = debug("bridge:WebWalletConnector");

export class WebWalletConnector extends Connector<ethers.providers.JsonRpcProvider, { secret: string }, ethers.Wallet> {
	readonly id = "web_wallet_connector";
	readonly name = "Web Wallet";

	ready = false;

	secret?: string;
	provider?: ethers.providers.JsonRpcProvider;
	wallet?: ethers.Wallet;

	// rome-ignore lint/suspicious/noExplicitAny: Because this is WAGMI interface
	constructor(config: { chains?: Chain[]; options: any }) {
		super(config);
		if (!config.chains) {
			throw Error("No chains provided");
		}

		useWebWalletState.subscribe((state) => {
			if (state.secret) {
				log("Secret changed, updating wallet");
				this.secret = state.secret;
				// const chain = this.chains.find((chain) => chain.id === state.selectedChainId);
				// if (!chain) {
				// 	throw Error(
				// 		`SelectedChainId: ${state.selectedChainId}, but configured chains only contains: ${this.chains
				// 			.map((chain) => chain.id)
				// 			.join(", ")}`,
				// 	);
				// }
				// if (chain.rpcUrls.default === "CUSTOM_WORKAROUND") {
				// 	this.provider = GET_PROVIDER();
				// } else {
				// 	this.provider = new ethers.providers.JsonRpcProvider(chain.rpcUrls.default);
				// }
				// if (!this.provider) {
				// 	throw Error("Provider should have been defined at this point");
				// }
				// this.wallet = new ethers.Wallet(state.secret).connect(this.provider);
				// if (this.ready) {
				// 	this.onAccountsChanged([this.wallet.address]);
				// }
				// this.ready = true;
			}
		});
	}

	// rome-ignore lint/suspicious/noExplicitAny: Because this is WAGMI interface
	async connect(config?: { chainId?: number | undefined } | undefined): Promise<Required<ConnectorData<any>>> {
		const chain = this.chains.find((chain) => chain.id === config?.chainId);
		if (!chain) {
			throw Error(
				`SelectedChainId: ${config?.chainId}, but configured chains only contains: ${this.chains
					.map((chain) => chain.id)
					.join(", ")}`,
			);
		}
		this.provider = GET_PROVIDER(chain, { withNetwork: true });
		if (!this.provider) {
			throw Error("Provider should have been defined at this point");
		}
		if (this.secret) {
			this.wallet = new ethers.Wallet(this.secret).connect(this.provider);
			if (this.ready) {
				this.onAccountsChanged([this.wallet.address]);
			}
		} else {
			// TODO - Support connecting without wallet
			throw Error("Secret should have been defined at this point");
		}

		this.ready = true;
		const account = await this.getAccount();
		return {
			account,
			chain: {
				id: chain.id,
				unsupported: false,
			},
			provider: this.provider,
		};
	}

	async switchChain?(chainId: number): Promise<Chain> {
		const chain = this.chains.find((chain) => chain.id === chainId);
		if (!chain) {
			throw Error("Chain not found. Maybe you forgot to configure it in Wagmi client?");
		}
		log("Switching chain to: ", chain);
		this.wallet = undefined;
		this.ready = false;
		await this.connect({ chainId: chain.id });
		// this.provider = GET_PROVIDER(chain, { withNetwork: true });
		// if (this.wallet) {
		// 	this.wallet = this.wallet.connect(this.provider);
		// }
		log("Done switching");
		return chain;
	}

	async getProvider() {
		if (!this.provider) {
			throw new Error("Provider not set");
		}
		return this.provider;
	}
	async getWallet(): Promise<ethers.Wallet> {
		if (!this.wallet) {
			throw Error("No wallet set");
		}
		return this.wallet;
	}

	async getAccount(): Promise<Address> {
		if (this.wallet && ethers.utils.isAddress(this.wallet.address)) {
			return this.wallet.address;
		}
		throw Error("Couldt not get a account with valid address for the wallet");
	}
	async getChainId(): Promise<number> {
		const chainId = this.provider?.network.chainId;
		if (!chainId) {
			throw Error("Could not get chainId from provider, maybe provider not initialized yet");
		}
		return chainId;
	}
	async getSigner(config?: { chainId?: number | undefined } | undefined): Promise<ethers.Wallet> {
		return this.getWallet();
	}

	async isAuthorized(): Promise<boolean> {
		return this.ready;
	}

	async disconnect(): Promise<void> {
		this.wallet = undefined;
		this.ready = false;
	}

	protected onAccountsChanged(accounts: string[]): void {
		log("Accounts changed", accounts);
	}
	protected onChainChanged(chain: number | string): void {
		throw new Error("Method not implemented.");
	}
	protected onDisconnect(error: Error): void {
		throw new Error("Method not implemented.");
	}
	// Implement other methods
	// connect, disconnect, getAccount, etc.
}
