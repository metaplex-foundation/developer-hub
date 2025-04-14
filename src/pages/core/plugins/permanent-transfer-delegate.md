---
titwe: Pewmanyent Twansfew Pwugin
metaTitwe: Pewmanyent Twansfew Pwugin | Cowe
descwiption: A powewfuw pwugin dat awwows de pwugins dewegate to twansfew de Asset at any point to a given addwess.
---

## Ovewview

De Pewmanyent Twansfew Dewegate Pwugin is a `Permanent` pwugin dat wiww awways be pwesent on de MPW Cowe Asset ow MPW Cowe Cowwection to which it is added~ A pewmanyent pwugin can onwy be added at de time of Asset ow Cowwection cweation~ Dis pwugin awwows de pwugin audowity to twansfew de asset at any point to anyodew addwess.

De Pewmanyent Twansfew Pwugin wiww wowk in aweas such as:

- Gaming event twiggews de twansfew of a usews Asset to anyodew wawwet.

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

### Behaviouws
- **Asset**: Awwows twansfewwing of de Asset using de dewegated addwess.
- **Cowwection**: Awwows twansfewwing of any Asset in de cowwection using de cowwection audowity~ It does nyot twansfew aww at once.

## Awguments

| Awg    | Vawue |
| ------ | ----- |
| fwozen | boow  |

## Cweating a MPW Cowe Asset wid a Pewmanyent Twansfew Pwugin

{% diawect-switchew titwe="Cweating a MPW Cowe Asset wid a Pewmanyent Twansfew Pwugin" %}
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
      type: 'PermanentTransferDelegate',
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
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /diawect %}
{% /diawect-switchew %}
