import { Container, Grid, NextUIProvider, Spacer } from "@nextui-org/react";
import Head from "next/head";
import { ReactNode } from "react";
import { WagmiConfig } from "wagmi";
import { HackatonNavBar } from "./HackatonNavBar";
import { client } from "../web-wallet/wagmi-client";

type DefaultLayoutProps = { children: ReactNode };

export const HackatonLayout = ({ children }: DefaultLayoutProps) => {
	return (
		<NextUIProvider>
			<Head>
				<title>Norges bank DSP-Hackaton</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="Norges bank DSP-Hackaton" />
			</Head>
			<main>
				<WagmiConfig client={client}>
					<Grid.Container>
						<Grid xs={12}>
							<HackatonNavBar></HackatonNavBar>
						</Grid>
						<Grid xs={12}>
							<Spacer y={2} />
						</Grid>
						{/* Apply space between sidebar and content  on XS, MD. No space on LG */}
						<Grid.Container>
							<Grid xs={12} md={0} lg={0}>
								<Spacer y={2} />
							</Grid>
							<Grid xs={12}>
								<Container md>{children}</Container>
							</Grid>
						</Grid.Container>
					</Grid.Container>
				</WagmiConfig>
			</main>
		</NextUIProvider>
	);
};
