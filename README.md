_see the 'Project Instructions' section for running instructions_

### PROJECT Description 

This application is demonstration of the EVM functionality on the Filecoin network (FEVM), using Solidity Smart Contracts that interact with the native Filecoin APIs.

It awards Watermark NFTs to Filecoin Storage providers. Ownership of this NFT provides Storage Clients or other users an easy way to visualise active and high-performing providers on the system. 

Providers who successfully complete a set number of storage deals within a timeframe (e.g. last 3 months) are eligble to claim these tokens from the Watermark collection.

To claim them, Storage Providers need to submit their deal IDs for independent verification via a contract calling the Filecoin APIs. If confirmed, the deals will be registered to the system. Once they are confident they have accumulated sufficient deals (currently >3), providers can try to claim an NFT. 

Do note that these NFTs do not last forever. Their duration is customisable by the contract Admin, and thereafter, they will be expired by the system. To keep their NFT, providers will need to submit newer deals for verification. This is to ensure that the NFT is proof of recent successfully activity on the Filecoin network.


### PROJECT Features

#### Role-based access control 
Storage providers can verify their deals claim an NFT if they have enough recent deals. 
Contract Admin can remove NFTs that are past their validity period.

#### Time-based checks 
To incentivise recent deals, the contract Admin can adjust time window for relevant deals to be included, and tweak the expiry period of NFTs.

#### Open Deal Registry
Anyone can submit deals for verification. Usually it would be the Deal Provider who has incentive to do so, but Storage Clients can also do so if they are satisfied with the service.


### PROJECT Challenges/ Limitations (as of 12 March 2023)

The nature of the `@zondax/filecoin-solidity` libraries created testing challenges.

The recommended approach by the authors was to directly these files into application code, however, this made mocking the code locally difficult. 

My initial approach was to isolate these calls in specific function calls and mock those calls out using Smock or Waffle. But this did not work, possibly as these fucntion calls ultimately required transactions on the chain through the Actor construct to call the Filecoin APIs, and could not be properly mocked out.

As a workaround, I had to introduce Dependency Injection by wrapping the library in a separate smart contract, and then passing the contract to consumer contracts during initialisation. 

The Filecoin APIs also proved to be limited as there didn't seem to be Solidity-ready APIs for fetching the blockheight of the blockchain. This had to be a paramter controlled by the contract Admnin.

Instead of using ERC-721 as the NFT standard, a more suitable choice could have been the ERC-4097 standard for short-lived NFTs, avoiding the need for a manual burn when it was time to expire the NFT. However, the standard is not codified in OpenZepellin, this would only be possible in future upgrades.

Finally, being a proof-of-concept, the architecture of the project did not fully implement separation of concerns. For instance, the WatermarkTokenERC721 would be better split into a separate AddressOracle for managing the mapping of Ethereum-style to F0-style addresses. 


### PROJECT interaction

#### Installation and Set UP
1. 
```
yarn install
```

2. Add your private keys as environment variables
Create a `.env` file from `.env.example`.
You can use the same private key for both if you do not intend to actually deploy. 
*Take care not to commit this file!* By default it is ignored by Git.

3. Get the address for your private keys.
Modify the `get-address.js` script accordingly to fetch the address for the respective private key. 
```
yarn hardhat get-address
```

4. Get some testnet FIL from the [Hyperspace testnet faucet](https://hyperspace.yoga/#faucet) if you need to.


#### Local Testing
```
yarn test
```


#### Existing contracts deployed on Hyperspace
There is a set of contracts deployed to HyperSpace with these details.

Deployer Account Address - 0xA6F5b661F40DCE124Fd1E19EE5ebd0f04956B0C9

Storage Provider (Mokced) Account Address - 0xd08aAa72633414877Cb53CF2fb2b62B980f24Fd1

MarketAPIWrapped deployed at 0xD9994B2F7ad6A6e7fEceA316B3B181aCc20f09a4

DealRegistry deployed at 0x880A07d4c8de187D3692B7717207ba96d6936931

WatermarkTokenERC721 deployed at 0xE36ACdE139474e3f32BFefC95B0BE805E14b415B

A WatermarkTokenERC721 has been issued to 0xd08aAa72633414877Cb53CF2fb2b62B980f24Fd1 with ID 0.
You can verify this by running command (runnable by any account).
```
yarn hardhat query-nft --id "0"
```
The NFT was awarded for Deals 50, 51, 52, 53, which were previously registered, you can verify this
```
yarn hardhat is-deal-registered --dealid "50"
```


#### Deployment
1. Complete installation and set up if not done.
Note you need two separate accounts if you wish to try as both an Admin and a Storage provider. 

2. Run the hardhat deploy task which will deploy these contracts in order.
```
yarn hardhat deploy
```
- MarketAPIWrapped
- DealRegistry
- WatermarkTokenERC721
Take note of the relevant addresses.

3. Update the relevant contract addresses in the relevant task scripts under the `/tasks` folder. They are now hardcoded.


4. Run these commands 

    As any account, register at least 4 deals. To make things work they need to be completed by the same provider, e.g. provider ID 1000
    ```
    yarn hardhat save-deal --dealid "51"
    ```

    As any account, you can onfirm that the deals are registered.
    ```
    yarn hardhat is-deal-registered --dealid "50"
    ```

    As admin, map an address you control to the provider which completed those deals
    ```
    yarn hardhat admin-add-address --ethaddress "0xd08aAa72633414877Cb53CF2fb2b62B980f24Fd1" --f0address "1000"
    ```

    As admin, set blockheight, notice the high blockheight in sync with the tokenValidity, so that all registered transactions will be counted for testing only
    ```
    yarn hardhat admin-set-block-height --blockheight "99999999"
    ```

    As a storage provider, claim your NFT (use the Account that has been mapped to the Provider) 
    ```
    yarn hardhat provider-claim-nft
    ```

    As any acccount, query to confirm that an NFT exists and is correctly assigned
    ```
    yarn hardhat query-nft --id "0"
    ```
