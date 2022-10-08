import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import "./App.css";
// import RPC from "./web3RPC"; // for using web3.js
import RPC from "./ethersRPC"; // for using ethers.js
import { BigNumber, ethers } from "ethers";
import { WETHContract } from "./contracts/wethContract";
import { musdContract } from "./contracts/musdContract";
import { stakingContract } from "./contracts/stakingContract";
import StakeView from "./views/StakeView";
import { Box, Button } from "@chakra-ui/react";
import Header from "./components/Header";
import { runRules } from "./notabene";

const clientId =
	"BHzLV_G8M2v-usQhJfTTKcDBR7RENAkYLn9D2VqX14Fn2_s2iSdjLFItKs5-BMOjtzwCilHGdcFTkqz2A6TRP_I"; // get from https://dashboard.web3auth.io

function App() {
	const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
	const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
		null
	);
	const [address, setAddress] = useState<string | null>(null);

	useEffect(() => {
		if (provider) {
			refreshAddress();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [provider]);

	useEffect(() => {
		const init = async () => {
			try {
				const web3auth = new Web3Auth({
					clientId,
					chainConfig: {
						chainNamespace: CHAIN_NAMESPACES.EIP155,
						chainId: "0x5",
						rpcTarget:
							"https://eth-goerli.g.alchemy.com/v2/6vw3KrCK7MCw53KabFy2YWABLN3MEhGl",
						// Avoid using public rpcTarget in production.
						// Use services like Infura, Quicknode etc
						displayName: "Ethereum Goerli",
						blockExplorer: "https://goerli.etherscan.io",
						ticker: "ETH",
						tickerName: "Ethereum",
					},
				});

				setWeb3auth(web3auth);

				await web3auth.initModal();
				if (web3auth.provider) {
					setProvider(web3auth.provider);
				}
			} catch (error) {
				console.error(error);
			}
		};

		init();
	}, []);

	const login = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		const web3authProvider = await web3auth.connect();
		setProvider(web3authProvider);
		const fetchedAddress = await getAccounts();
		setAddress(fetchedAddress);
	};

	const getUserInfo = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		const user = await web3auth.getUserInfo();
		console.log(user);
	};

	const logout = async () => {
		if (!web3auth) {
			console.log("web3auth not initialized yet");
			return;
		}
		await web3auth.logout();
		setProvider(null);
	};

	const refreshAddress = async () => {
		const fetchedAddress = await getAccounts();
		setAddress(fetchedAddress);
	};

	const wrappedETHBalance = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();

		const contract = new ethers.Contract(
			WETHContract.address,
			WETHContract.abi,
			signer
		);
		const address = await signer.getAddress();

		const message = (await contract.balanceOf(address)).toString();
		console.log(message);
	};

	const mUSDBalance = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();

		const contract = new ethers.Contract(
			musdContract.address,
			musdContract.abi,
			signer
		);
		const address = await signer.getAddress();

		const message = (await contract.balanceOf(address)).toString();
		console.log(message);
	};

	const stakedBalance = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();

		const contract = new ethers.Contract(
			stakingContract.address,
			stakingContract.abi,
			signer
		);
		const address = await signer.getAddress();

		const message = (await contract.balanceOf(address)).toString();
		console.log(message);
	};

	const stake = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}

		const wallet = new ethers.Wallet(
			"05c17cd5268b54bb5cd896f7ec4e80ec5d9197aefa842d0b0ee75de92e162340"
		);

		// All properties on a domain are optional
		const domain = {
			name: "Counter Party Risk Attestation",
			version: "1",
			chainId: 5,
			verifyingContract: "0x4c1c63F0F8eBBa87c4aAef8f1fffB4CD59edC6c7",
		};

		// The named list of all type definitions
		const types = {
			CRA: [
				{ name: "VASPAddress", type: "address" },
				{ name: "originator", type: "address" },
				{ name: "beneficiary", type: "address" },
				{ name: "symbol", type: "string" },
				{ name: "amount", type: "uint256" },
				{ name: "expireAt", type: "uint256" },
			],
		};

		// The data to sign
		const value = {
			VASPAddress: stakingContract.address,
			originator: address,
			beneficiary: stakingContract.address,
			symbol: "ETH",
			amount: 10000,
			expireAt: 1666119768,
		};

		console.log(value);

		const signature = await wallet._signTypedData(domain, types, value);
		console.log(signature);

		// '0x463b9c9971d1a144507d2e905f4e98becd159139421a4bb8d3c9c2ed04eb401057dd0698d504fd6ca48829a3c8a7a98c1c961eae617096cb54264bbdd082e13d1c'

		// const rulesResult = await runRules({
		// 	vaspDID: "did:ethr:0xcea876c94528c8d790836ad7e9420ba8253fdf70",
		// 	originatorAddress: address as string,
		// 	beneficiaryAddress: stakingContract.address,
		// 	transactionAsset: "ETH",
		// 	transactionAmount: "10000",
		// 	direction: "outgoing",
		// });

		// if ((rulesResult as any).actionRule === "REJECT") {
		// 	alert("cannot stake");
		// 	return;
		// }

		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();
		const wethContractCurrent = new ethers.Contract(
			WETHContract.address,
			WETHContract.abi,
			signer
		);
		const stakingContractCurrent = new ethers.Contract(
			stakingContract.address,
			stakingContract.abi,
			signer
		);
		const tx = await wethContractCurrent.approve(
			stakingContract.address,
			BigNumber.from(1000000)
		);
		console.log(tx);

		await tx.wait();

		const attestation = {
			signature,
			expireAt: 1666119768,
		};
		console.log(attestation);

		const tx2 = await stakingContractCurrent.stake(
			BigNumber.from(1000000),
			attestation
		);
		console.log(tx2);

		await tx2.wait();
		alert("Staked 1000000 WETH");
	};

	const unstake = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();
		const stakingContractCurrent = new ethers.Contract(
			stakingContract.address,
			stakingContract.abi,
			signer
		);
		const tx = await stakingContractCurrent.withdraw(BigNumber.from(1000000));
		await tx.wait();
		alert("Un-staked 1000000 WETH");
	};

	const getChainId = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const chainId = await rpc.getChainId();
		console.log(chainId);
	};
	const getAccounts = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const address = await rpc.getAccounts();
		return address;
	};

	const getBalance = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);

		const balance = await rpc.getBalance();
		console.log(balance);
	};

	const sendTransaction = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const receipt = await rpc.sendTransaction();
		console.log(receipt);
	};

	const signMessage = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const signedMessage = await rpc.signMessage();
		console.log(signedMessage);
	};

	const getPrivateKey = async () => {
		if (!provider) {
			console.log("provider not initialized yet");
			return;
		}
		const rpc = new RPC(provider);
		const privateKey = await rpc.getPrivateKey();
		console.log(privateKey);
	};
	const loggedInView = (
		<>
			{/* <button onClick={getUserInfo} className="card">
				Get User Info
			</button>
			<button onClick={getChainId} className="card">
				Get Chain ID
			</button>
			<button onClick={getAccounts} className="card">
				Get Accounts
			</button>
			<button onClick={getBalance} className="card">
				Get Balance
			</button>
			<button onClick={sendTransaction} className="card">
				Send Transaction
			</button>
			<button onClick={wrappedETHBalance} className="card">
				warppedETH Balance
			</button>
			<button onClick={stakedBalance} className="card">
				Staked Balance (WETH)
			</button>
			<button onClick={mUSDBalance} className="card">
				MUSD Balance
			</button>
			<button onClick={stake} className="card">
				Stake
			</button>
			<button onClick={unstake} className="card">
				Unstake
			</button>
			<button onClick={signMessage} className="card">
				Sign Message
			</button>
			<button onClick={getPrivateKey} className="card">
				Get Private Key
			</button> */}
			<Header address={address} onLogout={logout} />
			<Box height="100px" />
			<StakeView onStake={stake} />
		</>
	);

	const unloggedInView = (
		<Button onClick={login} className="card">
			Login
		</Button>
	);

	return (
		<Box
			width="100%"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			{provider ? loggedInView : unloggedInView}
		</Box>
	);
}

export default App;
