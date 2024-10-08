// we can't have these functions in our `helper-hardhat-config`
// since these use the hardhat library
// and it would be a circular dependency
const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
      console.log("Verifying contract...", contractAddress)
      try {
            await run("verify:verify", {
                  address: contractAddress,
                  constructorArguments: args,
            })
            console.log("verified!")
      } catch (e) {
            if (e.message.toLowerCase().includes("already verified")) {
                  console.log("Already verified!")
            } else {
                  console.log(e)
            }
      }
}

module.exports = {
      verify,
}
