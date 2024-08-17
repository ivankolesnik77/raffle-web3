const { assert, expect } = require("chai")
const {
      deployments,

      ethers,
      getNamedAccounts,
} = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
      ? describe.skip
      : describe("FundMe", async function () {
              let fundMe
              let deployerAddress
              let mockV3Aggregator
              const sendValue = ethers.parseEther("1")
              beforeEach(async function () {
                    deployerAddress = (await getNamedAccounts()).deployer
                    usersrAddress = (await getNamedAccounts()).users
                    await deployments.fixture(["all"])
                    fundMe = await ethers.getContract("FundMe", deployerAddress)
                    console.log("deployerAddress: ", deployerAddress)
                    console.log("usersrAddress: ", usersrAddress)
                    deployer = await ethers.getSigner(deployerAddress)
                    console.log("deployer address: ", deployer.address)
                    mockV3Aggregator = await ethers.getContract(
                          "MockV3Aggregator",
                          deployer,
                    )
                    fundMe = fundMe.connect(deployer)
              })

              describe("FundMe", async () => {
                    it("set aggregator address correctly", async () => {
                          const response = await fundMe.priceFeed()
                          const address = await mockV3Aggregator.getAddress()
                          assert.equal(response, address)
                    })

                    it("fails if don't send enogh ETH", async () => {
                          await expect(fundMe.fund()).to.be.revertedWith(
                                "You need to spend more ETH!",
                          )
                    })

                    it("updated the amount funded data", async () => {
                          console.log(sendValue.toString())
                          await fundMe.fund({ value: sendValue })
                          const response = await fundMe.addressToAmountFunded(
                                deployer.address,
                          )
                          assert.equal(
                                response.toString(),
                                sendValue.toString(),
                          )
                    })

                    it("add funder to array of funders", async () => {
                          await fundMe.fund({ value: sendValue })
                          const funder = await fundMe.funders(0)
                          assert.equal(funder, deployer.address)
                    })
              })

              describe("Withdraw", () => {
                    beforeEach(async function () {
                          await fundMe.fund({ value: sendValue })
                    })

                    it("withdraw ETH from a single funder", async () => {
                          const address = await fundMe.getAddress()
                          // Arrange
                          const startingDeployerBalance =
                                await ethers.provider.getBalance(deployer)
                          const startingFundMeBalance =
                                await ethers.provider.getBalance(address)
                          // Act
                          const transactionResponse = await fundMe.withdraw()
                          const transactionReceipt =
                                await transactionResponse.wait(1)

                          const endingFundMeBalance =
                                await ethers.provider.getBalance(address)
                          const endingDeployerBalance =
                                await ethers.provider.getBalance(deployer)
                          const { gasUsed, gasPrice } = transactionReceipt
                          const gasCost = gasUsed * gasPrice

                          //  Assert
                          assert.equal(endingFundMeBalance, 0)
                          assert.equal(
                                startingFundMeBalance + startingDeployerBalance,
                                endingDeployerBalance + gasCost,
                          )
                    })
              })
        })
