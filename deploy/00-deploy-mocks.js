const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const BASE_FEE = ethers.utils.parseEther("0.25") // Premium. It costs 0.25 LINK per request
const GAS_PRICE_LINK = 1e9

module.exports = async ({ getNamedAccounts, deployments }) => {
      const { deploy, log } = deployments
      const { deployer } = await getNamedAccounts()
      log(network.name)
      const chaidId = network.config.chainId
      if (developmentChains.includes(network.name)) {
            log("Local network detected! Deploying mocks...")
            await deploy("VRFCoordinatorV2Mock", {
                  from: deployer,
                  args: [BASE_FEE, GAS_PRICE_LINK],
                  log: true,
            })
            log("Mocks Deployed!")
            log("-------------------------------------------")
      }
      // const address = networkConfig[chaind]["ethUsdPriceFeed"]
}

module.exports.tags = ["all", "mocks"]
