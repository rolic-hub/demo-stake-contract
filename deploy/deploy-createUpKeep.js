const { network, getNamedAccounts, deployments } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
//const { ethers } = require("ethers")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const ERC677_LINK_ADDRESS = networkConfig[chainId]["ERC677_LINK_ADDRESS"]
    const REGISTRY_ADDRESS = networkConfig[chainId]["REGISTRY_ADDRESS"]
    let arguments = [ERC677_LINK_ADDRESS, REGISTRY_ADDRESS]
    //const msgvalue = ethers.utils.parseEther(networkConfig[chainId]["value"])


    log("--------------------------------------------------------------------------------------------------------")

    const upKeepContract = await deploy("UpkeepCreator", {
        from: deployer,
        args: arguments,
        log: true,
    })

     log("--------------------------------------deployed ukpeep creator------------------------------------------------")


    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(upKeepContract.address, [])
    }
}
module.exports.tags = ["all", "upKeepContract"]