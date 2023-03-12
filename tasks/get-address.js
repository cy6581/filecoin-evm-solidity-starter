const fa = require("@glif/filecoin-address")

task("get-address", "Gets Filecoin f4 address and corresponding Ethereum address.").setAction(
    async (taskArgs) => {
        //create new Wallet object from private key
        // const DEPLOYER_PRIVATE_KEY = network.config.accounts[0]
        // const user = new ethers.Wallet(DEPLOYER_PRIVATE_KEY)
        const PROVIDER_PRIVATE_KEY = network.config.accounts[1]
        const user = new ethers.Wallet(PROVIDER_PRIVATE_KEY)

        console.log("Pay attention to which account this is, Admin or User")

        //Convert Ethereum address to f4 address
        const f4Address = fa.newDelegatedEthAddress(user.address).toString()
        console.log("Ethereum address (this addresss should work for most tools):", user.address)
        console.log("f4address (also known as t4 address on testnets):", f4Address)
    }
)
