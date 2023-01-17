import { Container, Grid, NextUIProvider, Spacer } from "@nextui-org/react";
import Head from "next/head";
import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";
import { HackatonNavBar } from "./HackatonNavBar";
import { client } from "../web-wallet/wagmi-client";
import { HackatonSidebarRight } from "./HackatonSidebarRight";
import HackatonFooter from "./HackatonFooter";
import { Col, Row } from "react-bootstrap";
import { HackatonSidebarLeft } from "./HackatonSidebarLeft";

type DefaultLayoutProps = { children: ReactNode };

export const HackatonLayout = ({ children }: DefaultLayoutProps) => {
	return (
		<NextUIProvider >
			<Head>
				<title>Norges bank DSP-Hackaton</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="Norges bank DSP-Hackaton" />
			</Head>
			<main className="d-flex flex-row justify-content-center">
				<WagmiConfig client={client}>
					<div className="main-container">

							<HackatonNavBar></HackatonNavBar>


						<Row>
							<Col xs={4} style={{width:225}}>
							<HackatonSidebarLeft/>
							</Col>
							<Col xs={8}>
								<Container md>{children}</Container>
							</Col>
							<Col xs={4} style={{width:324}}>
							<HackatonSidebarRight/>
							</Col>
						</Row>
					</div>
				</WagmiConfig>
			</main>
			<HackatonFooter/>
		</NextUIProvider>
	);
};
