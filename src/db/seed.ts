import prisma from "../server/prisma";

async function main() {
	console.log("Emptying database");
	await prisma.job.deleteMany();
	const blockchainJob = await prisma.job.create({
		data: {
			name: "read_source_deposits",
		},
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
