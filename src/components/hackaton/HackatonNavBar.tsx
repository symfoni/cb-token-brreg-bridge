import { Button, Col, Container, Dropdown, Grid, Navbar, red, Row, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { WebWalletConnectButton } from "../web-wallet/WebWalletConnectButton";
import debug from "debug";
import { useAppState } from "../app-state";
import UnlistedLogo from "./UnlistedLogo";
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
				<Row className="hackaton-navbar">
					<Col className="header-left" >
						<div className=""style={{width:300, height:60}}>
					<UnlistedLogo
                width="100%"
                height="100%"
              /></div>
					</Col>
					<Col className="header-right">
					<WebWalletConnectButton></WebWalletConnectButton></Col>
				</Row>
	);
};
