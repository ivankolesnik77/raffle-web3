const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")

module.exports = async ({ getNamedAccounts, deployments }) => {
      const { deploy, log } = deployments
      const { deployer } = await getNamedAccounts()
      const chainId = network.config.chainId
      let vrfCoordinatorV2Address, subscriptionId

      if (developmentChains.includes(network.name)) {
            const VRFCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock"
            )
            vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address
            const transactionResponse =
                  await VRFCoordinatorV2Mock.createSubscription()
            const transactionReceipt = await transactionResponse.wait(1)

            subscriptionId = transactionReceipt.events[0].args.subId
            log("subscriptionId", subscriptionId)
            await VRFCoordinatorV2Mock.fundSubscription(
                  subscriptionId,
                  VRF_SUB_FUND_AMOUNT
            )
      } else {
            vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
            subscriptionId = networkConfig[chainId]["subscriptionId"]
      }

      const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
      const gasLane = networkConfig[chainId]["gasLane"]
      const entranceFee = networkConfig[chainId]["entranceFee"]
      const interval = networkConfig[chainId]["interval"]
      const args = [
            vrfCoordinatorV2Address,
            subscriptionId,
            gasLane,
            interval,
            entranceFee,
            callbackGasLimit,
      ]
      log("args", args)
      const raffle = await deploy("Raffle", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: 1,
      })

      if (developmentChains.includes(network.name)) {
            const vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock"
            )
            await vrfCoordinatorV2Mock.addConsumer(
                  subscriptionId,
                  raffle.address
            )
      }

      if (
            !developmentChains.includes(network.name) &&
            process.env.ETHERSCAN_API_KEY
      ) {
            log("Verifying...")
            await verify(raffle.address, args)
      }

      log("----------------------------------")
}

module.exports.tags = ["all", "fundme"]
