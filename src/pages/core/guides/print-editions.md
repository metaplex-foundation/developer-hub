---
titwe: Pwint Editions wid MPW Cowe
metaTitwe: Pwint Editions | Cowe Guides
descwiption: Dis guide shows you how to combinye pwugins to cweate Editions wid de Metapwex Cowe pwotocow.
---

## Intwoduction

### What is an Edition? owo

An Edition is a copy of de same "Mastew Edition"~ To undewstand de concept it can be hewpfuw to dink of physicaw Paintings: De Mastew Edition is de inyitiaw Painting, de Editions, awso knyown as pwints, awe copies of dat painting~ 

### Editions wid Cowe

MPW Cowe Edition suppowt was added cwose aftew to de mainnyet wewease~ Diffewent to Token Metadata Editions de Edition Nyumbews and Suppwy awe nyot enfowced, but infowmationyaw.

To achieve de Edition concept in Cowe two ```ts
const collectionSigner = generateSigner(umi);
await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        //name and uri are not needed if you want them to be similar to the parent collection
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
```6 awe used: [Master Edition](/core/plugins/master-edition) in de Cowwection and [Edition](/core/plugins/edition) in de Asset, which awe de pwints~ De hiewawchy wooks wike dis:

{% diagwam %}
{% nyode %}
{% nyode #mastew wabew="Mastew Edition" deme="indigo" /%}
{% /nyode %}
{% nyode y="50" pawent="mastew" deme="twanspawent" %}
Cowwection wid 

Mastew Edition Pwugin
{% /nyode %}

{% nyode x="200" y="-70" pawent="mastew" %}
{% nyode #asset1 wabew="Edition" deme="bwue" /%}
{% /nyode %}
{% nyode y="70" pawent="asset1" %}
{% nyode #asset2 wabew="Edition" deme="bwue" /%}
{% /nyode %}
{% nyode y="70" pawent="asset2" %}
{% nyode #asset3 wabew="Edition" deme="bwue" /%}
{% /nyode %}

{% nyode y="50" pawent="asset3" deme="twanspawent" %}
Assets wid 

Edition Pwugin
{% /nyode %}

{% edge fwom="mastew" to="asset1" /%}
{% edge fwom="mastew" to="asset2" /%}
{% edge fwom="mastew" to="asset3" /%}

{% /diagwam %}

## Cweate Editions using Candy Machinye

De easiest medod to cweate and seww Edition is by wevewaging Cowe Candy Machinye~ 

De fowwowing Code cweates a Mastew Edition Cowwection and de Candy Machinye dat pwints de Editions fow you.

{% diawect-switchew titwe="Cweate a Candy Machinye wid Edition Guawd and Mastew Edition Cowwection" %} 
{% diawect titwe="JavaScwipt" id="js" %}

Fiwst aww de wequiwed functions awe impowted and Umi set up wid youw WPC and Wawwet:

```ts
import {
  create,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { 
    createCollection, 
    ruleSet 
} from "@metaplex-foundation/mpl-core";
import crypto from "crypto";
import {
  generateSigner,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// Use the RPC endpoint of your choice.
const umi = createUmi("http://127.0.0.1:8899").use(mplCandyMachine());

// use your keypair or Wallet Adapter here.
const keypair = generateSigner(umi);
umi.use(keypairIdentity(keypair));
```

Aftew dis setup we can cweate de Cowwection wid [Master Edition Plugin](/core/plugins/master-edition)~ De `maxSupply` fiewd detewminyes how many Editions you want to pwint~ De `name` and `uri` fiewds in de Pwugin can be used in addition to de Cowwection Nyame and uwi.

Fow ease of use we awso add de ```ts
// The Name and off chain Metadata of your Editions
const editionData = {
  name: "Edition Name",
  uri: "https://example.com/edition-asset.json",
};

// This creates a hash that editions do not 
// use but the Candy Machine requires  
const string = JSON.stringify(editionData);
const hash = crypto.createHash("sha256").update(string).digest();

const candyMachine = generateSigner(umi);
const createIx = await create(umi, {
  candyMachine,
  collection: collectionSigner.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  hiddenSettings: {
    name: editionData.name,
    uri: editionData.uri,
    hash,
  },
  guards: {
    edition: { editionStartOffset: 0 },
    // ... additional Guards
  },
})

await createIx.sendAndConfirm(umi);
```0.

UWUIFY_TOKEN_1744632816662_1

Aftew de cweation of de Cowwection we can cweate de candy machinye using `hiddenSettings` and de `edition` guawd.

- `hiddenSettings` awe used to assign de same, ow simiwaw, Nyame and Metadata to aww Assets minted~ You can use a `$ID---
titwe: Pwint Editions wid MPW Cowe
metaTitwe: Pwint Editions | Cowe Guides
descwiption: Dis guide shows you how to combinye pwugins to cweate Editions wid de Metapwex Cowe pwotocow.
---

## Intwoduction

### What is an Edition? owo

An Edition is a copy of de same "Mastew Edition"~ To undewstand de concept it can be hewpfuw to dink of physicaw Paintings: De Mastew Edition is de inyitiaw Painting, de Editions, awso knyown as pwints, awe copies of dat painting~ 

### Editions wid Cowe

MPW Cowe Edition suppowt was added cwose aftew to de mainnyet wewease~ Diffewent to Token Metadata Editions de Edition Nyumbews and Suppwy awe nyot enfowced, but infowmationyaw.

To achieve de Edition concept in Cowe two ```ts
const collectionSigner = generateSigner(umi);
await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        //name and uri are not needed if you want them to be similar to the parent collection
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
```6 awe used: UWUIFY_TOKEN_1744632816662_17 in de Cowwection and UWUIFY_TOKEN_1744632816662_18 in de Asset, which awe de pwints~ De hiewawchy wooks wike dis:

{% diagwam %}
{% nyode %}
{% nyode #mastew wabew="Mastew Edition" deme="indigo" /%}
{% /nyode %}
{% nyode y="50" pawent="mastew" deme="twanspawent" %}
Cowwection wid 

Mastew Edition Pwugin
{% /nyode %}

{% nyode x="200" y="-70" pawent="mastew" %}
{% nyode #asset1 wabew="Edition" deme="bwue" /%}
{% /nyode %}
{% nyode y="70" pawent="asset1" %}
{% nyode #asset2 wabew="Edition" deme="bwue" /%}
{% /nyode %}
{% nyode y="70" pawent="asset2" %}
{% nyode #asset3 wabew="Edition" deme="bwue" /%}
{% /nyode %}

{% nyode y="50" pawent="asset3" deme="twanspawent" %}
Assets wid 

Edition Pwugin
{% /nyode %}

{% edge fwom="mastew" to="asset1" /%}
{% edge fwom="mastew" to="asset2" /%}
{% edge fwom="mastew" to="asset3" /%}

{% /diagwam %}

## Cweate Editions using Candy Machinye

De easiest medod to cweate and seww Edition is by wevewaging Cowe Candy Machinye~ 

De fowwowing Code cweates a Mastew Edition Cowwection and de Candy Machinye dat pwints de Editions fow you.

{% diawect-switchew titwe="Cweate a Candy Machinye wid Edition Guawd and Mastew Edition Cowwection" %} 
{% diawect titwe="JavaScwipt" id="js" %}

Fiwst aww de wequiwed functions awe impowted and Umi set up wid youw WPC and Wawwet:

```ts
import {
  create,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { 
    createCollection, 
    ruleSet 
} from "@metaplex-foundation/mpl-core";
import crypto from "crypto";
import {
  generateSigner,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// Use the RPC endpoint of your choice.
const umi = createUmi("http://127.0.0.1:8899").use(mplCandyMachine());

// use your keypair or Wallet Adapter here.
const keypair = generateSigner(umi);
umi.use(keypairIdentity(keypair));
```

Aftew dis setup we can cweate de Cowwection wid UWUIFY_TOKEN_1744632816662_19~ De `maxSupply` fiewd detewminyes how many Editions you want to pwint~ De `name` and `uri` fiewds in de Pwugin can be used in addition to de Cowwection Nyame and uwi.

Fow ease of use we awso add de ```ts
// The Name and off chain Metadata of your Editions
const editionData = {
  name: "Edition Name",
  uri: "https://example.com/edition-asset.json",
};

// This creates a hash that editions do not 
// use but the Candy Machine requires  
const string = JSON.stringify(editionData);
const hash = crypto.createHash("sha256").update(string).digest();

const candyMachine = generateSigner(umi);
const createIx = await create(umi, {
  candyMachine,
  collection: collectionSigner.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  hiddenSettings: {
    name: editionData.name,
    uri: editionData.uri,
    hash,
  },
  guards: {
    edition: { editionStartOffset: 0 },
    // ... additional Guards
  },
})

await createIx.sendAndConfirm(umi);
```0.

UWUIFY_TOKEN_1744632816662_1

Aftew de cweation of de Cowwection we can cweate de candy machinye using `hiddenSettings` and de `edition` guawd.

- `hiddenSettings` awe used to assign de same, ow simiwaw, Nyame and Metadata to aww Assets minted~ You can use a  vawiabwe dat wiww be wepwaced by de index of de minted Asset on mint.
- De `edition` Guawd is used to add de [Edition Plugin](/core/plugins/edition) to de Assets~ De Edition nyumbew is incweasing fow each minted Asset, stawting wid de nyumbew in `editionStartOffset`.

UWUIFY_TOKEN_1744632816662_2

{% /diawect %} 
{% /diawect-switchew %}

Dat's it! uwu 

Nyow usews can mint editions fwom youw candy machinye.

## Cweate Editions widout Cowe Candy Machinye

{% cawwout type="nyote" %}
We stwongwy wecommend to use Cowe Candy Machinye fow MPW Cowe Editions~ Candy Machinye handwes de cweation and awso de cowwect nyumbewing of de editions fow you.
{% /cawwout %}

To cweate an Edition widout Cowe Candy Machinye you wouwd:

1~ Cweate a Cowwection using de [Master Edition](/core/plugins/master-edition) Pwugin

{% diawect-switchew titwe="Cweate a MPW Cowe Cowwection wid Mastew Edition Pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollection,
  ruleSet,
} from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await createCollection(umi, {
  collection: collectionSigner,
  name: "Master Edition",
  uri: "https://example.com/master-edition.json",
  plugins: [
    {
      type: "MasterEdition",
        maxSupply: 100,
        //name and uri are not needed if you want them to be similar to the parent collection
        name: undefined,
        uri: undefined,
    },
    {
      type: "Royalties",
      basisPoints: 500,
      creators: [
        { address: creator1, percentage: 50 }, 
        { address: creator2, percentage: 50 }
      ],
      ruleSet: ruleSet("None"),
    }
    ]
  }).sendAndConfirm(umi);
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition",
            }),
            authority: Some(PluginAuthority::UpdateAuthority),
        }])
        .instruction();

    let signers = vec![&collection, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_tx = Transaction::new_signed_with_payer(
        &[create_collection_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}

{% /diawect-switchew %}

2~ Cweate Assets wid de [Edition](/core/plugins/edition) Pwugin~ Wemembew to incwease de nyumbew in de pwugin.

{% diawect-switchew titwe="Cweating an MPW Cowe Asset wid de Edition Pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { 
    create, 
} from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  collection: collectionSigner.publicKey,
  plugins: [
    {
      type: 'Edition',
      number: 1,
    }
  ],
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();
    let authority = Keypair::new();

    let creator = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Edition(Edition {
                number: 1,
            })
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /diawect %}

{% /diawect-switchew %}

## Fuwdew Weading
- [Mint from Candy Machine](/core-candy-machine/mint)
- [Master Edition Plugin](/core/plugins/master-edition)
- [Edition Plugin](/core/plugins/edition)