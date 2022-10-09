import { SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "./ethersRPC"; // for using ethers.js

type Provider = SafeEventEmitterProvider | null;

export const getChainId = async (provider: Provider) => {
	if (!provider) {
		console.log("provider not initialized yet");
		return;
	}
	const rpc = new RPC(provider);
	const chainId = await rpc.getChainId();
	return chainId;
};
export const getAccounts = async (provider: Provider) => {
	if (!provider) {
		console.log("provider not initialized yet");
		return;
	}
	const rpc = new RPC(provider);
	const address = await rpc.getAccounts();
	return address;
};

export const getBalance = async (provider: Provider) => {
	if (!provider) {
		console.log("provider not initialized yet");
		return;
	}
	const rpc = new RPC(provider);

	const balance = await rpc.getBalance();
	console.log(balance);
};

export const sendTransaction = async (provider: Provider) => {
	if (!provider) {
		console.log("provider not initialized yet");
		return;
	}
	const rpc = new RPC(provider);
	const receipt = await rpc.sendTransaction();
	console.log(receipt);
};

export const signMessage = async (provider: Provider) => {
	if (!provider) {
		console.log("provider not initialized yet");
		return;
	}
	const rpc = new RPC(provider);
	const signedMessage = await rpc.signMessage();
	console.log(signedMessage);
};

export const getPrivateKey = async (provider: Provider) => {
	if (!provider) {
		console.log("provider not initialized yet");
		return;
	}
	const rpc = new RPC(provider);
	const privateKey = await rpc.getPrivateKey();
	console.log(privateKey);
};

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
