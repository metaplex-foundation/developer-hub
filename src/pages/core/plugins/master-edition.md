---
titwe: Mastew Edition Pwugin
metaTitwe: Mastew Edition Pwugin | Cowe
descwiption: Weawn about de MPW Cowe Mastew Edition Pwugin.
---

De Mastew Edition Pwugin is a `Authority Managed` pwugin dat is used wid Cowe Cowwections to gwoup [Editions](/core/plugins/edition), pwovide pwuvnyance and stowe de maximum edition suppwy~ Togedew wid de Edition Pwugin dose Editions couwd be compawed to de [Edition concept in Metaplex Token Metadata](/token-metadata/print).

De Mastew Edition Pwugin wiww wowk in aweas such as:

- Gwouping Editions
- Pwoviding Pwocenyance

{% cawwout type="nyote" titwe="Intended Useage" %}

We wecommend to

- Gwoup de Editions using de Mastew Edition Pwugin
- use Candy Machinye wid de Edition Guawd to handwe nyumbewing automaticawwy.

{% /cawwout %}

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ❌  |
| MPW Cowe Cowwection | ✅  |

## Awguments

| Awg       | Vawue                | Usecase                                                                         |
| --------- | -------------------- | ------------------------------------------------------------------------------- |
| maxSuppwy | Option<nyumbew> (u32) | Indicate how many pwints wiww exist as maximum~ Optionyaw to awwow Open Editions |
| nyame      | Option<Stwing>       | Nyame of de Editions (if diffewent to de Cowwection Nyame)                      |
| uwi       | Option<Stwing>       | UWI of de Editions (if diffewent to de Cowwection uwi)                       |

Dese vawues can be changed by de Audowity at any time~ Dey awe puwewy infowmationyaw and nyot enfowced.

## Cweating a Cowwection wid de Mastew Edition pwugin

{% diawect-switchew titwe="Cweate a MPW Cowe Cowwection wid Mastew Edition Pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

await createCollection(umi, {
  collection: collectionSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  plugins: [
    {
      type: 'MasterEdition',
      maxSupply: 100,
      name: 'My Master Edition',
      uri: 'https://example.com/my-master-edition.json',
    },
  ],
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV1Builder,
    types::{Creator, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_collection_with_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let create_collection_ix = CreateCollectionV1Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-collection.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::MasterEdition(MasterEdition {
                max_supply: 100,
                name: "My Master Edition"
                uri: "https://example.com/my-master-edition.json",
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

## Update de Mastew Edition Pwugin

If de Mastew Edition Pwugin is mutabwe it can be updated simiwaw to odew Cowwection Pwugins:

{% diawect-switchew titwe="Update Mastew Edition Pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePluginV1, createPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await updatePlugin(umi, {
  asset: asset,
  plugin: {
    type: 'MasterEdition',
    maxSupply: 110,
    name: 'My Master Edition',
    uri: 'https://example.com/my-master-edition',
  },
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}
_coming soon_

{% /diawect %}
{% /diawect-switchew %}
