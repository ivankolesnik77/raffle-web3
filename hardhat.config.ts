
require("@nomiclabs/hardhat-waffle")
require("@nomicfoundation/hardhat-verify")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const SEPOLIA_RPC_URL = process.env.RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

const config = {
      solidity: "0.8.8",
      defaultNetwork: "hardhat",
      networks: {
            sepolia: {
                  url: SEPOLIA_RPC_URL!,
                  accounts: [PRIVATE_KEY!],
                  chainId: 11155111,
            },
      },
      typechain: {
            outDir: "src/types",
            target: "ethers-v6",
            alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
            externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
            dontOverrideCompile: false,
      },

      etherscan: {
            apiKey: process.env.ETHERSCAN_API_KEY,
            customChains: [],
        },
      gasReporter: {
            currency: "USD",
            enabled: true,
            noColors: true,
            gasPriceApi: `https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apiKey=${process.env.ETHERSCAN_API_KEY}`,
            outputFile: "gas-reporter.txt",
            coinmarketcap: COINMARKETCAP_API_KEY,
            token: "MATIC",
      },
      namedAccounts: {
            deployer: {
                  default: 0,
            },
            users: {
                  default: 1,
            },
      },
      mocha: {
            timeout: 200000
      }
}

export default config
