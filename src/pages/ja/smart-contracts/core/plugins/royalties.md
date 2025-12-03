---
title: ロイヤリティプラグイン
metaTitle: ロイヤリティの強制 | Core
description: ロイヤリティプラグインを使用すると、マーケットプレースでの二次販売に対するロイヤリティの割合を設定できます。これは、Core CollectionにRoyaltyプラグインを適用することで、コレクション全体に設定できるようになりました。
---

ロイヤリティプラグインは、アセットの権限がロイヤリティプラグインデータを設定および変更できる`権限管理`プラグインです。

このプラグインは`MPL Core Asset`と`MPL Core Collection`の両方で使用できます。

MPL Core AssetとMPL Core Collectionの両方に割り当てられた場合、MPL Core AssetロイヤリティプラグインがMPL Core Collectionプラグインよりも優先されます。

## 動作対象

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

ロイヤリティプラグインには以下の引数が必要です。

| 引数        | 値                 |
| ----------- | ------------------ |
| basisPoints | number             |
| creators    | Array<CreatorArgs> |
| ruleset     | RuleSet            |

## basisPoints

これは、二次販売時にcreatorsアレイのクリエイターがロイヤリティとして受け取る希望パーセンテージをベーシスポイントで表したものです。ロイヤリティプラグインが500に設定されている場合、これは5%を意味します。MPL Core Assetを1 SOLで販売した場合、アセットの指定されたクリエイターは合計0.05 SOLを受け取り、それが彼らの間で分配されます。umiの`percentAmount`など、一部のSDKでは計算を自分で行う必要がないようにヘルパーメソッドを提供しています。

## Creators

クリエイターリストは、獲得したロイヤリティがどこに分配されるかの配布リストです。ロイヤリティから収益を得るクリエイターを最大5人まで리스트に含めることができます。すべてのメンバー間の合計シェアは100%になる必要があります。

{% dialect-switcher title="Creatorsアレイ" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'

const creators = [
    { address: publicKey("11111111111111111111111111111111"), percentage: 80 }
    { address: publicKey("22222222222222222222222222222222"), percentage: 20 }
]
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::types::Creator;
use solana_sdk::pubkey::Pubkey
use std::str::FromStr;

let creators = vec![
        Creator {
            address: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
            percentage: 80,
        },
        Creator {
            address: Pubkey::from_str("22222222222222222222222222222222").unwrap(),
            percentage: 20,
        }
    ];
```

{% /dialect %}

{% /dialect-switcher %}

## ルールセット

ルールセットを使用すると、ロイヤリティプラグインが割り当てられているMPL Core Assetに対してどのプログラムがアクションを実行できるか、できないかを制御できます。

### 許可リスト

許可リストは、MPL Core Asset/Collectionとやり取りすることが許可されているプログラムのリストです。このリストにないプログラムはエラーをスローします。

{% dialect-switcher title="ルールセット許可リスト" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const ruleSet = ruleSet('ProgramAllowList', [
    [
		publicKey("11111111111111111111111111111111")
		publicKey("22222222222222222222222222222222")
    ]
])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey
use std::str::FromStr;

let rule_set = RuleSet::ProgramAllowList(
    vec![
        Pubkey::from_str("11111111111111111111111111111111").unwrap(),
        Pubkey::from_str("22222222222222222222222222222222").unwrap()
    ]
);
```

{% /dialect %}
{% /dialect-switcher %}

### 拒否リスト

拒否リストは、MPL Core Asset/Collectionとやり取りすることが許可されていないプログラムのリストです。このリストにあるプログラムはエラーをスローします。

{% dialect-switcher title="ルールセット拒否リスト" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const ruleSet = ruleSet('ProgramDenyList', [
    [
		publicKey("11111111111111111111111111111111")
		publicKey("22222222222222222222222222222222")
    ]
])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey
use std::str::FromStr;

let rule_set = RuleSet::ProgramDenyList(
    vec![
        Pubkey::from_str("11111111111111111111111111111111").unwrap(),
        Pubkey::from_str("22222222222222222222222222222222").unwrap()
    ]
);
```

{% /dialect %}
{% /dialect-switcher %}

### なし

ルールセットルールを設定したくない場合は、`__kind`をnoneとして渡すだけです。

{% dialect-switcher title="ルールセット拒否リスト" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { ruleSet } from '@metaplex-foundation/mpl-core'

const rule_set = ruleSet('None')
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::RuleSet;

let ruleSet = RuleSet::None;
```

{% /dialect %}
{% /dialect-switcher %}

## アセットにロイヤリティプラグインを追加するコード例

{% dialect-switcher title="MPL Core Assetにロイヤリティプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('2222222222222222222222222222222')

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Royalties',
    basisPoints: 500,
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('ProgramDenyList', [
      [
        publicKey('44444444444444444444444444444444'),
        publicKey('55555555555555555555555555555555'),
      ],
    ]),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションにロイヤリティプラグインを追加するコード例

{% dialect-switcher title="コレクションにロイヤリティプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('2222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Royalties',
    basisPoints: 500,
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('ProgramDenyList', [
      [
        publicKey('44444444444444444444444444444444'),
        publicKey('55555555555555555555555555555555'),
      ],
    ]),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_royalties_pluging_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let creator1 = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let creator2 = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let add_royalties_plugin_to_collection_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![
                Creator {
                    address: creator1,
                    percentage: 80,
                },
                Creator {
                    address: creator2,
                    percentage: 20,
                },
            ],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_royalties_pluging_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_royalties_pluging_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_royalties_pluging_to_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}