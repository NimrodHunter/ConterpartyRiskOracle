import React from "react";
import { Box, Container, Input, Text } from "@chakra-ui/react";
import { formatEther, parseUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
interface AmountProps {
	amount?: string;
	onChange?: (amount: string) => void;
	symbol?: string;
	max?: string;
}

export default function Amount({
	amount = "3000000004900",
	max = "30000000000000",
	symbol = "ETH",
	onChange = () => {},
}: AmountProps) {
	const [displayValue, setDisplayValue] = React.useState("0.0");

	const setMax = () => {
		const val = max;
		setDisplayValue(formatEther(BigNumber.from(val)));
		onChange(val);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;
		setDisplayValue(value);
		onChange(parseUnits(value, "ether").toString());
	};

	return (
		<>
			<Text fontSize="2md" paddingLeft="8px" justifyContent="flex-start">
				Balance
			</Text>
			<Container
				borderColor="transparent"
				backgroundColor="gray.200"
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
						defaultValue={formatEther(BigNumber.from(0)).toString()}
						value={displayValue}
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
						Balance: {formatEther(BigNumber.from(max))}
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
