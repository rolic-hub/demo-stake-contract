//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./stake.sol";
import "hardhat/console.sol";

error Stake__NoStaker();
error Stake__NotOwner();

contract StakeFactory {
    Stake[] public stakeAddresses;
    uint256 private profit = 0.22 ether;
    uint256 private immutable i_interval;
    address public /* immutable */ i_owner;
    uint256 private s_lastTimeStamp;

    event createdStake(address indexed stakeContract);

    constructor(uint256 _interval) payable {
        (bool callSuccess, ) = address(this).call{value: msg.value}("");
        if (!callSuccess) {
            revert Stake__transferFailed();
        }
         i_owner = msg.sender;
         i_interval = _interval;
         s_lastTimeStamp = block.timestamp;
    }

     modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert Stake__NotOwner();
        _;
    }

      modifier waitTimer {
      if ((block.timestamp - s_lastTimeStamp) < i_interval) {
            revert Stake__deadlineNotReached();
        }
        _;
    }

    function createStake() public payable waitTimer {
  
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

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    fallback() external payable {
        console.log("----- fallback:", msg.value);
    }

    receive() external payable {
        console.log("----- receive:", msg.value);
    }
}
