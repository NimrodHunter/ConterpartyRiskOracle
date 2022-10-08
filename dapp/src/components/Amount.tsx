import React from "react";
import { Box, Container, Input, Text } from "@chakra-ui/react";

interface AmountProps {
	amount?: string;
	onChange?: (amount: string) => void;
	symbol?: string;
	max?: string;
}

export default function Amount({
	amount = "0.0",
	max = "0.65",
	symbol = "ETH",
	onChange = () => {},
}: AmountProps) {
	const [value, setValue] = React.useState(amount);
	const setMax = () => {
		setValue(Number(max).toFixed(3));
		onChange(Number(max).toFixed(3));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setValue(value);
	};

	return (
		<>
			<Text fontSize="2md" paddingLeft="8px" justifyContent="flex-start">
				Balance
			</Text>
			<Container
				borderColor="transparent"
				backgroundColor="blue.300"
				padding="8px"
			>
				<Box display="flex" flex="row">
					<Input
						width="100%"
						fontWeight="bold"
						justifyContent="flex-start"
						border="none"
						type="number"
						onChange={handleChange}
						value={value}
					/>
					<Text fontSize="2md" fontWeight="bold" textAlign="right">
						{symbol}
					</Text>
				</Box>
				<Box display="flex" flexDirection="row" justifyContent="flex-end">
					<Text
						paddingRight="8px"
						fontSize="2md"
						fontWeight="bold"
						textAlign="right"
					>
						Balance: {max}
					</Text>
					<Text
						cursor="pointer"
						fontSize="2sm"
						textAlign="right"
						onClick={setMax}
					>
						Max
					</Text>
				</Box>
			</Container>
		</>
	);
}
