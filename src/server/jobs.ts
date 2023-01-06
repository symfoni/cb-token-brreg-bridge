import { BridgeChainConfig } from "../constants";
import prisma from "./prisma";

export async function getJob(name: string, params: BridgeChainConfig) {
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
