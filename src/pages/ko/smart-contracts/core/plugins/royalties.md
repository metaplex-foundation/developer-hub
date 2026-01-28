---
title: Royalties Plugin
metaTitle: Royalties Plugin | Metaplex Core
description: Royalties Plugin은 Core Asset과 Collection에서 크리에이터 로열티를 적용합니다. 베이시스 포인트, 크리에이터 분배, 마켓플레이스 준수를 위한 허용 목록/거부 목록 규칙을 설정합니다.
---

**Royalties Plugin**은 Core Asset의 2차 판매에서 크리에이터 로열티를 적용합니다. 로열티 비율, 크리에이터 분배, Asset을 전송할 수 있는 프로그램(마켓플레이스)의 허용 또는 거부를 지정합니다. {% .lead %}

{% callout title="학습 내용" %}

방법:
- Asset과 Collection에 로열티 추가
- 베이시스 포인트와 크리에이터 분배 구성
- 마켓플레이스 제어를 위한 허용 목록과 거부 목록 설정
- 생성 후 로열티 업데이트

{% /callout %}

## 요약

**Royalties Plugin**은 Core Asset에서 로열티를 적용하는 Authority Managed Plugin입니다. 비율(베이시스 포인트)을 설정하고, 여러 크리에이터에게 분배하고, 선택적으로 Asset을 전송할 수 있는 프로그램을 제한합니다.

- 베이시스 포인트로 로열티 설정 (500 = 5%)
- 최대 5명의 크리에이터 간 로열티 분배
- 허용 목록/거부 목록을 사용하여 마켓플레이스 액세스 제어
- Asset 레벨(개별) 또는 Collection 레벨(모든 Asset)에 적용

## 범위 외

Token Metadata 로열티(다른 시스템), 로열티 수집/배분(마켓플레이스가 처리), 로열티 법적 집행은 범위 외입니다.

## 빠른 시작

**바로 가기:** [Asset에 추가](#asset에-royalties-plugin-추가-코드-예시) · [Collection에 추가](#collection에-royalties-plugin-추가-코드-예시) · [RuleSet](#rulesets) · [업데이트](#asset의-royalties-plugin-업데이트)

1. `@metaplex-foundation/mpl-core`에서 `addPlugin` 가져오기
2. `type: 'Royalties'`, `basisPoints`, `creators`, `ruleSet`으로 호출
3. 마켓플레이스가 Plugin을 읽고 판매 시 로열티 적용

## 호환성

| 계정 타입 | 지원 |
|--------------|-----------|
| MPL Core Asset | Yes |
| MPL Core Collection | Yes |

Asset과 Collection 모두에 적용된 경우, **Asset 레벨 Plugin이 우선**합니다.

## 인수

| 인수 | 타입 | 설명 |
|----------|------|-------------|
| basisPoints | number | 로열티 비율 (500 = 5%, 1000 = 10%) |
| creators | Creator[] | 크리에이터 주소와 비율 점유율 배열 |
| ruleSet | RuleSet | 프로그램 허용 목록, 거부 목록 또는 없음 |

## Basis Points

로열티 비율(퍼센트의 100분의 1 단위).

| Basis Points | 퍼센트 |
|--------------|------------|
| 100 | 1% |
| 250 | 2.5% |
| 500 | 5% |
| 1000 | 10% |

예: `basisPoints`가 500이고 Asset이 1 SOL에 판매되면 크리에이터는 총 0.05 SOL을 받습니다.

## Creators

creators 배열은 누가 로열티를 받고 어떻게 분배되는지 정의합니다. 최대 5명의 크리에이터가 지원됩니다. 비율의 합은 100이어야 합니다.

{% dialect-switcher title="Creators 배열" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="creators-array.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const creators = [
  { address: publicKey('11111111111111111111111111111111'), percentage: 80 },
  { address: publicKey('22222222222222222222222222222222'), percentage: 20 },
]
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="creators_array.rs" %}
use mpl_core::types::Creator;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

