// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import {DealRegistry} from "../deal-registry/DealRegistry.sol";

contract WatermarkTokenERC721 is ERC721, AccessControl {
    uint256 nextTokenId;
    string uri;
    int64 blockHeight = 155290; // workaround, should be fetched dynamically
    int64 tokenValidity = 99999999;

    struct TokenInfo {
        int64 tokenIssued;
    }
    TokenInfo[] issuedTokens; // token ID is index
    DealRegistry dealRegistry;

    mapping(address => uint64) ethToF0;

    constructor(
        address _owner,
        string memory name,
        string memory symbol,
        string memory _uri, // same URI for now
        address _dealRegistry
    ) ERC721(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        uri = _uri;
        dealRegistry = DealRegistry(_dealRegistry);
    }

    // for anyone to check the existence of the NFT
    function checkExists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return uri;
    }

    // for providers to claim any NFTs awarded to them
    function claim() public virtual {
        require(canClaimToken(msg.sender), "No Watermark token available for claim");
        mint(msg.sender);
    }

    function mint(address receiver) internal virtual {
        _mint(receiver, nextTokenId);
        issuedTokens.push(TokenInfo(blockHeight));
        nextTokenId++;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, AccessControl) returns (bool) {
        return
            ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }

    // as long as provider has > 3 valid deals during the period
    // adjust parameters to increase the difficulty
    function canClaimToken(address claimant) private view returns (bool) {
        uint64 provider = getAddress(claimant);
        // check as far back as NFT tokens are valid for, so that token validity = period of verified deals
        int64 validCount = dealRegistry.countRegisteredDeals(provider, blockHeight, tokenValidity);
        return validCount > 3;
    }

    //
    // ADDRESS
    // TODO, move these Address getter/ setters and the data storage to a separate Address Oracle contract
    function setAddress(address ethAddress, uint64 f0Address) public onlyRole(DEFAULT_ADMIN_ROLE) {
        ethToF0[ethAddress] = f0Address;
    }

    function getAddress(address ethAddress) private view returns (uint64) {
        uint64 f0 = ethToF0[ethAddress];
        require(f0 != 0, "Address is not registered as a provider");
        return f0;
    }

    //
    // ADMIN only
    // TODO should otherwise fetch the latest blockHeight from chain APIs
    function setBlockHeight(int64 _blockHeight) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        blockHeight = _blockHeight;
    }

    function setTokenValidity(int64 _tokenValidity) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        tokenValidity = _tokenValidity;
    }

    function burnExpired() public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
        for (uint256 i = 0; i < nextTokenId; i++) {
            if (issuedTokens[i].tokenIssued + tokenValidity < blockHeight) {
                _burn(i);
            }
        }
    }

    //
    // Prohibit transfers
    function transferFrom(address from, address to, uint256 tokenId) public override {
        revert("Watermark tokens cannot be transferred");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        revert("Watermark tokens cannot be transferred");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override {
        revert("Watermark tokens cannot be transferred");
    }
}
