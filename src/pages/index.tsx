import { ReactElement, useEffect } from "react";
import { useAccount, useNetwork, WagmiConfig } from "wagmi";
import { Layout } from "../components/Layout";
import { client } from "../components/web-wallet/wagmi-client";
import { ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row, Spacer, Spinner, Text } from "@nextui-org/react";
import { AccountBalance } from "../components/AccountBalance";
import { useAppState } from "../components/app-state";
import { TransferToken } from "../components/TransferToken";
import debug from "debug";
import { TransferEventList } from "../components/TransferEventList";
import "react-toastify/dist/ReactToastify.css";
import { WithdrawTokens } from "../components/WithdrawTokens";
import { ethers } from "ethers";

const log = debug("bridge:index");

const Page = () => {
	const { networkContractAddresses, currentNetwork, currentNetworkName, isSourceNetwork, isDestinationNetwork } =
		useAppState();
	const { chain } = useNetwork();
	const { address, status } = useAccount();
	useEffect(() => {
		log("chain", chain);
	}, [chain]);

	return (
		<Container gap={1}>
			<Card>
				<Card.Header>Balances</Card.Header>
				<Card.Body>
					<Row>
						<Col>NOK</Col>
						<Col>
							{isSourceNetwork() && (
								<AccountBalance
									accountAddress={address}
									tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_ADDRESS}
								></AccountBalance>
							)}
							{isDestinationNetwork() && (
								<AccountBalance
									accountAddress={address}
									tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}
								></AccountBalance>
							)}
							{!(isSourceNetwork() || isDestinationNetwork()) && (
								<Text>
									Current network is not source or destination chain. Please configure env for what network to consider
									source and destination
								</Text>
							)}
						</Col>
					</Row>
				</Card.Body>
			</Card>

			<Spacer></Spacer>

			{isSourceNetwork() && (
				<Card>
					<Card.Header>Deposit</Card.Header>
					<Card.Body>
						<Row>
							<Col>
								<TransferToken
									tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_ADDRESS}
									to={networkContractAddresses[currentNetwork].BRIDGE_SOURCE_ADDRESS}
								></TransferToken>
							</Col>
						</Row>
						<Card>
							<Card.Header>Deposits</Card.Header>
							<Card.Body>
								<TransferEventList
									accountAddress={address}
									tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_ADDRESS}
									bridgeAddress={networkContractAddresses[currentNetwork].BRIDGE_SOURCE_ADDRESS}
								></TransferEventList>
							</Card.Body>
						</Card>
					</Card.Body>
				</Card>
			)}

			{isDestinationNetwork() && (
				<Card>
					<Card.Header>Withdraw</Card.Header>
					<Card.Body>
						<Row>
							<Col>
								<WithdrawTokens
									destinationBridgeAddress={networkContractAddresses[currentNetwork].BRIDGE_DESTINATION_ADDRESS}
								></WithdrawTokens>
							</Col>
						</Row>
						<Card>
							<Card.Header>Withdrawels</Card.Header>
							<Card.Body>
								<TransferEventList
									accountAddress={address}
									tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}
									bridgeAddress={ethers.constants.AddressZero}
								></TransferEventList>
							</Card.Body>
						</Card>
					</Card.Body>
				</Card>
			)}
			<Spacer></Spacer>
			<Card>
				<Card.Header>Admin</Card.Header>
				<Card.Footer>
					<Button onClick={() => fetch("/api/bot")}>Run sync manually</Button>
				</Card.Footer>
			</Card>
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
