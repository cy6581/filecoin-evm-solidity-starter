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
    struct DealInfo {
        // can add more fields
        int64 endEpoch; // end epoch of the deal
    }

    // TODO any more efficient data structure to store this, instead of two maps?
    mapping(uint64 => DealInfo) public dealDetails; // dealId -> DealInfo
    mapping(uint64 => uint64[]) public providerDeals; // providers -> dealId[]

    MarketAPIWrapped _marketAPI;

    constructor(address marketAPI) {
        _marketAPI = MarketAPIWrapped(marketAPI);
    }

    function isDealCollected(uint64 dealId) public view returns (bool) {
        return dealDetails[dealId].endEpoch != 0;
    }

    function registerDeal(uint64 dealId) public {
        if (isDealCollected(dealId)) {
            return;
        }
        require(_marketAPI.get_deal_verified(dealId), "The deal has not been verified");
        uint64 provider = _marketAPI.get_deal_provider(dealId);
        int64 endEpoch = _marketAPI.get_deal_end_epoch(dealId);
        dealDetails[dealId] = DealInfo(endEpoch);
        providerDeals[provider].push(dealId);
    }

    // can think of this as proxy for counting the deals completed in last X months, ends exclusive
    function countRegisteredDeals(
        uint64 provider,
        int64 queryTimeEpoch,
        int64 offset
    ) public view returns (uint64) {
        uint8 count = 0;
        for (uint i = 0; i < providerDeals[provider].length; i++) {
            int64 endEpoch = dealDetails[providerDeals[provider][i]].endEpoch;
            if (endEpoch < queryTimeEpoch && endEpoch > queryTimeEpoch - offset) {
                count++;
            }
        }
        return count;
    }
}
