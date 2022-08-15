const { ethers, deployments } = require("hardhat")

const main = async () => {
    await deployments.fixture(["all"])
    const stakeF = await ethers.getContract("StakeFactory")
    const createS = await stakeF.createStake()
    const tx = await createS.wait(1)
    const txReciept = tx.events[0].args.stakeContract
    console.log(txReciept)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
