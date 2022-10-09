import { Box, Button, Text } from "@chakra-ui/react";

export default function Header({
	address = "",
	onLogout,
}: {
	address?: string | null;
	onLogout: () => void;
}) {
	return (
		<Box
			display="flex"
			justifyContent="flex-end"
			alignContent="center"
			width="100%"
			maxWidth="800px"
			margin="8px 20px"
		>
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
