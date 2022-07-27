const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Stake Contract tests", () => {
          let stakeContract, deployer, tester, deadline, thresholdc, stakeFactory
          const chainId = network.config.chainId

          const amount = networkConfig[chainId]["interestAmount"]

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              tester = accounts[1]

              await deployments.fixture(["all"])
              stakeFactory = await ethers.getContract("StakeFactory")

              await stakeFactory.createStake({ value: amount })
              const stakeaddress = await stakeFactory.stakeAddrresses(0)
              stakeContract = await ethers.getContractAt("Stake", stakeaddress, deployer)
              thresholdc = await stakeContract.getThreshold()
              deadline = await stakeContract.deadline()
          })

          describe("constructor", () => {
              it("should check if interest was sent ", async () => {
                  const balance = await ethers.provider.getBalance(stakeContract.address)
                  assert.equal(balance, amount)
              })
              it("should check if stakeState is open", async() => {
                const stakeState = (await stakeContract._stakeState()).toString()
                assert.equal(stakeState, "1")
              })
          })
      })
