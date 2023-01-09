import { ReactElement, useCallback, useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork, WagmiConfig } from "wagmi";
import { Layout } from "../components/Layout";
import { client } from "../components/web-wallet/wagmi-client";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row, Spacer, Spinner, Table, Text } from "@nextui-org/react";
import { AccountBalance } from "../components/AccountBalance";
import { useAppState, Networks } from "../components/app-state";
import { TransferToken } from "../components/TransferToken";
import debug from "debug";
import { TransferEventList } from "../components/TransferEventList";
import "react-toastify/dist/ReactToastify.css";
import { WithdrawTokens } from "../components/WithdrawTokens";
import { HackatonLayout } from "../components/HackatonLayout";


const log = debug("bridge:portfolio");

const taxERC20Address = "0xEEE1948b96c59A40b456FDDc3F079e3DA5ca96Ff";

interface PortfolioSharesDto {
	captableAddress: string;
	companyName: string;
	orgNumber: string;
	numberOfShares: number;
	percentOfTotalShares: number;
  }

  interface TransactionDto {
	captableAddress: string;
	soldByAddress: string;
	boughtByAddress: string;
	companyName: string;
	orgNumber: string;
	price: number;
	totalPrice: number;
	totalProfit : number;
	numberOfShares : number;
	taxPayed : number;
	createdAt : Date;
  }

const Page = () => {
	const { networkContractAddresses, currentNetwork, currentNetworkName, isSourceNetwork, isDestinationNetwork } =
		useAppState();
	const { chain } = useNetwork();
	const { address} = useAccount();
	const { updateCurrentNetwork } = useAppState();
	const { chains, switchNetwork, data, status, variables } = useSwitchNetwork();
	const [stocksInPortfolio, setStocksInPortfolio] = useState<
    PortfolioSharesDto[]
  >([]);
  const [transactions, setTransactions] = useState<
  TransactionDto[]
  >([]);

  const switchToGoerliNetwork = useCallback(
	async () => {
		updateCurrentNetwork(chains[1].id);
	},
	[switchNetwork],
);

	// TODO - Fetch my captables

	useEffect(() => {
		fetchPortfolio();
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
			 setStocksInPortfolio(json);
		} catch (error) {
			log(error);
			toast("Could not create sales order!", { type: "error" });
		}

};

const fetchTransactions = async () => {

	try {

		const res2 = await fetch("/api/list-transactions/0x39d1786d6c23955830146b3658c6f028507c0fbe", { //"
			headers: {
				"Content-Type": "application/json",
			},
		});
		const json = await res2.json();
		 setStocksInPortfolio(json);
	} catch (error) {
		log(error);
		toast("Could not create sales order!", { type: "error" });
	}

};


const renderPortfolioTableRows = useCallback(
    () =>
      stocksInPortfolio.map((companyShares : PortfolioSharesDto, index) => {
        return (
			<Table.Row key={index}>
            <Table.Cell>{companyShares.companyName}</Table.Cell>
			<Table.Cell>{companyShares.orgNumber}</Table.Cell>
            <Table.Cell>{companyShares.numberOfShares}</Table.Cell>
            <Table.Cell>{companyShares.percentOfTotalShares} %</Table.Cell>
			  <Table.Cell>
              <Button
                className="action-button"
                // variant="primary"
                //  onClick={() => openSalesModal(companyShares)}
              >
                Selg aksjer
              </Button>
			  </Table.Cell>
			</Table.Row>
        );
      }),
    [stocksInPortfolio]
  );

  const renderTransactionsTableRows = useCallback(
    () =>
	transactions.map((transaction : TransactionDto, index) => {
        return (
			<Table.Row key={index}>
            <Table.Cell>{transaction.createdAt.toLocaleTimeString()}</Table.Cell>
            <Table.Cell>{transaction.companyName}</Table.Cell>
            <Table.Cell>{transaction.numberOfShares}</Table.Cell>
			<Table.Cell>{transaction.price} kr</Table.Cell>
			<Table.Cell>{transaction.totalPrice} kr</Table.Cell>
			<Table.Cell>{transaction.totalProfit} kr</Table.Cell>
			<Table.Cell>{transaction.taxPayed} kr</Table.Cell>
			</Table.Row>
        );
      }),
    [stocksInPortfolio]
  );

  if (currentNetwork !== Networks.ARBITRUM_GOERLI) {
	return <Row><Col style={{maxWidth:800}}>Man kan bare kjøpe aksjer på Arbitrum Goerli kjeden, venligst bytt kjede i velgeren på toppen av siden.
	</Col> 
	<Col style={{width:200}}><Button
	className="action-button"
	 onClick={() => switchToGoerliNetwork()}
  >
	Bytt til Goerli-kjeden
  </Button></Col></Row>;
}

	return (
		<Container gap={1}>

			<Card>
				<Card.Header className="hackaton-header">Din portfølje:</Card.Header>
				<Card.Body>
					<p className="portfolio-address">Ethereum adresse: {address}</p>
				<Table>
					<Table.Header>
        <Table.Column>Selskap</Table.Column>
        <Table.Column>Organisasjonsnummer</Table.Column>
        <Table.Column>Antall</Table.Column>
		<Table.Column>Eierskapsandel</Table.Column>
		<Table.Column>Selg</Table.Column>
		</Table.Header>
		<Table.Body>{renderPortfolioTableRows()}</Table.Body>
      
	  </Table>
	  </Card.Body>
			</Card>

			

			<Spacer></Spacer>

			<Card>
				<Card.Header className="hackaton-header">Valutta på Brøk-kjeden:</Card.Header>
				<Card.Body>
					<Row>
						<AccountBalance accountAddress={address} tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}/>
					</Row>
				</Card.Body>
			</Card>

			<Spacer></Spacer>

			<Card>
				<Card.Header className="hackaton-header">Valutta på Brøk-adressen til skatteetaten:</Card.Header>
				<Card.Body>
					<Row>
						<AccountBalance accountAddress={taxERC20Address} tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}/>
					</Row>
				</Card.Body>
			</Card>

			<Spacer></Spacer>

			<Card>
				<Card.Header className="hackaton-header">Dine siste transaksjoner:</Card.Header>
				<Card.Body>
				<Table>
					<Table.Header>
						<Table.Column>Tidspunkt</Table.Column>
						<Table.Column>Selskap</Table.Column>
						<Table.Column>Antall</Table.Column>
						<Table.Column>Pris</Table.Column>
						<Table.Column>Totalverdi</Table.Column>
						<Table.Column>Fortjeneste</Table.Column>
						<Table.Column>Skatt</Table.Column>
					</Table.Header>
					<Table.Body>{renderTransactionsTableRows()}</Table.Body>
      
	  </Table>
	  </Card.Body>
			</Card>
		</Container>
	);
};

Page.getLayout = function getLayout(page: ReactElement) {
	if (client) {
		return (
			<HackatonLayout >
				{page}
				<ToastContainer position="bottom-left"></ToastContainer>
			</HackatonLayout>
		);
	}
	return <Spinner />;
};

export default Page;
