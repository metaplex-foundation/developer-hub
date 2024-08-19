---
title: Create a Token Metadata NFT Collection on Solana with Candy Machine
metaTitle: Create a Token Metadata TM NFT Collection on Solana with Candy Machine | Candy Machine
description: How to create an NFT collection on the Solana blockchain using Candy Machine.
---

If you are looking to launch an NFT Collection on Solana Solana the Sugar CLI toolkit will abstract some of the trickier settup and management steps for you providing you with a automated launch system to create Candy Machines on the Solana blockchain.

## Prerequisite

- Solana CLI installed and configured. [Installation](https://docs.solanalabs.com/cli/install)
  - File system wallet generated using the CLI
  - Wallet to be funded either with either mainnet or devnet SOL

## Initial Setup

### Installing Sugar

#### Mac/Linux

```
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

#### Windows

you can install Sugar using the following url to download the installation executable:

```
https://github.com/metaplex-foundation/winstaller/releases/latest/download/winstaller.exe
```

Try to run the binary by double-clicking on it. If you get a pop-up message warning about an untrusted binary try clicking More Info and then Run Anyway.

## Preparing Your Assets

NFTs have two fundemental parts, the `image`, and the `metadata`.

The image is what is showcased and displayed in wallets and markets while the `metadata` contains all the relevant information for that NFT on the blockchain such as `name`, what link to find the `image` at, the `attributes` of the NFT.

### Assets Folder

When executing commands from Sugar, Sugar will expecting to find an `assets` folder in the directory you are launching the command from.

Both your images and your metadata files will reside in the `assets` folder.

### File Naming

Images and Metadata JSON files are expected to follow an incremental index naming convention starting from 0.

If any indices are missed of if the `image` and `metadata` folders do not include the same amount of files then folder validation will fail.

```
assets/
├─ 0.png
├─ 0.json
├─ 1.png
├─ 1.json
├─ 2.png
├─ 2.json
├─ ...
```

### Metadata JSON

{% partial file="token-standard-full.md" /%}

```json
{
  "name": "My NFT #1",
  "description": "My NFT Collection",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

### Example Images and Metadata

If you wish to use example images and metadata to create your Candy Machine you can download them from our github here in zip format by clicking the green `code` button and selecting the `zip format.

[https://github.com/metaplex-foundation/example-candy-machine-assets](https://github.com/metaplex-foundation/example-candy-machine-assets)

Alternatively if you have git installed you can clone the assets to your system or download a zipped copy from the link provided

```
git clone https://github.com/metaplex-foundation/example-candy-machine-assets.git
```

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

For the creation of the Collection we need the same details we would as a NFT Asset which is a `image` file, and a `metadata` json file. These would be placed in the root of the `asset/` folder folder like so:

```
assets/
├─ collection.jpg/
├─ collection.json/
├─ 0.png
├─ 0.json
├─ 1.png
├─ 1.json
├─ 2.png
├─ 2.json
├─ ...
```

The collection metadata file is the same format as a NFT Asset json file. In the case of the Collection you can omit filling out the `attributes` field.

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

## Sugar

By default **Sugar** will use the same config configuration file used by the Solana CLI to load the default values to use such as:

- The wallet set by Solana CLI
- The RPC URL set by Solana CLI

### Sugar Launch

Once your assets folder is in good order you can start the deployment process with **Sugar**. The first command we will run is

```shell
sugar launch
```

This will start **Sugars** CLI process to gather information regarding the deployment of your Candy Machine.

If `sugar` does not find a configuration file it was ask you to create one.

The following questions will then be asked for you till fill out

```
Found xx file pairs in "assets". Is this how many NFTs you will have in your candy machine?
```

```
Found symbol "xxxx" in your metadata file. Is this value correct?
```

```
Found value xxx for seller fee basis points in your metadata file. Is this value correct?
```

```
Do you want to use a sequential mint index generation? We recommend you choose no.
```

```
How many creator wallets do you have? (max limit of 4)
```

Create wallets are used to distribute royalties. If selection you will be asked to enter the `address` and `share` amount for each wallet.

```
Which extra features do you want to use? (use [SPACEBAR] to select options you want and hit [ENTER] when done)
```

For this guide we are going to leave `hidden settings` unselected and proceed by hitting `enter`

```
What upload method do you want to use?
```

For this guide we are going to select `Bundlr`

```
Do you want your NFTs to remain mutable? We HIGHLY recommend you choose yes.
```

Select yes(y) for this option so we can edit the NFTS in the future if we need to.

Sugar should now start the process of

- Creating and uploading the Collection NFT
- Uploading your assets to Bundlr
- Create the Candy Machine

If successful you will be greated with the follwing message but containing your own Candy Machine address within the link:

```
https://www.solaneyes.com/address/Beag81WvAPUCeFpJ2qFnvd2f1CFCpQBf3abTJXA1fH9o?cluster=devnet
```

Congrations you just created a Candy Machine on Solana.
If you click the above link you can view your Candy Machine details on chain.

### Updating the Candy Machine with Guards and Groups

Currently your Candy Machine has no Guards attatched. By default if no Candy Guard is attatched to the Candy Machine only the **mint authoirty** (which is you) can mint from the Candy Machine.

So solve this we have to attatch Guards to the Candy Machine which allows the public to mint from the Candy Machine following a set of rules. For example we might want the public to be able to mint from the Candy Machine while charging the user 1 SOL. For this we can use a **Sol Payment Guard**.

#### Adding Guard (SOL Payment)

To add the Sol Payment Guard to the Candy Machine we will need to open up the `config.json` file that Sugar generated in the root of our folder where we launched `sugar launch` in the terminal.

The config file will look like this:

```json
{
  "tokenStandard": "nft",
  "number": 16,
  "symbol": "NUMBERS",
  "sellerFeeBasisPoints": 500,
  "isMutable": true,
  "isSequential": false,
  "creators": [
    {
      "address": "B1kwbSHRiXFPYvNbuhCX92ibngzxdmfBzfaJYuy9WYp5",
      "share": 100
    }
  ],
  "uploadMethod": "bundlr",
  "ruleSet": null,
  "awsConfig": null,
  "sdriveApiKey": null,
  "nftStorageAuthToken": null,
  "shdwStorageAccount": null,
  "pinataConfig": null,
  "hiddenSettings": null,
  "guards": null,
  "maxEditionSupply": null
}
```

Here we can edit the `guards` field towards the end of the configuration file and fill out the destination address we want the SOL Payment to go to.

```json
"guards": {
    "default": {
        "solPayment": {
            "value": 1,
            "destination": "11111111111111111111111111111111"
        }
    }
},
```

Once you have added the guard to the `config.json` save the file and run the command:

```
sugar guard add
```

If you had previously already created a Candy Guard you can instead run the command:

```
sugar guard update
```

This will create the Candy Guard and add the **SOL Payment Guard** to default guard list.

## Show the Candy Machine

To show the Candy Machine details in your terminal you can run the command

```shell
sugar show
```

This will list out all the Candy Machine and Guard Details minus all the inserted items.

## Show the Candy Guard

To show the Candy Machine details in your terminal you can run the command

```shell
sugar guard show
```

This will list out all the Candy Machine and Guard Details minus all the inserted items.

## Next Steps

Now you have a functioning Candy Machine you would now need to host the Candy Machine on a web UI so that people are able to mint from the Candy Machine.

You can either generate your own UI and use the `umi` client wrapper and `mpl-candy-machine` SDK or you can use a prebuilt community UI and just supply the details of your Candy Machine.

### Developing a UI Resources

- nextJS/React recommended
- Metaplex Umi - [https://developers.metaplex.com/umi](https://developers.metaplex.com/umi)
- Metaplex Candy Machine SDK - [https://developers.metaplex.com/candy-machine](https://developers.metaplex.com/candy-machine)

### Further Reading
- [Sugar CLI Docs](/candy-machine/sugar)