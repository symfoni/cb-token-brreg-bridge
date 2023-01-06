import { ethers } from "ethers";
import { GET_PROVIDER, CONTRACT_ADDRESSES, IS_GASSLESS, TX_OVERRIDE, BridgeChainConfig } from "../constants";
import { VCRegistry__factory } from "../typechain-types";
import prisma from "./prisma";
import { Status, TransactionType } from "@prisma/client";
import { getJob } from "./jobs";

export async function writeAuthenticatedAddresses(params: BridgeChainConfig) {
	const { sourceChain, destinationChain, minBlockNumber } = params;
	try {
		console.log("===== START syncAuthenticatedAddresses...");

		const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(destinationChain, { withNetwork: true }),
		);
		const destinationVCRegistry = VCRegistry__factory.connect(
			CONTRACT_ADDRESSES[destinationChain.id].VC_REGISTRY_ADDRESS,
			walletDestination,
		);

		const job = await getJob("sync_authenticated_addresses", params);

		const addressesReaadyForSync = await prisma.transaction.findMany({
			where: {
				status: Status.RECEIVED,
				type: TransactionType.VC_SYNC,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
			},
		});
		let receipts: ethers.ContractReceipt[] = [];

		const ONE_YEAR = 52 * 7 * 24 * 60 * 60;

		for (const transaction of addressesReaadyForSync) {
			try {
				const verfifiedBefore = await destinationVCRegistry.checkAuthenticated(transaction.address, ONE_YEAR);
				if (verfifiedBefore) {
					console.log(`Address ${transaction.address} already verified on ${destinationChain.id}, skipping...`);
					await prisma.transaction.update({
						where: {
							id: transaction.id,
						},
						data: {
							status: Status.SUCCESS,
						},
					});
					continue;
				}
				const syncTx = IS_GASSLESS(destinationChain)
					? await destinationVCRegistry.setAuthenticatedPerson(transaction.address, TX_OVERRIDE)
					: await destinationVCRegistry.setAuthenticatedPerson(transaction.address);

				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.INITIATED,
						receipt: syncTx.hash,
					},
				});
				const receiptSync = await syncTx.wait();
				console.log(`Synced ${transaction.address} from {${sourceChain.id}} to {${destinationChain.id}`);

				receipts = [...receipts, receiptSync];
				const verfifiedAfter = await destinationVCRegistry.checkAuthenticatedOnce(transaction.address);
				if (!verfifiedAfter) {
					throw new Error(`Address ${transaction.address} not verified after sync on ${destinationChain.id}`);
				}
				console.log(`Address ${transaction.address} verified on ${destinationChain.id} after sync`);
				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.SUCCESS,
						receipt: receiptSync.transactionHash,
					},
				});
			} catch (error) {
				console.log("Error syncing address", error);
				let errorMessage = "";
				if (error instanceof Error && typeof error.message === "string") {
					errorMessage = error.message;
				} else {
					errorMessage = JSON.stringify(error);
				}
				const updatedTransaction2 = await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.ERROR_1,
						message: errorMessage,
					},
				});
			}
		}

		// update job
		await prisma.job.update({
			where: {
				id: job.id,
			},
			data: {
				running: false,
				lastRunAt: new Date(),
			},
		});

		console.log("===== END syncAuthenticatedAddresses...");
		return receipts;
	} catch (error) {
		prisma.job.update({
			where: {
				chainBridgeJob: {
					name: "sync_authenticated_addresses",
					destinationChain: destinationChain.id,
					sourceChain: sourceChain.id,
				},
			},
			data: {
				running: false,
			},
		});
		console.error(error);
	}
}
