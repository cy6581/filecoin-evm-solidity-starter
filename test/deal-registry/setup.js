const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

// TODO remove if not used
const { smock } = require("@defi-wonderland/smock")

const buildTestFixtures = async () => {
    const marketAPIFactory = await ethers.getContractFactory("FakeMarketAPIWrapped")
    const fakeMarketAPI = await marketAPIFactory.deploy()

    const dealRegistryMock = await ethers.getContractFactory("DealRegistry")
    const dealRegistry = await dealRegistryMock.deploy(fakeMarketAPI.address)

    return {
        dealRegistry,
        fakeMarketAPI,
    }
}
// supposedly loadFixture is an optimisation
// Hardhat just resets the state instead of building new fixtures
const createTestingModule = async () => loadFixture(buildTestFixtures)

module.exports = { createTestingModule }
