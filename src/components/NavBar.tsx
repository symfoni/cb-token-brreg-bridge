import {  Button, Dropdown, Grid, Navbar, Text } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

interface Props {}

export const NavBar: React.FC<Props> = ({ ...props }) => {

	return (
		<Navbar variant="static" maxWidth={"lg"}>
			<Navbar.Toggle showIn={"xs"} aria-label="toggle navigation" />
			<Navbar.Brand>
				<Link href="/">
					<Text h1>CB token bridge</Text>
				</Link>
			</Navbar.Brand>
			<Navbar.Content>
				<Navbar.Collapse>
					<Grid.Container gap={5} justify="center">
						<Grid>
						<Dropdown>
							<Dropdown.Button flat>{"TODO"}</Dropdown.Button>
							<Dropdown.Menu
								onAction={(key) => {
									console.log(key);
								}}
							>
								<Dropdown.Item key="account">Account</Dropdown.Item>
								<Dropdown.Item key="sign-out">Sign out</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
						</Grid>
					</Grid.Container>
				</Navbar.Collapse>
			</Navbar.Content>
			<Navbar.Content
				activeColor="secondary"
				hideIn="xs"
				variant="underline"
				style={{ textTransform: "uppercase" }}
			>
				{/* Some TODO  */}
				<Button>TODO</Button>
			</Navbar.Content>
		</Navbar>
	);
};
