// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "./SigUtils.sol";
import "@src/ICounterPartyRiskAttestation.sol";
import "@src/CounterPartyRiskAttestation.sol";

contract CounterPartyRiskAttestationTest is Test {
    SigUtils internal sigUtils;
    ICounterPartyRiskAttestation internal cra;

    uint256 internal signerPrivateKey;
    uint256 internal originatorPrivateKey;
    uint256 internal beneficiaryPrivateKey;

    address internal signer;
    address internal originator;
    address internal beneficiary;

    function setUp() public {
        signerPrivateKey = 0xA11CF;
        signer = vm.addr(signerPrivateKey);

        cra = new CounterPartyRiskAttestation(signer);
        sigUtils = new SigUtils(cra.getDomainHash());

        originatorPrivateKey = 0xF13AB;
        beneficiaryPrivateKey = 0xBF03B;

        originator = vm.addr(originatorPrivateKey);
        beneficiary = vm.addr(beneficiaryPrivateKey);
    }

    function testContructor() public {
        assertEq(cra.getSigner(), signer);
    }

    function testverifyCounterpartyRiskTo() public {
        
       CounterPartyRiskAttestation.CRA memory craMsg = ICounterPartyRiskAttestation.CRA({
            VASPAddress: address(this),
            originator: originator,
            beneficiary: address(this),
            symbol: "WETH",
            amount: 2,
            expireAt: 1 days
        });

        SigUtils.CRA memory counterpartyRisk = SigUtils.CRA({
            VASPAddress: address(this),
            originator: originator,
            beneficiary: address(this),
            symbol: "WETH",
            amount: 2,
            expireAt: 1 days
        });

        bytes32 digest = sigUtils.getTypedDataHash(counterpartyRisk);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPrivateKey, digest);
        bytes memory sig = abi.encodePacked(r, s, v);
        bytes32 hashedMsg = sigUtils.getStructHash(counterpartyRisk);

        bytes memory signature = cra.hashSignature(hashedMsg);

        assertEq(signature.length, 0);

        cra.verifyCounterpartyRisk(craMsg, sig);
        
        signature = cra.hashSignature(hashedMsg);

        assertEq(signature, sig);
    }



    function testSetSigner() public {
        address newSigner = address(0x1);
        cra.setSigner(newSigner);
        assertEq(cra.getSigner(), newSigner);
    }
}