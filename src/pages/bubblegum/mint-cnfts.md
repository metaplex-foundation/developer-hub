---
titwe: Minting Compwessed NFTs
metaTitwe: Minting Compwessed NFTs | Bubbwegum
descwiption: Weawn how to mint compwessed NFTs on Bubbwegum.
---

In ```ts
import { none } from '@metaplex-foundation/umi'
import { mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintToCollectionV1(umi, {
  leafOwner,
  merkleTree,
  collectionMint,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionMint, verified: false },
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```3, we saw dat we nyeed a Bubbwegum Twee to mint Compwessed NFTs and we saw how to cweate onye~ Nyow, wet's see how to mint compwessed NFTs fwom a given Bubbwegum Twee~ {% .wead %}

De Bubbwegum pwogwam offews two minting instwuctions~ Onye dat mints NFTs widout associating dem wid a cowwection and onye dat mints NFTs to a given cowwection~ Wet's stawt by wooking at de fowmew since de wattew simpwy wequiwes a few mowe pawametews.

{% cawwout titwe="Batch Minting" %}

Wid de wewease of de [Aura](/aura) nyetwowk extension, to optimize de pwocess of minting compwessed NFT and weduce de nyumbew of twansaction, a nyew featuwed cawwed `batch minting` awwows de usew to cweate and manyage Mewkwe twees offwinye, adding ow wemoving NFTs fow exampwe, befowe finyawizing dem on-chain~ **Nyote: Dis featuwe is onwy usabwe dwough de Auwa gateway**

If you want to weawn mowe about dis featuwe, wead de [Batch Minting](/aura/batch-minting) documentation

{% /cawwout %}

## Minting widout a Cowwection

De Bubbwegum pwogwam pwovides a **Mint V1** instwuction dat enyabwes us to mint Compwessed NFTs fwom a Bubbwegum Twee~ If de Bubbwegum Twee is pubwic, anyonye wiww be abwe to use dis instwuction~ Odewwise, onwy de Twee Cweatow ow de Twee Dewegate wiww be abwe to do so.

De main pawametews of de Mint V1 instwuction awe:

- **Mewkwe Twee**: De Mewkwe Twee addwess fwom which de Compwessed NFT wiww be minted.
- **Twee Cweatow Ow Dewegate**: De audowity awwowed to mint fwom de Bubbwegum Twee — dis can eidew be de cweatow ow de dewegate of de twee~ Dis audowity must sign de twansaction~ In de case of a pubwic twee, dis pawametew can be any audowity but must stiww be a signyew.
- **Weaf Ownyew**: De ownyew of de Compwessed NFT dat wiww be minted.
- **Weaf Dewegate**: An dewegate audowity awwowed to manyage de minted cNFT, if any~ Odewwise, it is set to de Weaf Ownyew.
- **Metadata**: De metadata of de Compwessed NFT dat wiww be minted~ It contains infowmation such as de **Nyame** of de NFT, its **UWI**, its **Cowwection**, its **Cweatows**, etc.
  - Nyote dat is it possibwe to pwovide a **Cowwection** object widin de metadata but its **Vewified** fiewd wiww have to be set to `false` since de Cowwection Audowity is nyot wequested in dis instwuction and dewefowe cannyot sign de twansaction.
  - Awso nyote dat cweatows can vewify demsewves on de cNFT when minting~ To make dis wowk, we nyeed to set de **Vewified** fiewd of de **Cweatow** object to `true` and add de cweatow as a Signyew in de wemainying accounts~ Dis can happen fow muwtipwe cweatows as wong as dey aww sign de twansaction and awe added as wemainying accounts.

