require("hardhat-deploy")
require("hardhat-deploy-ethers")

const { networkConfig } = require("../helper-hardhat-config")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    console.log("Wallet Ethereum Address:", wallet.address)

    let marketAPIaddresss, dealRegistryAddress

    const MarketAPI = await ethers.getContractFactory("MarketAPIWrapped", wallet)
    console.log("Deploying MarketAPIWrapped...")
    const marketAPI = await MarketAPI.deploy()
    await marketAPI.deployed()
    console.log("MarketAPIWrapped deployed to:", marketAPI.address)

    marketAPIaddresss = marketAPI.address
    const DealRegistry = await ethers.getContractFactory("DealRegistry", wallet)
    console.log("Deploying DealRegistry...")
    const dealRegistry = await DealRegistry.deploy(marketAPIaddresss)
    await dealRegistry.deployed()
    console.log("DealRegistry deployed to:", dealRegistry.address)

    dealRegistryAddress = dealRegistry.address
    const WatermarkNFT = await ethers.getContractFactory("WatermarkTokenERC721", wallet)
    console.log("Deploying watermarkNFT...")
    const watermarkNFT = await WatermarkNFT.deploy(
        wallet.address,
        "WatermarkToken",
        "WMT",
        "ipfs://abc",
        dealRegistryAddress
    )
    await watermarkNFT.deployed()
    console.log("watermarkNFT deployed to:", watermarkNFT.address)
    console.log("ALL done ")
    //  0xE36ACdE139474e3f32BFefC95B0BE805E14b415B
}
