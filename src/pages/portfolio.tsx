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
import SellSharesModal from "../components/hackaton/SellSharesModal";


const log = debug("bridge:portfolio");

const taxERC20Address = "0x1BD2AfE3d185C4Aa0a667759A5652Ad41405A1B7";

export interface PortfolioSharesDto {
	captableAddress: string;
	companyName: string;
	orgNumber: string;
	numberOfShares: number;
	percentOfTotalShares: number;
	lastPricePerShare: number;
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
	createdAt : string;
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
  const [totalValue, setTotalValue] = useState<string>();
  const [totalGain, setTotalGain] = useState<string>();
  const [totalTax, setTotalTax] = useState<string>();

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
		if(address !== undefined) {
			fetchPortfolio();
			fetchTransactions();
		}
		
	  }, [address]);

	const fetchPortfolio = async () => {

		try {
			console.log("portfolio from "+address)
			const res2 = await fetch(`/api/list-portfolio/${address}`, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await res2.json();
			 setStocksInPortfolio(json);
			 const sum = json.reduce((partialSum : number, a : PortfolioSharesDto) => partialSum + (a.lastPricePerShare * a.numberOfShares), 0);
			 setTotalValue(sum.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " "));
		} catch (error) {
			log(error);
		}

};

const fetchTransactions = async () => {

	try {
		console.log("transactions from "+address)
		const res2 = await fetch(`/api/list-transactions/${address}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		const json = await res2.json();
		const toArray : TransactionDto[] = json.shares;
		const filtered = toArray.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
		const reversed = filtered.reverse();
		console.log(reversed);
		setTransactions(reversed);
		const sales = reversed.filter((transaction) => transaction.boughtByAddress != address?.toString().toLocaleLowerCase())
		console.log(sales)
		const gain = sales.reduce((partialSum : number, a : TransactionDto) => partialSum + Number(a.totalProfit), 0);
		console.log("gain"+gain)
		const tax = sales.reduce((partialSum : number, a : TransactionDto) => partialSum + Number(a.taxPayed), 0);
			 setTotalGain(gain.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " "));
			 setTotalTax(tax.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " "));
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
      stocksInPortfolio.sort((a, b) => a.companyName.localeCompare(b.companyName))
	  .map((companyShares : PortfolioSharesDto, index) => {
        return (
			<Table.Row key={index}>
            <Table.Cell>{companyShares.companyName}</Table.Cell>
			<Table.Cell>{companyShares.orgNumber}</Table.Cell>
            <Table.Cell>{companyShares.numberOfShares}</Table.Cell>
            <Table.Cell>{companyShares.percentOfTotalShares.toFixed(2)} %</Table.Cell>
			<Table.Cell>{(companyShares.lastPricePerShare * companyShares.numberOfShares).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")} kr</Table.Cell>
			  <Table.Cell>
              <Button
                className="action-button-secondary"
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
		let date = new Date(transaction.createdAt.substring(0,19).concat("Z"));
			let dateString = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
			let timeString = `${date.getHours() > 9 ? date.getHours(): "0"+date.getHours()}:${date.getMinutes()}`
			let bought = transaction.boughtByAddress == address?.toString().toLocaleLowerCase()
        return (
			<Table.Row key={index}>
			<Table.Cell>{bought ? "Kjøp" : "Salg"}</Table.Cell>
			<Table.Cell>{transaction.companyName}</Table.Cell>
            <Table.Cell>{dateString}</Table.Cell>
			<Table.Cell>{timeString}</Table.Cell>
            <Table.Cell>{transaction.numberOfShares.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")}</Table.Cell>
			<Table.Cell>{transaction.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")} kr</Table.Cell>
			<Table.Cell>{transaction.totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")} kr</Table.Cell>
			<Table.Cell>{bought ? "Ingen" : `${transaction.totalProfit.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")} kr`}</Table.Cell>
			<Table.Cell>{bought ? "Ingen" : `${transaction.taxPayed.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")} kr`}</Table.Cell>
			</Table.Row>
        );
      }) ,
    [transactions, address]
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
		<div>
			<Row>
				<h1 className="page-title">Aksjeportefølje</h1>
			</Row>
			<Row className="white-container" style={{zIndex:2}}>
					<Table className="w-100" lined>
							<Table.Header>
				<Table.Column>Selskap</Table.Column>
				<Table.Column>Organisasjonsnummer</Table.Column>
				<Table.Column>Antall aksjer</Table.Column>
				<Table.Column>Eierskapsandel</Table.Column>
				<Table.Column>Totalverdi</Table.Column>
				<Table.Column>Selg</Table.Column>
				</Table.Header>
				<Table.Body>{renderPortfolioTableRows()}</Table.Body>
			
			</Table>
			</Row>
			<div className="white-container px-3 pb-3" style={{marginTop:-15,zIndex:10, position:"relative"}}>
			<div className="hackaton-sum-container " style={{zIndex:10}}>
				<p className="hackaton-strong-text m-auto ms-3">Total</p>
				<p className="hackaton-strong-text my-auto" style={{textAlign:"end", marginRight:225}}>{`${totalValue} kr`}</p>
			</div>
			</div>
			<Row style={{marginTop:64}}>
				<h1 className="sub-header-title">Dine siste transaksjoner</h1>
			</Row>
			<Row className="white-container">
				<Table lined>
						<Table.Header>
							<Table.Column>Kjøp/Salg</Table.Column>
							<Table.Column>Selskap</Table.Column>
							<Table.Column>Dato</Table.Column>
							<Table.Column>Tidspunkt</Table.Column>
							<Table.Column>Antall aksjer</Table.Column>
							<Table.Column>Pris</Table.Column>
							<Table.Column>Totalverdi</Table.Column>
							<Table.Column>Fortjeneste</Table.Column>
							<Table.Column>Skatt</Table.Column>
						</Table.Header>
						<Table.Body>{transactions && renderTransactionsTableRows()}</Table.Body>
		
				</Table>
			</Row>
			<div className="white-container px-3 pb-3" style={{marginTop:-15,zIndex:10, position:"relative"}}>
			<div className="hackaton-sum-container " style={{zIndex:10}}>
				<p className="hackaton-strong-text m-auto ms-3">Total</p>
				<p className="hackaton-strong-text my-auto" style={{textAlign:"end", marginRight:60}}>{`${totalGain} kr`}</p>
				<p className="hackaton-strong-text my-auto" style={{textAlign:"end", marginRight:40}}>{`${totalTax} kr`}</p>
			</div>
			</div>
			
			<SellSharesModal
        open={openSidebar}
		eth20Address={address}
        selectedStock={selectedStock}
        handleClose={() => {
          setOpenSidebar(false);
        }}
      />
		</div>
	);
};

Page.getLayout = function getLayout(page: ReactElement) {
	if (client) {
		return (
			<HackatonLayout>
				{page}
				<ToastContainer position="bottom-left"></ToastContainer>
			</HackatonLayout>
		);
	}
	return <Spinner />;
};

export default Page;
