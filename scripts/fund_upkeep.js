const { ethers, deployments } = require("hardhat")
const fs = require("fs")

//const Abi = require("../constants/linkAbi.json")
const { fetchJson } = require("ethers/lib/utils")
const { networkConfig, impersonate, abiLocation } = require("../helper-hardhat-config")
const { network } = require("hardhat")

const chainId = network.config.chainId
const linkAddress = networkConfig[chainId]["ERC677_LINK_ADDRESS"]
const impersonateAccount = impersonate

async function getAbi() {
    const abidata = fs.readFileSync(abiLocation, "utf8")
    return abidata
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
    await deployments.fixture(["all"])
    const createUpkeep = await ethers.getContract("UpkeepCreator")
    const contractAddress = createUpkeep.address
    const value = 5000000000

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
