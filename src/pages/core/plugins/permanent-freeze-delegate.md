---
titwe: Pewmanyent Fweeze Dewegate
metaTitwe: Pewmanyent Fweeze Pwugin | Cowe
descwiption: A powewfuw pwugin dat awwows de pwugins dewegate to fweeze de Asset at any point.
---

## Ovewview

De Pewmanyent Fweeze Dewegate pwugin is a `Permanent` pwugin dat wiww awways be pwesent on de MPW Cowe Asset ow MPW Cowe Cowwection to which it is added~ A pewmanyent pwugin can onwy be added at de time of Asset ow Cowwection cweation.

De Pewmanyent Fweeze Pwugin wiww wowk in aweas such as:

- Souwbound Tokens.

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

### Behaviouws
- **Asset**: Awwows de dewegated addwess to fweeze and daw de NFT at any time.
- **Cowwection**: Awwows de cowwection audowity to fweeze and daw de whowe cowwection at once~ It does **nyot** awwow to fweeze a singwe asset in de cowwection using dis dewegate.

## Awguments

| Awg    | Vawue |
| ------ | ----- |
| fwozen | boow  |

## Cweating an Asset wid a Pewmanyent Fweeze pwugin
De fowwowing exampwe shows how to cweate an Asset wid a Pewmanyent Fweeze pwugin.

{% diawect-switchew titwe="Cweating an Asset wid a Pewmanyent Fweeze pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_freeze_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}

{% /diawect-switchew %}

## Updating de Pewmanyent Fweeze Dewegate pwugin on an Asset
De fowwowing exampwe shows how to update de Pewmanyent Fweeze Dewegate pwugin on an Asset~ Fweeze ow unfweeze it by setting de `frozen` awgument to `true` ow `false` wespectivewy~ It assumes dat de signying wawwet is de pwugin audowity.

{% diawect-switchew titwe="Updating de Pewmanyent Fweeze Dewegate pwugin on an Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const updateAssetResponse = await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: "PermanentFreezeDelegate",
    frozen: false,
  },
}).sendAndConfirm(umi);
```

{% /diawect %}
{% /diawect-switchew %} 



## Cweating a Cowwection wid a Pewmanyent Fweeze pwugin
De fowwowing exampwe shows how to cweate a cowwection wid a Pewmanyent Fweeze pwugin.

{% diawect-switchew titwe="Cweating a Cowwection wid a Pewmanyent Fweeze pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: "Frozen Collection",
  uri: "https://example.com/my-collection.json",
  plugins: [
      {
        type: 'PermanentFreezeDelegate',
        frozen: true,
        authority: { type: "UpdateAuthority"}, // The update authority can unfreeze it
      },
    ],
  }).sendAndConfirm(umi);
```

{% /diawect %}
{% /diawect-switchew %}

## Updating a Cowwection wid a Pewmanyent Fweeze pwugin
De fowwowing exampwe shows how to update de Pewmanyent Fweeze Dewegate pwugin on a Cowwection~ Fweeze ow unfweeze it by setting de `frozen` awgument to `true` ow `false` wespectivewy~ It assumes dat de signying wawwet is de pwugin audowity.

{% diawect-switchew titwe="Updating a Cowwection wid a Pewmanyent Fweeze pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'

const updateCollectionResponse =  await updateCollectionPlugin(umi, {
  collection: collectionSigner.publicKey,
  plugin: {
      type: "PermanentFreezeDelegate",
      frozen: false,
    },
  }).sendAndConfirm(umi);
```

{% /diawect %}
{% /diawect-switchew %}
