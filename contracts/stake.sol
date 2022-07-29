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

    using SafeMath for uint;

    uint256 private _interest;
    uint256 private _contractBalance = address(this).balance;
    uint256 private immutable deadline = block.timestamp.add(3 minutes);
    uint256 private constant threshold = 1 ether;
    StakeState public _stakeState;
    uint256 private _totalStake = _contractBalance.sub(_interest);

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
     // main withdaw function which decides if the user makes a profit or not
     // it sets the state of the current
    function withdraw() public waitTimer {
      uint256 stakeT = address(this).balance - _interest;
      if( stakeT >= threshold){
        _stakeState = StakeState.WINTEREST;
        withdrawWInterest();
      }else{
        _stakeState = StakeState.WOINTEREST;
        withdrawWOinterest();
      }
      if( address(this).balance <= 0){
        _stakeState = StakeState.CLOSE;
      }
      
    }

    // withdraw without interest is called when the amount deposited
    // is less than the threshold set 
    // when called it sends back the eth that was initially deposited

    function withdrawWOinterest() internal {
        if(_stakeState != StakeState.WOINTEREST){
          revert();
        }
        uint256 amount = balances[tx.origin];
       balances[tx.origin] = 0;
      (bool callSuccess, ) = payable(tx.origin).call{value: amount}("");
       if(!callSuccess){
        revert Stake__transferFailed();
      }  
     } 

     // withdraw with interest is called when the amount
     // deposited is greater than the threshold set
     // when called it sends token deposited plus a calculated profit 

     function withdrawWInterest() internal {
       if(_stakeState != StakeState.WINTEREST){
        revert();
       }
        uint256 amount = balances[tx.origin];
        uint256 calculatedIn = calculateInterest(amount, _totalStake);
        balances[tx.origin] = 0;
        (bool callSuccess, ) = payable(tx.origin).call{value: calculatedIn}("");
       if(!callSuccess){
        revert Stake__transferFailed();
      } 
       

     }
     function calculateInterest(uint256 _amount, uint256 _total) internal view returns (uint256) {
        uint256 calculate = (_amount.div(_total)).mul(_interest);
        uint256 totalAmount = _amount + calculate;
        return totalAmount;
     }


     function amountDeposited() public view returns (uint256) {
         return address(this).balance;
     }

     function getAmountStaked() public view returns (uint256){
       return _totalStake;
     }

     function getThreshold() public pure returns (uint256) {
      return threshold;
     }

     function getStaker(uint256 _index) public view returns (address){
      return stakers[_index];
     }

     function getStakelength() public view returns (uint256) {
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