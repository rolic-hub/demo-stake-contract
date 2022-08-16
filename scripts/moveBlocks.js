const { network } = require("hardhat")
const moveBlocks = async () => {
    const amount = 10800
    await network.provider.send("evm_increaseTime", [amount])
    await network.provider.request({ method: "evm_mine", params: [] })
}

moveBlocks()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
