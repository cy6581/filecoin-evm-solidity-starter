// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

contract FakeMarketAPIWrapped {
    bool _verified = true;
    uint64 _provider = 0;
    int64 _end = 100;

    function set_deal_verified(bool verified) public {
        _verified = verified;
    }

    function set_deal_provider(uint64 provider) public {
        _provider = provider;
    }

    function set_deal_end_epoch(int64 end) public {
        _end = end;
    }

    function get_deal_verified(uint64 dealID) public returns (bool) {
        return _verified;
    }

    function get_deal_provider(uint64 dealID) public returns (uint64) {
        return _provider;
    }

    function get_deal_end_epoch(uint64 dealID) public returns (int64) {
        return _end;
    }
}
