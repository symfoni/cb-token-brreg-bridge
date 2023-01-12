import { Button, Container, Dropdown, Grid, Navbar, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { WebWalletConnectButton } from "./web-wallet/WebWalletConnectButton";
import debug from "debug";
import { useAppState } from "./app-state";
const log = debug("bridge:NavBar");

interface Props {}

export const NavBar: React.FC<Props> = ({ ...props }) => {
	const { chain } = useNetwork();
	const { chains, switchNetwork, data, status, variables } = useSwitchNetwork();
	const { updateCurrentNetwork } = useAppState();

	const handleSwitchNetwork = useCallback(
		async (chainId: number) => {
			console.log(chainId);
			updateCurrentNetwork(chainId);
		},
		[switchNetwork],
	);

	// useEffect(() => {
	// 	log("connectors", connectors);
	// }, [connectors]);

	return (
		<Navbar variant="static" maxWidth={"md"}>
			<Navbar.Toggle showIn={"xs"} aria-label="toggle navigation" />
			<Navbar.Brand>
				<Link href="/" style={{textDecoration:"none"}}>
					<Text h1>Token bridge</Text>
				</Link>
			</Navbar.Brand>
			<Navbar.Content>
				<Navbar.Collapse>
					<Container>
						<p>TODO</p>
					</Container>
				</Navbar.Collapse>
			</Navbar.Content>
			<Navbar.Content activeColor="secondary" hideIn="xs" variant="underline" style={{ textTransform: "uppercase" }}>
				<Dropdown>
					<Dropdown.Button flat>{chain ? chain.name : "Select chain"}</Dropdown.Button>
					<Dropdown.Menu
						onAction={(_key) => {
							const key = typeof _key === "string" ? parseInt(_key) : _key;
							handleSwitchNetwork(key);
						}}
					>
						{chains.map((chain) => (
							<Dropdown.Item key={chain.id}>{chain.name}</Dropdown.Item>
						))}
					</Dropdown.Menu>
				</Dropdown>
				<WebWalletConnectButton></WebWalletConnectButton>
			</Navbar.Content>
		</Navbar>
	);
};
