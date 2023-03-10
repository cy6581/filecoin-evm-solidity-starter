// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";

contract MarketAPIWrapped {
    function get_deal_verified(uint64 dealID) public returns (bool) {
        return MarketAPI.getDealVerified(dealID).verified;
    }

    function get_deal_provider(uint64 dealID) public returns (uint64) {
        return MarketAPI.getDealProvider(dealID).provider;
    }

    function get_deal_end_epoch(uint64 dealID) public returns (int64) {
        return MarketAPI.getDealTerm(dealID).end;
    }
}
