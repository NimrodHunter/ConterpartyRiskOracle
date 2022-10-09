import { Box, Button, Container, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import React from "react";
import Amount from "../components/Amount";

export default function StakeView({
	onStake,
	wethBalance,
	isLoading,
	amountStoked,
}: {
	onStake: (amount: string) => void;
	wethBalance?: string;
	amountStoked?: string;
	isLoading?: undefined | string;
}) {
	const [amount, setAmount] = React.useState("0");

	console.log(isLoading, "isLoading");

	const handleAmount = (val: string) => {
		setAmount(val);
	};

	const handleStake = () => {
		onStake(amount);
	};

	const shouldDisableButtons = amount === "0";

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
				<Button
					isLoading={isLoading === "staking"}
					isDisabled={shouldDisableButtons}
					onClick={handleStake}
				>
					STAKE
				</Button>
				<Button
					isLoading={isLoading === "unstaking"}
					isDisabled={shouldDisableButtons}
					onClick={() => {}}
				>
					UNSTAKE
				</Button>
				<Button
					isLoading={isLoading === "getreward"}
					isDisabled={shouldDisableButtons}
					onClick={() => {}}
				>
					GET REWARDS
				</Button>
			</Container>
		</>
	);
}
