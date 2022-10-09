// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract SigUtils {
    bytes32 internal DOMAIN_SEPARATOR;

    constructor(bytes32 _DOMAIN_SEPARATOR) {
        DOMAIN_SEPARATOR = _DOMAIN_SEPARATOR;
    }

    // keccak256("Counter Party Risk Attestation(address VASPAddress, address originator, address beneficiary, string symbol, uint256 amount, uint256 expireAt)");
    bytes32 public constant CRA_TYPEHASH =
        0x70fa7e976ae7888309b0257837ad3f859742f368c48b27f3117be000a91c5497;

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
                    _msg.VASPAddress,
                    _msg.originator,
                    _msg.beneficiary,
                    _msg.symbol,
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
                    "0x1901",
                    DOMAIN_SEPARATOR,
                    getStructHash(_msg)
                )
            );
    }
}