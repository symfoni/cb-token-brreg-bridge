import { ethers } from "ethers";
import { GET_PROVIDER, CONTRACT_ADDRESSES, IS_GASSLESS, TX_OVERRIDE, BridgeChainConfig } from "../constants";
import { Bridge__factory, CBToken__factory } from "../typechain-types";
import prisma from "./prisma";
import { Status, TransactionType } from "@prisma/client";
import { getJob } from "./jobs";

export async function writeDeposits(params: BridgeChainConfig) {
	const { sourceChain, destinationChain, minBlockNumber } = params;
	try {
		console.log("===== START mintBridgedTokensFromDeposits...");

		const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(destinationChain, { withNetwork: true }),
		);

		const job = await getJob("mint_from_deposits", params);

		const transactionsReadyForMinting = await prisma.transaction.findMany({
			where: {
				status: Status.RECEIVED,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
				type: TransactionType.DEPOSIT,
			},
		});
		let receipts: ethers.ContractReceipt[] = [];
		console.log(`transactionsReadyForMinting ${transactionsReadyForMinting.length}`);
		const destinationToken = CBToken__factory.connect(
			CONTRACT_ADDRESSES[destinationChain.id].CB_TOKEN_BRIDGE_ADDRESS,
			walletDestination,
		);
		const destinationBridge = Bridge__factory.connect(
			CONTRACT_ADDRESSES[destinationChain.id].BRIDGE_DESTINATION_ADDRESS,
			walletDestination,
		);

		for (const transaction of transactionsReadyForMinting) {
			try {
				const mintTx = IS_GASSLESS(destinationChain)
					? await destinationBridge.deposit(transaction.address, ethers.BigNumber.from(transaction.amount), TX_OVERRIDE)
					: await destinationBridge.deposit(transaction.address, ethers.BigNumber.from(transaction.amount));
				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.INITIATED,
						receipt: mintTx.hash,
					},
				});
				const receipt = await mintTx.wait();
				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.SUCCESS,
						receipt: receipt.transactionHash,
					},
				});
				receipts = [...receipts, receipt];
				const newBalance = await destinationToken.balanceOf(transaction.address);
				console.log("New balance", ethers.utils.formatUnits(newBalance, 4));
			} catch (error) {
				console.log("Error minting tokens", error);
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

		console.log("===== END mintBridgedTokensFromDeposits...");
		return receipts;
	} catch (error) {
		prisma.job.update({
			where: {
				chainBridgeJob: {
					name: "mint_from_deposits",
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
