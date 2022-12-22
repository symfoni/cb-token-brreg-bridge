import { ethers } from "ethers";

export const validAndPostiveBN = (value: string) => {
	try {
		const bn = ethers.utils.parseUnits(value, 4);
		if (bn._isBigNumber && bn.gt(0)) {
			return true;
		}
	} catch (error) {}
	return false;
};
