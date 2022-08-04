const networkConfig = {
    default: {
        name: "hardhat",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.6",
        interval: "120",
        value: "5",
        ERC677_LINK_ADDRESS: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        REGISTRY_ADDRESS: "0x4Cb093f226983713164A62138C3F718A5b595F73",
        CheckGasLimit: "6500000",
    },
    31337: {
        name: "localhost",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.6",
        interval: "120",
        value: "5",
        ERC677_LINK_ADDRESS: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        REGISTRY_ADDRESS: "0x4Cb093f226983713164A62138C3F718A5b595F73",
        CheckGasLimit: "6500000",
    },
    4: {
        name: "rinkeby",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.6",
        interval: "3600",
    },
}

const developmentChains = ["hardhat", "localhost"]
module.exports = {
    developmentChains,
    networkConfig,
}
