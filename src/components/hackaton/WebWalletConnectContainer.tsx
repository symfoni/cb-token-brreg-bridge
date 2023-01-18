import { Button, Row } from "@nextui-org/react";

import debug from "debug";
import React, { useEffect, useState } from "react";
import { ChevronDown, Edit2 } from "react-feather";
import { useAccount } from "wagmi";
import { FormatAddress } from "../format/Address";
import { useWebWalletState } from "../web-wallet/web-wallet-state";
import { WebWalletModal } from "../web-wallet/WebWalletModal";
import avatar from './Avatar.png';
// import { WebWalletModal } from "./WebWalletModal";
const log = debug("bridge:WebWalletConnectButton");

interface Props {}

export const WebWalletConnectContainer: React.FC<Props> = ({ ...props }) => {
	const [walletModalVisible, setWalletModalVisible] = useState(false);
	const { address, isConnected } = useAccount();
	const { wallets } = useWebWalletState();

	useEffect(() => {
		log("wallets", wallets);
	}, [wallets]);

	const ConnectButton = () => (
		<Button auto={true} onPress={() => setWalletModalVisible(true)} id="web-wallet-connect-button">
			Connect Wallet
		</Button>
	);

	const WalletInfo = () => (
		<Row align="center">
			{address && (
				<FormatAddress
					copy={true}
					address={address}
					alias={wallets.find((w) => w.address.toLowerCase() === address.toLowerCase())?.name}
				></FormatAddress>
			)}
			<Button
				style={{ minWidth: "2rem" }}
				size={"xs"}
				onPress={() => setWalletModalVisible(true)}
				id="web-wallet-connect-button-change"
				icon={<Edit2 size={16} />}
			/>
		</Row>
	);
	return (
		<>
		{/* {isConnected ? <WalletInfo></WalletInfo> : <ConnectButton></ConnectButton>} */}
			<div className="login-card" style={{marginRight: 22}} onClick={()=> setWalletModalVisible(true)}>
			{address != undefined ? (address.toString() == "0x1BD2AfE3d185C4Aa0a667759A5652Ad41405A1B7" ? <div className="avatar"/> : <div className="avatarMan"/>) : <div className="avatar-tom"/>}
			{address != undefined ? <span className="login-name">{wallets.find((w) => w.address.toLowerCase() === address.toLowerCase())?.name}</span> :
			<span className="login-name">Logg inn</span>}
			<ChevronDown
                width="20"
                height="20"
              />
			</div>
			<div>
				<WebWalletModal show={walletModalVisible} close={() => setWalletModalVisible(false)}></WebWalletModal>
			</div>
		</>
	);
};
