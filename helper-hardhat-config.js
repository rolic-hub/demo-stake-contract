const networkConfig = {
    default: {
        name: "hardhat",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.6",
    },
    31337: {
        name: "localhost",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.6",
    },
    4: {
        name: "rinkeby",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.6",
    },
}

const developmentChains = ["hardhat", "localhost"]
module.exports = {
    developmentChains,
    networkConfig,
}
