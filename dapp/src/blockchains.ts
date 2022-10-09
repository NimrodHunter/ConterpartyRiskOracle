export const goerli = {
	chainId: "0x5",
	rpcTarget:
		"https://eth-goerli.g.alchemy.com/v2/6vw3KrCK7MCw53KabFy2YWABLN3MEhGl",
	name: "Goerli Testnet",
	blockchainExplorer: "https://goerli.etherscan.io",
	ticker: "ETH",
	stakingToken: "WETH",
	tickerName: "Ethereum",
	version: "1",
};

export const mumbai = {
	chainId: "0x13881",
	rpcTarget:
		"https://polygon-mumbai.g.alchemy.com/v2/BG-cOJa9zyGErIxHhnP9xoyotSrfHRW2",
	blockchainExplorer: "https://mumbai.polygonscan.com/",
	name: "Mumbai Testnet",
	ticker: "MATIC",
	stakingToken: "WMATIC",
	tickerName: "Polygon",
	version: "1",
};

export const blockchains = [goerli, mumbai];
