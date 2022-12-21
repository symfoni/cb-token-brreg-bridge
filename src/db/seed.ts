import prisma from "../server/prisma";

async function main() {
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
		],
	});

	console.log("Seeding finished.");
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
