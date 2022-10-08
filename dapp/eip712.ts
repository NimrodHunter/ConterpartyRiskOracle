// All properties on a domain are optional
const domain = {
    name: 'Counter Party Risk Attestation',
    version: '1',
    chainId: 1,
    verifyingContract: '0x4c1c63F0F8eBBa87c4aAef8f1fffB4CD59edC6c7'
};

// The named list of all type definitions
const types = {
    CRA: [
        { name: 'VASPAddress', type: 'address' },
        { name: 'originator', type: 'address' },
        { name: 'beneficiary', type: 'address' },
        { name: 'symbol', type: 'string' },
        { name: 'amount', type: 'uint256' },
        { name: 'expireAt', type: 'uint256' }
    ]
};

// The data to sign
const value = {
    VASPAddress: OMRI Give this data,
    originator: OMRI Give this data,
    beneficiary: OMRI Give this data,
    symbol: OMRI Give this data,
    expireAt: OMRI Give this data,
};

export signature = await signer._signTypedData(domain, types, value);
// '0x463b9c9971d1a144507d2e905f4e98becd159139421a4bb8d3c9c2ed04eb401057dd0698d504fd6ca48829a3c8a7a98c1c961eae617096cb54264bbdd082e13d1c'