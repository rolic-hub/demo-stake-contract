const networkConfig = {
    default: {
        name: "localhost",
        interestAmount: "0.22",
        threshold: "1.5",
        amountSent: "0.6",
        interval: "300",
        value: "5",
        
    },
    31337: {
        name: "hardhat",
        interestAmount: "0.22",
        threshold: "1.5",
        amountSent: "0.6",
        interval: "300",
        value: "5",
       
    },
    4: {
        name: "rinkeby",
        interestAmount: "0.22",
        threshold: "1.5",
        amountSent: "0.2",
        interval: "300",
        value: "0.4",
        
    },
    5: {
        name: "goerli",
        interestAmount: "0.22",
        threshold: "1.5",
        amountSent: "0.2",
        interval: "300",
        value: "0.4",
       
    }
}


const developmentChains = ["hardhat", "localhost"]
module.exports = {
    developmentChains,
    networkConfig,
    
}
