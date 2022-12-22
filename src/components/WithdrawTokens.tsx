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
import { BridgeABI } from "../abis/BridgeABI";
const log = debug("bridge:TransferToken");

interface Props {
	destinationBridgeAddress: Address;
}

export const WithdrawTokens: React.FC<Props> = ({ ...props }) => {
	const { isGasless, networkContractAddresses, currentNetwork } = useAppState();
	const [withdrawAmount, setWithdrawAmount] = useState("0.0");
	const { config } = usePrepareContractWrite({
		address: props.destinationBridgeAddress,
		abi: BridgeABI,
		functionName: "withdraw",
		args: [validAndPostiveBN(withdrawAmount) ? ethers.utils.parseUnits(withdrawAmount, 4) : ethers.constants.Zero],
		overrides: isGasless ? TX_OVERRIDE : undefined, // TX override if on external network / Bergen. No override if on localhost
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

				toast(`Withdraw ${withdrawAmount} NOK tokens initiated!`, { type: "success" });
			} catch (error) {
				log(error);
				toast(`Could not withdraw ${withdrawAmount} NOK tokens!`, { type: "error" });
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
					onChange={(e) => setWithdrawAmount(e.target.value)}
				></Input>
			</Grid>
			<Grid xs={12}>
				<Button style={{ width: "100%" }} size={"xl"} disabled={!write} onPress={() => handleWrite()}>
					{isWriting ? <Loading color={"currentColor"}></Loading> : "Withdraw tokens"}
				</Button>
			</Grid>
		</Grid.Container>
	);
};