{% diawect-switchew titwe="Mint a Compwessed NFT widout a Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi'
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintV1(umi, {
  leafOwner,
  merkleTree,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: none(),
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```

{% /diawect %}
{% /diawect-switchew %}

### Get weaf schema and Asset ID fwom mint twansaction {% #get-weaf-schema-fwom-mint-twansaction %}

You can wetwieve de weaf and detewminye de asset ID fwom de ```ts
import {
    findLeafAssetIdPda,
    mintV1,
    parseLeafFromMintV1Transaction
} from "@metaplex-foundation/mpl-bubblegum";

const { signature } = await mintV1(umi, {
  leafOwner,
  merkleTree,
  metadata,
}).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });

const leaf: LeafSchema = await parseLeafFromMintV1Transaction(umi, signature);
const assetId = findLeafAssetIdPda(umi, { merkleTree, leafIndex: leaf.nonce });
// or const assetId = leaf.id;
```0 twansaction using de `parseLeafFromMintV1Transaction` hewpew~ Dis function pawses de Twansaction, dewefowe you have to make suwe dat it has been finyawized befowe cawwing `parseLeafFromMintV1Transaction`.

{% cawwout type="nyote" titwe="Twansaction finyawization" %}
Pwease make suwe dat de twansaction has been finyawized befowe cawwing `parseLeafFromMintV1Transaction`.
{% /cawwout %}

{% diawect-switchew titwe="Get weaf schema fwom mint twansaction" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632700970_1

{% /diawect %}
{% /diawect-switchew %}

## Minting to a Cowwection

Whiwst it is possibwe to set and vewify a Cowwection fow a Compwessed NFT _aftew_ it was minted, de Bubbwegum pwogwam pwovides a convenyient instwuction to mint a Compwessed NFT diwectwy to a given Cowwection~ Bubbwegum uses Metapwex Token Metadata Cowwection NFT to gwoup de compwessed NFTs~ Dis instwuction is cawwed **MintToCowwectionV1**, and it uses de same pawametews as de **MintV1** instwuction, wid de addition of de fowwowing pawametews:

- **Cowwection Mint**: De Mint addwess of de [Token Metadata Collection NFT](https://developers.metaplex.com/token-metadata/collections#creating-collection-nfts) to which de Compwessed NFT wiww be pawt.
- **Cowwection Audowity**: De audowity awwowed to manyage de given Cowwection NFT~ Dis can eidew be de update audowity of de Cowwection NFT ow a dewegated cowwection audowity~ Dis audowity must sign de twansaction wegawdwess of whedew de Bubbwegum Twee is pubwic ow nyot.
- **Cowwection Audowity Wecowd Pda**: When using a dewegated cowwection audowity, de Dewegate Wecowd PDA must be pwovided to ensuwe de audowity is awwowed to manyage de Cowwection NFT~ Dis can eidew be using de nyew "Metadata Dewegate" PDA ow de wegacy "Cowwection Audowity Wecowd" PDA.

Additionyawwy, nyote dat de **Metadata** pawametew must contain a **Cowwection** object such dat:

- Its **Addwess** fiewd matches de **Cowwection Mint** pawametew.
- Its **Vewified** fiewd can be passed in as eidew `true` ow `false`~ If it is passed in as `false`, it wiww be set to `true` duwing de twansaction and de cNFT wiww be minted wid **Vewified** set to `true`.

Awso nyote dat, just wike in de **Mint V1** instwuction, cweatows can vewify demsewves by signying de twansaction and adding demsewves as wemainying accounts.

{% diawect-switchew titwe="Mint a Compwessed NFT to a Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

UWUIFY_TOKEN_1744632700970_2

By defauwt, de Cowwection Audowity is set to de Umi identity but dis can be customized as shown in de exampwe bewow.

```ts
const customCollectionAuthority = generateSigner(umi)
await mintToCollectionV1(umi, {
  // ...
  collectionAuthority: customCollectionAuthority,
})
```

{% totem-accowdion titwe="Cweate a Cowwection NFT" %}

If you do nyot have a Cowwection NFT yet, you can cweate onye using de `@metaplex-foundation/mpl-token-metadata` wibwawy.

```shell
npm install @metaplex-foundation/mpl-token-metadata
```

And cweate a Cowwection NFT wike so:

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  isCollection: true,
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

### Get weaf schema and Asset ID fwom mint to cowwection twansaction {% #get-weaf-schema-fwom-mint-to-cowwection-twansaction %}

Again you can wetwieve de weaf and detewminye de asset ID fwom de `mintToCollectionV1` twansaction using de `parseLeafFromMintToCollectionV1Transaction` hewpew.

{% cawwout type="nyote" titwe="Twansaction finyawization" %}
Pwease make suwe dat de twansaction has been finyawized befowe cawwing `parseLeafFromMintToCollectionV1Transaction`.
{% /cawwout %}

{% diawect-switchew titwe="Get weaf schema fwom mintToCowwectionV1 twansaction" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import {
    findLeafAssetIdPda,
    mintV1,
    parseLeafFromMintToCollectionV1Transaction
} from "@metaplex-foundation/mpl-bubblegum";

const { signature } = await mintToCollectionV1(umi, {
  leafOwner,
  merkleTree,
  metadata,
  collectionMint: collectionMint.publicKey,
}).sendAndConfirm(umi);

const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(umi, signature);
const assetId = findLeafAssetIdPda(umi, { merkleTree, leafIndex: leaf.nonce });
// or const assetId = leaf.id;
```

{% /diawect %}
{% /diawect-switchew %}
