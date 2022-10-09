import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import "./App.css";
// import RPC from "./web3RPC"; // for using web3.js
// import RPC from "./ethersRPC"; // for using ethers.js
import { BigNumber, ethers } from "ethers";
import { wrappedAssetContract } from "./contracts/wrappedAssetContract";
import { musdContract } from "./contracts/musdContract";
import { stakingContract } from "./contracts/stakingContract";
import StakeView from "./views/StakeView";
import { Box, Button, useToast } from "@chakra-ui/react";
import Header from "./components/Header";
import { runRules } from "./notabene";
import { getAccounts, sleep } from "./helpers";
import { formatEther } from "ethers/lib/utils";
import { blockchains } from "./blockchains";

const clientId =
	"BHzLV_G8M2v-usQhJfTTKcDBR7RENAkYLn9D2VqX14Fn2_s2iSdjLFItKs5-BMOjtzwCilHGdcFTkqz2A6TRP_I"; // get from https://dashboard.web3auth.io

function App() {
	const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
	const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
		null
	);
	const [wethBalance, setWethBalance] = useState();
	const [amountStaked, setAmountStaked] = useState();
	const [musdBalance, setMusdBalance] = useState();
	const [address, setAddress] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<string | undefined>();
	const [processingText, setProcessingText] = useState<string | undefined>(
		undefined
	);
	const [blockchain, setBlockchain] = useState(0);
	const toast = useToast();

	const currentChain = blockchains[blockchain];
	const currentStakingContractAddress = stakingContract.addresses[blockchain];
	const currentWrappedAssetContractAddress =
		wrappedAssetContract.addresses[blockchain];
	useEffect(() => {
		if (provider) {
			refresh();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [provider]);

	useEffect(() => {
		const init = async () => {
			const {
				chainId,
				rpcTarget,
				name,
				blockchainExplorer,
				ticker,
				tickerName,
			} = blockchains[blockchain];
			try {
				const web3auth = new Web3Auth({
					clientId,
					chainConfig: {
						chainNamespace: CHAIN_NAMESPACES.EIP155,
						chainId: chainId,
						rpcTarget: rpcTarget,
						displayName: name,
						blockExplorer: blockchainExplorer,
						ticker: ticker,
						tickerName: tickerName,
					},
				});

				setWeb3auth(web3auth);

				await web3auth.initModal();
				if (web3auth.provider) {
					toast({
						title: "Connected",
						description: "You are connected to " + blockchains[blockchain].name,
						status: "success",
						duration: 3000,
						isClosable: true,
					});
					setProvider(web3auth.provider);
				}
			} catch (error) {
				console.error(error);
			}
		};

		init();
	}, [blockchain]);

	const login = async () => {
		if (!web3auth) {
			return;
		}
		const web3authProvider = await web3auth.connect();
		setProvider(web3authProvider);
		const fetchedAddress = await getAccounts(provider);
		setAddress(fetchedAddress);
	};

	const logout = async () => {
		if (!web3auth) {
			return;
		}
		await web3auth.logout();
		setProvider(null);
	};

	const refresh = async () => {
		const fetchedAddress = await getAccounts(provider);
		const wrappedAsset = await wrappedAssetBalance();
		const staked = await stakedBalance();

		console.log("wrappedAsset", wrappedAsset);
		console.log("staked", staked);

		// const musd = await mUSDBalance();
		// const reward = await rewardsBalance()
		setAddress(fetchedAddress);
		setWethBalance(wrappedAsset);
		setAmountStaked(staked);
		// setMusdBalance(musd);
	};

	const wrappedAssetBalance = async () => {
		if (!provider) {
			return;
		}
		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();

		const contract = new ethers.Contract(
			currentWrappedAssetContractAddress,
			wrappedAssetContract.abi,
			signer
		);
		const address = await signer.getAddress();

		const amount = (await contract.balanceOf(address)).toString();
		return amount;
	};

	const mUSDBalance = async () => {
		if (!provider) {
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

		return (await contract.balanceOf(address)).toString();
	};

	const stakedBalance = async () => {
		if (!provider) {
			return;
		}
		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();

		const contract = new ethers.Contract(
			currentStakingContractAddress,
			stakingContract.abi,
			signer
		);
		const address = await signer.getAddress();

		return (await contract.balanceOf(address)).toString();
	};

	const stake = async (amount: string) => {
		if (!provider) {
			return;
		}

		try {
			setIsLoading("staking");
			setProcessingText("Checking compliance...");

			await sleep(1000);

			const rulesResult = await runRules({
				vaspDID: "did:ethr:0xcea876c94528c8d790836ad7e9420ba8253fdf70",
				originatorAddress: address as string,
				beneficiaryAddress: currentStakingContractAddress,
				transactionAsset: currentChain.stakingToken,
				transactionAmount: amount,
				direction: "outgoing",
			});

			if ((rulesResult as any).actionRule === "REJECT") {
				toast({
					title: "Failed to comply",
					description: "You cannot stake",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "top",
					containerStyle: {
						marginTop: "80px",
					},
				});
				resetLoading();
				return;
			}

			const { signature, attestation } = rulesResult as any;

			setProcessingText("Approving transaction...");

			const ethersProvider = new ethers.providers.Web3Provider(provider);
			const signer = ethersProvider.getSigner();
			const wethContractCurrent = new ethers.Contract(
				currentWrappedAssetContractAddress,
				wrappedAssetContract.abi,
				signer
			);
			const stakingContractCurrent = new ethers.Contract(
				currentStakingContractAddress,
				stakingContract.abi,
				signer
			);
			const tx = await wethContractCurrent.approve(
				currentStakingContractAddress,
				amount
			);

			await tx.wait();

			setProcessingText("Staking...");

			const tx2 = await stakingContractCurrent.stake(amount, {
				expireAt: attestation.expireAt.toString(),
				signature,
			});

			await tx2.wait();

			toast({
				title: `Staked ${formatEther(BigNumber.from(amount))} ETH successfully`,
				status: "success",
				duration: 4000,
				position: "top",
				containerStyle: {
					marginTop: "80px",
				},
				isClosable: true,
			});
			resetLoading();
		} catch (error) {
			console.error(error);
			resetLoading();
		} finally {
			resetLoading();
		}
		refresh();
	};

	const resetLoading = () => {
		setProcessingText(undefined);
		setIsLoading(undefined);
	};

	const unstake = async (amount: string) => {
		if (!provider) {
			return;
		}

		setIsLoading("unstaking");
		setProcessingText("Checking compliance...");

		await sleep(1000);

		const rulesResult = await runRules({
			vaspDID: "did:ethr:0xcea876c94528c8d790836ad7e9420ba8253fdf70",
			originatorAddress: currentStakingContractAddress,
			beneficiaryAddress: address as string,
			transactionAsset: currentChain.stakingToken,
			transactionAmount: amount,
			direction: "incoming",
		});

		if ((rulesResult as any).actionRule === "REJECT") {
			toast({
				title: "Failed to comply",
				status: "error",
				duration: 4000,
				position: "top",
				containerStyle: {
					marginTop: "80px",
				},
				isClosable: true,
			});
			resetLoading();
			return;
		}

		const { signature, attestation } = rulesResult as any;

		setProcessingText("Unstaking...");

		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();
		const stakingContractCurrent = new ethers.Contract(
			currentStakingContractAddress,
			stakingContract.abi,
			signer
		);
		const tx = await stakingContractCurrent.withdraw(amount, {
			expireAt: attestation.expireAt.toString(),
			signature,
		});
		await tx.wait();

		showModal(
			"success",
			"UnStaked: " +
				formatEther(BigNumber.from(amount)) +
				" " +
				currentChain.stakingToken
		);
		toast({
			title: `Un-Staked ${formatEther(
				BigNumber.from(amount)
			)} ETH successfully`,
			status: "success",
			containerStyle: {
				marginTop: "80px",
			},
			position: "top",
			duration: 4000,
			isClosable: true,
		});
		refresh();
	};

	const showModal = (type: string, text: string) => {
		setIsLoading(type);
		setProcessingText(text);
		setTimeout(() => {
			setIsLoading(undefined);
			setProcessingText(undefined);
		}, 4000);
	};

	const getRewardsToBeClaimed = async () => {
		if (!provider) {
			return;
		}
		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();
		const stakingContractCurrent = new ethers.Contract(
			currentStakingContractAddress,
			stakingContract.abi,
			signer
		);
		return await stakingContractCurrent.rewards(address);
	};

	const getreward = async () => {
		if (!provider) {
			return;
		}

		const rewardsToBeClaimed = await getRewardsToBeClaimed();

		const rulesResult = await runRules({
			vaspDID: "did:ethr:0xcea876c94528c8d790836ad7e9420ba8253fdf70",
			originatorAddress: currentStakingContractAddress,
			beneficiaryAddress: address as string,
			transactionAsset: "MUSD",
			transactionAmount: rewardsToBeClaimed.toString(),
			direction: "incoming",
		});

		if ((rulesResult as any).actionRule === "REJECT") {
			toast({
				title: "Failed to comply",
				status: "error",
				duration: 4000,
				position: "top",
				containerStyle: {
					marginTop: "80px",
				},
				isClosable: true,
			});
			resetLoading();
			return;
		}

		const {
			signature,
			attestation: { expireAt },
		} = rulesResult as any;

		const ethersProvider = new ethers.providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();
		const stakingContractCurrent = new ethers.Contract(
			currentStakingContractAddress,
			stakingContract.abi,
			signer
		);

		const tx = await stakingContractCurrent.getReward({ signature, expireAt });

		tx.wait();
		refresh();
	};

	const loggedInView = (
		<>
			<Header
				setBlockchain={setBlockchain}
				address={address}
				onLogout={logout}
				blockchain={blockchain}
			/>
			<Box height="150px" />
			<StakeView
				chain={blockchains[blockchain]}
				isLoading={isLoading}
				amountStaked={amountStaked}
				wethBalance={wethBalance}
				musdBalance={musdBalance}
				processingText={processingText}
				onStake={stake}
				onUnStake={unstake}
				onGetRewards={getreward}
			/>
		</>
	);

	const unloggedInView = (
		<Box
			width="500px"
			height="100%"
			display="flex"
			justifyContent="center"
			alignItems="center"
		>
			<Button onClick={login}>Login</Button>
		</Box>
	);

	return (
		<Box
			width="100%"
			height="100vh"
			display="flex"
			flexDirection="column"
			justifyContent="flex-start"
			backgroundColor="gray.100"
			alignItems="center"
		>
			{provider ? loggedInView : unloggedInView}
		</Box>
	);
}

export default App;
