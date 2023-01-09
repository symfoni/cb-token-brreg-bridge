import { Button, Col, Container, Dropdown, Grid, Navbar, Row, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { WebWalletConnectButton } from "./web-wallet/WebWalletConnectButton";
import debug from "debug";
import { useAppState } from "./app-state";
const log = debug("bridge:NavBar");

interface Props {}

export const HackatonNavBar: React.FC<Props> = ({ ...props }) => {
	const { chain } = useNetwork();
	const { chains, switchNetwork, data, status, variables } = useSwitchNetwork();
	const { updateCurrentNetwork } = useAppState();

	const handleSwitchNetwork = useCallback(
		async (chainId: number) => {
			updateCurrentNetwork(chainId);
		},
		[switchNetwork],
	);

	// useEffect(() => {
	// 	log("connectors", connectors);
	// }, [connectors]);

	return (
		<Navbar variant="static" maxWidth={"md"} >
			<Navbar.Toggle showIn={"xs"} aria-label="toggle navigation" />
			<Navbar.Content >
				<Row align="stretch">
					<Col className="header-left" >
					<Link href="/market">Marked</Link>
          			<Link href="/portfolio">Min Portefølje</Link>
					</Col>
					<Col>
					<Link href="/market">
					<Text h1 className="header-center">Norges bank DSP-Hackaton</Text>
				</Link></Col>
					<Col className="header-right">
					<WebWalletConnectButton></WebWalletConnectButton></Col>
				</Row>
			</Navbar.Content>

			{/* <Navbar.Brand>
				<Link href="/market">
					<Text h1>Norges bank DSP-Hackaton</Text>
				</Link>
			</Navbar.Brand> */}
			<Navbar.Content>
				<Navbar.Collapse>
					<Container>
						<p>TODO</p>
					</Container>
				</Navbar.Collapse>
			</Navbar.Content>
		</Navbar>
	);
};
