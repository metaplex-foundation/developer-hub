---
title: Edition 플러그인
metaTitle: Edition 플러그인 | Metaplex Core
description: Core NFT 애셋에 에디션 번호를 추가합니다. 수집 가능한 시리즈 및 한정판을 위해 1/100과 같은 프린트 번호를 추적합니다.
---

**Edition 플러그인**은 개별 애셋에 에디션 번호를 저장합니다. 수집 가능한 시리즈 및 한정판을 위해 "100개 중 1번"과 같은 번호가 매겨진 프린트를 만드는 데 사용합니다. {% .lead %}

{% callout title="학습 내용" %}

- 애셋에 에디션 번호 추가하기
- 변경 가능한 및 불변 에디션 만들기
- 에디션 번호 업데이트하기
- Edition 워크플로우 이해하기

{% /callout %}

## 요약

**Edition** 플러그인은 애셋에 고유한 에디션 번호를 저장하는 권한 관리 플러그인입니다. 번호가 매겨진 에디션을 함께 그룹화하려면 컬렉션의 [Master Edition 플러그인](/ko/smart-contracts/core/plugins/master-edition)과 함께 사용하는 것이 가장 좋습니다.

- 권한 관리형 (update authority가 제어)
- 애셋 생성 시 추가해야 함
- 권한이 변경 가능하면 번호 업데이트 가능
- 자동 번호 매기기는 Candy Machine Edition Guard 사용

## 범위 외

공급량 강제 (정보 제공만), 자동 번호 매기기 (Candy Machine 사용), 컬렉션 레벨 에디션 (컬렉션에는 Master Edition 플러그인 사용).

## 빠른 시작

**이동:** [변경 가능한 에디션 생성](#변경-가능한-플러그인으로-생성) · [불변 에디션 생성](#불변-플러그인으로-생성) · [에디션 업데이트](#editions-플러그인-업데이트)

1. 애셋 생성 시 고유 번호로 Edition 플러그인 추가
2. 선택적으로 불변성을 위해 권한을 `None`으로 설정
3. 변경 가능하면 나중에 번호 업데이트 가능

{% callout type="note" title="권장 사용법" %}

다음을 권장합니다:

- Master Edition 플러그인을 사용하여 Edition 그룹화
- Edition Guard와 함께 Candy Machine을 사용하여 자동으로 넘버링 처리

{% /callout %}

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 인수

| 인수   | 값     |
| ------ | ------ |
| number | number |

번호는 애셋에 할당되는 특정 값입니다. 일반적으로 이 번호는 고유하므로 생성자는 번호가 두 번 사용되지 않도록 확인해야 합니다.

## editions 플러그인으로 애셋 생성

Editions 플러그인은 애셋 생성 시에 추가되어야 합니다. 변경 가능한 상태인 동안에는 번호를 변경할 수 있습니다.

### 변경 가능한 플러그인으로 생성

{% dialect-switcher title="Edition 플러그인으로 MPL Core 애셋 생성" %}
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

### 불변 플러그인으로 생성

불변 Edition 플러그인으로 애셋을 생성하려면 다음 코드를 사용할 수 있습니다:

{% dialect-switcher title="MPL Core 애셋에 Editions 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

editions 플러그인을 불변으로 만들려면 권한을 `nonePluginAuthority()`로 설정해야 합니다:

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

## Editions 플러그인 업데이트

Editions 플러그인이 변경 가능한 경우 다른 플러그인과 유사하게 업데이트할 수 있습니다:

{% dialect-switcher title="애셋의 Edition 플러그인 업데이트" %}
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

## 일반적인 오류

### `Cannot add Edition plugin after creation`

Edition 플러그인은 애셋 생성 중에 추가해야 합니다. 기존 애셋에는 추가할 수 없습니다.

### `Authority mismatch`

update authority만 에디션 번호를 업데이트할 수 있습니다 (변경 가능한 경우).

### `Plugin is immutable`

Edition 플러그인의 권한이 `None`으로 설정되어 있습니다. 번호를 변경할 수 없습니다.

## 참고 사항

- 에디션 번호는 고유성이 강제되지 않음 — 생성자가 추적해야 함
- 플러그인은 `create()` 중에 추가해야 하며 나중에 추가할 수 없음
- 권한을 `None`으로 설정하면 에디션 번호가 영구적으로 됨
- 적절한 그룹화를 위해 컬렉션의 Master Edition 플러그인과 함께 사용

## 빠른 참조

### 권한 옵션

| 권한 | 업데이트 가능 | 사용 사례 |
|------|---------------|-----------|
| `UpdateAuthority` | ✅ | 변경 가능한 에디션 번호 |
| `None` | ❌ | 영구적, 불변 에디션 |

### 권장 설정

| 컴포넌트 | 위치 | 목적 |
|----------|------|------|
| Master Edition | 컬렉션 | 에디션 그룹화, 최대 공급량 저장 |
| Edition | 애셋 | 개별 에디션 번호 저장 |
| Candy Machine | 민팅 | 자동 순차 번호 매기기 |

## FAQ

### 에디션 번호가 고유하도록 강제되나요?

아니요. 에디션 번호는 정보 제공용입니다. 생성자는 고유한 번호를 보장할 책임이 있습니다. 자동 순차 번호 매기기를 위해 Edition Guard와 함께 Candy Machine을 사용하세요.

### 기존 애셋에 Edition 플러그인을 추가할 수 있나요?

아니요. Edition 플러그인은 애셋 생성 중에 추가해야 합니다. 에디션 번호가 필요하면 미리 계획하세요.

### "100개 중 1번" 스타일의 에디션을 만들려면 어떻게 하나요?

애셋에 Edition 플러그인(번호 1-100)을 추가하고 컬렉션에 `maxSupply: 100`으로 Master Edition 플러그인을 추가합니다. Master Edition이 에디션을 그룹화하고 총 공급량을 나타냅니다.

### 생성 후 에디션 번호를 변경할 수 있나요?

예, 플러그인 권한이 `None`으로 설정되지 않은 경우. update authority는 `updatePlugin`을 사용하여 번호를 수정할 수 있습니다.

### Edition과 Master Edition의 차이점은 무엇인가요?

Edition은 애셋에 개별 번호(예: #5)를 저장합니다. Master Edition은 컬렉션에 컬렉션 수준 데이터(최대 공급량, 에디션 이름/URI)를 저장하고 에디션을 함께 그룹화합니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Edition Number** | 특정 프린트의 고유 식별자 (예: 1, 2, 3) |
| **Master Edition** | 에디션을 그룹화하는 컬렉션 레벨 플러그인 |
| **Edition Guard** | 자동 번호 매기기를 위한 Candy Machine 가드 |
| **Authority Managed** | update authority가 제어하는 플러그인 |
| **Immutable Edition** | 권한이 `None`으로 설정된 에디션 |

---

*Metaplex Foundation 관리 · 최종 확인 2026년 1월 · @metaplex-foundation/mpl-core 적용*
