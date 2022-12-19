import React, { useState } from "react";
import { Button, Container, Grid, Input, Loading } from "@nextui-org/react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useAppState } from "./app-state";
import { cbTokenABI } from "../abis/CBToken";
import { TX_OVERRIDE, validAndPostiveBN } from "./utils/blockchain-utils";
import { ethers } from "ethers";
import debug from "debug";
import { toast } from "react-toastify";
const log = debug("bridge:TransferToken");

interface Props {}

export const TransferToken: React.FC<Props> = ({ ...props }) => {
	const { isGasless, networkContractAddresses, currentNetwork } = useAppState();
	const [transferAmount, setTransferAmount] = useState("0.0");
	const { config } = usePrepareContractWrite({
		address: networkContractAddresses[currentNetwork].CB_TOKEN_ADDRESS,
		abi: cbTokenABI,
		functionName: "transfer",
		args: [
			networkContractAddresses[currentNetwork].BRIDGE_SOURCE_ADDRESS,
			validAndPostiveBN(transferAmount) ? ethers.utils.parseUnits(transferAmount, 4) : ethers.constants.Zero,
		],
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
					{isWriting ? <Loading color={"currentColor"}></Loading> : "Bridge tokens"}
				</Button>
			</Grid>
			<Button onClick={() => fetch("/api/hello")}>Test</Button>
		</Grid.Container>
	);
};
