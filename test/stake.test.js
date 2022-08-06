const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Stake Contract tests", () => {
          let stakeContract, deployer, tester, deadline, thresholdc, stakeFactory
          const chainId = network.config.chainId
          const _amount = networkConfig[chainId]["interestAmount"]
          const interestAmount = ethers.utils.parseEther(_amount)
          const depamount = ethers.utils.parseEther(networkConfig[chainId]["amountSent"])

          beforeEach(async () => {
              [deployer, tester, addr2] = await ethers.getSigners()
              await deployments.fixture(["all"])
              stakeFactory = await ethers.getContract("StakeFactory")
              await stakeFactory.connect(deployer)
              await stakeFactory.createStake()
              const stakeaddress = await stakeFactory.stakeAddresses(0)
              stakeContract = await ethers.getContractAt("Stake", stakeaddress, deployer)
              thresholdc = await stakeContract.getThreshold()
              deadline = await stakeContract.getDeadline()
          })

          describe("constructor", () => {
              it("should check if interest was sent ", async () => {
                  const balance = await ethers.provider.getBalance(stakeContract.address)
                  const totalA = await stakeContract.amountDeposited()
                  assert.equal(balance.toString(), interestAmount.toString(), totalA.toString())
              })
              it("should check if stakeState is open", async () => {
                  const stakeState = (await stakeContract._stakeState()).toString()
                  assert.equal(stakeState, "1")
              })
          })
          describe("deposit function", () => {
              beforeEach(async () => {
                  await stakeContract.deposit({ value: depamount })
              })
              it("should check if a deposit was made", async () => {
                  const total = parseInt(interestAmount) + parseInt(depamount)
                  const balance = await ethers.provider.getBalance(stakeContract.address)
                  assert.equal(balance.toString(), total.toString())
              })
              it("should check if the mapping was updated", async () => {
                  const mapBalance = await stakeContract.balances(deployer.address)
                  assert.equal(mapBalance.toString(), depamount.toString())
              })
              it("should check that our array was updated", async () => {
                  const arrayLength = await stakeContract.getStakelength()
                  assert.equal(arrayLength.toString(), "1")
              })
              it("should check if staker is correct", async () => {
                  const addressC = await stakeContract.getStaker(0)
                  assert.equal(addressC, deployer.address)
              })
          })
          describe("interest, threshold, deadline", () => {
              it("should check how much interest was sent", async () => {
                  const interest = await stakeContract.getInterest()
                  assert.equal(interest.toString(), interestAmount)
              })
              it("should check if threshold was set", async () => {
                  const _threshold = ethers.utils.parseEther(networkConfig[chainId]["threshold"])
                  assert.equal(thresholdc.toString(), _threshold.toString())
              })
          })
          describe("withdraw function", () => {
              beforeEach(async () => {
                  await stakeContract.deposit({ value: depamount })
                  await network.provider.send("evm_increaseTime", [deadline.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  await stakeContract.withdraw()
              })
              it("should check the withdraw state", async () => {
                  const stakeState = (await stakeContract._stakeState()).toString()
                  assert.equal(stakeState, "0")
              })
              it("the balance of the contract", async () => {
                  const balance = await stakeContract.amountDeposited()
                  assert.equal(balance.toString(), interestAmount.toString())
              })
              it("should be reverted because stake is closed", async () => {
                  await expect(stakeContract.deposit({ value: depamount })).to.be.reverted
              })
          })
          describe("perform upkeep function", () => {
              it("should be reverted because upkeep not needed ", async () => {
                  await stakeContract.deposit({ value: depamount })
                  await network.provider.send("evm_increaseTime", [deadline.toNumber() - 5])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  await expect(stakeContract.performUpkeep([])).to.be.reverted
              })
              it("should be reverted because stake is closed", async () => {
                  await stakeContract.deposit({ value: depamount })
                  await network.provider.send("evm_increaseTime", [deadline.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  await stakeContract.performUpkeep([])
                  await expect(stakeContract.deposit({ value: depamount })).to.be.reverted
              })
              it("should revert because stake deadline not reached", async () => {
                  await stakeContract.deposit({ value: depamount })
                  await expect(stakeContract.withdraw()).to.be.reverted
              })
          })
          describe("check Upkeep function", () => {
              it("should return false ", async () => {
                  await stakeContract.deposit({ value: depamount })
                  await network.provider.send("evm_increaseTime", [deadline.toNumber() - 5])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await stakeContract.callStatic.checkUpkeep("0x")
                  assert(upkeepNeeded == false)
              })
              it("should return true", async () => {
                  await stakeContract.deposit({ value: depamount })
                  await network.provider.send("evm_increaseTime", [deadline.toNumber() + 5])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await stakeContract.callStatic.checkUpkeep("0x")
                  assert(upkeepNeeded == true)
              })
          })
          describe("second staker test", () => {
              beforeEach(async () => {
                  await stakeFactory.connect(tester)
                  const stakeaddress = await stakeFactory.stakeAddresses(0)
                  stakeContract = await ethers.getContractAt("Stake", stakeaddress, tester)
              })
              it("should emit deposited eth event", async () => {
                  await expect(stakeContract.deposit({ value: depamount }))
                      .to.emit(stakeContract, "depositedEth")
                      .withArgs(depamount, tester.address)
              })
              it("should check that our array was updated", async () => {
                  await stakeContract.deposit({ value: depamount })
                  const arrayLength = await stakeContract.getStakelength()
                  assert.equal(arrayLength.toString(), "1")
              })
              it("should check if the mapping was updated", async () => {
                  await stakeContract.deposit({ value: depamount })
                  const mapBalance = await stakeContract.balances(tester.address)
                  assert.equal(mapBalance.toString(), depamount.toString())
              })
          })
      })
