task("admin-add-address", "Admin can set an address mapping")
    .addParam("ethaddress", "Ethereum Address")
    .addParam("f0address", "F0 or TO address")
    .setAction(async (taskArgs) => {
        const contractAddr = "0xE36ACdE139474e3f32BFefC95B0BE805E14b415B"
        const ethaddress = taskArgs.ethaddress
        const f0address = taskArgs.f0address
        const networkId = network.name
        console.log("admin-add-address", networkId)

        //create a new wallet instance
        const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)

        //create a contract factory
        const NftContract = await ethers.getContractFactory("WatermarkTokenERC721", wallet)
        const nftContract = await NftContract.attach(contractAddr)
        //create a contract instance
        //this is what you will call to interact with the deployed contract
        const t = await nftContract.setAddress(ethaddress, f0address)
        await t.wait()

        console.log("Complete!")
    })
