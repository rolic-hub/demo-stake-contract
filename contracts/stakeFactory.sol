//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./stake.sol";
import "hardhat/console.sol";

error Stake__NoStaker();
error Stake__NotOwner();

contract StakeFactory {
    Stake[] public stakeAddresses;
    uint256 private profit = 0.22 ether;
    uint256 private constant interval = 2 minutes;
    address public /* immutable */ i_owner;

    event createdStake(address indexed stakeContract);

    constructor() payable {
        (bool callSuccess, ) = address(this).call{value: msg.value}("");
        if (!callSuccess) {
            revert Stake__transferFailed();
        }
         i_owner = msg.sender;
    }

     modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert Stake__NotOwner();
        _;
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

    function withdraw(uint256 _amount) payable public onlyOwner {
      (bool callSuccess, ) = payable(msg.sender).call{value: _amount}("");
       if (!callSuccess) {
            revert Stake__transferFailed();
        }
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

    fallback() external payable {
        console.log("----- fallback:", msg.value);
    }

    receive() external payable {
        console.log("----- receive:", msg.value);
    }
}
