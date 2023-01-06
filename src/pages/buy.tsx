import { ReactElement, useEffect, useState } from "react";
import { useAccount, useNetwork, usePrepareContractWrite, useContractWrite } from "wagmi";
import { Layout } from "../components/Layout";
import { client } from "../components/web-wallet/wagmi-client";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row, Spacer, Spinner, Text } from "@nextui-org/react";
import { AccountBalance } from "../components/AccountBalance";
import { Networks, useAppState } from "../components/app-state";
import { TransferToken } from "../components/TransferToken";
import debug from "debug";
import { TransferEventList } from "../components/TransferEventList";
import "react-toastify/dist/ReactToastify.css";
import { WithdrawTokens } from "../components/WithdrawTokens";
import { ethers } from "ethers";
import { cbTokenABI } from "../abis/CBToken";
import { validAndPostiveBN } from "../components/utils/blockchain-utils";
import { TX_OVERRIDE } from "../constants";

const log = debug("bridge:buy");

const Page = () => {
	const {
		networkContractAddresses,
		currentNetwork,
		currentNetworkName,
		isSourceNetwork,
		isDestinationNetwork,
		isGasless,
	} = useAppState();
	const { chain } = useNetwork();
	const { address, status } = useAccount();
	const [sellOrders, setSellOrders] = useState([]);
	const [buyAmount, setBuyAmount] = useState("0.0");
	const { config } = usePrepareContractWrite({
		address: networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS,
		abi: cbTokenABI,
		functionName: "transfer",
		args: [
			"0xb977651ac2f276c3a057003f9a6a245ef04c7147",
			validAndPostiveBN(buyAmount) ? ethers.utils.parseUnits(buyAmount, 4) : ethers.constants.Zero,
		],
		overrides: isGasless() ? TX_OVERRIDE : undefined, // TX override if on external network / Bergen. No override if on localhost
	});
	const { write, writeAsync } = useContractWrite(config);
	const [isWriting, setIsWriting] = useState(false);

	// TODO - Fetch my sell orders

	const transferBuyAmount = async () => {
		if (writeAsync) {
			try {
				// setIsWriting(true);
				// const res = await writeAsync();
				// log("waiting");
				// await res.wait();
				// setIsWriting(false);
				// toast("Buy amount transfered!", { type: "success" });
				// TODO - Call backend to validate and transfer shares and buy amount.
				const res2 = await fetch("/api/buy-shares", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						address,
						amount: buyAmount,
					}),
				});
				const json = await res2.json();
				console.log("json", json);
			} catch (error) {
				log(error);
				toast("Could not transfer buy amount!", { type: "error" });
			}
			setIsWriting(false);
		}
	};

	if (currentNetwork !== Networks.ARBITRUM_GOERLI) {
		return <div>Buy is only available on Arbitrum Goerli, please switch chain.</div>;
	}

	return (
		<Container gap={1}>
			<Card>
				<Card.Header>Sell orders</Card.Header>
				<Card.Body>address: {address}</Card.Body>
				<Button onPress={() => transferBuyAmount()}>Test</Button>
			</Card>

			<Spacer></Spacer>

			<Card>
				<Card.Header>Balances</Card.Header>
				<Card.Body>
					<Row>
						<Col>NOK</Col>
						<Col>
							<AccountBalance
								accountAddress={address}
								tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}
							></AccountBalance>
						</Col>
					</Row>
				</Card.Body>
			</Card>

			<Spacer></Spacer>
		</Container>
	);
};

Page.getLayout = function getLayout(page: ReactElement) {
	if (client) {
		return (
			<Layout>
				{page}
				<ToastContainer position="bottom-left"></ToastContainer>
			</Layout>
		);
	}
	return <Spinner />;
};

export default Page;
