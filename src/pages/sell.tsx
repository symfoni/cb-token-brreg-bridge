import { ReactElement, useEffect, useState } from "react";
import { useAccount, useNetwork, WagmiConfig } from "wagmi";
import { Layout } from "../components/Layout";
import { client } from "../components/web-wallet/wagmi-client";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row, Spacer, Spinner, Text } from "@nextui-org/react";
import { AccountBalance } from "../components/AccountBalance";
import { useAppState } from "../components/app-state";
import { TransferToken } from "../components/TransferToken";
import debug from "debug";
import { TransferEventList } from "../components/TransferEventList";
import "react-toastify/dist/ReactToastify.css";
import { WithdrawTokens } from "../components/WithdrawTokens";
import { ethers } from "ethers";
import dynamic from 'next/dynamic'
// const SDK = dynamic(() => import("@brok/sdk").then((module) => module.SDK))

// import { SDK } from "@brok/sdk";


const log = debug("bridge:sell");

const Page = () => {
	const { networkContractAddresses, currentNetwork, currentNetworkName, isSourceNetwork, isDestinationNetwork } =
		useAppState();
	const { chain } = useNetwork();
	const { address, status } = useAccount();
	const [capTables, setCapTables] = useState([]);

	// TODO - Fetch my captables

	useEffect(() => {
		fetchPortfolio();
	  }, []);


	const createSellOrder = async () => {

			try {
				// setIsWriting(true);
				// const res = await writeAsync();
				// log("waiting");
				// await res.wait();
				// setIsWriting(false);
				// toast("Buy amount transfered!", { type: "success" });
				// TODO - Call backend to validate and transfer shares and buy amount.
				const res2 = await fetch("/api/sell-shares", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						soldByAddress: "0x39d1786d6c23955830146b3658c6f028507c0fbe",
						companyName: "The Great Company",
						orgNumber: "12345678",
						price: 100,
						lastPrice: 70,
						numberOfShares: 20
					}),
				});
				const json = await res2.json();
				console.log("json", json);
			} catch (error) {
				log(error);
				toast("Could not create sales order!", { type: "error" });
			}
	};

	const fetchPortfolio = async () => {

		try {

			const res2 = await fetch("/api/list-portfolio/0x39d1786d6c23955830146b3658c6f028507c0fbe", { //"
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await res2.json();
			console.log(json);
		} catch (error) {
			log(error);
			toast("Could not create sales order!", { type: "error" });
		}

};

	return (
		<Container gap={1}>
			<Card>
				<Card.Header>Your Cap Tables</Card.Header>
				<Card.Body>address: {address}</Card.Body>
			</Card>

			<Spacer></Spacer>

			<Button onClick={() => createSellOrder()}>Sell shares</Button>

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
