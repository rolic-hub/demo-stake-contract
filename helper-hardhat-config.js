const networkConfig = {
    default: {
        name: "localhost",
        interestAmount: "0.22",
        threshold: "1",
        amountSent: "0.6",
        interval: "3600",
        value: "5",
    },
    31337: {
        name: "hardhat",
        interestAmount: "0.22",
        threshold: "1",
        amountSent: "0.6",
        interval: "3600",
        value: "5",
    },
    4: {
        name: "rinkeby",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.2",
        interval: "3600",
        value: "0.4",
        PriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    5: {
        name: "goerli",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.2",
        interval: "3600",
        value: "0.4",
        PriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    80001: {
        name: "polygon mumbai",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.2",
        interval: "3600",
        value: "0.4",
        PriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    }
}

const developmentChains = ["hardhat", "localhost"]
module.exports = {
    developmentChains,
    networkConfig,
}
