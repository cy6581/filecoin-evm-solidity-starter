require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("@nomicfoundation/hardhat-chai-matchers") // add chai matchers e.g. be reverted
require("./tasks")
require("dotenv").config()

const PRIVATE_KEY_DEPLOYER = process.env.PRIVATE_KEY_DEPLOYER
const PRIVATE_KEY_PROVIDER = process.env.PRIVATE_KEY_PROVIDER
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.17",
    },
    defaultNetwork: "hyperspace",
    networks: {
        hyperspace: {
            chainId: 3141,
            url: "https://api.hyperspace.node.glif.io/rpc/v1",
            accounts: [PRIVATE_KEY_DEPLOYER, PRIVATE_KEY_PROVIDER],
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}
