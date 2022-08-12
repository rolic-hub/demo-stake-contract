const networkConfig = {
    default: {
        name: "localhost",
        interestAmount: "0.22",
        threshold: "1",
        amountSent: "0.6",
        interval: "3600",
        value: "5",
        REGISTRAR_ADDRESS:"0xDb8e8e2ccb5C033938736aa89Fe4fa1eDfD15a1d",
        ERC677_LINK_ADDRESS: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        REGISTRY_ADDRESS: "0x02777053d6764996e594c3E88AF1D58D5363a2e6",
        CheckGasLimit: "6500000",
        //LINK_TOKEN_ADDRESS: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    31337: {
        name: "hardhat",
        interestAmount: "0.22",
        threshold: "1",
        amountSent: "0.6",
        interval: "3600",
        value: "5",
        REGISTRAR_ADDRESS:"0xDb8e8e2ccb5C033938736aa89Fe4fa1eDfD15a1d",
        ERC677_LINK_ADDRESS: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        REGISTRY_ADDRESS: "0x02777053d6764996e594c3E88AF1D58D5363a2e6",
        CheckGasLimit: "6500000",
        //LINK_TOKEN_ADDRESS: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    4: {
        name: "rinkeby",
        interestAmount: "2",
        threshold: "1",
        amountSent: "0.2",
        interval: "3600",
        value: "0.4",
        REGISTRAR_ADDRESS:"0xDb8e8e2ccb5C033938736aa89Fe4fa1eDfD15a1d",
        REGISTRY_ADDRESS: "0x02777053d6764996e594c3E88AF1D58D5363a2e6",
        ERC677_LINK_ADDRESS: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
        CheckGasLimit: "9900000",
    },
}

const abiLocation = "/Users/ezehope/Documents/Javis/code/demo-stake-contract/utils/linkAbi.json"
const impersonate = "0x0D4f1ff895D12c34994D6B65FaBBeEFDc1a9fb39"

const developmentChains = ["hardhat", "localhost"]
module.exports = {
    developmentChains,
    networkConfig,
    abiLocation,
    impersonate,
}
