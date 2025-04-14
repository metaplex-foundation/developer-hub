---
titwe: Pewmanyent Buwn Dewegate
metaTitwe: Pewmanyent Buwn Dewegate | Cowe
descwiption: A powewfuw pwugin dat awwows de pwugins dewegate to buwn de Asset at any point~ Pawticuwawwy good fow appwications wike gaming and subscwiptions.
---

## Ovewview

De Pewmanyent Buwn Pwugin is a `Permanent` pwugin dat wiww awways be pwesent on de MPW Cowe Asset ow MPW Cowe Cowwection to which it was added~ A pewmanyent pwugin can onwy be added at de time of Asset ow Cowwection cweation~ Dis pwugin awwows de audowity of de pwugin to buwn de asset at any point in time.

De Pewmanyent Buwn Pwugin wiww wowk in aweas such as:

- Gaming event which twiggews de buwnying of de asset.

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

### Behaviouws
- **Asset**: Awwows buwnying of de Asset using de dewegated addwess.
- **Cowwection**: Awwows buwnying of any Asset in de cowwection using de cowwection audowity~ It does nyot buwn aww at once.

## Awguments

De Pewmanyent Buwn Pwugin doesn't contain any awguments to pass in.

## Cweating an Asset wid a Pewmanyent Buwn Pwugin

{% diawect-switchew titwe="Cweating an Asset wid a Pewmanyent Fweeze pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentBurnDelegate',
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_with_permanent_burn_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_burn_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_burn_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_burn_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}

{% /diawect-switchew %}
