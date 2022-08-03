const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("StakeFactory Contract tests", () => {
          let deployer, tester, amountSent, stakeFactory, interval, deadline
          const chainId = network.config.chainId
          amountSent = ethers.utils.parseEther(networkConfig[chainId]["value"])

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              tester = accounts[1]
              await deployments.fixture(["all"])
              stakeFactory = await ethers.getContract("StakeFactory")
              await stakeFactory.connect(deployer.address)
              interval = await stakeFactory.getInterval()
              deadline = await stakeFactory.getDeadlinefromContract()
          })
          describe("constructor", () => {
              it("checks if contract was credited", async () => {
                  const balance = await ethers.provider.getBalance(stakeFactory.address)
                  const profit = await stakeFactory.showProfit()
                  const total = amountSent - profit
                  assert.equal(balance.toString(), total.toString())
              })
              it("checks if interval was set", async () => {
                  const intervalC = await stakeFactory.getInterval()
                  assert.equal(intervalC, networkConfig[chainId]["interval"])
              })
          })
          describe("should check deadline, profit, no. of stakers", () => {
              it("check the deadline ", async () => {
                  const deadlinec = await stakeFactory.getDeadlinefromContract()
                  assert.equal(deadlinec.toString(), deadline.toString())
              })
              it("checks the profit", async () => {
                  const profit = await stakeFactory.showProfit()
                  const profitH = ethers.utils.parseEther(networkConfig[chainId]["interestAmount"])
                  assert.equal(profit.toString(), profitH.toString())
              })
              it("checks the no. of stakers", async () => {
                  const stakers = await stakeFactory.getNoofStakers()
                  assert.equal(stakers.toString(), "1")
              })
          })
      })
