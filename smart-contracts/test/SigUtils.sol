// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract SigUtils {
    bytes32 internal DOMAIN_SEPARATOR;

    constructor(bytes32 _DOMAIN_SEPARATOR) {
        DOMAIN_SEPARATOR = _DOMAIN_SEPARATOR;
    }

    // keccak256("Counter Party Risk Attestation(address VASPAddress, address originator, address beneficiary, string symbol, uint256 amount, uint256 expireAt)");
    bytes32 public constant CRA_TYPEHASH =
        0x0437aae69c54cd2466509c2a8ff9665c8db4aeca454a7326b4d054709a5b07ea;

    struct CRA {
        address VASPAddress;
        address originator;
        address beneficiary;
        string symbol;
        uint256 amount;
        uint256 expireAt;
    }

    // computes the hash of a counter party risk oracle
    function getStructHash(CRA memory _msg)
        public
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encode(
                    CRA_TYPEHASH,
                    _msg.VASPAddress,
                    _msg.originator,
                    _msg.beneficiary,
                    keccak256(bytes(_msg.symbol)),
                    _msg.amount,
                    _msg.expireAt
                )
            );
    }

    // computes the hash of the fully encoded EIP-712 message for the domain, which can be used to recover the signer
    function getTypedDataHash(CRA memory _msg)
        public
        view
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR,
                    getStructHash(_msg)
                )
            );
    }
}