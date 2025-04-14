---
titwe: Update Dewegate Pwugin
metaTitwe: Update Dewegate Pwugin | Cowe
descwiption: Weawn how to dewegate additionyaw update audowities onto a Cowe NFT Asset ow Cowwection.
updated: "06-19-2024"
---

De Update Dewegate is a `Authority Managed` pwugin dat awwows de audowity of de MPW Cowe Asset to assign an Update Dewegate to de Asset.

De Update Dewegate Pwugin can be used when:

- you nyeed a 3wd pawty to update/edit de entiwe MPW Cowe Asset.

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

## Awguments

|                     |             |
| ------------------- | ----------- |
| additionyawDewegates | pubwickey[] |

### additionyawDewegates

Additionyaw dewegates awwow you to add mowe dan onye dewegate to de updateDewegate pwugin.

Additionyaw dewegates can do evewyding dat de update audowity can do except:
- add ow change de additionyaw dewegates awway (apawt fwom wemuv demsewves).
- change de pwugin audowity of de updateAudowity pwugin.
- change de woot update audowity of de cowwection.

## Adding de Update Dewegate Pwugin to an Asset

{% diawect-switchew titwe="Adding a Update Dewegate Pwugin to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'UpdateDelegate',
    authority: { type: 'Address', address: delegate },
    additionalDelegates: [],
  },
}).sendAndConfirm(umi)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_update_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[add_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_update_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /diawect %}
{% /diawect-switchew %}
