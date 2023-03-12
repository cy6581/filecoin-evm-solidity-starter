task("query-nft", "Anyone can query whether an NFT exists")
    .addParam("id", "The id of the nft")
    .setAction(async (taskArgs) => {
        const contractAddr = "0xE36ACdE139474e3f32BFefC95B0BE805E14b415B"
        const id = taskArgs.id
        const networkId = network.name
        console.log("query-nft", networkId)

        //create a new wallet instance
        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

        //create a contract factory
        const NftContract = await ethers.getContractFactory("WatermarkTokenERC721", wallet)
        //create a contract instance
        //this is what you will call to interact with the deployed contract
        const nftContract = await NftContract.attach(contractAddr)
        console.warn(`Querying, if NFT does not exist you will get an error from ownerOf...`)
        const isExists = await nftContract.checkExists(id)
        console.warn(`Normal isExists is ${isExists}`)

        const owner = await nftContract.ownerOf(id)
        console.warn(`Normal owner is ${owner}`)

        console.log("Complete!")
    })
