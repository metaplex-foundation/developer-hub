---
title: Permanent Freeze Delegate
metaTitle: Permanent Freeze Plugin | Core
description: 플러그인의 위임자가 언제든지 Asset을 동결할 수 있는 강력한 플러그인입니다.
---

## 개요

Permanent Freeze Delegate 플러그인은 추가된 MPL Core Asset 또는 MPL Core Collection에 항상 존재하는 `Permanent` 플러그인입니다. 영구 플러그인은 Asset 또는 Collection 생성 시에만 추가될 수 있습니다.

Permanent Freeze Plugin은 다음과 같은 영역에서 작동합니다:

- 소울바운드 토큰

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 동작

- **Asset**: 위임된 주소가 언제든지 NFT를 동결하고 해제할 수 있습니다.
- **Collection**: 컬렉션 권한이 전체 컬렉션을 한 번에 동결하고 해제할 수 있습니다. 이 위임자를 사용하여 컬렉션의 단일 에셋을 동결할 수는 **없습니다**.

## Arguments

| Arg    | Value |
| ------ | ----- |
| frozen | bool  |

## Permanent Freeze 플러그인과 함께 Asset 생성

다음 예시는 Permanent Freeze 플러그인과 함께 Asset을 생성하는 방법을 보여줍니다.

{% dialect-switcher title="Permanent Freeze 플러그인과 함께 Asset 생성" %}
{% dialect title="JavaScript" id="js" %}

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

{% /dialect %}

{% dialect title="Rust" id="rust" %}

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

{% /dialect %}

{% /dialect-switcher %}

## Asset에서 Permanent Freeze Delegate 플러그인 업데이트

다음 예시는 Asset에서 Permanent Freeze Delegate 플러그인을 업데이트하는 방법을 보여줍니다. `frozen` 인수를 각각 `true` 또는 `false`로 설정하여 동결하거나 해제합니다. 서명하는 지갑이 플러그인 권한이라고 가정합니다.

{% dialect-switcher title="Asset에서 Permanent Freeze Delegate 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

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

{% /dialect %}
{% /dialect-switcher %}



## Permanent Freeze 플러그인과 함께 Collection 생성

다음 예시는 Permanent Freeze 플러그인과 함께 컬렉션을 생성하는 방법을 보여줍니다.

{% dialect-switcher title="Permanent Freeze 플러그인과 함께 Collection 생성" %}
{% dialect title="JavaScript" id="js" %}

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
        authority: { type: "UpdateAuthority"}, // 업데이트 권한이 동결을 해제할 수 있습니다
      },
    ],
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Permanent Freeze 플러그인과 함께 Collection 업데이트

다음 예시는 Collection에서 Permanent Freeze Delegate 플러그인을 업데이트하는 방법을 보여줍니다. `frozen` 인수를 각각 `true` 또는 `false`로 설정하여 동결하거나 해제합니다. 서명하는 지갑이 플러그인 권한이라고 가정합니다.

{% dialect-switcher title="Permanent Freeze 플러그인과 함께 Collection 업데이트" %}
{% dialect title="JavaScript" id="js" %}

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

{% /dialect %}
{% /dialect-switcher %}