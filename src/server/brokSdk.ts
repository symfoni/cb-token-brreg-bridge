import { initSDK } from "../components/brok-sdk";

export async function getCompanyInformation(captableAddress: string) {
	const sdk = await initSDK();
	return await sdk.getCapTable(captableAddress);
}

export async function isSharesOwnedByTheWallet(captableAddress: string, walletAddress: string) {
  const sdk = await initSDK();
	const captable = await sdk.getCapTable(captableAddress);
	return captable.shareholders.some(
		(tokenHolder) => {
			return tokenHolder.ethAddress === walletAddress?.toString()
		}
	)
}