let creators = vec![
    Creator {
        address: Pubkey::from_str("11111111111111111111111111111111").unwrap(),
        percentage: 80,
    },
    Creator {
        address: Pubkey::from_str("22222222222222222222222222222222").unwrap(),
        percentage: 20,
    },
];
```

{% /dialect %}
{% /dialect-switcher %}

## RuleSets

RuleSet은 로열티가 있는 Asset을 어떤 프로그램이 전송할 수 있는지 제어합니다. 준수하는 마켓플레이스로 전송을 제한하여 로열티를 적용하는 데 사용합니다.

### None (제한 없음)

모든 프로그램이 Asset을 전송할 수 있습니다. 로열티는 권장 사항일 뿐입니다.

{% dialect-switcher title="RuleSet None" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="ruleset-none.ts" %}
import { ruleSet } from '@metaplex-foundation/mpl-core'

const rules = ruleSet('None')
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="ruleset_none.rs" %}
use mpl_core::types::RuleSet;

let rule_set = RuleSet::None;
```

{% /dialect %}
{% /dialect-switcher %}

### Allowlist (적용 권장)

목록에 있는 프로그램만 전송 가능. 로열티를 준수하는 마켓플레이스로 제한하는 데 사용.

{% dialect-switcher title="RuleSet Allowlist" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="ruleset-allowlist.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const rules = ruleSet('ProgramAllowList', [
  [
    publicKey('M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'), // Magic Eden
    publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'), // Tensor
  ],
])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="ruleset_allowlist.rs" %}
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

let rule_set = RuleSet::ProgramAllowList(vec![
    Pubkey::from_str("M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K").unwrap(),
    Pubkey::from_str("TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN").unwrap(),
]);
```

{% /dialect %}
{% /dialect-switcher %}

### Denylist

목록에 있는 프로그램을 제외한 모든 프로그램이 전송 가능. 알려진 비준수 마켓플레이스를 차단하는 데 사용.

{% dialect-switcher title="RuleSet DenyList" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="ruleset-denylist.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { ruleSet } from '@metaplex-foundation/mpl-core'

const rules = ruleSet('ProgramDenyList', [
  [
    publicKey('BadMarketplace111111111111111111111111111'),
  ],
])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="ruleset_denylist.rs" %}
use mpl_core::types::RuleSet;
use solana_sdk::pubkey::Pubkey;
use std::str::FromStr;

let rule_set = RuleSet::ProgramDenyList(vec![
    Pubkey::from_str("BadMarketplace111111111111111111111111111").unwrap(),
]);
```

{% /dialect %}
{% /dialect-switcher %}

## Asset에 Royalties Plugin 추가 코드 예시

