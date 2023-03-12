task("save-deal", "Save the deal, this contract becomes the ")
    .addParam("dealid", "The id of the deal")
    .setAction(async (taskArgs) => {
        const contractAddr = "0x880A07d4c8de187D3692B7717207ba96d6936931"
        const dealid = taskArgs.dealid
        const networkId = network.name
        console.log("Saving deal to contract in ", networkId)

        //create a new wallet instance
        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

        //create a contract factory
        const DealRegistry = await ethers.getContractFactory("DealRegistry", wallet)
        //create a contract instance
        //this is what you will call to interact with the deployed contract
        const dealRegistry = await DealRegistry.attach(contractAddr)

        const transaction = await dealRegistry.registerDeal(dealid)
        // await transaction.wait()

        console.log("Complete!")
    })
