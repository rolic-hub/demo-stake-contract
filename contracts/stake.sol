//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Stake {

    error Stake__closed();
    error Stake__sendMoreEth();
    error Stake__deadlineNotReached();
    error Stake__transferFailed();

    enum StakeState {
        CLOSE,
        OPEN,
        WINTEREST,
        WOINTEREST
    }

    uint256 private _interest;
    uint256 private immutable deadline = block.timestamp + 3 minutes;
    uint256 private constant threshold = 1 ether;
    StakeState public _stakeState;

    mapping ( address => uint256 ) public balances;
    address[] private stakers;

    event depositedEth(uint256 amount, address sender);

    constructor() payable { 
      (bool callSuccess, ) = payable(address(this)).call{value: msg.value}("");  
      if(!callSuccess){
        revert Stake__transferFailed();
      } 
      _interest = msg.value;

      _stakeState = StakeState.OPEN;
      
    }

    modifier waitTimer() {
        if(block.timestamp < deadline){
         revert Stake__deadlineNotReached();
        }
        _;
    }

    function deposit() public payable {
      if(_stakeState == StakeState.CLOSE){
        revert Stake__closed();
      }
       if(msg.value <= 0 ){
        revert Stake__sendMoreEth();
       }
       
     balances[tx.origin] += msg.value;
     stakers.push(tx.origin);
     emit depositedEth(msg.value, tx.origin);
    }

    function withdraw() public waitTimer {
      uint256 balanceStake = address(this).balance - _interest;
      if( balanceStake >= threshold){
        _stakeState = StakeState.WINTEREST;
        withdrawWInterest();
      }else{
        _stakeState = StakeState.WOINTEREST;
        withdrawWOinterest();
      }
      //_stakeState = StakeState.CLOSE;
    }

    function withdrawWOinterest() internal {
        if(_stakeState != StakeState.WOINTEREST){
          revert();
        }
        uint256 amount = balances[tx.origin];
       
      (bool callSuccess, ) = payable(tx.origin).call{value: amount}("");
       if(!callSuccess){
        revert Stake__transferFailed();
      } 
       balances[tx.origin] = 0;
     } 

     function withdrawWInterest() internal {
       if(_stakeState != StakeState.WINTEREST){
        revert();
       }
        uint256 amount = balances[tx.origin];
        uint256 total = address(this).balance - _interest;
        uint256 calculatedIn = calculateInterest(amount, total);
        balances[tx.origin] = 0;
        (bool callSuccess, ) = payable(tx.origin).call{value: calculatedIn}("");
       if(!callSuccess){
        revert Stake__transferFailed();
      } 
       

     }
     function calculateInterest(uint256 amount, uint256 total) internal view returns (uint256) {
        uint256 calculate = (amount / total) * _interest;
        uint256 totalAmount = amount + calculate;
        return totalAmount;
     }


     function amountDeposited () public view returns (uint256) {
         return  address(this).balance;
     }

     function getThreshold() public pure returns (uint256) {
      return threshold;
     }

     function getStaker(uint256 _index) public view returns (address){
      return stakers[_index];
     }

     function getStakelength() public view returns (uint) {
      return stakers.length;
     }

     function getInterest() public view returns (uint256){
      return _interest;
     }

     function getDeadline() public view returns (uint256) {
      return deadline;
     }

     receive() external payable {
      deposit();   
     }


}