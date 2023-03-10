// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

contract FakeMarketAPIWrapped {
    bool _verified = true;

    function set_deal_verified(bool verified) public {
        _verified = verified;
    }

    function get_deal_verified(uint64 dealID) public returns (bool) {
        // irrelevant, overwrite in test anyway
        return _verified;
    }
}
