//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./stake.sol";

error Stake__NoStaker();

contract StakeFactory {
    Stake[] public stakeAddresses;
    uint256 private profit = 2 ether;
    uint256 private constant interval = 2 minutes;

    event createdStake(address stakeContract );

    constructor() payable {
        (bool callSuccess, ) = address(this).call{value: msg.value}("");
        if (!callSuccess) {
            revert Stake__transferFailed();
        }
    }

    function createStake() public payable {
        Stake stakeContract = new Stake{value: profit}();
        stakeAddresses.push(stakeContract);
         emit createdStake(address(stakeContract));
    }

    function getDeadlinefromContract() public view returns (uint256) {
        uint256 index = getNoofStakers();
        if (index <= 0) {
            revert Stake__NoStaker();
        }
        uint256 deadline = stakeAddresses[index - 1].getDeadline();
        return deadline;
    }

    function getStakeAddresses(uint256 _index) public view returns (address) {
        return address(stakeAddresses[_index]);
    }

    function getNoofStakers() public view returns (uint256) {
        return stakeAddresses.length;
    }

    function showProfit() public view returns (uint256) {
        return profit;
    }

    function getInterval() public pure returns (uint256) {
        return interval;
    }
}
