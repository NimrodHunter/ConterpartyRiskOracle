interface Tx {
	vaspDID: string;
	originatorAddress: string;
	beneficiaryAddress: string;
	transactionAsset: string;
	transactionAmount: string;
	direction: string;
}

enum actionRule {
	"APPROVE",
	"REJECT",
}

interface RuleResponse {
	actionRule: actionRule;
	attestation: string;
}

export const runRules = async (tx: Tx): Promise<RuleResponse> => {
	console.log(tx);

	const res = await fetch("http://localhost:3000/rules/run", {
		method: "post",
		body: JSON.stringify(tx),
		headers: {
			"Content-Type": "application/json",
		},
	});
	return (await res.json()) as RuleResponse;
};
