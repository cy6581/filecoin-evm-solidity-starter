exports.getAddress = require("./get-address")
exports.cidToBytes = require("./cid-to-bytes")

exports.getDealEndEpoch = require("./filecoin-api-wrapper/get-deal-end-epoch")

exports.saveDeal = require("./deal-registry/save-deal")
exports.isDealRegistered = require("./deal-registry/is-deal-registered")

exports.adminSetBlockHeight = require("./nft/admin-set-block-height")
exports.adminSetBlockHeight = require("./nft/admin-add-address")
exports.queryNFT = require("./nft/query-nft")
exports.providerClaimNFT = require("./nft/provider-claim-nft")
