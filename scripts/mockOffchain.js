const { ethers, network } = require("hardhat")
// script incorrect 
async function mockKeepers() {
    const stake = await ethers.getContract("Stake")
    const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
    const { upkeepNeeded } = await stake.callStatic.checkUpkeep(checkData)
    if (upkeepNeeded) {
        const tx = await stake.performUpkeep(checkData)
        await tx.wait(1)
    } else {
        console.log("No upkeep needed!")
    }
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
