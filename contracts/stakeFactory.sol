//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "./stake.sol";

contract StakeFactory {
   Stake[] public stakeAddrresses;


   function createStake() public payable {
    Stake stakeContract = new Stake{value: msg.value}();
    stakeAddrresses.push(stakeContract);
   }

   function getStakeAddresses(uint256 _index) public view returns (address)  {
    return address(stakeAddrresses[_index]);

   }
   function getNoofStakers() public view returns (uint256) {
    return stakeAddrresses.length;
   }
}