import { ethers } from "ethers";
import { GET_PROVIDER, CONTRACT_ADDRESSES, BridgeChainConfig } from "../constants";
import { VCRegistry__factory } from "../typechain-types";
import prisma from "./prisma";
import { Prisma, Status, TransactionType } from "@prisma/client";
import { getJob } from "./jobs";

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
				sourceTx: event.transactionHash,
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
