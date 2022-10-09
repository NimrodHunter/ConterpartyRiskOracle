import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
	components: {
		Container: {
			baseStyle: {
				borderRadius: "16px",
				padding: "8px",
			},
		},
		Text: {
			baseStyle: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			},
		},
		Input: {
			baseStyle: {
				borderRadius: "16px",
				padding: "8px",
				border: "none",
				_focus: {
					outline: "none",
				},
			},
		},
		Button: {
			baseStyle: {
				borderRadius: "16px",
				backgroundColor: "primary.500",
				width: "100%",
				marginTop: "8px",
			},
			sizes: {
				small: {
					px: 5,
					h: "50px",
					fontSize: "20px",
				},
				medium: {
					px: 7,
					h: "60px",
					fontSize: "25px",
				},
				large: {
					px: 8,
					h: "70px",
					fontSize: "30px",
					borderRadius: "10px",
				},
			},
			defaultProps: {
				size: "small",
				variant: "primary",
			},
			variants: {
				primary: {
					bg: "green.500",
					color: "#fff",
					_hover: {
						bg: "green.400",
					},
					_active: {
						bg: "green.500",
					},
				},
				secondary: {
					bg: "secondary",
					color: "#333",
				},
				ghost: {
					bg: "transparent",
					border: "1px solid red",
				},
				primaryGhost: {
					bg: "transparent",
					border: "1px solid",
					borderColor: "primary",
				},
				secondaryGhost: {
					bg: "transparent",
					border: "1px solid",
					borderColor: "secondary",
					_hover: {
						color: "#333",
						bg: "#BB1415",
					},
				},
			},
		},
		Heading: {
			baseStyle: {
				fontFamily: "Open Sans",
				fontWeight: "600",
			},
			sizes: {
				small: {
					fontSize: "20px",
				},
				medium: { fontSize: "25px" },
				large: { fontSize: "30px" },
			},
		},
	},
});
