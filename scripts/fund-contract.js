const { ethers,  getNamedAccounts, deployments } = require("hardhat")

async function fundContract() {
    console.log("funding contract address")
     await deployments.fixture(["all"])
    const { deployer } = await getNamedAccounts()
    const stakeFactory = await ethers.getContract("StakeFactory")
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/", 31337)
    const signer = provider.getSigner()
    const tx = signer.sendTransaction({
        from: signer[0],
        to: stakeFactory.address,
        value: ethers.utils.parseEther("4.0"),
    })
    const txReciept = await (await tx).wait(1)
    console.log(`funding sucessfull `)
    
}

fundContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