{% dialect-switcher title="Asset에 로열티 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="add-royalties-to-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500, // 5%
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="add_royalties_to_asset.rs" %}
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_royalties_to_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("AssetAddress111111111111111111111111111").unwrap();
    let creator = Pubkey::from_str("CreatorAddress11111111111111111111111111").unwrap();

    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![Creator {
                address: creator,
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&tx).await.unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Collection에 Royalties Plugin 추가 코드 예시

Collection 레벨 로열티는 Asset 레벨에서 재정의되지 않는 한 Collection의 모든 Asset에 적용됩니다.

{% dialect-switcher title="Collection에 로열티 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="add-royalties-to-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500, // 5%
    creators: [
      { address: creator1, percentage: 80 },
      { address: creator2, percentage: 20 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="add_royalties_to_collection.rs" %}
use mpl_core::{
    instructions::AddCollectionPluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_royalties_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("CollectionAddress111111111111111111111").unwrap();

    let creator1 = Pubkey::from_str("Creator1Address111111111111111111111111").unwrap();
    let creator2 = Pubkey::from_str("Creator2Address111111111111111111111111").unwrap();

    let add_plugin_ix = AddCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::Royalties(Royalties {
            basis_points: 500,
            creators: vec![
                Creator { address: creator1, percentage: 80 },
                Creator { address: creator2, percentage: 20 },
            ],
            rule_set: RuleSet::None,
        }))
        .instruction();

    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&tx).await.unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Asset의 Royalties Plugin 업데이트

기존 Asset의 로열티 비율, 크리에이터 또는 규칙 세트를 수정합니다.

{% dialect-switcher title="Asset의 Royalties Plugin 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="update-royalties-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'

await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 750, // 7.5%로 업데이트
    creators: [
      { address: creator1, percentage: 60 },
      { address: creator2, percentage: 40 },
    ],
    ruleSet: ruleSet('ProgramAllowList', [[marketplace1, marketplace2]]),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust {% title="update_royalties_asset.rs" %}
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Creator, Plugin, Royalties, RuleSet},
};

let update_ix = UpdatePluginV1Builder::new()
    .asset(asset)
    .payer(authority.pubkey())
    .plugin(Plugin::Royalties(Royalties {
        basis_points: 750,
        creators: vec![
            Creator { address: creator1, percentage: 60 },
            Creator { address: creator2, percentage: 40 },
        ],
        rule_set: RuleSet::None,
    }))
    .instruction();
```

{% /dialect %}
{% /dialect-switcher %}

## Collection의 Royalties Plugin 업데이트

{% dialect-switcher title="Collection의 Royalties Plugin 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts {% title="update-royalties-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 600, // 6%로 업데이트
    creators: [
      { address: creator1, percentage: 70 },
      { address: creator2, percentage: 30 },
    ],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Creator percentages must sum to 100`

크리에이터 비율 값의 합이 100이 아닙니다. 분배를 조정하세요.

### `Authority mismatch`

Plugin 권한만 로열티를 업데이트할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

### `Program not in allowlist`

호출 프로그램이 허용 목록에 없어 전송이 차단되었습니다. 프로그램을 추가하거나 거부 목록/none 규칙 세트로 전환하세요.

## 참고사항

- Asset 레벨 로열티가 Collection 레벨 로열티를 재정의
- 크리에이터 비율의 합은 정확히 100이어야 함
- 엄격한 적용에는 허용 목록, 유연성에는 거부 목록 사용
- 로열티 수집/배분은 마켓플레이스가 처리하며 Core 프로그램이 아님

## 빠른 참조

### 최소 코드

```ts {% title="minimal-royalties.ts" %}
import { addPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Royalties',
    basisPoints: 500,
    creators: [{ address: creatorAddress, percentage: 100 }],
    ruleSet: ruleSet('None'),
  },
}).sendAndConfirm(umi)
```

### Basis Points 참조

| 원하는 % | Basis Points |
|-----------|--------------|
| 2.5% | 250 |
| 5% | 500 |
| 7.5% | 750 |
| 10% | 1000 |

## FAQ

### Core 로열티가 적용되나요?

예, allowlist 규칙 세트를 사용할 때. 허용 목록에 있는 프로그램만 Asset을 전송할 수 있어 로열티가 지불되도록 보장합니다.

### Core 로열티와 Token Metadata 로열티의 차이점은 무엇인가요?

Core 로열티는 규칙 세트를 통한 선택적 적용 기능이 Asset에 내장되어 있습니다. Token Metadata 로열티는 권장 사항이며 마켓플레이스 협력에 의존합니다.

### Collection 내 Asset마다 다른 로열티를 가질 수 있나요?

예. 개별 Asset에 Royalties Plugin을 추가하여 Collection 레벨 설정을 재정의할 수 있습니다.

### 마켓플레이스는 로열티를 어떻게 읽나요?

마켓플레이스는 DAS 또는 온체인 데이터를 통해 Asset의 Plugin을 쿼리합니다. Royalties Plugin 데이터에는 베이시스 포인트, 크리에이터, 규칙 세트가 포함됩니다.

### 규칙 세트를 설정하지 않으면 어떻게 되나요?

`ruleSet('None')`을 사용합니다. 모든 프로그램이 Asset을 전송할 수 있으며 로열티는 권장 사항일 뿐입니다.

### 민팅 후 로열티를 변경할 수 있나요?

예. 권한이 있다면 `updatePlugin`(Asset의 경우) 또는 `updateCollectionPlugin`(Collection의 경우)을 사용합니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Basis Points** | 로열티 비율의 100분의 1 단위 (500 = 5%) |
| **Creators** | 로열티 지급을 받는 주소 배열 |
| **RuleSet** | 어떤 프로그램이 전송할 수 있는지 제어하는 허용 목록/거부 목록 |
| **Allowlist** | 목록에 있는 프로그램만 전송 가능 (엄격한 적용) |
| **Denylist** | 목록에 있는 프로그램을 제외한 모든 프로그램이 전송 가능 |
| **Authority** | Plugin을 업데이트할 권한이 있는 계정 |

---

*Metaplex Foundation에서 관리 · 2026년 1월 마지막 확인 · @metaplex-foundation/mpl-core에 적용*
