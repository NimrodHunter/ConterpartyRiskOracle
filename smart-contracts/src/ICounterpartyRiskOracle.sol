// @title Interface CounterPartyRiskOracle
// @notice Provides functions interface to verify off chain information about counter party risk in txs
// @author Anibal Catalan <anibal@notabene.id>
pragma solidity ^0.8.17;

interface ICounterpartyRiskOracle {

    struct craParams {
        uint256 expireAt;
        bytes signature;
    }

    struct CRA {
        address VASPAddress;
        address originator;
        address beneficiary;
        string symbol;
        uint256 amount;
        uint256 expireAt;
    }

    function verifyCounterpartyRisk(CRA calldata msg, bytes calldata sig) external;

    function setSigner(address signer) external;

    function getSigner() view external returns (address);

    function hashSignature(bytes32 _sigHash) view external returns (bytes calldata);

    function getDomainHash() view external returns (bytes32);

}