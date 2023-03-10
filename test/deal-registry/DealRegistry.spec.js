const { expect } = require("chai")
const { createTestingModule } = require("./setup")

describe("DealRegistry contract", () => {
    const dealId = "54"

    let dealRegistry
    let fakeMarketAPI

    beforeEach(async () => {
        const testModule = await createTestingModule()
        dealRegistry = testModule.dealRegistry
        fakeMarketAPI = testModule.fakeMarketAPI
    })

    it("should init the correct state on deployment", async () => {
        expect(await dealRegistry.isDealRegistered(dealId)).to.eql(false)
        expect(BigInt(await dealRegistry.countRegisteredDeals())).to.eql(0n)
    })

    it("registerDeal, should add verified deals to the Registry", async () => {
        await fakeMarketAPI.set_deal_verified(true)
        await dealRegistry.registerDeal(dealId)
        expect(await dealRegistry.isDealRegistered(dealId)).to.eql(true)
    })

    it("registerDeal, should revert on unverified deals", async () => {
        await fakeMarketAPI.set_deal_verified(false)
        await expect(dealRegistry.registerDeal(dealId)).to.be.reverted
        expect(await dealRegistry.isDealRegistered(dealId)).to.eql(false)
    })
})
