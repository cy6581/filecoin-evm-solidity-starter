task("admin-set-block-height", "Admin to set block height")
    .addParam("blockheight", "The id of the deal with the completed bounty")
    .setAction(async (taskArgs) => {
        const contractAddr = "0xE36ACdE139474e3f32BFefC95B0BE805E14b415B"
        const blockHeight = taskArgs.blockheight
        const networkId = network.name
        console.log("admin-set-block-height", networkId)

        //create a new wallet instance
        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

        //create a contract factory
        const NftContract = await ethers.getContractFactory("WatermarkTokenERC721", wallet)
        //create a contract instance
        //this is what you will call to interact with the deployed contract
        const nftContract = await NftContract.attach(contractAddr)

        const result = await nftContract.setBlockHeight(blockHeight)
        await result.wait()
        console.log("Complete!")
    })
