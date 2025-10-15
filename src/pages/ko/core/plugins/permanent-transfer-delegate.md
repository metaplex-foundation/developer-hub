---
title: Permanent Transfer Plugin
metaTitle: Permanent Transfer Plugin | Core
description: 플러그인의 위임자가 언제든지 Asset을 주어진 주소로 전송할 수 있는 강력한 플러그인입니다.
---

## 개요

Permanent Transfer Delegate Plugin은 추가된 MPL Core Asset 또는 MPL Core Collection에 항상 존재하는 `Permanent` 플러그인입니다. 영구 플러그인은 Asset 또는 Collection 생성 시에만 추가될 수 있습니다. 이 플러그인을 통해 플러그인 권한자는 언제든지 에셋을 다른 주소로 전송할 수 있습니다.

Permanent Transfer Plugin은 다음과 같은 영역에서 작동합니다:

- 게임 이벤트가 사용자의 Asset을 다른 지갑으로 전송하도록 트리거

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 동작

- **Asset**: 위임된 주소를 사용하여 Asset을 전송할 수 있습니다.
- **Collection**: 컬렉션 권한을 사용하여 컬렉션의 모든 Asset을 전송할 수 있습니다. 한 번에 모두 전송하지는 않습니다.

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Permanent Transfer Plugin과 함께 MPL Core Asset 생성

{% dialect-switcher title="Permanent Transfer Plugin과 함께 MPL Core Asset 생성" %}
{% dialect title="JavaScript" id="js" %}

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

{% /dialect %}

{% dialect title="Rust" id="rust" %}

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

{% /dialect %}
{% /dialect-switcher %}