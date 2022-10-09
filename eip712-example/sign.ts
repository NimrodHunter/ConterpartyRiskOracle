import { ethers, providers } from "ethers";

const domain = {
    name: 'Counter Party Risk Attestation',
    version: '1',
    chainId: 1,  
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

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

(async ()=>{
    //const signer = ethers.Wallet.createRandom();
    
    const privKeyHex = '05c17cd5268b54bb5cd896f7ec4e80ec5d9197aefa842d0b0ee75de92e162340';
    const signer = new ethers.Wallet(privKeyHex);   
    const addr = signer.address;
    console.log("signer: "+addr);
    
    const testCRA = {
        VASPAddress: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        originator: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        beneficiary:'0x0000000000000000000000000000000000000000',
        symbol: 'WETH',
        amount: 100000000,
        expireAt: 123456789
    }

    const signature = await signer._signTypedData(domain, types, testCRA);

    console.log("signature: "+signature);

    //Verification (in typesript);
    const expectedSignerAddress = addr;
    const recoveredAddress = ethers.utils.verifyTypedData(domain, types, testCRA, signature);
    console.log("verification: "+(recoveredAddress === expectedSignerAddress));
})();
