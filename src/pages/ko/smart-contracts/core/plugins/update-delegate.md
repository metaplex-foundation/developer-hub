---
title: Update Delegate Plugin
metaTitle: Update Delegate Plugin | Core
description: Core NFT Asset 또는 Collection에 추가 업데이트 권한을 위임하는 방법을 알아보세요.
updated: "06-19-2024"
---

Update Delegate는 MPL Core Asset의 권한이 Asset에 Update Delegate를 할당할 수 있게 하는 `Authority Managed` 플러그인입니다.

Update Delegate Plugin은 다음과 같은 경우에 사용할 수 있습니다:

- 제3자가 전체 MPL Core Asset을 업데이트/편집해야 하는 경우

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

|                     |             |
| ------------------- | ----------- |
| additionalDelegates | publickey[] |

### additionalDelegates

추가 위임자를 통해 updateDelegate 플러그인에 둘 이상의 위임자를 추가할 수 있습니다.

추가 위임자는 다음을 제외하고 업데이트 권한이 할 수 있는 모든 것을 할 수 있습니다:
- 추가 위임자 배열을 추가하거나 변경 (스스로를 제거하는 것은 제외)
- updateAuthority 플러그인의 플러그인 권한을 변경
- 컬렉션의 루트 업데이트 권한을 변경

## Asset에 Update Delegate Plugin 추가

{% dialect-switcher title="MPL Core Asset에 Update Delegate Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

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

{% /dialect %}

{% dialect title="Rust" id="rust" %}

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

{% /dialect %}
{% /dialect-switcher %}