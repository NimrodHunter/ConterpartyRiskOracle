export const goerli = {
	chainId: "0x5",
	rpcTarget:
		"https://eth-goerli.g.alchemy.com/v2/6vw3KrCK7MCw53KabFy2YWABLN3MEhGl",
	verifyingContract: "0x0000000000000000000000000000000000000000",
	name: "Goerli Testnet",
	blockchainExplorer: "https://goerli.etherscan.io",
	ticker: "ETH",
	version: "1",
};

export const mumbai = {
	chainId: "0x13881",
	rpcTarget: "https://rpc-mumbai.maticvigil.com",
	verifyingContract: "0x0000000000000000000000000000000000000000",
	blockchainExplorer: "https://explorer-mumbai.maticvigil.com",
	name: "Mumbai Testnet",
	ticker: "MATIC",
	version: "1",
};

export const blockchains = [goerli, mumbai];
