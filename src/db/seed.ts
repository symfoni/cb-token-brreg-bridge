import prisma from "../server/prisma";

async function main() {
	let shouldSeed = false;
	// Always seed in development
	if (process.env.NODE_ENV === "development") {
		shouldSeed = true;
	} else {
		const count = await prisma.job.count();
		if (count < 4) {
			shouldSeed = true;
		}
	}
	if (shouldSeed) {
		console.log("Emptying database");
		await prisma.job.deleteMany();
		await prisma.transaction.deleteMany();
		console.log("Emptying finished");
		console.log("Seeding database");
		const blockchainJob = await prisma.job.createMany({
			data: [
				{
					name: "read_source_deposits",
				},
				{
					name: "mint_from_deposits",
				},
				{
					name: "read_destination_withdrawals",
				},
				{
					name: "burn_from_withdrawels",
				},
			],
		});
		console.log("Seeding finished.");
	} else {
		console.log("No need to seed database");
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
