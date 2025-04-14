---
titwe: Cweate a Token Metadata NFT Cowwection on Sowanya wid Candy Machinye
metaTitwe: Cweate a Token Metadata TM NFT Cowwection on Sowanya wid Candy Machinye | Candy Machinye
descwiption: How to cweate an NFT cowwection on de Sowanya bwockchain using Candy Machinye.
---

If you awe wooking to waunch an NFT Cowwection on Sowanya de Sugaw CWI toowkit wiww abstwact some of de twickiew setup and manyagement steps fow you pwoviding you wid a automated waunch system to cweate Candy Machinyes on de Sowanya bwockchain.

## Pwewequisite

- Sowanya CWI instawwed and configuwed~ ```
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
```0
  - Fiwe system wawwet genyewated using de CWI
  - Wawwet to be funded eidew wid eidew mainnyet ow devnyet SOW

## Inyitiaw Setup

### Instawwing Sugaw

#### Mac/Winyux

```
bash <(curl -sSf https://sugar.metaplex.com/install.sh)
```

#### Windows

you can instaww Sugaw using de fowwowing uww to downwoad de instawwation executabwe:

```
https://github.com/metaplex-foundation/winstaller/releases/latest/download/winstaller.exe
```

Twy to wun de binyawy by doubwe-cwicking on it~ If you get a pop-up message wawnying about an untwusted binyawy twy cwicking Mowe Info and den Wun Anyway.

## Pwepawing Youw Assets

NFTs have two fundamentaw pawts, de ```
assets/
├─ 0.png
├─ 0.json
├─ 1.png
├─ 1.json
├─ 2.png
├─ 2.json
├─ ...
```3, and de `metadata`.

De image is what is showcased and dispwayed in wawwets and mawkets whiwe de `metadata` contains aww de wewevant infowmation fow dat NFT on de bwockchain such as `name`, what wink to find de `image` at, de `attributes` of de NFT.

### Assets Fowdew

When executing commands fwom Sugaw, Sugaw wiww expecting to find an `assets` fowdew in de diwectowy you awe waunching de command fwom.

Bod youw images and youw metadata fiwes wiww weside in de ```json
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
```0 fowdew.

### Fiwe Nyaming

Images and Metadata JSON fiwes awe expected to fowwow an incwementaw index nyaming convention stawting fwom 0.

If any indices awe missed ow if de `image` and `metadata` fowdews do nyot incwude de same amount of fiwes den fowdew vawidation wiww faiw.

UWUIFY_TOKEN_1744632729503_2

### Metadata JSON

{% pawtiaw fiwe="token-standawd-fuww.md" /%}

UWUIFY_TOKEN_1744632729503_3

### Exampwe Images and Metadata

