import { Box, Button, Tab, TabList, Tabs, Text } from "@chakra-ui/react";

export default function Header({
	address = "",
	onLogout,
	setBlockchain,
}: {
	address?: string | null;
	onLogout: () => void;
	setBlockchain: (index: number) => void;
}) {
	return (
		<Box
			display="flex"
			justifyContent="flex-end"
			alignContent="center"
			width="98%"
			margin="8px 20px"
		>
			<Tabs
				onChange={setBlockchain}
				variant="soft-rounded"
				size="sm"
				colorScheme="green"
			>
				<TabList>
					<Tab>Goerli</Tab>
					<Tab>Mumbai</Tab>
				</TabList>
			</Tabs>
			<Text
				marginRight="8px"
				fontSize="smaller"
				boxShadow="md"
				borderRadius="16px"
				backgroundColor="white"
				padding="0 8px"
			>
				{address}
			</Text>
			<Box>
				<Button
					backgroundColor="red.300 !important"
					marginTop="0"
					size="sm"
					onClick={onLogout}
				>
					Logout
				</Button>
			</Box>
		</Box>
	);
}
