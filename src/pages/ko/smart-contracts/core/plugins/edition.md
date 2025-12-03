---
title: Edition 플러그인
metaTitle: Edition 플러그인 | Core
description: MPL Core Edition 플러그인에 대해 알아보세요.
---

Edition 플러그인은 애셋 내에 Edition 번호를 저장하는 `권한 관리` 플러그인입니다. 곧 추가될 Master Edition 플러그인과 함께 이러한 Edition은 [Metaplex Token Metadata의 Edition 개념](/token-metadata/print)과 비교할 수 있습니다.

Edition 플러그인은 다음과 같은 영역에서 작동합니다:

- 동일한 애셋의 프린트

{% callout type="note" title="사용 목적" %}

다음을 권장합니다:

- Master Edition 플러그인을 사용하여 Edition 그룹화
- Edition Guard와 함께 Candy Machine을 사용하여 자동으로 번호 매기기 처리

{% /callout %}

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 인수

| Arg    | Value  |
| ------ | ------ |
| number | number |

번호는 애셋에 할당되는 특정 값입니다. 일반적으로 이 번호는 고유하므로 생성자는 번호가 두 번 사용되지 않도록 확인해야 합니다.

## editions 플러그인으로 애셋 생성하기

Editions 플러그인은 애셋 생성 시에 추가되어야 합니다. 변경 가능한 상태인 동안에는 번호를 변경할 수 있습니다.

### 변경 가능한 플러그인으로 생성하기

{% dialect-switcher title="Edition 플러그인으로 MPL Core 애셋 생성하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)

const result = create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'Edition',
      number: 1
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
        .name("My Asset".into())
        .uri("https://example.com/my-asset.json".into())
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

{% /dialect %}

{% /dialect-switcher %}

### 불변 플러그인으로 생성하기

불변 Edition 플러그인으로 애셋을 생성하려면 다음 코드를 사용할 수 있습니다:

{% dialect-switcher title="MPL Core 애셋에 Editions 플러그인 추가하기" %}
{% dialect title="JavaScript" id="js" %}

editions 플러그인을 불변으로 만들려면 권한을 다음과 같이 `nonePluginAuthority()`로 설정해야 합니다:

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  plugins: [
    {
      type: 'Edition',
      number: 1,
      authority: { type: 'None' },
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
            }),
            authority: None,
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

{% /dialect %}

{% /dialect-switcher %}

## Editions 플러그인 업데이트하기

Editions 플러그인이 변경 가능한 경우 다른 플러그인과 유사하게 업데이트할 수 있습니다:

{% dialect-switcher title="애셋의 Edition 플러그인 업데이트하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

  await updatePlugin(umi, {
    asset: assetAccount.publicKey,
    plugin: { type: 'Edition', number: 2 },
  }).sendAndConfirm(umi);
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
_곧 출시_

{% /dialect %}
{% /dialect-switcher %}