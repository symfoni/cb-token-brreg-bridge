import { ethers } from "ethers";
import { GET_PROVIDER, CONTRACT_ADDRESSES, IS_GASSLESS, TX_OVERRIDE, BridgeChainConfig } from "../constants";
import { Bridge__factory, CBToken__factory } from "../typechain-types";
import prisma from "./prisma";
import { Prisma, Status } from "@prisma/client";
import { Chain } from "wagmi";

// const sourceChain = process.env.NODE_ENV === "development" ? LOCAL_HARDHAT : NORGES_BANK_CHAIN;
// const destinationChain = process.env.NODE_ENV === "development" ? NORGES_BANK_CHAIN : ARBITRUM_GOERLI;
// const minBlockNumber = {
// 	[LOCAL_HARDHAT.id]: 0,
// 	[NORGES_BANK_CHAIN.id]: 3755065,
// 	[ARBITRUM_GOERLI.id]: 3336808,
// };

export async function burnBridgedTokensFromWithdrawels(params: BridgeChainConfig) {
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

		const transactionsReadyForMinting = await prisma.transaction.findMany({
			where: {
				status: Status.WITHDRAWEL_RECEIEVED,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
			},
		});
		let receipts: ethers.ContractReceipt[] = [];

		for (const transaction of transactionsReadyForMinting) {
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
						status: Status.WITHDRAWEL_INITIATED,
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
						status: Status.WITHDRAWEL_SUCCESS,
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
					txHashBurn: event.transactionHash,
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
				txHashBurn: event.transactionHash,
				status: Status.WITHDRAWEL_RECEIEVED as Status,
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

export async function mintBridgedTokensFromDeposits(params: BridgeChainConfig) {
	const { sourceChain, destinationChain, minBlockNumber } = params;
	try {
		console.log("===== START mintBridgedTokensFromDeposits...");

		const walletDestionation = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(destinationChain, { withNetwork: true }),
		);

		const job = await getJob("mint_from_deposits", params);

		const transactionsReadyForMinting = await prisma.transaction.findMany({
			where: {
				status: Status.DEPOSIT_RECEIVED,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
			},
		});
		let receipts: ethers.ContractReceipt[] = [];
		for (const transaction of transactionsReadyForMinting) {
			try {
				const destinationToken = CBToken__factory.connect(
					CONTRACT_ADDRESSES[destinationChain.id].CB_TOKEN_BRIDGE_ADDRESS,
					walletDestionation,
				);
				const destinationBridge = Bridge__factory.connect(
					CONTRACT_ADDRESSES[destinationChain.id].BRIDGE_DESTINATION_ADDRESS,
					walletDestionation,
				);

				if (IS_GASSLESS(destinationChain)) {
				}
				const mintTx = IS_GASSLESS(destinationChain)
					? await destinationBridge.deposit(transaction.address, ethers.BigNumber.from(transaction.amount), TX_OVERRIDE)
					: await destinationBridge.deposit(transaction.address, ethers.BigNumber.from(transaction.amount));
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
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
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

async function getJob(name: string, params: BridgeChainConfig) {
	const { sourceChain, destinationChain } = params;
	let job = await prisma.job.findUnique({
		where: {
			chainBridgeJob: {
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
				name,
			},
		},
	});
	if (!job) {
		job = await prisma.job.create({
			data: {
				name,
				running: false,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
			},
		});
		if (!job) {
			throw new Error("Job not found after creating it.");
		}
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
