const { network, getNamedAccounts, deployments } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
   

     

    log("----------------------------------------------------------------------------")

    const stakefactory = await deploy("StakeFactory", {
        from: deployer,
        args: [],
        log: true,
    })

    log("----------------------------------deployed stake Factory ---------------------------")

     if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
         log("Verifying...")
         await verify(stakefactory.address, [])
     }

}
module.exports.tags = ["all", "stakeFactory"]
