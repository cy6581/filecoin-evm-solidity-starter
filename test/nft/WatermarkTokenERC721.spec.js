const { expect } = require("chai")
const { createTestingModule } = require("../setup")

describe("WatermarkTokenERC721 contract", () => {
    let dealRegistry
    let fakeMarketAPI
    let userARole
    let userBRole
    let deployRole

    beforeEach(async () => {
        const testModule = await createTestingModule()
        fakeMarketAPI = testModule.fakeMarketAPI
        dealRegistry = testModule.dealRegistry
        watermarkTokenERC721 = testModule.watermarkTokenERC721
        userARole = testModule.userARole
        userBRole = testModule.userBRole
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
        let blockHeight = 155290
        const providerID = 1100
        await verifyFourDeals(fakeMarketAPI, dealRegistry, providerID, blockHeight)
        await watermarkTokenERC721.connect(deployRole).setBlockHeight(blockHeight)
        await watermarkTokenERC721.connect(deployRole).setAddress(userARole.address, providerID)

        await watermarkTokenERC721.connect(userARole).claim()
        expect(await watermarkTokenERC721.checkExists(0)).to.eql(true)
        expect(await watermarkTokenERC721.ownerOf(0)).to.eql(userARole.address)
    })

    it("should let the contract owner burn any NFTs based on their validity period", async () => {
        let blockHeight = 155290
        const providerID = 1100
        await verifyFourDeals(fakeMarketAPI, dealRegistry, providerID, blockHeight)

        await watermarkTokenERC721.connect(deployRole).setBlockHeight(blockHeight)
        await watermarkTokenERC721.connect(deployRole).setAddress(userARole.address, providerID)

        await watermarkTokenERC721.connect(userARole).claim()
        await watermarkTokenERC721.connect(deployRole).setTokenValidity(1000) // token still valid 1000 epochs after issue
        await watermarkTokenERC721.connect(deployRole).burnExpired()
        expect(await watermarkTokenERC721.checkExists(0)).to.eql(true)

        await watermarkTokenERC721.connect(deployRole).setTokenValidity(0) // token only valid on issuedEpcoh, expires immediately after
        await watermarkTokenERC721.connect(deployRole).setBlockHeight(blockHeight + 10)
        await watermarkTokenERC721.connect(deployRole).burnExpired()
        expect(await watermarkTokenERC721.checkExists(0)).to.eql(false)
    })

    it("should prevent other users except the contract owner from setting config or burning NFTs", async () => {
        await expect(watermarkTokenERC721.connect(userARole).setBlockHeight(1555555)).to.be.reverted
        await expect(watermarkTokenERC721.connect(userARole).setTokenValidity(1000)).to.be.reverted
        await expect(watermarkTokenERC721.connect(userARole).burnExpired()).to.be.reverted

        await expect(watermarkTokenERC721.connect(userBRole).setBlockHeight(1555555)).to.be.reverted
        await expect(watermarkTokenERC721.connect(userBRole).setTokenValidity(1000)).to.be.reverted
        await expect(watermarkTokenERC721.connect(userBRole).burnExpired()).to.be.reverted
    })

    it("should prevent users from transfering their NFTs", async () => {
        let blockHeight = 155290
        const providerID = 1100
        await verifyFourDeals(fakeMarketAPI, dealRegistry, providerID, blockHeight)
        await watermarkTokenERC721.connect(deployRole).setBlockHeight(blockHeight)
        await watermarkTokenERC721.connect(deployRole).setAddress(userARole.address, providerID)

        await watermarkTokenERC721.connect(userARole).claim()
        expect(await watermarkTokenERC721.checkExists(0)).to.eql(true)
        expect(await watermarkTokenERC721.ownerOf(0)).to.eql(userARole.address)

        await expect(
            watermarkTokenERC721
                .connect(userARole)
                .transferFrom(userARole.address, userBRole.address, 0)
        ).to.be.reverted
    })
})

async function verifyFourDeals(fakeMarketAPI, dealRegistry, providerID, blockHeight) {
    await fakeMarketAPI.set_deal_verified(true)
    await fakeMarketAPI.set_deal_provider(providerID)

    // register >3 valid deals,
    await fakeMarketAPI.set_deal_end_epoch(blockHeight - 51)
    await dealRegistry.registerDeal("51")
    await fakeMarketAPI.set_deal_end_epoch(blockHeight - 52)
    await dealRegistry.registerDeal("52")
    await fakeMarketAPI.set_deal_end_epoch(blockHeight - 53)
    await dealRegistry.registerDeal("53")
    await fakeMarketAPI.set_deal_end_epoch(blockHeight - 54)
    await dealRegistry.registerDeal("54")
}
