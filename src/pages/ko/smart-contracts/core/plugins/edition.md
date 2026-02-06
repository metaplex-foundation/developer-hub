---
title: Edition 플러그인
metaTitle: Edition 플러그인 | Metaplex Core
description: Core NFT Asset에 에디션 번호를 추가하여 프린트와 한정판을 위한 기능을 제공합니다. 수집 시리즈를 위해 1/100과 같은 에디션 번호를 추적합니다.
updated: '01-31-2026'
keywords:
  - NFT edition
  - edition number
  - limited edition
  - print series
about:
  - Edition numbering
  - Limited runs
  - Print series
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 에디션 번호가 고유하도록 강제되나요?
    a: 아니요. 에디션 번호는 정보 제공 목적입니다. 창작자가 고유 번호를 보장할 책임이 있습니다. 자동 순차 번호 부여를 위해 Edition Guard가 있는 Candy Machine을 사용하세요.
  - q: 기존 Asset에 Edition 플러그인을 추가할 수 있나요?
    a: 아니요. Edition 플러그인은 Asset 생성 시 추가해야 합니다. 에디션 번호가 필요하면 미리 계획하세요.
  - q: 1 of 100 스타일 에디션을 어떻게 만드나요?
    a: 1-100 번호로 Asset에 Edition 플러그인을 추가하고 maxSupply가 100인 Master Edition 플러그인을 Collection에 추가합니다.
  - q: 생성 후 에디션 번호를 변경할 수 있나요?
    a: 네, 플러그인 권한이 None으로 설정되지 않았다면 가능합니다. 업데이트 권한자가 updatePlugin을 사용하여 번호를 수정할 수 있습니다.
  - q: Edition과 Master Edition의 차이점은 무엇인가요?
    a: Edition은 개별 Asset에 번호를 저장합니다. Master Edition은 Collection에 컬렉션 수준 데이터(최대 공급량, 에디션 이름/URI)를 저장합니다.
---
**Edition 플러그인**은 개별 Asset에 에디션 번호를 저장합니다. 수집 시리즈와 한정판을 위해 "1 of 100"과 같은 번호가 매겨진 프린트를 만드는 데 사용합니다. {% .lead %}
{% callout title="학습 내용" %}

- Asset에 에디션 번호 추가
- 변경 가능 및 불변 에디션 생성
- 에디션 번호 업데이트
- Edition 워크플로우 이해
{% /callout %}

## 요약

**Edition** 플러그인은 Asset에 고유한 에디션 번호를 저장하는 권한 관리 플러그인입니다. 번호가 매겨진 에디션을 함께 그룹화하기 위해 Collection의 [Master Edition 플러그인](/smart-contracts/core/plugins/master-edition)과 함께 사용하는 것이 좋습니다.

- 권한 관리 (업데이트 권한자가 제어)
- Asset 생성 시 추가해야 함
- 권한이 변경 가능하면 번호 업데이트 가능
- 자동 번호 부여를 위해 Candy Machine Edition Guard와 함께 사용

## 범위 외

공급량 강제 (정보 제공만), 자동 번호 부여 (Candy Machine 사용), Collection 수준 에디션 (Collection에는 Master Edition 플러그인 사용).

## 빠른 시작

