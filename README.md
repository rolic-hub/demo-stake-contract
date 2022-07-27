# Sample Hardhat Project

## What our smart contract does
0. the constructor accepts an interest total amount
1. be able to recieve eth 
2. have a deadline for sending eth
3. have a threshold 
4. if the threshold has not been met when the deadline is reached open for withdrawal
5. if the balance in the contract is greater than or equal to the threshold amount the total is added to the interest total amount and after some calculations interest is added to each users account and they can withdraw



This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
