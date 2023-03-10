task(
    "save-deal",
    "Save the deal, this contract becomes the "
  )
    // .addParam("contract", "The address of the DealRewarder contract")
    .addParam("dealid", "The id of the deal with the completed bounty")
    .setAction(async (taskArgs) => {
        //store taskargs as useable variables
        // const contractAddr = taskArgs.contract
        const contractAddr = '0x37F1356ff912a60Be180eafa1269e78359f34ca9';
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
        await transaction.wait();

        console.log("Complete!")
    })