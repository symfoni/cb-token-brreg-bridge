import prisma from "./prisma";

export async function getSharesTransactions(address: string) {
	return await prisma.shareTransaction.findMany({
		where: {
			OR: [
			  {
				soldByAddress: {
				  contains: address,
				},
			  },
			  {
				boughtByAddress: {
				  contains: address,
				},
			  },
			],
		  },
	});
}
