import { ethers } from "ethers";
import { GET_PROVIDER, LOCAL_HARDHAT, NORGES_BANK_CHAIN, ARBITRUM_GOERLI, CONTRACT_ADDRESSES } from "../constants";
import { Bridge__factory, CBToken__factory } from "../typechain-types";
import prisma from "./prisma";
import { Prisma, Token } from "@prisma/client";
import { addListener } from "process";

const SOURCE_CHAIN = LOCAL_HARDHAT;
const DESTINATION_CHAIN = NORGES_BANK_CHAIN;

export async function readSourceDeposits() {
	console.log("===== START Reading source deposits...");
	try {
		const wallet = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(SOURCE_CHAIN, { withNetwork: true }),
		);
		const job = await prisma.job.findUnique({
			where: {
				name: "read_source_deposits",
			},
		});
		if (!job) {
			throw new Error("Job not found");
		}
		if (job.running) {
			// if job was started for over 5 minnutes, then it is probably stuck, and we should restart it
			if (job.lastRunAt.getTime() + 5 * 60 * 1000 < new Date().getTime()) {
				console.log("Job was started for over 5 minutes, restarting it");
				await prisma.job.update({
					where: {
						id: job.id,
					},
					data: {
						running: false,
					},
				});
			} else {
				throw new Error("Job is already running");
			}
		}
		await prisma.job.update({
			where: {
				id: job.id,
			},
			data: {
				running: true,
			},
		});

		// const bridge = Bridge__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS, wallet);
		const sourceToken = CBToken__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].CB_TOKEN_ADDRESS, wallet);

		const events = await sourceToken.queryFilter(
			sourceToken.filters.Transfer(null, CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS, null),
			job.latestBlockNumber,
			"latest",
		);
		let transactions: Prisma.TransactionCreateInput[] = [];
		for (const event of events) {
			const { from, to, value } = event.args;

			const hasTransaction = await prisma.transaction.findFirst({
				where: {
					txHash: event.transactionHash,
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
				token: "CB_TOKEN" as Token,
				destinationChain: DESTINATION_CHAIN.id,
				sourceChain: SOURCE_CHAIN.id,
				txHash: event.transactionHash,
			};
			transactions = [...transactions, transaction];
		}

		await prisma.transaction.createMany({
			data: transactions,
		});

		const [updatedJob, updatedTransactions] = await prisma.$transaction([
			prisma.job.update({
				where: {
					id: job.id,
				},
				data: {
					running: false,
					latestBlockNumber: events[events.length - 1].blockNumber,
					lastRunAt: new Date(),
				},
			}),
			prisma.transaction.createMany({
				data: transactions,
			}),
		]);
		return { updatedJob, updatedTransactions };
	} catch (error) {
		prisma.job.update({
			where: {
				name: "read_source_deposits",
			},
			data: {
				running: true,
			},
		});
		console.error(error);
	}
	console.log("===== END Reading source deposits...");
}
