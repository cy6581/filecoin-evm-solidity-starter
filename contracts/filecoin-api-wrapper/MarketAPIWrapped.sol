// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";

contract MarketAPIWrapped {
    function get_deal_verified(uint64 dealID) public returns (bool) {
        return MarketAPI.getDealVerified(dealID).verified;
    }
}
