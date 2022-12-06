import { Button, Grid, Input, Modal } from "@nextui-org/react";
import React, { useState } from "react";

interface Props {
	show: boolean;
	close: () => void;
	onRename: (newName: string) => void;
}

export const RenameWalletModal: React.FC<Props> = ({ ...props }) => {
	const { show, close, onRename } = props;
	const [newName, setNewName] = useState<string>("");
	return (
		<Modal
			width="30rem"
			closeButton={true}
			aria-labelledby="modal-title"
			open={show}
			onClose={() => close()}
			blur={true}
		>
			<Grid.Container alignItems="center" gap={2} direction="column">
				<Grid xs={12}>
					<Input
						autoFocus={true}
						tabIndex={0}
						labelPlaceholder="Enter new name"
						onChange={(e) => setNewName(e.target.value)}
					/>
				</Grid>
				<Grid xs={12}>
					<Button tabIndex={0} onPress={() => onRename(newName)}>
						Rename
					</Button>
				</Grid>
			</Grid.Container>
		</Modal>
	);
};
