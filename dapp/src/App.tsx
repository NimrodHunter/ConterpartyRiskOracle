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

const clientId =
	"BHzLV_G8M2v-usQhJfTTKcDBR7RENAkYLn9D2VqX14Fn2_s2iSdjLFItKs5-BMOjtzwCilHGdcFTkqz2A6TRP_I"; // get from https://dashboard.web3auth.io

function App() {
	const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
	const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
		null
	);

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
		await tx.wait();
		const tx2 = await stakingContractCurrent.stake(BigNumber.from(1000000));
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
		console.log(address);
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
			<button onClick={getUserInfo} className="card">
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
			</button>
			<button onClick={logout} className="card">
				Log Out
			</button>

			<div id="console" style={{ whiteSpace: "pre-line" }}>
				<p style={{ whiteSpace: "pre-line" }}></p>
			</div>
		</>
	);

	const unloggedInView = (
		<button onClick={login} className="card">
			Login
		</button>
	);

	return (
		<div className="container">
			<h1 className="title">
				<a target="_blank" href="http://web3auth.io/" rel="noreferrer">
					Web3Auth
				</a>
				& ReactJS Example
			</h1>

			<div className="grid">{provider ? loggedInView : unloggedInView}</div>

			<footer className="footer">
				<a
					href="https://github.com/Web3Auth/Web3Auth/tree/master/examples/react-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Source code
				</a>
			</footer>
		</div>
	);
}

export default App;
