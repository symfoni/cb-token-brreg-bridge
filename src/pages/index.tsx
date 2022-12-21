import { ReactElement, useEffect } from "react";
import { useAccount, useNetwork, WagmiConfig } from "wagmi";
import { Layout } from "../components/Layout";
import { client } from "../components/web-wallet/wagmi-client";
import { ToastContainer } from "react-toastify";
import { Card, Col, Container, Row, Spinner } from "@nextui-org/react";
import { AccountBalance } from "../components/AccountBalance";
import { useAppState } from "../components/app-state";
import { TransferToken } from "../components/TransferToken";
import debug from "debug";
import { SourceDeposits } from "../components/SourceDeposits";
import "react-toastify/dist/ReactToastify.css";

const log = debug("bridge:index");

const Page = () => {
	const { networkContractAddresses, currentNetwork, currentNetworkName } = useAppState();
	const { chain } = useNetwork();
	const { address, status } = useAccount();
	useEffect(() => {
		log("chain", chain);
	}, [chain]);
	return (
		<Container>
			<Row>
				<Col>Balance {currentNetworkName}</Col>
				<Col>
					<AccountBalance
						accountAddress={address}
						tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_ADDRESS}
					></AccountBalance>
				</Col>
			</Row>

			<Row>
				<Col>Balance bridged {currentNetworkName}</Col>
				<Col>
					<AccountBalance
						accountAddress={address}
						tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}
					></AccountBalance>
				</Col>
			</Row>

			<Row>
				<Col>
					<TransferToken></TransferToken>
				</Col>
			</Row>
			<Card>
				<Card.Header>Deposits</Card.Header>
				<Card.Body>
					<SourceDeposits
						accountAddress={address}
						tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_ADDRESS}
						bridgeAddress={networkContractAddresses[currentNetwork].BRIDGE_SOURCE_ADDRESS}
					></SourceDeposits>
				</Card.Body>
			</Card>
		</Container>
	);
};

Page.getLayout = function getLayout(page: ReactElement) {
	return (
		<WagmiConfig client={client}>
			<Layout>
				{page}
				<ToastContainer position="bottom-left"></ToastContainer>
			</Layout>
		</WagmiConfig>
	);
};

export default Page;
