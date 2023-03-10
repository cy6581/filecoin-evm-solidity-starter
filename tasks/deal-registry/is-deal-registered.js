task(
  "is-deal-registered",
  "Check with the registry about deal"
)
  // .addParam("contract", "The address of the DealRewarder contract")
  .addParam("dealid", "The id of the deal with the completed bounty")
  .setAction(async (taskArgs) => {
      //store taskargs as useable variables
      // const contractAddr = taskArgs.contract
      const contractAddr = '0x37F1356ff912a60Be180eafa1269e78359f34ca9';
      const dealid = taskArgs.dealid
      const networkId = network.name
      console.log("Checking with registry about deal ", networkId)

      //create a new wallet instance
      const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

      //create a contract factory
      const DealRegistry = await ethers.getContractFactory("DealRegistry", wallet)
      //create a contract instance 
      //this is what you will call to interact with the deployed contract
      const dealRegistry = await DealRegistry.attach(contractAddr)
      const isRegistered = await dealRegistry.isDealRegistered(dealid)

      console.warn(`Normal isRegistered is ${isRegistered}`)
      console.warn(`Stringify isRegistered is ${JSON.stringify(isRegistered, null, 2)}`)
      console.log("Complete!")
  })