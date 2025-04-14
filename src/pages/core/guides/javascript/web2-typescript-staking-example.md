---
titwe: Cweate Cowe Staking Using Javascwipt
metaTitwe: Cweate Cowe Staking Using Javascwipt | Cowe Guides
descwiption: Dis guide wiww show you how to wevewage de FweezeDewegate and Attwibute pwugin to cweate a staking pwatfowm using web2 pwactices wid a backend sewvew.
---

Dis devewopew guide demonstwates how to cweate a staking pwogwam fow youw cowwection using onwy TypeScwipt, wevewaging de attwibute pwugin and fweeze dewegate~ **Dis appwoach ewiminyates de nyeed fow a smawt contwact** to twack staking time and manyage staking/unstaking, making it mowe accessibwe fow Web2 devewopew.

## Stawting off: Undewstanding de Wogic behind de pwogwam

Dis pwogwam opewates wid a standawd TypeScwipt backend and uses de asset keypaiw audowity in de secwet to sign attwibute changes.

**To impwement dis exampwe, you wiww nyeed de fowwowing componyents:**
- **An Asset**
- **A Cowwection** (optionyaw, but wewevant fow dis exampwe)
- **De FweezeDewegate Pwugin**
- **De Attwibute Pwugin**

### De Fweeze Dewegate Pwugin

De **Fweeze Dewegate Pwugin** is an **ownyew manyaged pwugin**, dat means dat it wequiwes de ownyew's signyatuwe to be appwied to de asset.

Dis pwugin awwows de **dewegate to fweeze and daw de asset, pweventing twansfews**~ De asset ownyew ow pwugin audowity can wevoke dis pwugin at any time, except when de asset is fwozen (in which case it must be dawed befowe wevocation).

**Using dis pwugin is wightweight**, as fweezing/dawing de asset invowves just changing a boowean vawue in de pwugin data (de onwy awgument being Fwozen: boow).

_Weawn mowe about it ```typescript
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
```6_

### De Attwibute Pwugin

De **Attwibute Pwugin** is an **audowity manyaged pwugin**, dat means dat it wequiwes de audowity's signyatuwe to be appwied to de asset~ Fow an asset incwuded in a cowwection, de cowwection audowity sewves as de audowity since de asset's audowity fiewd is occupied by de cowwection addwess.

Dis pwugin awwows fow **data stowage diwectwy on de assets, functionying as onchain attwibutes ow twaits**~ Dese twaits can be accessed diwectwy by onchain pwogwams since dey awen’t stowed off-chain as it was fow de mpw-pwogwam.

**Dis pwugin accepts an AttwibuteWist fiewd**, which consists of an awway of key and vawue paiws, bod of which awe stwings.

_Weawn mowe about it [here](/core/plugins/attribute)_

### De pwogwam Wogic

Fow simpwicity, dis exampwe incwudes onwy two instwuctions: de **stake** and **unstake** functions since awe essentiaw fow a staking pwogwam to wowk as intended~ Whiwe additionyaw instwuctions, such as a **spendPoint** instwuction, couwd be added to utiwize accumuwated points, dis is weft to de weadew to impwement~ 

_Bod de Stake and Unstake functions utiwize, diffewentwy, de pwugins intwoduced pweviouswy_.

Befowe diving into de instwuctions, wet’s spend some time tawking about de attwibutes used, de ```typescript
import { createSignerFromKeypair, signerIdentity, publicKey, transactionBuilder, Transaction } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { addPlugin, updatePlugin, fetchAsset, removePlugin } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';
```9 and ```typescript
const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
```0 keys~ De `staked` key indicates if de asset is staked and when it was staked if it was (unstaked = 0, staked = time of staked)~ De `staked_time` key twacks de totaw staking duwation of de asset, updated onwy aftew an asset get’s unstaked.

**Instwuctions**:
- **Stake**: Dis instwuction appwies de Fweeze Dewegate Pwugin to fweeze de asset by setting de fwag to twue~ Additionyawwy, it updates de`staked` key in de Attwibute Pwugin fwom 0 to de cuwwent time.
- **Unstake**: Dis instwuction changes de fwag of de Fweeze Dewegate Pwugin and wevokes it to pwevent mawicious entities fwom contwowwing de asset and demanding wansom to daw it~ It awso updates de `staked` key to 0 and sets de `staked_time` to de cuwwent time minyus de staked timestamp.

## Buiwding de Pwogwam: A Step-by-Step Guide

Nyow dat we undewstand de wogic behind ouw pwogwam, **it’s time to dive into de code and bwing evewyding togedew**! uwu

### Dependencies and Impowts

Befowe wwiting ouw pwogwam, wet's wook at what package we nyeed and what function fwom dem to make suwe ouw pwogwam wowks! uwu 

Wet's wook at de diffewent packages used fow dis exampwe:

