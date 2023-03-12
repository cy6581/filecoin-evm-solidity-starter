// NB: Double check which address is being used to claim
task("provider-claim-nft", "Storage providers can claim NFT").setAction(async (taskArgs) => {
    const contractAddr = "0xE36ACdE139474e3f32BFefC95B0BE805E14b415B"
    const networkId = network.name
    console.log("provider-claim-nft", networkId)

    //create a new wallet instance
    console.log("Plase double check which account you run this from...")
    // note, this is using the key associated with Storage provider, previously set address
    const wallet = new ethers.Wallet(network.config.accounts[1], ethers.provider)

    //create a contract factory
    const NftContract = await ethers.getContractFactory("WatermarkTokenERC721", wallet)
    //create a contract instance
    //this is what you will call to interact with the deployed contract
    const nftContract = await NftContract.attach(contractAddr)
    const claimCall = await nftContract.claim({ gasLimit: 1000000000 })
    // specify a high gas limit
    await claimCall.wait()

    console.log("Complete!")
})
