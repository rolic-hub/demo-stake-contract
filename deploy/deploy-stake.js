const { network, getNamedAccounts, deployments } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const {ethers} = require("ethers")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let arguments = [networkConfig[chainId]["interval"]]
    const msgvalue = ethers.utils.parseEther(networkConfig[chainId]["value"])

    log("----------------------------------------------------------------------------")

    const stakefactory = await deploy("StakeFactory", {
        from: deployer,
        args: [],
        log: true,
        value: msgvalue
        //gasLimit: 8000000
    })

    log("----------------------------------deployed stake Factory ---------------------------")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(stakefactory.address, [])
    }
}
module.exports.tags = ["all", "stakeFactory"]
