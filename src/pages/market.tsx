import { ReactElement, useCallback, useEffect, useState } from "react";
import { useAccount, useNetwork, usePrepareContractWrite, useContractWrite, useSwitchNetwork } from "wagmi";
import { client } from "../components/web-wallet/wagmi-client";
import { toast, ToastContainer } from "react-toastify";
import { Button, Card, Col, Container, Row, Spacer, Spinner, Table, Text } from "@nextui-org/react";
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
import { HackatonLayout } from "../components/HackatonLayout";


interface SharesInMarketDto {
	captableAddress: string;
	soldByAddress: string;
	companyName: string;
	orgNumber: string;
	price: number;
	numberOfShares: number;
	createdAt: Date;
  }



const log = debug("bridge:market");

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
	const { address} = useAccount();
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
	const { updateCurrentNetwork } = useAppState();
	const { chains, switchNetwork, data, status, variables } = useSwitchNetwork();
	const [sharesInMarket, setSharesInMarket] = useState<
    SharesInMarketDto[]
  >([]);

  const switchToGoerliNetwork = useCallback(
	async () => {
		updateCurrentNetwork(chains[1].id);
	},
	[switchNetwork],
);

  useEffect(() => {
	fetchSharesInMarket();
  }, []);

	// TODO - Fetch my sell orders
	const fetchSharesInMarket = async () => {

		try {
	
			const res2 = await fetch("/api/list-share-orders/0x39d1786d6c23955830146b3658c6f028507c0fbe", { //"
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await res2.json();
			setSharesInMarket(json);
		} catch (error) {
			log(error);
			toast("Could not create sales order!", { type: "error" });
		}
	
	};

	const renderMarketTableRows = useCallback(
		() =>
		  sharesInMarket.map((companyShares : SharesInMarketDto, index) => {
			return (
				<Table.Row key={index}>
				<Table.Cell>{companyShares.companyName}</Table.Cell>
				<Table.Cell>{companyShares.orgNumber}</Table.Cell>
				<Table.Cell>{companyShares.price} kr</Table.Cell>
				<Table.Cell>{companyShares.numberOfShares}</Table.Cell>
				<Table.Cell>{companyShares.createdAt.toLocaleTimeString()} %</Table.Cell>
				  <Table.Cell>
				  <Button
					className="action-button"
					// variant="primary"
					//  onClick={() => openSalesModal(companyShares)}
				  >
					Kjøp aksjer
				  </Button>
				  </Table.Cell>
				</Table.Row>
			);
		  }),
		[sharesInMarket]
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
				<Card.Header className="hackaton-header">Marked:</Card.Header>
				<Card.Body>
					
				<Table>
					<Table.Header>
						<Table.Column>Selskap</Table.Column>
						<Table.Column>Organisasjonsnummer</Table.Column>
						<Table.Column>Pris</Table.Column>
						<Table.Column>Antall</Table.Column>
						<Table.Column>Listet dato</Table.Column>
						<Table.Column>Kjøp</Table.Column>
					</Table.Header>
					<Table.Body>{renderMarketTableRows()}</Table.Body>
      
	  </Table>
	  </Card.Body>
			</Card>

			

			<Spacer></Spacer>

			<Card>
				<Card.Header className="hackaton-header">Valutta på Brøk-kjeden:</Card.Header>
				<Card.Body>
				<p className="portfolio-address">Ethereum adresse: {address}</p>
					<Row>
						<AccountBalance accountAddress={address} tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}/>
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
			<HackatonLayout>
				{page}
				<ToastContainer position="bottom-left"></ToastContainer>
			</HackatonLayout>
		);
	}
	return <Spinner />;
};

export default Page;