**바로 가기:** [변경 가능한 에디션 생성](#변경-가능한-플러그인으로-생성) · [불변 에디션 생성](#불변-플러그인으로-생성) · [에디션 업데이트](#editions-플러그인-업데이트)

1. Asset 생성 시 고유 번호와 함께 Edition 플러그인 추가
2. 선택적으로 불변성을 위해 권한을 `None`으로 설정
3. 변경 가능하면 나중에 번호 업데이트
{% callout type="note" title="권장 사용법" %}
권장 사항

- Master Edition Plugin을 사용하여 Edition을 그룹화
- Candy Machine과 Edition Guard를 사용하여 자동으로 번호 부여를 처리
{% /callout %}

## 호환 대상

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 인자

| 인자    | 값  |
| ------ | ------ |
| number | number |
숫자는 자산에 할당되는 특정 값입니다. 일반적으로 이 숫자는 고유하므로 창작자는 번호가 두 번 사용되지 않도록 해야 합니다.

## editions 플러그인으로 Asset 생성

Editions Plugin은 자산 생성 시 추가해야 합니다. 변경 가능한 한 번호를 변경할 수 있습니다.

### 변경 가능한 플러그인으로 생성

{% dialect-switcher title="Edition Plugin으로 MPL Core Asset 생성" %}
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

불변 Edition Plugin으로 Asset을 생성하려면 다음 코드를 사용할 수 있습니다:
{% dialect-switcher title="MPL Core Asset에 Editions Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}
editions Plugin을 불변으로 만들려면 authority를 다음과 같이 `nonePluginAuthority()`로 설정해야 합니다:

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

Editions Plugin이 변경 가능하면 다른 플러그인과 유사하게 업데이트할 수 있습니다:
{% dialect-switcher title="Asset의 Edition Plugin 업데이트" %}
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
_곧 제공 예정_
{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Cannot add Edition plugin after creation`

Edition 플러그인은 Asset 생성 시 추가해야 합니다. 기존 Asset에는 추가할 수 없습니다.

### `Authority mismatch`

업데이트 권한자만 에디션 번호를 업데이트할 수 있습니다 (변경 가능한 경우).

### `Plugin is immutable`

Edition 플러그인의 권한이 `None`으로 설정되어 있습니다. 번호를 변경할 수 없습니다.

## 참고 사항

- 에디션 번호는 고유하도록 강제되지 않음—창작자가 이를 추적해야 함
- 플러그인은 `create()` 중에 추가해야 하며, 이후에는 안 됨
- 권한을 `None`으로 설정하면 에디션 번호가 영구적이 됨
- 적절한 그룹화를 위해 Collection의 Master Edition 플러그인과 함께 사용

## 빠른 참조

### 권한 옵션

| 권한 | 업데이트 가능 | 사용 사례 |
|-----------|------------|----------|
| `UpdateAuthority` | ✅ | 변경 가능한 에디션 번호 |
| `None` | ❌ | 영구적, 불변 에디션 |

### 권장 설정

| 구성 요소 | 위치 | 목적 |
|-----------|----------|---------|
| Master Edition | Collection | 에디션 그룹화, 최대 공급량 저장 |
| Edition | Asset | 개별 에디션 번호 저장 |
| Candy Machine | 민팅 | 자동 순차 번호 부여 |

## FAQ

### 에디션 번호가 고유하도록 강제되나요?

아니요. 에디션 번호는 정보 제공 목적입니다. 창작자가 고유 번호를 보장할 책임이 있습니다. 자동 순차 번호 부여를 위해 Edition Guard가 있는 Candy Machine을 사용하세요.

### 기존 Asset에 Edition 플러그인을 추가할 수 있나요?

아니요. Edition 플러그인은 Asset 생성 시 추가해야 합니다. 에디션 번호가 필요하면 미리 계획하세요.

### "1 of 100" 스타일 에디션을 어떻게 만드나요?

Asset에 Edition 플러그인을 추가하고 (1-100 번호로) Collection에 `maxSupply: 100`으로 Master Edition 플러그인을 추가합니다. Master Edition은 에디션을 그룹화하고 총 공급량을 나타냅니다.

### 생성 후 에디션 번호를 변경할 수 있나요?

네, 플러그인 권한이 `None`으로 설정되지 않았다면 가능합니다. 업데이트 권한자가 `updatePlugin`을 사용하여 번호를 수정할 수 있습니다.

### Edition과 Master Edition의 차이점은 무엇인가요?

Edition은 개별 번호 (예: #5)를 Asset에 저장합니다. Master Edition은 컬렉션 수준 데이터 (최대 공급량, 에디션 이름/URI)를 Collection에 저장하고 에디션을 함께 그룹화합니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **에디션 번호** | 특정 프린트의 고유 식별자 (예: 1, 2, 3) |
| **Master Edition** | 에디션을 그룹화하는 Collection 수준 플러그인 |
| **Edition Guard** | 자동 번호 부여를 위한 Candy Machine 가드 |
| **권한 관리** | 업데이트 권한자가 제어하는 플러그인 |
| **불변 에디션** | 권한이 `None`으로 설정된 에디션 |
