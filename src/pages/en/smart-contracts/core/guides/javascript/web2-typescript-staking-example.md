---
title: Create Core Staking Using Javascript
metaTitle: Create Core Staking Using Javascript | Core Guides
description: This guide will show you how to leverage the FreezeDelegate and Attribute plugin to create a staking platform using web2 practices with a backend server.
updated: '01-31-2026'
---
This developer guide demonstrates how to create a staking program for your collection using only TypeScript, leveraging the attribute plugin and freeze delegate. **This approach eliminates the need for a smart contract** to track staking time and manage staking/unstaking, making it more accessible for Web2 developer.
## Starting off: Understanding the Logic behind the program
This program operates with a standard TypeScript backend and uses the asset keypair authority in the secret to sign attribute changes.
**To implement this example, you will need the following components:**
- **An Asset**
- **A Collection** (optional, but relevant for this example)
- **The FreezeDelegate Plugin**
- **The Attribute Plugin**
### The Freeze Delegate Plugin
The **Freeze Delegate Plugin** is an **owner managed plugin**, that means that it requires the owner's signature to be applied to the asset.
This plugin allows the **delegate to freeze and thaw the asset, preventing transfers**. The asset owner or plugin authority can revoke this plugin at any time, except when the asset is frozen (in which case it must be thawed before revocation).
**Using this plugin is lightweight**, as freezing/thawing the asset involves just changing a boolean value in the plugin data (the only argument being Frozen: bool).
_Learn more about it [here](/smart-contracts/core/plugins/freeze-delegate)_
### The Attribute Plugin
The **Attribute Plugin** is an **authority managed plugin**, that means that it requires the authority's signature to be applied to the asset. For an asset included in a collection, the collection authority serves as the authority since the asset's authority field is occupied by the collection address.
This plugin allows for **data storage directly on the assets, functioning as onchain attributes or traits**. These traits can be accessed directly by onchain programs since they aren’t stored off-chain as it was for the mpl-program.
**This plugin accepts an AttributeList field**, which consists of an array of key and value pairs, both of which are strings.
_Learn more about it [here](/smart-contracts/core/plugins/attribute)_
### The program Logic
For simplicity, this example includes only two instructions: the **stake** and **unstake** functions since are essential for a staking program to work as intended. While additional instructions, such as a **spendPoint** instruction, could be added to utilize accumulated points, this is left to the reader to implement. 
_Both the Stake and Unstake functions utilize, differently, the plugins introduced previously_.
Before diving into the instructions, let’s spend some time talking about the attributes used, the `staked` and `staked_time` keys. The `staked` key indicates if the asset is staked and when it was staked if it was (unstaked = 0, staked = time of staked). The `staked_time` key tracks the total staking duration of the asset, updated only after an asset get’s unstaked.
**Instructions**:
- **Stake**: This instruction applies the Freeze Delegate Plugin to freeze the asset by setting the flag to true. Additionally, it updates the`staked` key in the Attribute Plugin from 0 to the current time.
- **Unstake**: This instruction changes the flag of the Freeze Delegate Plugin and revokes it to prevent malicious entities from controlling the asset and demanding ransom to thaw it. It also updates the `staked` key to 0 and sets the `staked_time` to the current time minus the staked timestamp.
## Building the Program: A Step-by-Step Guide
Now that we understand the logic behind our program, **it’s time to dive into the code and bring everything together**!
### Dependencies and Imports
Before writing our program, let's look at what package we need and what function from them to make sure our program works! 
Let's look at the different packages used for this example:
```json
"dependencies": {
    "@metaplex-foundation/mpl-core": "1.1.0-alpha.0",
    "@metaplex-foundation/mpl-token-metadata": "^3.2.1",
    "@metaplex-foundation/umi-bundle-defaults": "^0.9.1",
    "bs58": "^5.0.0",
    "typescript": "^5.4.5"
}
```
And the different functions from those packages are as follow:
```typescript
import { createSignerFromKeypair, signerIdentity, publicKey, transactionBuilder, Transaction } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { addPlugin, updatePlugin, fetchAsset, removePlugin } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';
```
### Umi and Core SDK Overview
In this guide, we’ll use both **Umi** and the **Core SDK** to create all necessary instructions. 
**Umi is a modular framework for building and using JavaScript clients for Solana programs**. It provides a zero-dependency library that defines a set of core interfaces, enabling libraries to operate independently of specific implementations. 
_For more information, you can find an overview [here](/dev-tools/umi/getting-started)_
**The basic Umi setup for this example will look like this**:
```typescript
const umi = createUmi("https://api.devnet.solana.com", "finalized")
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
```
This setup involves:
- **Establishing a connection with Devnet** for our Umi provider
- **Setting up a keypair** to be used as both the authority and payer (umi.use(signerIdentity(...)))
**Note**: If you prefer to use a new keypair for this example, you can always use the generateSigner() function to create one.
### Creating an Asset and Adding it to a Collection
Before diving into the logic for staking and unstaking, we should learn **how to create an asset from scratch and add it to a collection**.
**Creating a Collection**:
```typescript
(async () => {
   // Generate the Collection KeyPair
   const collection = generateSigner(umi)
   console.log("\nCollection Address: ", collection.publicKey.toString())
   // Generate the collection
   const tx = await createCollection(umi, {
       collection: collection,
       name: 'My Collection',
       uri: 'https://example.com/my-collection.json',
   }).sendAndConfirm(umi)
   // Deserialize the Signature from the Transaction
   const signature = base58.deserialize(tx.signature)[0];
   console.log(`\nCollection Created: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
})();
```
**Creating an Asset and Adding it to the Collection:**
```typescript
(async () => {
   // Generate the Asset KeyPair
   const asset = generateSigner(umi)
   console.log("\nAsset Address: ", asset.publicKey.toString())
   // Pass and Fetch the Collection
   const collection = publicKey("<collection_pubkey>")
   const fetchedCollection = await fetchCollection(umi, collection);
   // Generate the Asset
   const tx = await create(umi, {
       name: 'My NFT',
       uri: 'https://example.com/my-nft.json',
       asset,
       collection: fetchedCollection,
   }).sendAndConfirm(umi)
   // Deserialize the Signature from the Transaction
   const signature = base58.deserialize(tx.signature)[0];
   console.log(`Asset added to the Collection: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
})();
```
### The Staking Instruction
Here's the full **Staking instruction** 
We begin by using the `fetchAsset(...)` instruction from the mpl-core SDK to retrieve information about an asset, including whether it has the attribute plugin and, if so, the attributes it contains.
```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```
1. **Check for the Attribute Plugin**
If the asset does not have the attribute plugin, add it and populate it with the `staked` and `stakedTime` keys.
```typescript
if (!fetchedAsset.attributes) {
    tx = await transactionBuilder().add(addPlugin(umi, {
        asset,
        collection,
        plugin: {
        type: "Attributes",
        attributeList: [
            { key: "staked", value: currentTime },
            { key: "stakedTime", value: "0" },
        ],
        },
    })).add(
        [...]
    )
} else {
```
2. **Check for Staking Attributes**:
If the asset has the staking attribute, ensure it contains the staking attributes necessary for the staking instruction. 
```typescript
} else {
    const assetAttribute = fetchedAsset.attributes.attributeList;
    const isInitialized = assetAttribute.some(
        (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
    );
```
If it does, check if the asset is already staked and update the `staked` key with the current timeStamp as string:
```typescript
if (isInitialized) {
    const stakedAttribute = assetAttribute.find(
        (attr) => attr.key === "staked"
    );
    if (stakedAttribute && stakedAttribute.value !== "0") {
        throw new Error("Asset is already staked");
    } else {
        assetAttribute.forEach((attr) => {
            if (attr.key === "staked") {
                attr.value = currentTime;
            }
        });
    }
} else {
```
If it doesn't, add them to the existing attribute list.
```typescript
} else {
    assetAttribute.push({ key: "staked", value: currentTime });
    assetAttribute.push({ key: "stakedTime", value: "0" });
}
```
3. **Update the Attribute Plugin**:
Update the attribute plugin with the new or modified attributes.
```typescript
tx = await transactionBuilder().add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "Attributes",
        attributeList: assetAttribute,
    },
})).add(
    [...]
)
```
4. **Freeze the Asset**
Whether the asset already had the attribute plugin or not, freeze the asset in place so it can't be traded
```typescript
tx = await transactionBuilder().add(
    [...]
).add(addPlugin(umi, {
    asset,
    collection,
    plugin: {
        type: "FreezeDelegate",
        frozen: true,
        authority: { type: "UpdateAuthority" }
    }
})).buildAndSign(umi);
```
**Here's the full instruction**:
```typescript
(async () => {
    // Pass the Asset and Collection
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")
    // Fetch the Asset Attributes
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("\nThis is the current state of your Asset Attribute Plugin: ", fetchedAsset.attributes);
    const currentTime = new Date().getTime().toString();
    let tx: Transaction;
    // Check if the Asset has an Attribute Plugin attached to it, if not, add it
    if (!fetchedAsset.attributes) {
        tx = await transactionBuilder().add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
            type: "Attributes",
            attributeList: [
                { key: "staked", value: currentTime },
                { key: "stakedTime", value: "0" },
            ],
            },
        })).add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
                type: "FreezeDelegate",
                frozen: true,
                authority: { type: "UpdateAuthority" }
            }
        })).buildAndSign(umi);
    } else {
        // If it is, fetch the Asset Attribute Plugin attributeList
        const assetAttribute = fetchedAsset.attributes.attributeList;
        // Check if the Asset is already been staked
        const isInitialized = assetAttribute.some(
            (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
        );
        // If it is, check if it is already staked and if not update the staked attribute
        if (isInitialized) {
            const stakedAttribute = assetAttribute.find(
                (attr) => attr.key === "staked"
            );
            if (stakedAttribute && stakedAttribute.value !== "0") {
                throw new Error("Asset is already staked");
            } else {
                assetAttribute.forEach((attr) => {
                    if (attr.key === "staked") {
                        attr.value = currentTime;
                    }
                });
            }
        } else {
            // If it is not, add the staked & stakedTime attribute
            assetAttribute.push({ key: "staked", value: currentTime });
            assetAttribute.push({ key: "stakedTime", value: "0" });
        }
        // Update the Asset Attribute Plugin and Add the FreezeDelegate Plugin
        tx = await transactionBuilder().add(updatePlugin(umi, {
            asset,
            collection,
            plugin: {
            type: "Attributes",
                attributeList: assetAttribute,
            },
        })).add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
                type: "FreezeDelegate",
                frozen: true,
                authority: { type: "UpdateAuthority" }
            }
        })).buildAndSign(umi);
    }
    // Deserialize the Signature from the Transaction
    console.log(`Asset Staked: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=devnet-alpha`);
})();
```
### The Unstaking Instruction
The unstaking instruction will be even easier simpler because, since the unstaking instruction can be called only after the staking instruction, many of the checks are inherently covered by the staking instruction itself. 
We start by calling the `fetchAsset(...)` instruction to retrieve all information about the asset.
```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```
1. **Run all the checks for the attribute plugin**
To verify if an asset has already gone through the staking instruction, **the instruction check the attribute plugin for the following**:
- **Does the attribute plugin exist on the asset?**
- **Does it have the staked key?**
- **Does it have the stakedTime key?**
If any of these checks are missing, the asset has never gone through the staking instruction.
```typescript
if (!fetchedAsset.attributes) {
    throw new Error(
        "Asset has no Attribute Plugin attached to it. Please go through the stake instruction before."
    );
}
const assetAttribute = fetchedAsset.attributes.attributeList;
const stakedTimeAttribute = assetAttribute.find((attr) => attr.key === "stakedTime");
if (!stakedTimeAttribute) {
    throw new Error(
        "Asset has no stakedTime attribute attached to it. Please go through the stake instruction before."
    );
}
const stakedAttribute = assetAttribute.find((attr) => attr.key === "staked");
if (!stakedAttribute) {
    throw new Error(
        "Asset has no staked attribute attached to it. Please go through the stake instruction before."
    );
}
```
Once we confirm that the asset has the staking attributes, **we check if the asset is currently staked**. If it is staked, we update the staking attributes as follows:
- Set `Staked` field to zero
- Update `stakedTime` to `stakedTime` + (currentTimestamp - stakedTimestamp)
```typescript
if (stakedAttribute.value === "0") {
    throw new Error("Asset is not staked");
} else {
    const stakedTimeValue = parseInt(stakedTimeAttribute.value);
    const stakedValue = parseInt(stakedAttribute.value);
    const elapsedTime = new Date().getTime() - stakedValue;
    assetAttribute.forEach((attr) => {
        if (attr.key === "stakedTime") {
            attr.value = (stakedTimeValue + elapsedTime).toString();
        }
        if (attr.key === "staked") {
            attr.value = "0";
        }
    });
}
```
2. **Update the Attribute Plugin**
Update the attribute plugin with the new or modified attributes.
```typescript
tx = await transactionBuilder().add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
        type: "Attributes",
        attributeList: assetAttribute,
    },
})).add(
    [...]
).add(
    [...]
).buildAndSign(umi);
```
3. **Thaw and remove the FreezeDelegate Plugin**
At the end of the instruction, thaw the asset and remove the FreezeDelegate plugin so the asset is `free` and not controlled by the `update_authority`
```typescript
tx = await transactionBuilder().add(
    [...]
).add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "FreezeDelegate",
    frozen: false,
    },
})).add(removePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "FreezeDelegate",
    },
})).buildAndSign(umi);
```
**Here's the full instruction**:
```typescript
(async () => {
    // Pass the Asset and Collection
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")
    let tx: Transaction;
    // Fetch the Asset Attributes
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("This is the current state of your Asset Attribute Plugin", fetchedAsset.attributes);
    // If there is no attribute plugin attached to the asset, throw an error
    if (!fetchedAsset.attributes) {
      throw new Error(
        "Asset has no Attribute Plugin attached to it. Please go through the stake instruction before."
      );
    }
    
    const assetAttribute = fetchedAsset.attributes.attributeList;
    // Check if the asset has a stakedTime attribute attached to it, if not throw an error
    const stakedTimeAttribute = assetAttribute.find((attr) => attr.key === "stakedTime");
    if (!stakedTimeAttribute) {
      throw new Error(
        "Asset has no stakedTime attribute attached to it. Please go through the stake instruction before."
      );
    }
    // Check if the asset has a staked attribute attached to it, if not throw an error
    const stakedAttribute = assetAttribute.find((attr) => attr.key === "staked");
    if (!stakedAttribute) {
      throw new Error(
        "Asset has no staked attribute attached to it. Please go through the stake instruction before."
      );
    }
    // Check if the asset is already staked (!0), if not throw an error.
    if (stakedAttribute.value === "0") {
      throw new Error("Asset is not staked");
    } else {
      const stakedTimeValue = parseInt(stakedTimeAttribute.value);
      const stakedValue = parseInt(stakedAttribute.value);
      const elapsedTime = new Date().getTime() - stakedValue;
      // Update the stakedTime attribute to the new value and the staked attribute to 0
      assetAttribute.forEach((attr) => {
        if (attr.key === "stakedTime") {
          attr.value = (stakedTimeValue + elapsedTime).toString();
        }
        if (attr.key === "staked") {
          attr.value = "0";
        }
      });
    }
    // Update the Asset Attribute Plugin with the new attributeList
    // then Update the Asset FreezeDelegate Plugin to thaw the asset
    // and then Remove the FreezeDelegate Plugin from the asset
    tx = await transactionBuilder().add(updatePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "Attributes",
        attributeList: assetAttribute,
      },
    })).add(updatePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "FreezeDelegate",
        frozen: false,
      },
    })).add(removePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "FreezeDelegate",
      },
    })).buildAndSign(umi);
     // Deserialize the Signature from the Transaction
     console.log(`Asset Unstaked: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=devnet-alpha`);
})();
```
## Conclusion
Congratulations! You are now equipped to create a staking solution for your NFT collection! If you want to learn more about Core and Metaplex, check out the [developer hub](/smart-contracts/core/getting-started).
