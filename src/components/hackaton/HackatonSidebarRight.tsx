import {Col, Container, Dropdown, Grid, Navbar, Row, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { WebWalletConnectButton } from "../web-wallet/WebWalletConnectButton";
import debug from "debug";
import { useRouter } from 'next/router'
import { useAppState } from "../app-state";
import { AccountBalance } from "../AccountBalance";
import { Button } from "react-bootstrap";
import Router from 'next/router'
const log = debug("bridge:NavBar");

interface Props {}

export const HackatonSidebarRight: React.FC<Props> = ({ ...props }) => {
	const {
		networkContractAddresses,
		currentNetwork,
		updateCurrentNetwork
	} = useAppState();
	const { address} = useAccount();



	// useEffect(() => {
	// 	log("connectors", connectors);
	// }, [connectors]);

	return (
		<div className="hackaton-sidebar-right">
			<Row className="">
				<p className="w-100 text-center" style={{fontWeight:500}}>Demo:</p>
			</Row>
			<Row className="value-container">
				<div className="w-100 d-flex flex-row align-center "style={{height:40, borderBottom: "2px solid #ECECEC" }}>
						<p className="text-center m-auto" >KONTO:</p>
						</div>
						<div className="hackaton-account-balance">
						<AccountBalance accountAddress={address} tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}/>
						</div>
						<Button className="action-button-secondary" style={{marginTop:24}} onClick={() => Router.push(`/`)}>Overfør valutta</Button>
					</Row>
					<Row className="value-container" style={{marginTop:28}}>
				<div className="w-100 d-flex flex-row align-center "style={{height:61, borderBottom: "2px solid #ECECEC" }}>
						<p className="text-center m-auto" >VALUTA PÅ BRØK-ADRESSEN TIL SKATTEETATEN:</p>
						</div>
						<div className="hackaton-account-balance">
						<AccountBalance accountAddress={"0x14fb5374d26c11010e264213ef6c7d6578b94bdc"} tokenAddress={networkContractAddresses[currentNetwork].CB_TOKEN_BRIDGE_ADDRESS}/>
						</div>
					</Row>
					
				</div>
	);
};
