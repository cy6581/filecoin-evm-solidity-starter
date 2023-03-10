// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

// import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import {MarketAPIWrapped} from "../filecoin-api-wrapper/MarketAPIWrapped.sol";

/**
 * @title DealAPI
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

contract DealRegistry {
    // address public owner;
    MarketAPIWrapped _marketAPI;
    uint64 client;
    uint64 provider;

    mapping(uint64 => bool) public verifiedDeals;
    mapping(uint64 => uint64) public registeredDeals;

    // event storeClient(uint256 indexed numberTokensMinted, address owner);

    constructor(address marketAPI) {
        _marketAPI = MarketAPIWrapped(marketAPI);
    }

    function isDealRegistered(uint64 dealId) public view returns (bool) {
        bool alreadySaved = verifiedDeals[dealId];
        return alreadySaved;
    }

    function registerDeal(uint64 dealId) public {
        if (isDealRegistered(dealId)) {
            return;
        }
        require(_marketAPI.get_deal_verified(dealId), "The deal has not been verified");
        verifiedDeals[dealId] = true;
        // TODO remove hardcode, relying on init to 0
        registeredDeals[42] = registeredDeals[42] + 1;
    }

    function countRegisteredDeals() public view returns (uint64) {
        return registeredDeals[42];
    }
}
