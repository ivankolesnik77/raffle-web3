const networkConfig = {
      11011: {
            name: "sepolia",
            ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
            blockConfirmations: 6,
      },
      137: {
            name: "polygon",
            ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
      },
      31337: {
            name: "hardhat",
            ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
            blockConfirmations: 1,
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
