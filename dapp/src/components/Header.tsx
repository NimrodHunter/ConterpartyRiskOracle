import { Box, Button, Image, Tab, TabList, Tabs, Text } from "@chakra-ui/react";

export default function Header({
	address = "",
	onLogout,
	blockchain,
	setBlockchain,
}: {
	address?: string | null;
	onLogout: () => void;
	blockchain: number;
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
				margin="0 8px"
				colorScheme={blockchain === 0 ? "blue" : "purple"}
			>
				<TabList>
					<Tab>
						<Image
							marginRight="8px"
							borderRadius="full"
							src="https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=64&q=75"
							width="20px"
							height="20px"
						/>
						Goerli
					</Tab>
					<Tab>
						<Image
							marginRight="8px"
							borderRadius="full"
							src="https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_polygon.jpg&w=64&q=75"
							width="20px"
							height="20px"
						/>
						Mumbai
					</Tab>
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
