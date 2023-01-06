import { ethers } from "ethers";
import { GET_PROVIDER, CONTRACT_ADDRESSES, BridgeChainConfig } from "../constants";
import { CBToken__factory } from "../typechain-types";
import prisma from "./prisma";
import { Prisma, Status, TransactionType } from "@prisma/client";
import { getJob } from "./jobs";

export async function readWithdrawels(params: BridgeChainConfig) {
	const { sourceChain, destinationChain, minBlockNumber } = params;
	console.log("===== START readWithdrawels ...");
	try {
		// const walletSource = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
		// 	GET_PROVIDER(sourceChain, { withNetwork: true }),
		// );
		const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(destinationChain, { withNetwork: true }),
		);
		const job = await getJob("read_destination_withdrawals", params);
		// const bridge = Bridge__factory.connect(CONTRACT_ADDRESSES[sourceChain.id].BRIDGE_SOURCE_ADDRESS, wallet);
		const destinationToken = CBToken__factory.connect(
			CONTRACT_ADDRESSES[destinationChain.id].CB_TOKEN_BRIDGE_ADDRESS,
			walletDestination,
		);

		// Transfers to Zero Address are considered withdrawels
		const events = await destinationToken.queryFilter(
			destinationToken.filters.Transfer(null, ethers.constants.AddressZero, null),
			Math.max(minBlockNumber[destinationChain.id], job.latestBlockNumber),
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
				type: TransactionType.WITHDRAWEL as TransactionType,
			};
			transactions = [...transactions, transaction];
			latest_block = event.blockNumber;
		}
		console.log(
			`Read ${transactions.length} transactions from block ${Math.max(
				minBlockNumber[destinationChain.id],
				job.latestBlockNumber,
			)} to ${latest_block}`,
		);
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
		console.log("===== END readWithdrawels...");
		return { updatedJob, updatedTransactions };
	} catch (error) {
		await prisma.job.update({
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
