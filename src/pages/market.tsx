import { ReactElement, useCallback, useEffect, useState } from "react";
import { useAccount, useNetwork, usePrepareContractWrite, useContractWrite, useSwitchNetwork } from "wagmi";
import { client } from "../components/web-wallet/wagmi-client";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row, Spacer, Spinner, Table, Text } from "@nextui-org/react";
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
import { BRIDGE_CHAIN_CONFIG, CONTRACT_ADDRESSES, GET_PROVIDER, TX_OVERRIDE } from "../constants";
import { HackatonLayout } from "../components/hackaton/HackatonLayout";
import { Button } from "react-bootstrap";
import { useWebWalletState } from "../components/web-wallet/web-wallet-state";
import { CBToken__factory } from "../typechain-types";


interface BuySharesDto {
    transactionID: number;
	buyerID: string;
	numberOfStocksToBuy : number;
}

interface SharesInMarketDto {
	id: number;
	captableAddress: string;
	soldByAddress: string;
	companyName: string;
	orgNumber: string;
	price: number;
	numberOfShares: number;
	createdAt: string;
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

	const { secret} = useWebWalletState()
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
	if (currentNetwork !== Networks.ARBITRUM_GOERLI) {
		switchToGoerliNetwork();
	}

	fetchSharesInMarket();
  }, []);

	// TODO - Fetch my sell orders
	const fetchSharesInMarket = async () => {

		try {
	
			const res2 = await fetch("/api/list-sell-orders", { //"
				headers: {
					"Content-Type": "application/json",
				},
			});
			const json = await res2.json();
			setSharesInMarket(json.shares);
		} catch (error) {
			log(error);
			toast("Could not create sales order!", { type: "error" });
		}
	
	};

	async function moveMoney(to: string, amount: string, walletSecret: string | undefined) {
		try {
		  const { destinationChain } = BRIDGE_CHAIN_CONFIG();
	  
		  const walletDestination = new ethers.Wallet(walletSecret!).connect(
			GET_PROVIDER( destinationChain, { withNetwork: true }),
		  );
		
		  const destinationToken = CBToken__factory.connect(
			CONTRACT_ADDRESSES[destinationChain.id].CB_TOKEN_BRIDGE_ADDRESS,
			walletDestination,
		  );
		
		  const tx = await destinationToken.transfer(to, ethers.utils.parseUnits(amount, 4))
		
		  await tx.wait()
		  return true
		} catch (error) {
		  console.error(error)
		  return false
		}
	  }

	async function buyShares(shares: SharesInMarketDto, walleSecret: string, walletAddress: string)  {
		const buyRequest: BuySharesDto = {
			transactionID: shares.id,
			buyerID: walletAddress,
			numberOfStocksToBuy: shares.numberOfShares,
		};

	
		try {
			const res = await fetch("/api/buy-shares", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(buyRequest
				),
			});
	
			if(res.status === 200) {
				const json = await res.json();
				console.log(json);
				toast(`Du kjøpte ${shares.numberOfShares} aksjer av ${shares.companyName}`, { type: "success" });
				fetchSharesInMarket();
			}
			
		} catch (error) {
			console.log(error);
			toast("Kunne ikke opprette salgsordre!", { type: "error" });
		}
	
		console.log("sell now");
		// const totalPrice = shares.price * shares.numberOfShares;
		// moveMoney(shares.soldByAddress, totalPrice.toString(), walleSecret)
	  }

	const renderMarketTableRows = useCallback(
		() =>
		  sharesInMarket?.map((companyShares : SharesInMarketDto, index) => {
			let date = new Date(companyShares.createdAt.substring(0,19).concat("Z"));
			let dateString = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
			let timeString = `${date.getHours() > 9 ? date.getHours(): "0"+date.getHours()}:${date.getMinutes()}`
			return (
				<Table.Row key={index}>
				<Table.Cell>{companyShares.companyName}</Table.Cell>
				<Table.Cell>{companyShares.orgNumber}</Table.Cell>
				<Table.Cell>{companyShares.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ")} kr</Table.Cell>
				<Table.Cell><div style={{textAlign:"center"}}>{companyShares.numberOfShares}</div></Table.Cell>
				<Table.Cell>{dateString}</Table.Cell>
				<Table.Cell>{timeString}</Table.Cell>
				  <Table.Cell>
				  <Button
                className="action-button"
                variant="primary"
					onClick={() => {
						if(secret != undefined && address != undefined) {
							buyShares(companyShares, secret, address)}
						}
					}
				  >
					Kjøp aksjer
				  </Button>
				  </Table.Cell>
				</Table.Row>
			);
		  }),
		[sharesInMarket]
	  );

	// if (currentNetwork !== Networks.ARBITRUM_GOERLI) {
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
				<h1 className="page-title">Aksjehandel</h1>
			</Row>
			<Row className="white-container">
					<Table className="w-100">
							<Table.Header>
							<Table.Column>Selskap</Table.Column>
						<Table.Column>Organisasjonsnummer</Table.Column>
						<Table.Column>Pris</Table.Column>
						<Table.Column>Antall aksjer</Table.Column>
						<Table.Column>Dato</Table.Column>
						<Table.Column>Tidspunkt</Table.Column>
						<Table.Column>Kjøp</Table.Column>
				</Table.Header>
				<Table.Body>{renderMarketTableRows()}</Table.Body>
			
			</Table>
			</Row>
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