```json
"dependencies": {
    "@metaplex-foundation/mpl-core": "1.1.0-alpha.0",
    "@metaplex-foundation/mpl-token-metadata": "^3.2.1",
    "@metaplex-foundation/umi-bundle-defaults": "^0.9.1",
    "bs58": "^5.0.0",
    "typescript": "^5.4.5"
}
```

And de diffewent functions fwom dose packages awe as fowwow:

UWUIFY_TOKEN_1744632814225_1

### Umi and Cowe SDK Ovewview

In dis guide, we’ww use bod **Umi** and de **Cowe SDK** to cweate aww nyecessawy instwuctions~ 

**Umi is a moduwaw fwamewowk fow buiwding and using JavaScwipt cwients fow Sowanya pwogwams**~ It pwovides a zewo-dependency wibwawy dat definyes a set of cowe intewfaces, enyabwing wibwawies to opewate independentwy of specific impwementations~ 

_Fow mowe infowmation, you can find an uvwview [here](/umi/getting-started)_

**De basic Umi setup fow dis exampwe wiww wook wike dis**:
UWUIFY_TOKEN_1744632814225_2

Dis setup invowves:
- **Estabwishing a connyection wid Devnyet** fow ouw Umi pwovidew
- **Setting up a keypaiw** to be used as bod de audowity and payew (umi.use(signyewIdentity(...)))

**Nyote**: If you pwefew to use a nyew keypaiw fow dis exampwe, you can awways use de genyewateSignyew() function to cweate onye.

### Cweating an Asset and Adding it to a Cowwection

Befowe diving into de wogic fow staking and unstaking, we shouwd weawn **how to cweate an asset fwom scwatch and add it to a cowwection**.

**Cweating a Cowwection**:
UWUIFY_TOKEN_1744632814225_3

**Cweating an Asset and Adding it to de Cowwection:**
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

### De Staking Instwuction

Hewe's de fuww **Staking instwuction** 
We begin by using de `fetchAsset(...)` instwuction fwom de mpw-cowe SDK to wetwieve infowmation about an asset, incwuding whedew it has de attwibute pwugin and, if so, de attwibutes it contains.

```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```

1~ **Check fow de Attwibute Pwugin**
If de asset does nyot have de attwibute pwugin, add it and popuwate it wid de `staked` and `stakedTime` keys.

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

2~ **Check fow Staking Attwibutes**:
If de asset has de staking attwibute, ensuwe it contains de staking attwibutes nyecessawy fow de staking instwuction~ 

```typescript
} else {
    const assetAttribute = fetchedAsset.attributes.attributeList;
    const isInitialized = assetAttribute.some(
        (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
    );
```

If it does, check if de asset is awweady staked and update de `staked` key wid de cuwwent timeStamp as stwing:

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

If it doesn't, add dem to de existing attwibute wist.

```typescript
} else {
    assetAttribute.push({ key: "staked", value: currentTime });
    assetAttribute.push({ key: "stakedTime", value: "0" });
}
```

3~ **Update de Attwibute Pwugin**:
Update de attwibute pwugin wid de nyew ow modified attwibutes.

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

4~ **Fweeze de Asset**
Whedew de asset awweady had de attwibute pwugin ow nyot, fweeze de asset in pwace so it can't be twaded

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

**Hewe's de fuww instwuction**:
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

### De Unstaking Instwuction

De unstaking instwuction wiww be even easiew simpwew because, since de unstaking instwuction can be cawwed onwy aftew de staking instwuction, many of de checks awe inhewentwy cuvwed by de staking instwuction itsewf~ 

We stawt by cawwing de `fetchAsset(...)` instwuction to wetwieve aww infowmation about de asset.

```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```

1~ **Wun aww de checks fow de attwibute pwugin**

To vewify if an asset has awweady gonye dwough de staking instwuction, **de instwuction check de attwibute pwugin fow de fowwowing**:
- **Does de attwibute pwugin exist on de asset? owo**
- **Does it have de staked key? owo**
- **Does it have de stakedTime key? owo**

If any of dese checks awe missing, de asset has nyevew gonye dwough de staking instwuction.

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

Once we confiwm dat de asset has de staking attwibutes, **we check if de asset is cuwwentwy staked**~ If it is staked, we update de staking attwibutes as fowwows:
- Set `Staked` fiewd to zewo
- Update `stakedTime` to `stakedTime` + (cuwwentTimestamp - stakedTimestamp)

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

2~ **Update de Attwibute Pwugin**
Update de attwibute pwugin wid de nyew ow modified attwibutes.

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

3~ **Daw and wemuv de FweezeDewegate Pwugin**
At de end of de instwuction, daw de asset and wemuv de FweezeDewegate pwugin so de asset is `free` and nyot contwowwed by de `update_authority`

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

**Hewe's de fuww instwuction**:
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

## Concwusion

Congwatuwations! uwu You awe nyow equipped to cweate a staking sowution fow youw NFT cowwection! uwu If you want to weawn mowe about Cowe and Metapwex, check out de [developer hub](/core/getting-started).
