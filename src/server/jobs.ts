import { ethers } from "ethers";
import { GET_PROVIDER, LOCAL_HARDHAT, NORGES_BANK_CHAIN, ARBITRUM_GOERLI, CONTRACT_ADDRESSES } from "../constants";
import { Bridge__factory, CBToken__factory } from "../typechain-types";
import prisma from "./prisma";
import { Prisma, Status, Token } from "@prisma/client";
import { addListener } from "process";

const SOURCE_CHAIN = LOCAL_HARDHAT;
const DESTINATION_CHAIN = NORGES_BANK_CHAIN;

export async function mintBridgedTokensFromDeposits() {
	try {
		console.log("===== START Mint from deposits...");

		const wallet = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(DESTINATION_CHAIN, { withNetwork: true }),
		);

		const job = await getJob("mint_from_deposits");

		const transactionsReadyForMinting = await prisma.transaction.findMany({
			where: {
				status: Status.DEPOSIT_RECEIVED,
			},
		});
		let receipts: ethers.ContractReceipt[] = [];
		for (const transaction of transactionsReadyForMinting) {
			try {
				const destinationToken = CBToken__factory.connect(
					CONTRACT_ADDRESSES[DESTINATION_CHAIN.id].CB_TOKEN_BRIDGE_ADDRESS,
					wallet,
				);
				const destinationBridge = Bridge__factory.connect(
					CONTRACT_ADDRESSES[DESTINATION_CHAIN.id].BRIDGE_DESTINATION_ADDRESS,
					wallet,
				);

				const mintTx = await destinationBridge.deposit(transaction.address, ethers.BigNumber.from(transaction.amount));
				const updatedTransaction = await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.MINT_INITIATED,
						txHashMint: mintTx.hash,
					},
				});
				const receipt = await mintTx.wait();
				const updatedTransaction2 = await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.MINT_SUCCESS,
						txHashMint: mintTx.hash,
					},
				});
				receipts = [...receipts, receipt];
				const newBalance = await destinationToken.balanceOf(transaction.address);
				console.log("New balance", ethers.utils.formatUnits(newBalance, 4));
			} catch (error) {
				console.log("Error minting tokens", error);
				const updatedTransaction2 = await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.ERROR,
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

		console.log("===== END Mint from deposits...");
		return receipts;
	} catch (error) {
		prisma.job.update({
			where: {
				name: "mint_from_deposits",
			},
			data: {
				running: false,
			},
		});
		console.error(error);
	}
}

async function getJob(name: string) {
	const job = await prisma.job.findUnique({
		where: {
			name,
		},
	});
	if (!job) {
		throw new Error("Job not found");
	}
	if (job.running) {
		// if job was started for over 5 minnutes, then it is probably stuck, and we should restart it
		if (job.lastRunAt.getTime() + 5 * 60 * 1000 < new Date().getTime()) {
			console.log("Job was started for over 5 minutes, will execute it again now");
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
	return job;
}

export async function readSourceDeposits() {
	console.log("===== START Reading source deposits...");
	try {
		const wallet = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(SOURCE_CHAIN, { withNetwork: true }),
		);
		const job = await getJob("read_source_deposits");
		// const bridge = Bridge__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS, wallet);
		const sourceToken = CBToken__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].CB_TOKEN_ADDRESS, wallet);

		const events = await sourceToken.queryFilter(
			sourceToken.filters.Transfer(null, CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS, null),
			job.latestBlockNumber,
			"latest",
		);
		let transactions: Prisma.TransactionCreateInput[] = [];
		let latest_block = job.latestBlockNumber;
		for (const event of events) {
			const { from, to, value } = event.args;

			const hasTransaction = await prisma.transaction.findFirst({
				where: {
					txHashDeposit: event.transactionHash,
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
				token: Token.CB_TOKEN as Token,
				destinationChain: DESTINATION_CHAIN.id,
				sourceChain: SOURCE_CHAIN.id,
				txHashDeposit: event.transactionHash,
				status: Status.DEPOSIT_RECEIVED as Status,
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
		console.log("===== END Reading source deposits...");
		return { updatedJob, updatedTransactions };
	} catch (error) {
		prisma.job.update({
			where: {
				name: "read_source_deposits",
			},
			data: {
				running: false,
			},
		});
		console.error(error);
	}
}
