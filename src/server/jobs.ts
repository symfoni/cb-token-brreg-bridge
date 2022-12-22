import { ethers } from "ethers";
import {
	GET_PROVIDER,
	LOCAL_HARDHAT,
	NORGES_BANK_CHAIN,
	ARBITRUM_GOERLI,
	CONTRACT_ADDRESSES,
	IS_GASSLESS,
	TX_OVERRIDE,
} from "../constants";
import { Bridge__factory, CBToken__factory } from "../typechain-types";
import prisma from "./prisma";
import { Prisma, Status } from "@prisma/client";

const SOURCE_CHAIN = LOCAL_HARDHAT;
const DESTINATION_CHAIN = NORGES_BANK_CHAIN;
const MIN_BLOCK_NUMBER = {
	[LOCAL_HARDHAT.id]: 0,
	[NORGES_BANK_CHAIN.id]: 3755065,
	[ARBITRUM_GOERLI.id]: 3336808,
};

export async function burnBridgedTokensFromWithdrawels() {
	try {
		console.log("===== START burnBridgedTokensFromWithdrawels...");

		const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(DESTINATION_CHAIN, { withNetwork: true }),
		);
		const walletSource = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(SOURCE_CHAIN, { withNetwork: true }),
		);
		const sourceBridge = Bridge__factory.connect(
			CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS,
			walletSource,
		);
		const sourceToken = CBToken__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].CB_TOKEN_ADDRESS, walletSource);

		const job = await getJob("burn_from_withdrawels");

		const transactionsReadyForMinting = await prisma.transaction.findMany({
			where: {
				status: Status.WITHDRAWEL_RECEIEVED,
			},
		});
		let receipts: ethers.ContractReceipt[] = [];

		for (const transaction of transactionsReadyForMinting) {
			try {
				const balanceForBridgeBefore = await sourceToken.balanceOf(
					CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS,
				);
				const balanceForUserBefore = await sourceToken.balanceOf(transaction.address);
				console.log("balanceForBridgeBefore", ethers.utils.formatUnits(balanceForBridgeBefore, 4));
				console.log("balanceForUserBefore", ethers.utils.formatUnits(balanceForUserBefore, 4));

				console.log(
					`Transfering ${transaction.amount.toString()} tokens from Bridge to ${transaction.address} on chain: ${
						SOURCE_CHAIN.name
					}`,
				);
				const withdrawelTx = await sourceBridge.transfer(
					transaction.address,
					ethers.BigNumber.from(transaction.amount),
					// IS_GASSLESS(SOURCE_CHAIN) ? TX_OVERRIDE : undefined,
				);

				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.WITHDRAWEL_INITIATED,
					},
				});
				const receiptWithdrawel = await withdrawelTx.wait();
				console.log(
					`Transfered ${transaction.amount.toString()} tokens from Bridge to ${transaction.address} on ${
						SOURCE_CHAIN.name
					}`,
				);
				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.WITHDRAWEL_SUCCESS,
					},
				});
				receipts = [...receipts, receiptWithdrawel];
				const balanceForBridgeAfter = await sourceToken.balanceOf(walletSource.address);
				const balanceForUserAfter = await sourceToken.balanceOf(transaction.address);
				console.log("balanceForBridgeAfter", ethers.utils.formatUnits(balanceForBridgeAfter, 4));
				console.log("balanceForUserAfter", ethers.utils.formatUnits(balanceForUserAfter, 4));
			} catch (error) {
				console.log("Error withdrawing tokens", error);
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

		console.log("===== END burnBridgedTokensFromWithdrawels...");
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

export async function readWithdrawels() {
	console.log("===== START readWithdrawels ...");
	try {
		// const walletSource = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
		// 	GET_PROVIDER(SOURCE_CHAIN, { withNetwork: true }),
		// );
		const walletDestination = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(DESTINATION_CHAIN, { withNetwork: true }),
		);
		const job = await getJob("read_destination_withdrawals");
		// const bridge = Bridge__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS, wallet);
		const destinationToken = CBToken__factory.connect(
			CONTRACT_ADDRESSES[DESTINATION_CHAIN.id].CB_TOKEN_BRIDGE_ADDRESS,
			walletDestination,
		);

		// Transfers to Zero Address are considered withdrawels
		const events = await destinationToken.queryFilter(
			destinationToken.filters.Transfer(null, ethers.constants.AddressZero, null),
			Math.max(MIN_BLOCK_NUMBER[DESTINATION_CHAIN.id], job.latestBlockNumber),
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
				destinationChain: DESTINATION_CHAIN.id,
				sourceChain: SOURCE_CHAIN.id,
				txHashBurn: event.transactionHash,
				status: Status.WITHDRAWEL_RECEIEVED as Status,
			};
			transactions = [...transactions, transaction];
			latest_block = event.blockNumber;
		}
		console.log(
			`Read ${transactions.length} transactions from block ${Math.max(
				MIN_BLOCK_NUMBER[DESTINATION_CHAIN.id],
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
				name: "read_source_deposits",
			},
			data: {
				running: false,
			},
		});
		console.error(error);
	}
}

export async function mintBridgedTokensFromDeposits() {
	try {
		console.log("===== START Mint from deposits...");

		const walletDestionation = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
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
					walletDestionation,
				);
				const destinationBridge = Bridge__factory.connect(
					CONTRACT_ADDRESSES[DESTINATION_CHAIN.id].BRIDGE_DESTINATION_ADDRESS,
					walletDestionation,
				);

				const mintTx = await destinationBridge.deposit(
					transaction.address,
					ethers.BigNumber.from(transaction.amount),
					IS_GASSLESS(DESTINATION_CHAIN) ? TX_OVERRIDE : undefined,
				);
				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.DEPOSIT_INITIATED,
						txHashMint: mintTx.hash,
					},
				});
				const receipt = await mintTx.wait();
				await prisma.transaction.update({
					where: {
						id: transaction.id,
					},
					data: {
						status: Status.DEPOSIT_SUCCESS,
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

export async function readDeposits() {
	console.log("===== START Reading source deposits...");
	try {
		const walletSource = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(SOURCE_CHAIN, { withNetwork: true }),
		);
		const job = await getJob("read_source_deposits");
		// const bridge = Bridge__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS, wallet);
		const sourceToken = CBToken__factory.connect(CONTRACT_ADDRESSES[SOURCE_CHAIN.id].CB_TOKEN_ADDRESS, walletSource);

		const events = await sourceToken.queryFilter(
			sourceToken.filters.Transfer(null, CONTRACT_ADDRESSES[SOURCE_CHAIN.id].BRIDGE_SOURCE_ADDRESS, null),
			Math.max(MIN_BLOCK_NUMBER[SOURCE_CHAIN.id], job.latestBlockNumber),
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
		// if job was started for over 1 minnutes, then it is probably stuck, and we should restart it
		if (job.lastRunAt.getTime() + 1 * 60 * 1000 < new Date().getTime()) {
			console.log("Job was started for over 1 minutes, will execute it again now");
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
