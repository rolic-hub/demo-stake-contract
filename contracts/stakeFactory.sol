//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "./stake.sol";

contract StakeFactory {
   Stake[] public stakeAddrresses;
   uint256 private constant profit = 2 ether;
   uint256 public  interval;
    uint256 private _deadline = getDeadlinefromContract();
    uint256 private waitTime = _deadline + interval;

   constructor(uint256 _interval) {
    interval = _interval;
   }
     //function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
   function checkUpkeep(
        bytes calldata /* checkData */ ) external view 
        returns (
            bool upkeepNeeded, bytes memory /* performData */ ) {
               
        bool timePassed = (block.timestamp > waitTime);
        upkeepNeeded = (timePassed);
        return (upkeepNeeded, "0x0"); // can we comment this out?
    }
    
    function performUpkeep(bytes calldata /* performData */) external {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if(block.timestamp > waitTime) {
         createStake();
        }     
    }

   function createStake() public payable {
    Stake stakeContract = new Stake{value: profit}();
    stakeAddrresses.push(stakeContract);
   }

   function getStakeAddresses(uint256 _index) public view returns (address)  {
    return address(stakeAddrresses[_index]);

   }
   function getNoofStakers() public view returns (uint256) {
    return stakeAddrresses.length;
   }

   function getDeadlinefromContract() public view returns (uint256) {
      uint256 index = getNoofStakers();
      uint256 deadline = stakeAddrresses[index - 1].getDeadline();
      return deadline;
   }
}