const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
      const { deploy, log } = deployments
      const { deployer } = await getNamedAccounts()

      const chainId = network.config.chainId
      let ethUsPriceFeedAddress
      if (developmentChains.includes(network.name)) {
            console.log(deployments)
            const ethUsdAggregator = await deployments.get("MockV3Aggregator")
            ethUsPriceFeedAddress = await ethUsdAggregator.address
      } else {
            ethUsPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
      }

      log("chainId:", chainId)
      log("network.name:", network.name)

      const args = [ethUsPriceFeedAddress]
      const fundMe = await deploy("FundMe", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
      })

      if (
            !developmentChains.includes(network.name) &&
            process.env.ETHERSCAN_API_KEY
      ) {
            await verify(fundMe.address, args)
      }
}

module.exports.tags = ["all", "fundme"]
