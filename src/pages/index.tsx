import { ReactElement, useEffect } from "react";
import { useAccount, useNetwork, WagmiConfig } from "wagmi";
import { Layout } from "../components/Layout";
import { client } from "../components/web-wallet/wagmi-client";
import { ToastContainer } from "react-toastify";
import { Col, Container, Row, Spinner } from "@nextui-org/react";
import { AccountBalance } from "../components/AccountBalance";
import { useAppState } from "../components/app-state";

import "react-toastify/dist/ReactToastify.css";
import { TransferToken } from "../components/TransferToken";

const Page = () => {
	const { cbTokenAddress } = useAppState();
	const { chain } = useNetwork();
	const { address, status } = useAccount();
	useEffect(() => {
		console.log("chain", chain);
	}, [chain]);
	return (
		<Container>
			<Row>
				<Col>Balance Norges bank</Col>
				<AccountBalance accountAddress={address} tokenAddress={cbTokenAddress}></AccountBalance>
				<TransferToken></TransferToken>
			</Row>
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
