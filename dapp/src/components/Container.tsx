import React from "react";
import { Box } from "@chakra-ui/react";

interface Props {
	onClick: () => void;
	children: React.ReactNode;
}

export default function Button({ children }: Props) {
	return (
		<Box boxShadow="dark-lg" padding="1">
			{children}
		</Box>
	);
}
