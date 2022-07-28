const networkConfig = {
    default: {
        name: "hardhat",
        interestAmount: "10",
        threshold: "1",
        amountSent: "0.6",
    },
    31337: {
        name: "localhost",
        interestAmount: "10",
        threshold: "1",
        amountSent: "0.6",
    },
    4: {
        name: "rinkeby",
        interestAmount: "10",
        threshold: "1",
        amountSent: "0.6",
    },
}

const developmentChains = ["hardhat","localhost"]
module.exports = {
    developmentChains,
    networkConfig,
}
