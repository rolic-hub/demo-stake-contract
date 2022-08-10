const fs = require("fs")
const { networkConfig, abiLocation } = require("../helper-hardhat-config")
const { ethers, network } = require("hardhat")
const { fetchJson } = require("ethers/lib/utils")
//const {abi} = require("../utils/linkAbi.json")

const chainId = network.config.chainId
const linkAddress = networkConfig[chainId]["ERC677_LINK_ADDRESS"]

module.exports = async function linkAbi() {
    if (process.env.LINKABI) {
        console.log(".........Link Abi..............")
        await abiUpdate()
        console.log(".........Abi Updated............")
    }
}

async function abiUpdate() {
    const response = await fetchJson(
        `https://api.etherscan.io/api?module=contract&action=getabi&address=${linkAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
    )
    const abi = response.result

    const options = {
        encoding: "utf8",
        mode: 0o666,
        flag: "w",
    }

    fs.writeFileSync(abiLocation, abi, options, (error) => {
        console.log(error)
    })
}

module.exports.tags = ["abiUpdate"]
