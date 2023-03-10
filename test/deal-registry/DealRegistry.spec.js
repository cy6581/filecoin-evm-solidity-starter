const { expect } = require("chai")
const { createTestingModule } = require("./setup")

describe("DealRegistry contract", () => {
    const dealId = "54"
    const provider = "1000"

    const dealEndEpoch = "99"
    const nowEpoch = "500"
    const epochCutoff = "500" // essentially anything from epoch 0 should be counted

    let dealRegistry
    let fakeMarketAPI

    beforeEach(async () => {
        const testModule = await createTestingModule()
        dealRegistry = testModule.dealRegistry
        fakeMarketAPI = testModule.fakeMarketAPI
    })

    it("should init the correct state on deployment", async () => {
        expect(await dealRegistry.isDealCollected(dealId)).to.eql(false)
        expect(
            BigInt(await dealRegistry.countRegisteredDeals(provider, epochCutoff, nowEpoch))
        ).to.eql(0n)
    })

    it("registerDeal, should add verified deals to the Registry", async () => {
        await fakeMarketAPI.set_deal_verified(true)
        await dealRegistry.registerDeal(dealId)
        expect(await dealRegistry.isDealCollected(dealId)).to.eql(true)
    })

    it("registerDeal, should revert on unverified deals", async () => {
        await fakeMarketAPI.set_deal_verified(false)
        await expect(dealRegistry.registerDeal(dealId)).to.be.reverted
        expect(await dealRegistry.isDealCollected(dealId)).to.eql(false)
    })

    it("countRegisteredDeals, should correctly count the registered deals based on time passed", async () => {
        await fakeMarketAPI.set_deal_verified(true)
        await fakeMarketAPI.set_deal_provider(provider)
        await fakeMarketAPI.set_deal_end_epoch(dealEndEpoch)
        // all should be registered to the same provider, be verified, and have same epoch
        await dealRegistry.registerDeal("51")
        await fakeMarketAPI.set_deal_end_epoch("199")
        await dealRegistry.registerDeal("52")
        await fakeMarketAPI.set_deal_end_epoch("299")
        await dealRegistry.registerDeal("53")
        await fakeMarketAPI.set_deal_end_epoch("399")
        await dealRegistry.registerDeal("54")
        await fakeMarketAPI.set_deal_end_epoch("499")
        await dealRegistry.registerDeal("55")

        // vary the offset
        const nowEpoch = "500"
        expect(BigInt(await dealRegistry.countRegisteredDeals(provider, nowEpoch, "100"))).to.eql(
            1n
        )
        expect(BigInt(await dealRegistry.countRegisteredDeals(provider, nowEpoch, "200"))).to.eql(
            2n
        )
        expect(BigInt(await dealRegistry.countRegisteredDeals(provider, nowEpoch, "300"))).to.eql(
            3n
        )
        // vary the query start time (i.e. now)
        const queryOffset = "100"
        expect(
            BigInt(await dealRegistry.countRegisteredDeals(provider, "100", queryOffset))
        ).to.eql(1n)
        expect(
            BigInt(await dealRegistry.countRegisteredDeals(provider, "200", queryOffset))
        ).to.eql(1n)
        expect(
            BigInt(await dealRegistry.countRegisteredDeals(provider, "300", queryOffset))
        ).to.eql(1n)
    })

    it("countRegisteredDeals, should correctly count the registered deals based on provider", async () => {
        await fakeMarketAPI.set_deal_verified(true)
        await fakeMarketAPI.set_deal_provider(provider)
        await fakeMarketAPI.set_deal_end_epoch(dealEndEpoch)
        // all should be registered to the same provider, be verified, and have same epoch
        await dealRegistry.registerDeal("51")
        await fakeMarketAPI.set_deal_end_epoch(dealEndEpoch)
        await dealRegistry.registerDeal("52")
        await dealRegistry.registerDeal("53")
        await dealRegistry.registerDeal("54")
        await dealRegistry.registerDeal("55")

        expect(
            BigInt(await dealRegistry.countRegisteredDeals(provider, nowEpoch, epochCutoff))
        ).to.eql(5n)

        const otherProvider = "1001"
        expect(
            BigInt(await dealRegistry.countRegisteredDeals(otherProvider, nowEpoch, epochCutoff))
        ).to.eql(0n)

        await fakeMarketAPI.set_deal_provider(otherProvider)
        // register one other deal for the other provider
        await dealRegistry.registerDeal("56")
        expect(
            BigInt(await dealRegistry.countRegisteredDeals(otherProvider, nowEpoch, epochCutoff))
        ).to.eql(1n)
    })

    // TODO, count based on offset
})
