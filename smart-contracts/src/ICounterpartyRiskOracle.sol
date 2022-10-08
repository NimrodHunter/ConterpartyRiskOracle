// @title Interface CounterPartyRiskOracle
// @notice Provides functions interface to verify off chain information about counter party risk in txs
// @author Anibal Catalan <anibal@notabene.id>
pragma solidity ^0.8.17;

interface ICounterpartyRiskOracle {

    struct croParams {
        bool rules;
        uint256 deadline;
        bytes signature;
    }

    struct CRO {
        address customerVASP;
        bool rules;
        address originator;
        address beneficiary;
        uint256 value;
        bytes data;
        uint256 deadline;
    }

    function verifyCounterpartyRisk(CRO calldata msg, bytes calldata sig) external;

    function setSigner(address signer) external;

    function getSigner() view external returns (address);

    function hashSignature(bytes32 _sigHash) view external returns (bytes calldata);

    function getDomainHash() view external returns (bytes32);

}