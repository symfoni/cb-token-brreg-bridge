import create from "zustand";
import { persist } from "zustand/middleware";

// TODO - Encrypt VCs with wallet.

export interface WebWalletState {
	secret: string | undefined;
	wallets: EncryptedWalletMeta[];
	setSecret: (secret: string) => void;
	saveWallet: (wallet: EncryptedWalletMeta) => void;
	removeWallet: (address: string) => void;
	updateWallet: (updateWallet: EncryptedWalletMeta) => void;
}

export type EncryptedWalletMeta = {
	encryptedWallet: string;
	address: string;
	name: string;
};

export const useWebWalletState = create<WebWalletState>()(
	persist(
		(set) => ({
			secret: undefined,
			wallets: [],
			setSecret: (secret) => set(() => ({ secret: secret })),
			saveWallet: (wallet: EncryptedWalletMeta) => {
				return set((state) => {
					const wallets = state.wallets;
					if (wallets.length === 0) {
						return { wallets: [wallet] };
					} else {
						const otherWallets = wallets.filter((otherWallet) => otherWallet.address !== wallet.address);
						if (otherWallets.length === 0) {
							return { wallets: state.wallets };
						}
						return { wallets: [...otherWallets, wallet] };
					}
				});
			},
			removeWallet: (address: string) => {
				return set((state) => {
					const otherWallets = state.wallets.filter((otherWallet) => otherWallet.address !== address);
					return { wallets: otherWallets };
				});
			},
			updateWallet: (updateWallet: EncryptedWalletMeta) => {
				return set((state) => {
					const wallets = state.wallets.map((wallet) =>
						wallet.address === updateWallet.address ? updateWallet : wallet,
					);
					return { wallets };
				});
			},
		}),
		{
			name: "web-wallet-storage",
			partialize: (state) => ({ wallets: state.wallets }),
		},
	),
);
