const { subscribe } = require("diagnostics_channel")
const { ethers } = require("hardhat")

const networkConfig = {
      11155111: {
            name: "sepolia",
            ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
            blockConfirmations: 6,
            vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
            gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
            entranceFee: ethers.utils.parseEther("0.01"),
            subscriptionId: "0",
            callbackGasLimit: "500000",
            interval: "30",
      },
      137: {
            name: "polygon",
            ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
      },
      31337: {
            name: "hardhat",
            ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
            blockConfirmations: 1,
            vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
            gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
            entranceFee: ethers.utils.parseEther("0.01"),
            subscriptionId: "0",
            callbackGasLimit: "500000",
            interval: "30",
      },
}

const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

const developmentChains = ["hardhat", "localhost"]
module.exports = {
      developmentChains,
      INITIAL_ANSWER,
      DECIMALS,
      networkConfig,
}
