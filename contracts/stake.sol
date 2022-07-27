//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Stake {

    error Stake__NotOpenForWithdrawal();
    error Stake__sendMoreEth();
    error Stake__deadlineNotReached();
    error Stake__transferFailed();

    enum StakeState {
        CLOSE,
        OPEN,
        WINTEREST,
        WOINTEREST
    }

    
    uint256 public immutable deadline = block.timestamp + 3 minutes;
    uint256 private constant threshold = 1 ether;
    StakeState public _stakeState;

    mapping ( address => uint256 ) public balances;
    address[] stakers;

    constructor() payable { 
        
      (bool callSuccess, ) = payable(address(this)).call{value: msg.value}("");  
      if(!callSuccess){
        revert Stake__transferFailed();
      } 
      _stakeState = StakeState.OPEN;
      
    }

    modifier waitTimer() {
        if(block.timestamp < deadline){
         revert Stake__deadlineNotReached();
        }
        _;
    }

    function deposit() public payable {
       if(msg.value <= 0 ){
        revert Stake__sendMoreEth();
       }
       
     balances[msg.sender] += msg.value;
     stakers.push(msg.sender);
    }

    function withdrawWOinterest() public payable waitTimer {
        _stakeState = StakeState.WOINTEREST;
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
      (bool callSuccess, ) = address(this).call{value: amount}("");
       if(!callSuccess){
        revert Stake__transferFailed();
      } 
     } 

     function amountDeposited () public view returns (uint256) {
         return  address(this).balance;
     }

     function getThreshold() public pure returns (uint256) {
      return threshold;
     }


}