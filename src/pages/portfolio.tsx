import { ReactElement, useCallback, useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork, WagmiConfig } from "wagmi";
import { Layout } from "../components/Layout";
import { client } from "../components/web-wallet/wagmi-client";
import { toast, ToastContainer } from "react-toastify";
import {Card, Col, Container, Row, Spacer, Spinner, Table, Text } from "@nextui-org/react";
import { AccountBalance } from "../components/AccountBalance";
import { useAppState, Networks } from "../components/app-state";
import { TransferToken } from "../components/TransferToken";
import debug from "debug";
import { TransferEventList } from "../components/TransferEventList";
import "react-toastify/dist/ReactToastify.css";
import { WithdrawTokens } from "../components/WithdrawTokens";
import { HackatonLayout } from "../components/hackaton/HackatonLayout";
import SellSharesSidebar from "../components/hackaton/SellSharesSidebar";
import { Button } from "react-bootstrap";


const log = debug("bridge:portfolio");

const taxERC20Address = "0x1BD2AfE3d185C4Aa0a667759A5652Ad41405A1B7";

export interface PortfolioSharesDto {
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
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<PortfolioSharesDto>();

  const switchToGoerliNetwork = useCallback(
	async () => {
		updateCurrentNetwork(chains[1].id);
	},
	[switchNetwork],
);

	// TODO - Fetch my captables

	useEffect(() => {
		if (currentNetwork !== Networks.ARBITRUM_GOERLI) {
			switchToGoerliNetwork();
		}
		fetchPortfolio();
		fetchTransactions();
	  }, []);

	const fetchPortfolio = async () => {

		try {

			const res2 = await fetch("/api/list-portfolio/0xb415f84064f46732e179aa0e43059533f487243c", { //"
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await res2.json();
			 setStocksInPortfolio(json);
		} catch (error) {
			log(error);
		}

};

const fetchTransactions = async () => {

	try {

		const res2 = await fetch("/api/list-transactions/0xb415f84064f46732e179aa0e43059533f487243c", { //"
			headers: {
				"Content-Type": "application/json",
			},
		});
		const json = await res2.json();
		 setStocksInPortfolio(json);
	} catch (error) {
		log(error);
	}

};

function openSalesModal(stock: PortfolioSharesDto) {
    setSelectedStock(stock);
    setOpenSidebar(true);
  }


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
                variant="primary"
                onClick={() => openSalesModal(companyShares)}
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

//   if (currentNetwork !== Networks.ARBITRUM_GOERLI) {
// 	return <Row><Col style={{maxWidth:800}}>Man kan bare kjøpe aksjer på Arbitrum Goerli kjeden, venligst bytt kjede i velgeren på toppen av siden.
// 	</Col> 
// 	<Col style={{width:200}}><Button
// 	className="action-button"
// 	 onClick={() => switchToGoerliNetwork()}
//   >
// 	Bytt til Goerli-kjeden
//   </Button></Col></Row>;
// }

	return (
		<Container gap={1}>

			<Card>
				<Card.Header className="hackaton-header">Din portfølje:</Card.Header>
				<Card.Body>
					 <p className="portfolio-address">Ethereum adresse: "0xb415f84064f46732e179aa0e43059533f487243c"</p> {/*{address} */}
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
						<AccountBalance accountAddress={"0xb415f84064f46732e179aa0e43059533f487243c"} tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}/>{/*{address} */}
					</Row>
				</Card.Body>
			</Card>

			<Spacer></Spacer>

			<Card>
				<Card.Header className="hackaton-header">Valutta på Brøk-adressen til skatteetaten:</Card.Header>
				<Card.Body>
					<Row>
						<AccountBalance accountAddress={taxERC20Address} tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}/>{/*{address} */}
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
			<SellSharesSidebar
        open={openSidebar}
		eth20Address={"0xb415f84064f46732e179aa0e43059533f487243c"}
        selectedStock={selectedStock}
        handleClose={() => {
          setOpenSidebar(false);
        }}
      />
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
