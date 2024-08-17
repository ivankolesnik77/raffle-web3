const { run } = require("hardhat")
const { modules } = require("web3")

exports.verify = async (contractAddress, args) => {
      console.log("Verifying contract...")
      try {
            await run("verify:verify", {
                  address: contractAddress,
                  contstructorArguments: args,
            })
      } catch (e) {
            if (e.message.toLowerCase().includes("already verified")) {
                  console.log("already verified")
            } else {
                  console.log(e.message)
            }
      }
}
