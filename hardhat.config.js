require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")
require("solidity-coverage")
require("hardhat-contract-sizer")
require("dotenv").config()

const REPORT_GAS = process.env.GAS_REPORTER
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const RINKEBY_RPC_URL = process.env.RINKEBY_ALCHEMY_API_URL
const POLYGON_RPC_URL = process.env.POLYGON_ALCHEMY_API_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.9",
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        player: {
            default: 1,
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            // // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // }
            chainId: 31337,
            // saveDeployments: true,
        },
        localhost: {
            chainId: 31337,
            // saveDeployments: true,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            saveDeployments: true,
            chainId: 4,
        },
        polygon: {
            url: POLYGON_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            saveDeployments: true,
            chainId: 80001,
        },
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY,
           // polygon: POLYGONSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: REPORT_GAS,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    contractSizer: {
        runOnCompile: false,
        only: ["stake"],
    },
    mocha: {
        timeout: 500000, // 500 seconds max for running tests
    },
}
