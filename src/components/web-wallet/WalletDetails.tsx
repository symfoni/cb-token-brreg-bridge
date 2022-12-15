import { Button, Card, Col, Grid, Text } from "@nextui-org/react";
import debug from "debug";
import { ethers } from "ethers";
import React, { useState } from "react";
import { Delete } from "react-feather";
import { useConnect } from "wagmi";
import { FormatAddress } from "../format/Address";
import { toastError } from "../format/toast";
import { RenameWalletModal } from "./RenameWalletModal";
import { RequestPasswordModal } from "./RequestPasswordModal";
import { EncryptedWalletMeta, useWebWalletState } from "./web-wallet-state";
const log = debug("bridge:WalletDetails");

interface Props {
	wallet: EncryptedWalletMeta;
	onSelectWallet: (wallet: EncryptedWalletMeta, decryptedWallet: ethers.Wallet) => void;
}

export const WalletDetails: React.FC<Props> = ({ ...props }) => {
	const { wallet, onSelectWallet } = props;
	const [requestUnlock, setRequestUnlock] = useState<boolean>(false);
	const [requestRename, setRequestRename] = useState<boolean>(false);
	const { removeWallet, updateWallet } = useWebWalletState();

	const onDecryptWallet = async (decryptedWallet: ethers.Wallet) => {
		onSelectWallet(wallet, decryptedWallet);
	};

	const onRename = async (newName: string) => {
		updateWallet({
			...wallet,
			name: newName,
		});
		setRequestRename(false);
	};

	return (
		<Card
			className='wallet-card'
			id={`wallet-${wallet.address}`}
			key={wallet.address}
			isHoverable
			isPressable
			onPress={() => setRequestUnlock(true)}
		>
			<Grid.Container gap={1} alignItems="flex-end" justify="flex-end">
				<Grid xs={12}>
					<Col>
						<Text size={12}>{wallet.name}</Text>
						<FormatAddress address={wallet.address}></FormatAddress>
					</Col>
				</Grid>
				<Grid sm={3}>
					<Button size={"xs"} onPress={() => setRequestUnlock(true)}>
						Unlock
					</Button>
				</Grid>
				<Grid sm={3}>
					<Button size={"xs"} onPress={() => setRequestRename(true)}>
						Rename
					</Button>
				</Grid>
				<Grid sm={3}>
					<Button
						size={"xs"}
						className='remove-wallet'
						color={"error"}
						icon={<Delete size={16}></Delete>}
						style={{ width: "1rem" }}
						onPress={() => removeWallet(wallet.address)}
					></Button>
				</Grid>
			</Grid.Container>
			<RequestPasswordModal
				wallet={wallet}
				show={requestUnlock}
				close={() => setRequestUnlock(false)}
				onDecryptWallet={onDecryptWallet}
			></RequestPasswordModal>
			<RenameWalletModal
				show={requestRename}
				close={() => setRequestRename(false)}
				onRename={onRename}
			></RenameWalletModal>
		</Card>
	);
};
