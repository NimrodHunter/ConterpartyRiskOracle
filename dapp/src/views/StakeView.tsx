import { Box, Button, Container, Text } from "@chakra-ui/react";
import React from "react";
import Amount from "../components/Amount";

export default function StakeView({ onStake }: { onStake: () => void }) {
	return (
		<>
			<Container
				maxW="md"
				bg="blue.600"
				color="white"
				padding="8px"
				borderRadius="16px"
			>
				<Text fontSize="2sm" fontWeight="bold" textAlign="center">
					Stake
				</Text>
				<Amount />
				<Button onClick={onStake}>STAKE</Button>
				<Button onClick={() => {}}>UNSTAKE</Button>
				<Button onClick={() => {}}>GET REWARDS</Button>
			</Container>
		</>
	);
}
