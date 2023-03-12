task("get-deal-end-epoch", "Fetch deal end epoch info")
    .addParam("dealid", "The id of the deal with the completed bounty")
    .setAction(async (taskArgs) => {
        const contractAddr = "0xD9994B2F7ad6A6e7fEceA316B3B181aCc20f09a4"
        const dealid = taskArgs.dealid
        const networkId = network.name
        console.log("get-deal-end-epoch in", networkId)

        //create a new wallet instance
        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

        //create a contract factory
        const MarketAPIWrapped = await ethers.getContractFactory("MarketAPIWrapped", wallet)
        //create a contract instance
        //this is what you will call to interact with the deployed contract
        const marketAPIWrapped = await MarketAPIWrapped.attach(contractAddr)

        const result = await marketAPIWrapped.get_deal_end_epoch(dealid)
        // console.warn(`Normal result is ${result}`)
        // console.warn(`Stringify result is ${JSON.stringify(result, null, 2)}`)
        // for some reason not logging correctly, view in Explorer

        console.log("Complete!")
    })
