const { network } = require("hardhat")
const {
      networkConfig,
      developmentChains,
      DECIMALS,
      INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
      const { deploy, log } = deployments
      const { deployer } = await getNamedAccounts()
      log(deployer)
      const chaidId = network.config.chainId
      if (developmentChains.includes(network.name)) {
            log("Local network detected! Deploying mocks...")
            await deploy("MockV3Aggregator", {
                  contract: "MockV3Aggregator",
                  from: deployer,
                  args: [DECIMALS, INITIAL_ANSWER],
                  log: true,
            })
            log("Mocks Deployed!")
            log("-------------------------------------------")
      }
      // const address = networkConfig[chaind]["ethUsdPriceFeed"]
}

module.exports.tags = ["all", "mocks"]
