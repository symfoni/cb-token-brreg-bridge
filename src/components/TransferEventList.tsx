import React, { useEffect, useState } from "react";
import { Col, Row, Text } from "@nextui-org/react";
import { Address, useContractEvent } from "wagmi";
import { cbTokenABI } from "../abis/CBToken";
import debug from "debug";
import { ethers } from "ethers";

const log = debug("bridge:SourceDeposits");

interface Props {
	bridgeAddress: Address;
	tokenAddress: Address;
	accountAddress?: Address;
}

export const TransferEventList: React.FC<Props> = ({ ...props }) => {
	const [_perAccount, setPerAccount] = useState(false);
	const [deposits, setDeposits] = useState<
		{ amount: ethers.BigNumber; blockNumber: number; transactionHash: string }[]
	>([]);

	useContractEvent({
		address: props.tokenAddress,
		abi: cbTokenABI,
		eventName: "Transfer",
		listener(from, to, amount, event) {
			log("transfers", from, to, amount.toString());
			log("event", event);
			log("check", props.tokenAddress, to);
			if (props.bridgeAddress === to) {
				log("1");
				if (props.accountAddress === from) {
					setPerAccount(true);
					setDeposits((old) => [
						...old,
						{ amount, blockNumber: event.blockNumber, transactionHash: event.transactionHash },
					]);
				} else {
					setPerAccount(false);
					setDeposits((old) => [
						...old,
						{ amount, blockNumber: event.blockNumber, transactionHash: event.transactionHash },
					]);
				}
			}
		},
		once: false,
	});
	useEffect(() => {
		return () => {
			if (props.tokenAddress) {
				setDeposits([]);
			}
		};
	}, [props.tokenAddress]);

	return (
		<>
			{deposits.length === 0 ? (
				<Text>No deposits</Text>
			) : (
				<>
					<Row>
						<Col>
							<Text b>Amount</Text>
						</Col>
						<Col>
							<Text b>BlockNumber</Text>
						</Col>
					</Row>
				</>
			)}
			{deposits.map((deposit) => {
				return (
					<Row key={deposit.transactionHash}>
						<Col>{ethers.utils.formatUnits(deposit.amount, 4)}</Col>
						<Col>
							<Text>{deposit.blockNumber}</Text>
						</Col>
					</Row>
				);
			})}
			<Text small>Shows last deposit and recently added</Text>
		</>
	);
};
