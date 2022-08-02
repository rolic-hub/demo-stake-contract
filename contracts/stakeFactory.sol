//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "./stake.sol";

error Stake__NoStaker();

contract StakeFactory {
    Stake[] public stakeAddrresses;
    uint256 private profit = 2 ether;
    uint256 public interval;

    constructor(uint256 _interval) payable {
        interval = _interval;
        (bool callSuccess, ) = address(this).call{value: msg.value}("");
        if (!callSuccess) {
            revert Stake__transferFailed();
        }
    }

    function createStake() public payable {
        Stake stakeContract = new Stake{value: profit}();
        stakeAddrresses.push(stakeContract);
    }

    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        uint256 _deadline = getDeadlinefromContract();
        uint256 waitTime = _deadline + interval;
        bool timePassed = (block.timestamp > waitTime);
        bool balance = (address(this).balance > profit);
        upkeepNeeded = (timePassed && balance);
        return (upkeepNeeded, "0x0"); // can we comment this out?
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        (bool upkeepNeeded, ) = checkUpkeep("");

        if (upkeepNeeded) {
            createStake();
        }
    }

    function getDeadlinefromContract() public view returns (uint256) {
        uint256 index = getNoofStakers();
        if (index <= 0) {
            revert Stake__NoStaker();
        }
        uint256 deadline = stakeAddrresses[index - 1].getDeadline();
        return deadline;
    }

    function getStakeAddresses(uint256 _index) public view returns (address) {
        return address(stakeAddrresses[_index]);
    }

    function getNoofStakers() public view returns (uint256) {
        return stakeAddrresses.length;
    }

    function showProfit() public view returns (uint256) {
        return profit;
    }
}
