import { Connector, Chain, ConnectorData, Address } from "wagmi";
import { ethers } from "ethers";
import { useWebWalletState } from "./state";
import { GET_PROVIDER } from "./constants";

export class WebWalletConnector extends Connector<ethers.providers.JsonRpcProvider, { secret: string }, ethers.Wallet> {
	readonly id = "web_wallet_connector";
	readonly name = "Web Wallet";
	ready = false;

	provider?: ethers.providers.JsonRpcProvider;
	wallet?: ethers.Wallet;

	constructor(config: { chains?: Chain[]; options: any }) {
		super(config);
		if (!config.chains) {
			throw Error("No chains provided");
		}

		for (const chain of config.chains) {
			// TODO - support multiple chains
			if (chain.id === 1729) {
				this.provider = GET_PROVIDER();
			}
			// this.provider = getProvider(true);
			// this.provider = chain.provider() as ethers.providers.JsonRpcProvider;
			useWebWalletState.subscribe((state) => {
				if (state.secret) {
					if (!this.provider) {
						throw Error("No provider set");
					}
					console.log("Setting wallet", state.secret);
					this.wallet = new ethers.Wallet(state.secret).connect(this.provider);
					if (this.ready) {
						this.onAccountsChanged([this.wallet.address]);
					}
					this.ready = true;
				}
			});
			break; // TODO - Must be fixed for multiple chains
		}
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

	async connect(config?: { chainId?: number | undefined } | undefined): Promise<Required<ConnectorData<any>>> {
		if (!this.wallet) {
			throw Error("No wallet set on connect");
		}
		if (!this.provider) {
			throw Error("No provider set on connect");
		}
		return {
			account: await this.getAccount(),
			chain: {
				id: 1729,
				unsupported: false,
			},
			provider: this.provider,
		};
	}
	async getAccount(): Promise<Address> {
		if (this.wallet && ethers.utils.isAddress(this.wallet.address)) {
			return this.wallet.address;
		}
		throw Error("Couldt not get a account with valid address for the wallet");
	}
	async getChainId(): Promise<number> {
		return this.provider?.network.chainId || 0;
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
		console.log("Accounts changed", accounts);
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
