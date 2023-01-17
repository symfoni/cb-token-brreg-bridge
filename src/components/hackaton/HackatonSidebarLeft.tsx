import { Button, Col, Container, Dropdown, Grid, Navbar, Row, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { WebWalletConnectButton } from "../web-wallet/WebWalletConnectButton";
import debug from "debug";
import { useRouter } from 'next/router'
import { useAppState } from "../app-state";
import { AccountBalance } from "../AccountBalance";
import { ChevronDown, ChevronUp } from "react-feather";
const log = debug("bridge:NavBar");

interface Props {}

export const HackatonSidebarLeft: React.FC<Props> = ({ ...props }) => {
	const {
		networkContractAddresses,
		currentNetwork,
		updateCurrentNetwork
	} = useAppState();
	const { address} = useAccount();
	const router = useRouter()

	  const renderLinks = useCallback( () => {
		if(router.pathname == "/portfolio") {
			return (<>
				<Link href="/market" className="sidebar-link">Marked</Link>
				<Link href="/portfolio" className="sidebar-link-active">Min Portefølje</Link>
			</>
				);
		}
		else if(router.pathname == "/market") {
			return (<>
				<Link href="/market" className="sidebar-link-active">Marked</Link>
				<Link href="/portfolio" className="sidebar-link">Min Portefølje</Link>
			</>
				);
		}
		  },
		[router.pathname]
	  );

	// useEffect(() => {
	// 	log("connectors", connectors);
	// }, [connectors]);

	return (
		<div className="hackaton-sidebar">
			<h2 className="sidebar-header"> Mine verdipapirer <ChevronDown
                width="20"
                height="20"
              /></h2>
			  {router.pathname == "/portfolio" ? 
			  	<Link href="/portfolio" className="sidebar-link-active">-Aksjeportefølje</Link> : 
				<Link href="/portfolio" className="sidebar-link">-Aksjeportefølje</Link>}
				<Link href="/portfolio" className="sidebar-link">-Aksjerettigheter</Link>

			<h2 className="sidebar-header" style={{marginTop:56}}> min konto <ChevronDown
			width="20"
			height="20"
			/></h2>
			<Link href="/portfolio" className="sidebar-link">-Saldo</Link>
			<Link href="/portfolio" className="sidebar-link">-Transaksjoner</Link>
			<Link href="/portfolio" className="sidebar-link">-Skatt</Link>

			<h2 className="sidebar-header" style={{marginTop:56}}> marked <ChevronDown
			width="20"
			height="20"
			/></h2>
				{router.pathname == "/market" ?
				<Link href="/market" className="sidebar-link-active">-Aksjehandel</Link> :
				<Link href="/market" className="sidebar-link">-Aksjehandel</Link>
				}
				<Link href="/market" className="sidebar-link">-Andre verdipapirer</Link>

			<h2 className="sidebar-header" style={{marginTop:56}} > Administer selskap <ChevronUp
			width="20"
			height="20"
			/></h2>

				</div>
	);
};
