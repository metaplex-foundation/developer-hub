---
title: Create a Token Metadata NFT Collection on Solana with Candy Machine
metaTitle: Create a Token Metadata TM NFT Collection on Solana with Candy Machine | Candy Machine
description: How to create an NFT collection on the Solana blockchain using Candy Machine.
---

If you are looking to launch an NFT Collection on Solana Solana the Sugar CLI toolkit will abstract some of the trickier settup and management steps for you providing you with a automated launch system to create Candy Machines on the Solana blockchain.


## Prerequisite

- Solana CLI


## Initial Setup

### Installing Sugar

To install Sugar do this...

#### Mac/Linux
```
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

#### Windows

## Preparing Your Assets

NFTs have two fundemental parts, the `image`, and the `metadata`.

The image is what is showcased and displayed in wallets and markets while the `metadata` contains all the relevant information for that NFT on the blockchain such as `name`, what link to find the `image` at, the `attributes` of the NFT.

### Assets Folder

When executing commands such as `upload` Sugar will expecting to find an `assets` folder in the directory you are launching the command from.

The folder structure Sugar will expect is the following:

```
assets/
├─ images/
├─ metadata/
```

### File Naming

Images and Metadata JSON files are expected to follow an incremental index naming convention starting from 0.

If any indices are missed of if the `image` and `metadata` folders do not include the same amount of files then folder validation will fail.

```
assets/
├─ images/
│  ├─ 0.png
│  ├─ 1.png
│  ├─ 2.png
│  ├─ ...
├─ metadata/
│  ├─ 0.json
│  ├─ 1.json
│  ├─ 2.json
│  ├─ ...
```

### Example Images and Metadata

If you wish to use example images and metadata to create your Candy Machine you can download them from our github here.

[Example Assets](https://github.com/metaple-foundation)


### Image and Metadata Generators

If you need to generate artwork images and metadata from layers there are several automated scripts and websites where you can supply the generator with your image layers and some basic information about your project and it will generate x number of Asset Image and JSON Metadata combos based on your paramenters given.

| Name                                                        | type   | Difficulty | Requirements | Free |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | web UI | unknown    |              |      |


### Collection Details

For the creation of the Core Collection we need the same details we would as a Core NFT Asset which is a `image` file, and a `metadata` json file. These would be placed in the root of the `asset/` folder folder like so:

```
assets/
├─ images/
├─ metadata/
├─ collection.jpg/
├─ metadata.json/
```

The collection metadata file is the same format as a Core NFT Asset json file. In the case of the Core Collection you can omit filling out the `attributes` field.

```json
{
  "name": "My Collection",
  "description": "This is My Nft Collection",
  "image": "collection.jpg",
  "external_url": "https://example.com",
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }
    ],
    "category": "image"
  }
}
```

## Settings File

TODO: Not quite sure how this file is going to look yet but will most likely have stuff like

- chain (devnet/mainnet)
- rpc
- wallet location

## Guards and Groups

Candy Machines come with a powerful plugin system that allows you set different types of guards and groups which you buyers must forfil there conditions in order to be able to purchase from the Candy Machine.


// Don't know how much this has changed, just documenting original idea.
// But as JSON now can't use comments.

Create a `guards-and-groups.json` file in the directory you are launching `sugar` from and copy and paste the following code into the file.

```json
{
    guards: {
        // Uncomment (remove //) from the guards you want to use, and fill in the required fields.
        // You can also copy and paste the guards you want to use into the groups below.
        // To learn more about the guards listed below, visit the Core Candy Machine documentation at 
        // https://developers.metaplex.com/core-candy-machine

        // addressGate: some({ address: publicKey("11111111111111111111111111111111") }),
        // allocation: some({ id: 1, limit: 5 }),
        // allowList: some({ merkleRoot: processAllowList("example1.json") }),
        // assetBurn: some({ requiredCollection: publicKey("11111111111111111111111111111111") }),
        // assetBurnMulti: some({ num: 2, requiredCollection: publicKey("11111111111111111111111111111111") }),
        // assetMintLimit: some({ id: 1, limit: 5, requiredCollection: publicKey("11111111111111111111111111111111") }),
        // assetPayment: some({ destination: publicKey("11111111111111111111111111111111"), requiredCollection: publicKey("11111111111111111111111111111111") }),
        // assetPaymentMulti: some({ destination: publicKey("11111111111111111111111111111111"), num: 2, requiredCollection: publicKey("11111111111111111111111111111111") }),
        // botTax: some({ lamports: sol(0.01), lastInstruction: true }),
        // edition: { editionStartOffset: 0 },
        // endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        // freezeSolPayment: some({ destination: publicKey("11111111111111111111111111111111"), lamports: sol(1.5) }),
        // freezeTokenPayment: some({ amount: 300, destinationAta: publicKey(findAssociatedTokenPda(umi, { mint: publicKey("11111111111111111111111111111111"), owner: publicKey("11111111111111111111111111111111") })), mint: publicKey("11111111111111111111111111111111") }),
        // gatekeeper: some({ expireOnUse: true, gatekeeperNetwork: publicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6") }),
        // mintLimit: some({ id: 1, limit: 5 }),
        // nftBurn: some({ requiredCollection: publicKey("11111111111111111111111111111111") }),
        // nftGate: some({ requiredCollection: publicKey("11111111111111111111111111111111") }),
        // nftMintLimit: some({ id: 1, limit: 5, requiredCollection: publicKey("11111111111111111111111111111111") }),
        // nftPayment: some({ destination: publicKey("11111111111111111111111111111111"), requiredCollection: publicKey("11111111111111111111111111111111") }),
        // programGate: some({ additional: [publicKey("11111111111111111111111111111111"), publicKey("222222222222222222222222222222")] }),
        // redeemedAmount: some({ maximum: 300 }),
        // solFixedFee: some({ destination: publicKey("11111111111111111111111111111111"), lamports: sol(1.5) }),
        // solPayment: some({ destination: publicKey("11111111111111111111111111111111"), lamports: sol(1) }),
        // startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        // thirdPartySigner: some({ signerKey: publicKey("11111111111111111111111111111111") }),
        // token2022Payment: some({ amount: 300, destinationAta: findAssociatedTokenPda(umi, { mint: publicKey("11111111111111111111111111111111"), owner: publicKey("11111111111111111111111111111111") })[0], mint: publicKey("11111111111111111111111111111111") }),
        // tokenBurn: some({ amount: 300, mint: publicKey("11111111111111111111111111111111") }),
        // tokenGate: some({ amount: 300, mint: publicKey("11111111111111111111111111111111") }),
        // tokenPayment: some({ amount: 300, destinationAta: findAssociatedTokenPda(umi, { mint: publicKey("11111111111111111111111111111111"), owner: publicKey("11111111111111111111111111111111") })[0], mint: publicKey("11111111111111111111111111111111") })
    },
    groups: [
        // Uncomment (remove //) from the group , copy and paste in guards from above you wish to use.
        // you can also copy and paste the entire group to make multiple groups.
        {
            // label: "group1"
            // guards: {
            //     assetBurn: some({ requiredCollection: publicKey("11111111111111111111111111111111") }),
            //     botTax: some({ lamports: sol(0.01), lastInstruction: true }),
            //     endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
            //     solPayment: some({ destination: publicKey("11111111111111111111111111111111"), lamports: sol(1) }),
            //     startDate: some({ date: dateTime('2022-10-18T16:00:00Z') })
            // },
        },
        {
            // label: "group2"
            // guards: {
            //     botTax: some({ lamports: sol(0.01), lastInstruction: true }),
            //     endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
            //     mintLimit: some({ id: 1, limit: 5 }),
            //     nftBurn: some({ requiredCollection: publicKey("11111111111111111111111111111111") }),
            //     solPayment: some({ destination: publicKey("11111111111111111111111111111111"), lamports: sol(1) }),
            //     startDate: some({ date: dateTime('2022-10-18T16:00:00Z') })
            // },
        },
    ],

}
```

To enable or disable a guard remove the comment markers `//` from the line and fill in the details provided.

To enable a group remove all comment markers surrounding the group and copy and paste guards from the main guard list above and enabled them. To remove guards simple delete the the line of comment out the guard using `//`


## Create Candy Machine

Now that the preperation steps have been completed you can run

```shell
sugar lfg
```

Which will execute the following steps:

- Create Collection
- Upload Assets
- Create Candy Machine
- Insert Assets into the Candy Machine

The Candy Machine will be created with guards and groups enabled within the `guards-and-groups.json` file.

## Show the Candy Machine

To show the Candy Machine details in your terminal you can run the command

```shell
sugar show
```

This will list out all the Candy Machine and Guard Details minus all the inserted items.


## Update The Candy Machine

Updating the Candy Machine with different guards is as simple as editing the `guards-and-groups.json` file with the guard and groups changes and running

```shell
sugar update
```

## Next Steps

- UI for Candy Machine.

Maybe I make a quick UI we can put here so users can at least see there machines and get friends to mint from them as a test.
 Empty file added0  
src/pages/core-candy-machine/guides/index.md
