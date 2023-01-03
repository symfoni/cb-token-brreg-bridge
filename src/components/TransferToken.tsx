import React, { useState } from "react";
import { Button, Container, Grid, Input, Loading } from "@nextui-org/react";
import { usePrepareContractWrite, useContractWrite, Address } from "wagmi";
import { useAppState } from "./app-state";
import { cbTokenABI } from "../abis/CBToken";
import { validAndPostiveBN } from "./utils/blockchain-utils";
import { ethers } from "ethers";
import debug from "debug";
import { toast } from "react-toastify";
import { TX_OVERRIDE } from "../constants";
const log = debug("bridge:TransferToken");

interface Props {
	to: Address; // TODO - maybe do this optional and if not provided, show a modal to select a recipient
	tokenAddress: Address;
}

export const TransferToken: React.FC<Props> = ({ ...props }) => {
	const { isGasless, destinationNetworkName } = useAppState();
	const [transferAmount, setTransferAmount] = useState("0.0");
	const { config } = usePrepareContractWrite({
		address: props.tokenAddress,
		abi: cbTokenABI,
		functionName: "transfer",
		args: [
			props.to,
			validAndPostiveBN(transferAmount) ? ethers.utils.parseUnits(transferAmount, 4) : ethers.constants.Zero,
		],
		overrides: isGasless() ? TX_OVERRIDE : undefined, // TX override if on external network / Bergen. No override if on localhost
	});
	const { write, writeAsync } = useContractWrite(config);
	const [isWriting, setIsWriting] = useState(false);

	const handleWrite = async () => {
		if (writeAsync) {
			try {
				setIsWriting(true);
				const res = await writeAsync();
				log("waiting");
				await res.wait();
				setIsWriting(false);

				toast(`Transferred ${transferAmount} NOK tokens successfully!`, { type: "success" });
			} catch (error) {
				log(error);
				toast(`Could not transfer ${transferAmount} NOK tokens!`, { type: "error" });
			}
			setIsWriting(false);
		}
	};

	return (
		<Grid.Container gap={2}>
			<Grid xs={12}>
				<Input
					fullWidth
					size="xl"
					css={{
						$$inputBorderRadius: "3px",
					}}
					type={"number"}
					placeholder={"0.000"}
					label="Enter amount"
					labelRight="NOK"
					onChange={(e) => setTransferAmount(e.target.value)}
				></Input>
			</Grid>
			<Grid xs={12}>
				<Button style={{ width: "100%" }} size={"xl"} disabled={!write} onPress={() => handleWrite()}>
					{isWriting ? (
						<Loading color={"currentColor"}></Loading>
					) : (
						`Send to ${destinationNetworkName.toLocaleLowerCase()}`
					)}
				</Button>
			</Grid>
		</Grid.Container>
	);
};
