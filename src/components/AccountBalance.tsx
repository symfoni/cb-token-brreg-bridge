import { Text } from "@nextui-org/react";
import React from "react";
import { Address, useBalance } from "wagmi";
import { formatNOK } from "./format/Currency";

interface Props {
	accountAddress?: Address;
	tokenAddress?: Address;
}

export const AccountBalance: React.FC<Props> = ({ ...props }) => {
	const { data } = useBalance({
		address: props.accountAddress,
		token: props.tokenAddress,
		watch: true,
	});

	if (!data) {
		<Text b size={20}>
			-
		</Text>;
	}

	return (
		<Text b size={20}>
			{data && formatNOK(data.formatted, { postfix: true })}
		</Text>
	);
};
