import { Button, Container, Tab, TabList, Tabs } from "@chakra-ui/react";
import React from "react";
import Amount from "../components/Amount";

export default function StakeView({
	onStake,
	onUnStake,
	onGetRewards,
	processingText,
	wethBalance,
	isLoading,
	amountStaked,
	musdBalance,
}: {
	onStake: (amount: string) => void;
	onUnStake: (amount: string) => void;
	onGetRewards: () => void;
	wethBalance?: string;
	amountStaked?: string;
	musdBalance?: string;
	isLoading?: undefined | string;
	processingText?: string;
}) {
	const [amount, setAmount] = React.useState("0");
	const [state, setState] = React.useState(0);

	const handleAmount = (val: string) => {
		setAmount(val);
	};

	const handleStake = () => {
		onStake(amount);
	};

	const handleUnStake = () => {
		onUnStake(amount);
	};

	const shouldDisableButtons = amount === "0";
	const currentMax = state === 0 ? wethBalance : amountStaked;

	const handleTabChange = (index: number) => {
		setState(index);
		if (!currentMax) return;
		if (Number(amount) > Number(currentMax)) {
			setAmount(currentMax);
		}
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
				<Tabs
					onChange={handleTabChange}
					variant="soft-rounded"
					size="sm"
					colorScheme="green"
				>
					<TabList>
						<Tab>STAKE</Tab>
						<Tab>UNSTAKE</Tab>
					</TabList>
				</Tabs>
				<Amount max={currentMax} onChange={handleAmount} />
				{state === 0 ? (
					<Button
						isLoading={isLoading === "staking"}
						isDisabled={shouldDisableButtons || !!isLoading}
						loadingText={processingText}
						onClick={handleStake}
					>
						STAKE
					</Button>
				) : (
					<Button
						isLoading={isLoading === "unstaking"}
						isDisabled={shouldDisableButtons || !!isLoading}
						loadingText={processingText}
						onClick={handleUnStake}
					>
						UNSTAKE
					</Button>
				)}
				{/* {isLoading && (
					<>
						<Box display="flex" justifyContent="center" alignItems="center">
							{isLoading === "success" && <CheckCircleIcon color="green.500" />}
							{isLoading === "error" && <WarningIcon color="red.500" />}
						</Box>
						<Text>{processingText}</Text>
					</>
				)} */}
				{/* <Button
					isLoading={isLoading === "getreward"}
					isDisabled={!!isLoading}
					onClick={onGetRewards}
				>
					GET REWARDS
				</Button> */}
			</Container>
		</>
	);
}
