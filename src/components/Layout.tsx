import { Container, Grid, NextUIProvider, Spacer } from "@nextui-org/react";
import Head from "next/head";
import { ReactNode } from "react";
import { NavBar } from "./NavBar";

type DefaultLayoutProps = { children: ReactNode };

export const Layout = ({ children }: DefaultLayoutProps) => {
	return (
		<NextUIProvider>
			<Head>
				<title>CB Token Bridge</title>
				<link rel="icon" href="/favicon.ico" />
				<meta name="description" content="CB token bridge" />
			</Head>
			<main>
				<Grid.Container>
					<Grid xs={12}>
						<NavBar></NavBar>
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
			</main>
		</NextUIProvider>
	);
};
