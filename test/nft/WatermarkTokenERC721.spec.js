const { expect } = require("chai")
const { createTestingModule } = require("../setup")

describe("WatermarkTokenERC721 contract", () => {
    let dealRegistry
    let fakeMarketAPI
    let userARole
    let deployRole

    beforeEach(async () => {
        const testModule = await createTestingModule()
        fakeMarketAPI = testModule.fakeMarketAPI
        dealRegistry = testModule.dealRegistry
        watermarkTokenERC721 = testModule.watermarkTokenERC721
        userARole = testModule.userARole
        deployRole = testModule.deployRole
    })

    it("should init the correct state with no new NFTs on deploy", async () => {
        expect(await watermarkTokenERC721.checkExists(0)).to.eql(false)
        expect(await watermarkTokenERC721.checkExists(1)).to.eql(false)
    })

    it("should reject any NFT claim if user has no valid verified deals", async () => {
        await expect(watermarkTokenERC721.connect(userARole).claim()).to.be.reverted
    })

    it("should let the user claim an NFT if they have successfully verified >3 deals previously", async () => {
        await verifyFourDeals(fakeMarketAPI, dealRegistry)

        await watermarkTokenERC721.connect(userARole).claim()
        expect(await watermarkTokenERC721.checkExists(0)).to.eql(true)
    })

    it("should let the contract owner burn any NFTs based on their validity period", async () => {
        let blockHeight = 155290
        await verifyFourDeals(fakeMarketAPI, dealRegistry)

        await watermarkTokenERC721.connect(deployRole).setBlockHeight(blockHeight)
        await watermarkTokenERC721.connect(userARole).claim()
        expect(await watermarkTokenERC721.checkExists(0)).to.eql(true)

        await watermarkTokenERC721.connect(deployRole).setTokenValidity(1000) // token still valid 1000 epochs after issue
        await watermarkTokenERC721.connect(deployRole).burnExpired()
        expect(await watermarkTokenERC721.checkExists(0)).to.eql(true)

        await watermarkTokenERC721.connect(deployRole).setTokenValidity(0) // token only valid on issuedEpcoh
        await watermarkTokenERC721.connect(deployRole).setBlockHeight(blockHeight + 10)
        await watermarkTokenERC721.connect(deployRole).burnExpired()
        expect(await watermarkTokenERC721.checkExists(0)).to.eql(false)
    })
})

async function verifyFourDeals(fakeMarketAPI, dealRegistry) {
    await fakeMarketAPI.set_deal_verified(true)
    await fakeMarketAPI.set_deal_provider("1100") // matches user A

    // register >3 valid deals,
    await fakeMarketAPI.set_deal_end_epoch("155200")
    await dealRegistry.registerDeal("51")
    await fakeMarketAPI.set_deal_end_epoch("155201")
    await dealRegistry.registerDeal("52")
    await fakeMarketAPI.set_deal_end_epoch("155203")
    await dealRegistry.registerDeal("53")
    await fakeMarketAPI.set_deal_end_epoch("155204")
    await dealRegistry.registerDeal("54")
}