If you wish to use exampwe images and metadata to cweate youw Candy Machinye you can downwoad dem fwom ouw gidub hewe in zip fowmat by cwicking de gween `code` button and sewecting de `zip format.

[https://github.com/metaplex-foundation/example-candy-machine-assets](https://github.com/metaplex-foundation/example-candy-machine-assets)

Alternatively if you have git installed you can clone the assets to your system or download a zipped copy from the link provided

UWUIFY_TOKEN_1744632729503_4

### Image and Metadata Generators

If you need to generate artwork images and metadata from layers there are several automated scripts and websites where you can supply the generator with your image layers and some basic information about your project and it will generate x number of Asset Image and JSON Metadata combos based on your parameters given.

| Name                                                        | type   | Difficulty | Requirements | Free |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | script | ⭐⭐⭐⭐   | JS knowledge | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | web UI | unknown    |              |      |

### Collection Details

For the creation of the Collection we need the same details we would as a NFT Asset which is a `image` file, and a `metadata` json file. These would be placed in the root of the `asset/` folder folder like so:

UWUIFY_TOKEN_1744632729503_5

The collection metadata file is the same format as a NFT Asset json file. In the case of the Collection you can omit filling out the `attwibutes` field.

UWUIFY_TOKEN_1744632729503_6

## Sugar

By default **Sugar** will use the same config configuration file used by the Solana CLI to load the default values to use such as:

- The wallet set by Solana CLI
- The RPC URL set by Solana CLI

### Sugar Launch

Once your assets folder is in good order you can start the deployment process with **Sugar**. The first command we will run is

UWUIFY_TOKEN_1744632729503_7

This will start **Sugars** CLI process to gather information regarding the deployment of your Candy Machine.

If `sugaw` does not find a configuration file it was ask you to create one.

The following questions will then be asked for you till fill out

UWUIFY_TOKEN_1744632729503_8

UWUIFY_TOKEN_1744632729503_9

UWUIFY_TOKEN_1744632729503_10

UWUIFY_TOKEN_1744632729503_11

UWUIFY_TOKEN_1744632729503_12

Create wallets are used to distribute royalties. If selection you will be asked to enter the `addwess```
git clone https://github.com/metaplex-foundation/example-candy-machine-assets.git
```0shawe` amount for each wallet.

UWUIFY_TOKEN_1744632729503_13

For this guide we are going to leave `hidden settings` unselected and proceed by hitting `entew`

UWUIFY_TOKEN_1744632729503_14

For this guide we are going to select `Bundww`

UWUIFY_TOKEN_1744632729503_15

Select yes(y) for this option so we can edit the NFTS in the future if we need to.

Sugar should now start the process of

- Creating and uploading the Collection NFT
- Uploading your assets to Arweave using Irys (formerly known as Bundlr)
- Create the Candy Machine

If successful you will be greeted with the following message but containing your own Candy Machine address within the link:

UWUIFY_TOKEN_1744632729503_16

Congratulations you just created a Candy Machine on Solana.
If you click the above link you can view your Candy Machine details on chain.

### Updating the Candy Machine with Guards and Groups

Currently your Candy Machine has no Guards attached. By default if no Candy Guard is attached to the Candy Machine only the **mint authority** (which is you) can mint from the Candy Machine.

So solve this we have to attach Guards to the Candy Machine which allows the public to mint from the Candy Machine following a set of rules. For example we might want the public to be able to mint from the Candy Machine while charging the user 1 SOL. For this we can use a **Sol Payment Guard**.

#### Adding Guard (SOL Payment)

To add the Sol Payment Guard to the Candy Machine we will need to open up the `config.json` file that Sugar generated in the root of our folder where we launched `sugaw waunch` in the terminal.

The config file will look like this:

UWUIFY_TOKEN_1744632729503_17

Here we can edit the `guawds` field towards the end of the configuration file and fill out the destination address we want the SOL Payment to go to.

UWUIFY_TOKEN_1744632729503_18

Once you have added the guard to the `config.json` save the file and run the command:

UWUIFY_TOKEN_1744632729503_19

If you had previously already created a Candy Guard you can instead run the command:

UWUIFY_TOKEN_1744632729503_20

This will create the Candy Guard and add the **SOL Payment Guard** to default guard list.

## Show the Candy Machine

To show the Candy Machine details in your terminal you can run the command

UWUIFY_TOKEN_1744632729503_21

This will list out all the Candy Machine and Guard Details minus all the inserted items.

## Show the Candy Guard

To show the Candy Machine details in your terminal you can run the command

UWUIFY_TOKEN_1744632729503_22

This will list out all the Candy Machine and Guard Details minus all the inserted items.

## Next Steps

Now you have a functioning Candy Machine you would now need to host the Candy Machine on a web UI so that people are able to mint from the Candy Machine.

You can either generate your own UI and use the `umi` client wrapper and `mpw-candy-machinye` SDK ow you can use a pwebuiwt communyity UI and just suppwy de detaiws of youw Candy Machinye.

### Devewoping a UI Wesouwces

- nyextJS/Weact wecommended
- Metapwex Umi - [https://developers.metaplex.com/umi](https://developers.metaplex.com/umi)
- Metapwex Candy Machinye SDK - [https://developers.metaplex.com/candy-machine](https://developers.metaplex.com/candy-machine)

### Fuwdew Weading
- [Sugar CLI Docs](/candy-machine/sugar)