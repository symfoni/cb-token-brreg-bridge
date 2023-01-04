import { ethers } from "ethers";
import { GET_PROVIDER, CONTRACT_ADDRESSES, IS_GASSLESS, TX_OVERRIDE, BridgeChainConfig } from "../constants";
import { Bridge__factory, CBToken__factory, VCRegistry__factory } from "../typechain-types";
import prisma from "./prisma";
import { Prisma, Status, TransactionType } from "@prisma/client";

export async function readAuthenticatedAddresses(params: BridgeChainConfig) {
	const { sourceChain, destinationChain, minBlockNumber } = params;
	console.log("===== START syncVCRegistry ...");
	try {
		const walletSource = new ethers.Wallet(process.env.BRIDGE_OWNER_PRIVATE_KEY!).connect(
			GET_PROVIDER(sourceChain, { withNetwork: true }),
		);

		const job = await getJob("read_authenticated_addresses", params);
		const sourceVCRegistry = VCRegistry__factory.connect(
			CONTRACT_ADDRESSES[sourceChain.id].VC_REGISTRY_ADDRESS,
			walletSource,
		);

		// Transfers to Zero Address are considered withdrawels
		const authenticatePersonEvents = await sourceVCRegistry.queryFilter(
			sourceVCRegistry.filters.AuthenticatedPerson(null),
			Math.max(minBlockNumber[sourceChain.id], job.latestBlockNumber),
			"latest",
		);
		const authenticateContractEvents = await sourceVCRegistry.queryFilter(
			sourceVCRegistry.filters.PersonAuthenticatedContract(null),
			Math.max(minBlockNumber[sourceChain.id], job.latestBlockNumber),
			"latest",
		);
		let transactions: Prisma.TransactionCreateInput[] = [];
		let latest_block = job.latestBlockNumber;
		for (const event of [...authenticatePersonEvents, ...authenticateContractEvents]) {
			const address =
				"authenticatedAddress" in event.args ? event.args.authenticatedAddress : event.args.contractAddress;

			const hasTransaction = await prisma.transaction.findFirst({
				where: {
					sourceTx: event.transactionHash,
				},
			});
			if (hasTransaction) {
				console.log(
					`Transaction ${event.transactionHash}, with authenticatedAddress: ${address} already exists, skipping...`,
				);
				continue;
			}

			const transaction = {
				amount: ethers.constants.Zero.toBigInt(),
				address: address,
				blockNumber: event.blockNumber,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
				sourceTxt: event.transactionHash,
				status: Status.RECEIVED,
				type: TransactionType.VC_SYNC,
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
		console.log("===== END syncVCRegistry...");
		return { updatedJob, updatedTransactions };
	} catch (error) {
		await prisma.job.update({
			where: {
				chainBridgeJob: {
					name: "read_authenticated_addresses",
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

export async function syncAuthenticatedAddresses(params: BridgeChainConfig) {
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
				status: Status.INITIATED,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
				type: TransactionType.WITHDRAWEL,
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
				status: Status.RECEIVED,
				destinationChain: destinationChain.id,
				sourceChain: sourceChain.id,
				type: TransactionType.DEPOSIT,
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
