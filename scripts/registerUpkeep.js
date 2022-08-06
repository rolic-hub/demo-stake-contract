const { ethers, network, deployments } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

async function registerUpkeep() {
    console.log("--------------------registering upkeep ----------------")
    await deployments.fixture(["all"])
    const stakeFactory = await ethers.getContract("StakeFactory")
    const createStake = await stakeFactory.createStake()
    const txReceipt = await createStake.wait(1)
    const stakeAddress = txReceipt.events[0].args.stakeContract
    console.log(`created stake at stake Address: ${stakeAddress}`)
    const chainId = network.config.chainId
    await createUpKeep(stakeAddress, "stake", networkConfig[chainId]["CheckGasLimit"])
}

async function createUpKeep(contratAddressToAutomate, upkeepName, gasLimit) {
    const upKeepContract = await ethers.getContract("UpkeepCreator")
    const createUpKeep = await upKeepContract.createUpkeep(
        contratAddressToAutomate,
        upkeepName,
        gasLimit
    )
    await createUpKeep.wait(1)
    console.log("upkeep registered sucessfully")
}

registerUpkeep()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
