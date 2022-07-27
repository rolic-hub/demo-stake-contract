const networkConfig = {
    default: {
        name: "hardhat",
        interestAmount: "10000000000000000000",
    },
    31337: {
        name: "localhost",
        interestAmount: "10000000000000000000",
    },
    4: {
        name: "rinkeby",
        interestAmount: "10000000000000000",
    },
}

const developmentChains = ["hardhat","localhost"]
module.exports = {
    developmentChains,
    networkConfig,
}
