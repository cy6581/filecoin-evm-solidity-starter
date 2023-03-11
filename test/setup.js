const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

// TODO remove if not used
const { smock } = require("@defi-wonderland/smock")

const buildTestFixtures = async () => {
    const marketAPIFactory = await ethers.getContractFactory("FakeMarketAPIWrapped")
    const fakeMarketAPI = await marketAPIFactory.deploy()

    const DealRegistry = await ethers.getContractFactory("DealRegistry")
    const dealRegistry = await DealRegistry.deploy(fakeMarketAPI.address)

    const WatermarkTokenERC721 = await ethers.getContractFactory("WatermarkTokenERC721")

    const [deployRole, userARole] = await ethers.getSigners()
    const name = "FOO"
    const symbol = "BAR"
    const uri = "ipfs://foobar"
    const watermarkTokenERC721 = await WatermarkTokenERC721.deploy(
        deployRole.address,
        name,
        symbol,
        uri,
        dealRegistry.address
    )

    return {
        dealRegistry,
        fakeMarketAPI,
        watermarkTokenERC721,
        deployRole,
        userARole,
    }
}
// supposedly loadFixture is an optimisation
// Hardhat just resets the state instead of building new fixtures
const createTestingModule = async () => loadFixture(buildTestFixtures)

module.exports = { createTestingModule }
