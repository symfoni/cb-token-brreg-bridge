import { ReactElement } from "react";
import { WagmiConfig } from "wagmi";
import { Layout } from "../components/Layout";
import { client } from "../components/web-wallet/WagmiClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
	return (
		<div>
			<p>lol</p>
		</div>
	);
};

Page.getLayout = function getLayout(page: ReactElement) {
	return (
		<Layout>
			<WagmiConfig client={client}>{page}</WagmiConfig>
			<ToastContainer position="bottom-left"></ToastContainer>
		</Layout>
	);
};

export default Page;
