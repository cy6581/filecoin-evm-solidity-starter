// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import {DealRegistry} from "../deal-registry/DealRegistry.sol";

// TODO, access control stuff
// TODO, test reversion on transfer

contract WatermarkTokenERC721 is ERC721, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    uint256 nextTokenId;
    string uri;
    int64 blockHeight = 155290; // workaround, should be fetched dynamically
    int64 tokenValidity = 1000; // default for 1000 epochs

    struct TokenInfo {
        int64 tokenIssued;
    }
    TokenInfo[] issuedTokens; // token ID is index

    DealRegistry dealRegistry;

    constructor(
        address _owner,
        string memory name,
        string memory symbol,
        string memory _uri, // same URI for now
        address _dealRegistry
    ) ERC721(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        _setupRole(ISSUER_ROLE, _owner);
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
    // can be adjusted
    function canClaimToken(address claimant) private returns (bool) {
        // TODO remove hardcode
        uint64 provider = 1100;
        // recognise anything in last 999999 epochs, should sync up to NFT validity
        int64 epochCountToCheck = 999999;
        int64 validCount = dealRegistry.countRegisteredDeals(
            provider,
            blockHeight,
            epochCountToCheck
        );
        return validCount > 3;
    }

    //
    // ISSUER only

    // work around, should otherwise fetch the latest blockHeight from chain
    // TODO put back
    // function setBlockHeight(int64 _blockHeight) public virtual onlyRole(ISSUER_ROLE) {
    function setBlockHeight(int64 _blockHeight) public virtual {
        blockHeight = _blockHeight;
    }

    // TODO
    // function setBlockHeight(int64 _blockHeight) public virtual onlyRole(ISSUER_ROLE) {
    function setTokenValidity(int64 _tokenValidity) public virtual {
        tokenValidity = _tokenValidity;
    }

    // TODO put back authz
    // function burnExpired() public virtual onlyRole(ISSUER_ROLE) {
    function burnExpired() public virtual {
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
