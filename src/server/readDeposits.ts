import { ethers } from "ethers";
import { GET_PROVIDER, CONTRACT_ADDRESSES, BridgeChainConfig } from "../constants";
import { CBToken__factory } from "../typechain-types";
import prisma from "./prisma";
import { Prisma, Status, TransactionType } from "@prisma/client";
import { getJob } from "./jobs";

export async function readDeposits(params: BridgeChainConfig) {
	const { sourceChain, destinationChain, minBlockNumber } = params;
	console.log("===== START readDeposits...");
	try {
		const walletSource = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(sourceChain, { withNetwork: true }),
		);
		const job = await getJob("read_source_deposits", params);
		// const bridge = Bridge__factory.connect(CONTRACT_ADDRESSES[sourceChain.id].BRIDGE_SOURCE_ADDRESS, wallet);
		const sourceToken = CBToken__factory.connect(CONTRACT_ADDRESSES[sourceChain.id].CB_TOKEN_ADDRESS, walletSource);

		const events = await sourceToken.queryFilter(
			sourceToken.filters.Transfer(null, CONTRACT_ADDRESSES[sourceChain.id].BRIDGE_SOURCE_ADDRESS, null),
			Math.max(minBlockNumber[sourceChain.id], job.latestBlockNumber),
			"latest",
		);
		let transactions: Prisma.TransactionCreateInput[] = [];
		let latest_block = job.latestBlockNumber;
		for (const event of events) {
			const { from, to, value } = event.args;

			const hasTransaction = await prisma.transaction.findFirst({
				where: {
					sourceTx: event.transactionHash,
				},
			});
			if (hasTransaction) {
				console.log(
					`Transaction ${event.transactionHash}, with amount: ${ethers.utils.formatUnits(
						value,
						4,
					)}, from: ${from} already exists, skipping...`,
				);
				continue;
			}

			const transaction = {
				amount: value.toBigInt(),
				address: from,
				blockNumber: event.blockNumber,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
				sourceTx: event.transactionHash,
				status: Status.RECEIVED as Status,
				type: TransactionType.DEPOSIT as TransactionType,
			};
			transactions = [...transactions, transaction];
			latest_block = event.blockNumber;
		}

		const [updatedJob, updatedTransactions] = await prisma.$transaction([
			prisma.job.update({
				where: {
					id: job.id,
				},
				data: {
					running: false,
					latestBlockNumber: latest_block,
					lastRunAt: new Date(),
				},
			}),
			prisma.transaction.createMany({
				data: transactions,
			}),
		]);
		console.log("===== END readDeposits...");
		return { updatedJob, updatedTransactions };
	} catch (error) {
		prisma.job.update({
			where: {
				chainBridgeJob: {
					name: "read_source_deposits",
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
