import abi from "./wethContractAbi.json";

export const wrappedETHContractAddress =
	"0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

export const wrappedMaticContractAddress =
	"0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

export const wrappedAssetContract = {
	abi,
	addresses: [wrappedETHContractAddress, wrappedMaticContractAddress],
};
