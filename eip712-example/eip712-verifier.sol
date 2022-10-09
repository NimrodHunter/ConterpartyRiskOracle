// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

contract EIP712verifier {
    
    struct EIP712Domain {
        string  name;
        string  version;
        uint256 chainId;
        address verifyingContract;
    }

    struct CRA {
        address VASPAddress;
        address originator;
        address beneficiary;
        string symbol;
        uint256 amount;
        uint256 expireAt;
    }


    bytes32 constant EIP712DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    bytes32 constant CRA_TYPEHASH = keccak256(
        "CRA(address VASPAddress,address originator,address beneficiary,string symbol,uint256 amount,uint256 expireAt)"
    );

    bytes32 DOMAIN_SEPARATOR;

    constructor () {
        DOMAIN_SEPARATOR = hash(EIP712Domain({
            name: "Counter Party Risk Attestation",
            version: '1',
            chainId: 1,
            // verifyingContract: this
            verifyingContract: 0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC
        }));
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v){
        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

    function hash(EIP712Domain memory eip712Domain) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            EIP712DOMAIN_TYPEHASH,
            keccak256(bytes(eip712Domain.name)),
            keccak256(bytes(eip712Domain.version)),
            eip712Domain.chainId,
            eip712Domain.verifyingContract
        ));
    }

    function hash(CRA memory cra) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            CRA_TYPEHASH,
            cra.VASPAddress,
            cra.originator,
            cra.beneficiary,
            keccak256(bytes(cra.symbol)),
            cra.amount,
            cra.expireAt
        ));
    }


    function verify(CRA memory cra, address signer, uint8 v, bytes32 r, bytes32 s) internal view returns (bool) {
        // Note: we need to use `encodePacked` here instead of `encode`.
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hash(cra)
        ));
        return ecrecover(digest, v, r, s) == signer;
    }

    

    function verifyCRA(
        address  _VASPAddress,
        address  _originator,
        address  _beneficiary,
        string   memory _symbol,
        uint256  _amount,
        uint256  _expireAt,
        bytes memory _sig, 
        address _signer) public view returns (bool) {

            //Create structure
            CRA memory cra = CRA({
                VASPAddress: _VASPAddress,
                originator: _originator,
                beneficiary:_beneficiary,
                symbol: _symbol,
                amount: _amount,
                expireAt: _expireAt
            });
            
            (bytes32 r, bytes32 s, uint8 v) = splitSignature(_sig);
            return verify(cra, _signer, v, r, s);
    }
}