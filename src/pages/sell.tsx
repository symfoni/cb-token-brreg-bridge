import { ReactElement, useEffect, useState } from "react";
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

const log = debug("bridge:sell");

const Page = () => {
	const { networkContractAddresses, currentNetwork, currentNetworkName, isSourceNetwork, isDestinationNetwork } =
		useAppState();
	const { chain } = useNetwork();
	const { address, status } = useAccount();
	const [capTables, setCapTables] = useState([]);

	// TODO - Fetch my captables

	return (
		<Container gap={1}>
			<Card>
				<Card.Header>Your Cap Tables</Card.Header>
				<Card.Body>address: {address}</Card.Body>
			</Card>

			<Spacer></Spacer>

			<Card>
				<Card.Header>Balances</Card.Header>
				<Card.Body>
					<Row>
						<Col>NOK</Col>
						<Col>
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
