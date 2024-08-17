// import { MockV3AggregatorInterface } from "../../src/types/@chainlink/contracts/src/v0.8/tests/MockV3Aggregator"
// import { FundMe } from "../../typechain-types"

const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

developmentChains.includes(network.name)
      ? describe.skip
      : describe("FundMe staging", async function () {
              let fundMe
              let deployerAddress
              const sendValue = ethers.parseEther("0.01")

              beforeEach(async function () {
                    deployerAddress = (await getNamedAccounts()).deployer
                    await deployments.fixture(["all"])
                    console.log(deployerAddress)

                    fundMe = await ethers.getContract("FundMe", deployerAddress)
                    deployer = await ethers.getSigner(deployerAddress)
                    console.log(deployer)
              })

              it("withdraw ETH from a single funder", async () => {
                    const address = await fundMe.getAddress()

                    await fundMe.fund({ value: sendValue })
                    const transactionResponse = await fundMe.withdraw()
                    const transactionReceipt = await transactionResponse.wait(1)

                    const endingFundMeBalance =
                          await ethers.provider.getBalance(address)

                    assert.equal(endingFundMeBalance, 0)
              })
        })
