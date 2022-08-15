//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


error Stake__closed();
error Stake__sendMoreEth();
error Stake__deadlineNotReached();
error Stake__transferFailed();

/**@title A sample Stake Contract
 * @author Heeze
 * @notice This contract is for creating a stake contract
 * @dev This contract uses the Chainlink Keepers to automate functions
 */

contract Stake {
    /* Type declarations */
    enum StakeState {
        CLOSE,
        OPEN,
        WINTEREST,
        WOINTEREST
    }

    using SafeMath for uint256;

    /* State variables */

    uint256 private _interest;
    uint256 private _contractBalance = address(this).balance;
    uint256 private immutable deadline = 2 hours;
    uint256 private constant threshold = 1.5 ether;
    uint256 private s_lastTimeStamp;
    uint256 private immutable fee = 0.02 ether;
    StakeState public _stakeState;

    address private to;
    

    mapping(address => uint256) private balances;
    address[] private stakers;

    /* Events */
    event depositedEth(uint256 amount, address sender);

    /* Modifiers */
    modifier closeStake() {
        bool timePassed = (block.timestamp.sub(s_lastTimeStamp)) > deadline;
        bool balanceC = (address(this).balance > 0);
        if (timePassed && balanceC) {
            _stakeState = StakeState.CLOSE;
        }
        _;
    }

    modifier waitTimer() {
        if (block.timestamp.sub(s_lastTimeStamp) < deadline) {
            revert Stake__deadlineNotReached();
        }
        _;
    }

    /* Functions */
    constructor(address _to ) payable {
        (bool callSuccess, ) = payable(address(this)).call{value: msg.value}("");
        if (!callSuccess) {
            revert Stake__transferFailed();
        }
        _interest = msg.value;
        _stakeState = StakeState.OPEN;
        s_lastTimeStamp = block.timestamp;
        to = _to;
       
    }

    function deposit() public payable closeStake {
        if (_stakeState == StakeState.CLOSE) {
            revert Stake__closed();
        }
        if (msg.value <= fee) {
            revert Stake__sendMoreEth();
        }
        
        uint256 amount = msg.value - fee;
        (bool callSuccess, ) = payable(to).call{value: fee}("");
        if (!callSuccess) {
            revert Stake__transferFailed();
        }
        balances[msg.sender] += amount;
        stakers.push(msg.sender);
        emit depositedEth(amount, msg.sender);
    }

    // main withdaw function which decides if the user makes a profit or not
    // it sets the state of the contract

    function withdraw() public waitTimer {
        uint256 stakeT = address(this).balance.sub(_interest);
        
        if (stakeT >= threshold) {
            _stakeState = StakeState.WINTEREST;
            withdrawWInterest();
        } else {
            _stakeState = StakeState.WOINTEREST;
            withdrawWOinterest();
        }
        _stakeState = StakeState.CLOSE;
    }

    // withdraw without interest is called when the amount deposited
    // is less than the threshold set
    // when called it sends back the eth that was initially deposited

    function withdrawWOinterest() internal {
        if (_stakeState != StakeState.WOINTEREST) {
            revert();
        }
        uint256 amount = balances[msg.sender];
        balances[tx.origin] = 0;
        (bool callSuccess, ) = payable(tx.origin).call{value: amount}("");
        if (!callSuccess) {
            revert Stake__transferFailed();
        }
    }

    /* withdraw with interest is called when the amount
     deposited is greater than the threshold set
     when called it sends token deposited plus a calculated profit 
     */

    function withdrawWInterest() internal {
        if (_stakeState != StakeState.WINTEREST) {
            revert();
        }
        uint256 amount = balances[msg.sender];
        uint256 _totalStake = getAmountStaked();
        uint256 calculatedIn = calculateInterest(amount, _totalStake);
        balances[tx.origin] = 0;
        (bool callSuccess, ) = payable(tx.origin).call{value: calculatedIn}("");
        if (!callSuccess) {
            revert Stake__transferFailed();
        }
    }

    function calculateInterest(uint256 _amount, uint256 _total) internal view returns (uint256) {
        uint256 calculate = (_amount.div(_total)).mul(_interest);
        uint256 totalAmount = _amount.add(calculate);
        return totalAmount;
    }

    /** Getter Functions */

    function amountDeposited() public view returns (uint256) {
        return address(this).balance; 
    }

    function getAmountStaked() public view returns (uint256) {
     uint256 _amountDeposited = amountDeposited();
     uint256 _interestA = getInterest();
     uint256 totalStaked = _amountDeposited.sub(_interestA);
     return totalStaked;
    }

    function getThreshold() public pure returns (uint256) {
        return threshold;
    }

    function getStaker(uint256 _index) public view returns (address) {
        return stakers[_index];
    }

    function getStakersBalance(address _staker) public view returns (uint256) {
       return balances[_staker];
    }

    function getStakelength() public view returns (uint256) {
        return stakers.length;
    }

    function getInterest() public view returns (uint256) {
        return _interest;
    }

    function getDeadline() public pure returns (uint256) {
        return deadline;
    }

    function getFee() public pure returns (uint256) {
        return fee;
    }

    receive() external payable {
        deposit();
    }
}
