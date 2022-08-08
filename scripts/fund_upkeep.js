const { ethers } = require("hardhat")
const {BigNumber} = require('ethers')
//const Abi = require("../constants/linkAbi.json")
const { fetchJson } = require("ethers/lib/utils")
const { networkConfig, impersonate } = require("../helper-hardhat-config")
const { network } = require("hardhat")

const chainId = network.config.chainId
const linkAddress = networkConfig[chainId]["LINK_TOKEN_ADDRESS"]
const impersonateAccount = impersonate

async function getAbi() {
    const response = await fetchJson(
        `https://api.etherscan.io/api?module=contract&action=getabi&address=${linkAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
    )
    const abi = response.result
    return abi
}

async function fundUpkeep() {
    console.log(".........fund upkeep running")
    const Abi = await getAbi()

    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [impersonateAccount],
    })
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/", 31337)
    const signer = provider.getSigner(impersonateAccount)

    const linkContract = new ethers.Contract(linkAddress, Abi, signer)
    const balance = await linkContract.balanceOf(impersonateAccount)
    //console.log(ethers.utils.formatUnits(balance, 8))
    const createUpkeep = await ethers.getContract("UpkeepCreator")
    const contractAddress = createUpkeep.address
    const value = 5000000000
    // const amount = 5000000000;
    // const value = ethers.utils.formatUnits(amount.toString(), 8)

    await linkContract.transfer(contractAddress, value)
    const contractBalance = await linkContract.balanceOf(contractAddress)
    console.log(contractBalance.toString())
    console.log("..........funded createUpkeep contract...........")
}   

fundUpkeep()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
