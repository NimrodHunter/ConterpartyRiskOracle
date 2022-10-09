import { Box, Button, Container, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import React from "react";
import Amount from "../components/Amount";

export default function StakeView({
	onStake,
	wethBalance,
	amountStoked,
}: {
	onStake: (amount: string) => void;
	wethBalance?: string;
	amountStoked?: string;
}) {
	const [amount, setAmount] = React.useState("0");

	const handleAmount = (val: string) => {
		setAmount(val);
	};

	const handleStake = () => {
		onStake(amount);
	};

	return (
		<>
			<Container
				maxW="md"
				bg="white"
				color="#333"
				boxShadow="2xl"
				padding="8px"
				borderRadius="16px"
			>
				<Text fontSize="2sm" fontWeight="bold" textAlign="center">
					Stake
				</Text>
				<Amount max={wethBalance} onChange={handleAmount} />
				<Button onClick={handleStake}>STAKE</Button>
				<Button onClick={() => {}}>UNSTAKE</Button>
				<Button onClick={() => {}}>GET REWARDS</Button>
			</Container>
		</>
	);
}
