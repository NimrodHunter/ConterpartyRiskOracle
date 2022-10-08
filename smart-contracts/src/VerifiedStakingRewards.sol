// SPDX-License-Identifier: MIT
// Modified contract, source:
pragma solidity ^0.8.17;

import "@src/ICounterPartyRiskAttestation.sol";

contract VerifiedStakingRewards {
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    address public owner;

    // Duration of rewards to be paid out (in seconds)
    uint public duration;
    // Timestamp of when the rewards finish
    uint public finishAt;
    // Minimum of last updated time and reward finish time
    uint public updatedAt;
    // Reward to be paid out per second
    uint public rewardRate;
    // Sum of (reward rate * dt * 1e18 / total supply)
    uint public rewardPerTokenStored;
    // User address => rewardPerTokenStored
    mapping(address => uint) public userRewardPerTokenPaid;
    // User address => rewards to be claimed
    mapping(address => uint) public rewards;

    // Total staked
    uint public totalSupply;
    // User address => staked amount
    mapping(address => uint) public balanceOf;

    ICounterPartyRiskAttestation internal cra;

    constructor(address _stakingToken, address _rewardToken, address _cra) {
        owner = msg.sender;
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardToken);

        cra = ICounterPartyRiskAttestation(_cra);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    modifier updateReward(address _account) {
        rewardPerTokenStored = rewardPerToken();
        updatedAt = lastTimeRewardApplicable();

        if (_account != address(0)) {
            rewards[_account] = earned(_account);
            userRewardPerTokenPaid[_account] = rewardPerTokenStored;
        }

        _;
    }

    function lastTimeRewardApplicable() public view returns (uint) {
        return _min(finishAt, block.timestamp);
    }

    function rewardPerToken() public view returns (uint) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }

        return
            rewardPerTokenStored +
            (rewardRate * (lastTimeRewardApplicable() - updatedAt) * 1e18) /
            totalSupply;
    }

    function stake(uint _amount, ICounterPartyRiskAttestation.craParams calldata _params) external updateReward(msg.sender) {
        require(_amount > 0, "amount = 0");

        // Start CRA Verification
        ICounterPartyRiskAttestation.CRA memory craMsg = ICounterPartyRiskAttestation.CRA({
            VASPAddress: address(this),
            originator: msg.sender,
            beneficiary: address(this),
            symbol: "WETH",
            amount: _amount,
            expireAt: _params.expireAt
        });
        cra.verifyCounterpartyRisk(craMsg, _params.signature);
        // End CRA Verification

        stakingToken.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
        totalSupply += _amount;
    }

    function withdraw(uint _amount, ICounterPartyRiskAttestation.craParams calldata _params) external updateReward(msg.sender) {
        require(_amount > 0, "amount = 0");

        // Start CRA Verification
        ICounterPartyRiskAttestation.CRA memory craMsg = ICounterPartyRiskAttestation.CRA({
            VASPAddress: address(this),
            originator: address(this),
            beneficiary: msg.sender,
            symbol: "WETH",
            amount: _amount,
            expireAt: _params.expireAt
        });
        cra.verifyCounterpartyRisk(craMsg, _params.signature);
        // End CRA Verification

        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        stakingToken.transfer(msg.sender, _amount);
    }

    function earned(address _account) public view returns (uint) {
        return
            ((balanceOf[_account] *
                (rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18) +
            rewards[_account];
    }

    function getReward(ICounterPartyRiskAttestation.craParams calldata _params) external updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        if (reward > 0) {

            // Start CRA Verification
            ICounterPartyRiskAttestation.CRA memory craMsg = ICounterPartyRiskAttestation.CRA({
                VASPAddress: address(this),
                originator: address(this),
                beneficiary: msg.sender,
                symbol: "MUSD",
                amount: reward,
                expireAt: _params.expireAt
            });
            cra.verifyCounterpartyRisk(craMsg, _params.signature);
            // End CRA Verification

            rewards[msg.sender] = 0;
            rewardsToken.transfer(msg.sender, reward);
        }
    }

    function setRewardsDuration(uint _duration) external onlyOwner {
        require(finishAt < block.timestamp, "reward duration not finished");
        duration = _duration;
    }

    function notifyRewardAmount(uint _amount)
        external
        onlyOwner
        updateReward(address(0))
    {
        if (block.timestamp >= finishAt) {
            rewardRate = _amount / duration;
        } else {
            uint remainingRewards = (finishAt - block.timestamp) * rewardRate;
            rewardRate = (_amount + remainingRewards) / duration;
        }

        require(rewardRate > 0, "reward rate = 0");
        require(
            rewardRate * duration <= rewardsToken.balanceOf(address(this)),
            "reward amount > balance"
        );

        finishAt = block.timestamp + duration;
        updatedAt = block.timestamp;
    }

    function _min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}