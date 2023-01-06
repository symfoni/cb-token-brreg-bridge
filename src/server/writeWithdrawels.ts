import { ethers } from "ethers";
import { GET_PROVIDER, CONTRACT_ADDRESSES, IS_GASSLESS, TX_OVERRIDE, BridgeChainConfig } from "../constants";
import { Bridge__factory, CBToken__factory } from "../typechain-types";
import prisma from "./prisma";
import { Status, TransactionType } from "@prisma/client";
import { getJob } from "./jobs";

export async function wirteWithdrawels(params: BridgeChainConfig) {
	const { sourceChain, destinationChain, minBlockNumber } = params;
	try {
		console.log("===== START burnBridgedTokensFromWithdrawels...");

		const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(destinationChain, { withNetwork: true }),
		);
		const walletSource = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(sourceChain, { withNetwork: true }),
		);
		const sourceBridge = Bridge__factory.connect(
			CONTRACT_ADDRESSES[sourceChain.id].BRIDGE_SOURCE_ADDRESS,
			walletSource,
		);
		const sourceToken = CBToken__factory.connect(CONTRACT_ADDRESSES[sourceChain.id].CB_TOKEN_ADDRESS, walletSource);

		const job = await getJob("burn_from_withdrawels", params);

		const transactionsReadyForWithdrawel = await prisma.transaction.findMany({
			where: {
				status: Status.RECEIVED,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
				type: TransactionType.WITHDRAWEL,
			},
		});
		let receipts: ethers.ContractReceipt[] = [];
		console.log("transactionsReadyForWithdrawel", transactionsReadyForWithdrawel.length);

		for (const transaction of transactionsReadyForWithdrawel) {
			try {
				const balanceForBridgeBefore = await sourceToken.balanceOf(
					CONTRACT_ADDRESSES[sourceChain.id].BRIDGE_SOURCE_ADDRESS,
				);
				const balanceForUserBefore = await sourceToken.balanceOf(transaction.address);
				console.log("balanceForBridgeBefore", ethers.utils.formatUnits(balanceForBridgeBefore, 4));
				console.log("balanceForUserBefore", ethers.utils.formatUnits(balanceForUserBefore, 4));

				console.log(
					`Transfering ${transaction.amount.toString()} tokens from Bridge to ${transaction.address} on chain: ${
						sourceChain.name
					}`,
				);
				const withdrawelTx = IS_GASSLESS(sourceChain)
					? await sourceBridge.transfer(transaction.address, ethers.BigNumber.from(transaction.amount), TX_OVERRIDE)
					: await sourceBridge.transfer(transaction.address, ethers.BigNumber.from(transaction.amount));

				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.INITIATED,
						receipt: withdrawelTx.hash,
					},
				});
				const receiptWithdrawel = await withdrawelTx.wait();
				console.log(
					`Transfered ${transaction.amount.toString()} tokens from Bridge to ${transaction.address} on ${
						sourceChain.name
					}`,
				);
				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.SUCCESS,
						receipt: receiptWithdrawel.transactionHash,
					},
				});
				receipts = [...receipts, receiptWithdrawel];
				const balanceForBridgeAfter = await sourceToken.balanceOf(
					CONTRACT_ADDRESSES[sourceChain.id].BRIDGE_SOURCE_ADDRESS,
				);
				const balanceForUserAfter = await sourceToken.balanceOf(transaction.address);
				console.log("balanceForBridgeAfter", ethers.utils.formatUnits(balanceForBridgeAfter, 4));
				console.log("balanceForUserAfter", ethers.utils.formatUnits(balanceForUserAfter, 4));
			} catch (error) {
				console.log("Error withdrawing tokens", error);
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

		console.log("===== END burnBridgedTokensFromWithdrawels...");
		return receipts;
	} catch (error) {
		prisma.job.update({
			where: {
				chainBridgeJob: {
					name: "burn_from_withdrawels",
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
