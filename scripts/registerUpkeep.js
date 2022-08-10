const { ethers, network, deployments, getNamedAccounts } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

async function registerUpkeep() {
    console.log("--------------------registering upkeep ----------------")
    //await deployments.fixture(["all"])
    const { deployer } = await getNamedAccounts()
    const stakeFactory = await ethers.getContract("StakeFactory")
    //await stakeFactory.connect(deployer)
    const createStake = await stakeFactory.createStake()
    const txReceipt = await createStake.wait()
    const stakeAddress = txReceipt.events[0].args.stakeContract
    console.log(`created stake at stake Address: ${stakeAddress}`)
    const chainId = network.config.chainId
    await createUpKeep(stakeAddress, "stake", 9000000)

    // stakeFactory.on("createdStake", async (stakeContract, event) => {
    //     console.log(`created stake at stake Address: ${stakeContract}`)
    //     const chainId = network.config.chainId
    //     await createUpKeep(stakeContract, "stake", networkConfig[chainId]["CheckGasLimit"])
    //     console.log(event)
    // })
    // await stakeFactory.createStake();
}

async function createUpKeep(contratAddressToAutomate, upkeepName, gasLim) {
    const upKeepContract = await ethers.getContract("UpkeepIDConsumerExample")
    const createUpKeep = await upKeepContract.registerAndPredictID(
        upkeepName,
        "0x",
        contratAddressToAutomate,
        gasLim,
        "0x9353CdB9598937A9a9DD1D792A4D822EE8415E8D",
        "0x",
        ethers.utils.parseEther("5"),
        0,
        contratAddressToAutomate, {
            gasLimit: 1800000
        }
    )
    const tx = await createUpKeep.wait()
    const txEvent = tx.events[0].args.UpkeepID
    console.log(`registered upkeep with upkeepId:${txEvent}`)

    console.log("upkeep registered sucessfully")
}

registerUpkeep()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
