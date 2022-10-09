import { SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "./ethersRPC"; // for using ethers.js

type Provider = SafeEventEmitterProvider | null;

export const getChainId = async (provider: Provider) => {
	if (!provider) {
		return;
	}
	const rpc = new RPC(provider);
	const chainId = await rpc.getChainId();
	return chainId;
};
export const getAccounts = async (provider: Provider) => {
	if (!provider) {
		return;
	}
	const rpc = new RPC(provider);
	const address = await rpc.getAccounts();
	return address;
};

export const getBalance = async (provider: Provider) => {
	if (!provider) {
		return;
	}
	const rpc = new RPC(provider);

	return await rpc.getBalance();
};

export const sendTransaction = async (provider: Provider) => {
	if (!provider) {
		return;
	}
	const rpc = new RPC(provider);
	return await rpc.sendTransaction();
};

export const signMessage = async (provider: Provider) => {
	if (!provider) {
		return;
	}
	const rpc = new RPC(provider);
	return await rpc.signMessage();
};

export const getPrivateKey = async (provider: Provider) => {
	if (!provider) {
		return;
	}
	const rpc = new RPC(provider);
	return await rpc.getPrivateKey();
};

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
