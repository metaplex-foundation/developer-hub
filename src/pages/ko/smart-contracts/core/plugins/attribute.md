---
title: Attribute Plugin
metaTitle: Attribute Plugin | Metaplex Core
description: Core NFT Asset에 온체인 키-값 데이터를 저장합니다. Attributes Plugin을 사용하여 게임 스탯, 특성, 온체인 프로그램이 읽어야 하는 모든 데이터를 저장합니다.
---

**Attributes Plugin**은 Core Asset 또는 Collection 내에 키-값 쌍을 직접 온체인에 저장합니다. 게임 스탯, 특성, 온체인 프로그램이 읽어야 하는 모든 데이터에 적합합니다. {% .lead %}

{% callout title="학습 내용" %}

- Asset과 Collection에 온체인 속성 추가
- 키-값 쌍 저장 및 업데이트
- 온체인 프로그램에서 속성 읽기
- 사용 사례: 게임 스탯, 특성, 액세스 레벨

{% /callout %}

## 요약

**Attributes Plugin**은 온체인에 키-값 문자열 쌍을 저장하는 Authority Managed Plugin입니다. 오프체인 메타데이터와 달리 이러한 속성은 Solana 프로그램에서 읽을 수 있고 DAS에서 인덱싱됩니다.

- 모든 문자열 키-값 쌍을 온체인에 저장
- CPI를 통해 온체인 프로그램에서 읽기 가능
- DAS에서 빠른 쿼리를 위해 자동 인덱싱
- 업데이트 권한으로 수정 가능

## 범위 외

오프체인 메타데이터 속성(URI의 JSON에 저장), 복잡한 데이터 타입(문자열만 지원), 불변 속성(모든 속성은 수정 가능)은 범위 외입니다.

## 빠른 시작

**바로 가기:** [Asset에 추가](#asset에-attributes-plugin-추가) · [속성 업데이트](#asset의-attributes-plugin-업데이트)

1. Attributes Plugin 추가: `addPlugin(umi, { asset, plugin: { type: 'Attributes', attributeList: [...] } })`
2. 각 속성은 `{ key: string, value: string }` 쌍
3. 언제든 `updatePlugin()`으로 업데이트 가능
4. DAS 또는 온체인 fetch로 쿼리

{% callout type="note" title="온체인 vs 오프체인 속성" %}

| 기능 | 온체인 (이 Plugin) | 오프체인 (JSON 메타데이터) |
|---------|------------------------|---------------------------|
| 저장 위치 | Solana 계정 | Arweave/IPFS |
| 프로그램에서 읽기 가능 | ✅ Yes (CPI) | ❌ No |
| DAS에서 인덱싱 | ✅ Yes | ✅ Yes |
| 수정 가능 | ✅ Yes | 스토리지에 따라 다름 |
| 비용 | 렌트 (회수 가능) | 업로드 비용 (일회성) |
| 최적 용도 | 동적 데이터, 게임 스탯 | 정적 특성, 이미지 |

**온체인 속성 사용**: 프로그램이 데이터를 읽어야 하거나 자주 변경되는 경우.
**오프체인 메타데이터 사용**: 정적 특성과 이미지 참조의 경우.

{% /callout %}

## 일반적인 사용 사례

- **게임 캐릭터 스탯**: 체력, XP, 레벨, 클래스 - 게임플레이 중 변경되는 데이터
- **액세스 제어**: 티어, 역할, 권한 - 프로그램이 인증을 위해 확인하는 데이터
- **동적 특성**: 액션에 따라 특성이 변경되는 진화하는 NFT
- **스테이킹 상태**: 스테이킹 상태, 획득 보상, 스테이킹 시간 추적
- **업적 추적**: 배지, 마일스톤, 완료 상태
- **렌탈/대출**: 렌탈 기간, 대여자 정보, 반환일 추적

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 인수

| 인수           | 값                               |
| ------------- | ----------------------------------- |
| attributeList | Array<{key: string, value: string}> |

### AttributeList

속성 목록은 Array[] 형태로 구성되며, 그 안에 키-값 쌍 `{key: "value"}` 문자열 값 쌍의 객체가 있습니다.

{% dialect-switcher title="AttributeList" %}
{% dialect title="JavaScript" id="js" %}

```ts
const attributeList = [
  { key: 'key0', value: 'value0' },
  { key: 'key1', value: 'value1' },
]
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::{Attributes, Attribute}

let attributes = Attributes {
    attribute_list: vec![
        Attribute {
            key: "color".to_string(),
            value: "blue".to_string(),
        },
        Attribute {
            key: "access_type".to_string(),
            value: "prestige".to_string(),
        },
    ],
}
```

{% /dialect %}
{% /dialect-switcher %}

## Asset에 Attributes Plugin 추가

{% dialect-switcher title="MPL Core Asset에 Attribute Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'key0', value: 'value0' },
      { key: 'key1', value: 'value1' },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Attribute, Attributes, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_attributes_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_attribute_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: vec![
                Attribute {
                    key: "color".to_string(),
                    value: "blue".to_string(),
                },
                Attribute {
                    key: "access_type".to_string(),
                    value: "prestige".to_string(),
                },
            ],
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_attribute_plugin_tx = Transaction::new_signed_with_payer(
        &[add_attribute_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_attribute_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## Asset의 Attributes Plugin 업데이트

{% dialect-switcher title="Asset의 Attributes Plugin 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')

await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'key0', value: 'value0' },
      { key: 'key1', value: 'value1' },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Attribute, Attributes, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_attributes_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_attributes_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::Attributes(Attributes {
            attribute_list: vec![
                Attribute {
                    key: "color".to_string(),
                    value: "new value".to_string(),
                },
                Attribute {
                    key: "access_type".to_string(),
                    value: "new value".to_string(),
                },
                Attribute {
                    key: "additional_attribute".to_string(),
                    value: "additional_value".to_string(),
                },
            ],
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[update_attributes_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

Plugin 권한(보통 업데이트 권한)만 속성을 추가하거나 업데이트할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

### `String too long`

속성 키와 값에는 크기 제한이 있습니다. 간결하게 유지하세요.

## 참고사항

- Authority Managed: 업데이트 권한은 소유자 서명 없이 추가/업데이트 가능
- 모든 값은 문자열 - 필요에 따라 숫자/불리언 변환
- 업데이트는 전체 속성 목록을 대체 (부분 업데이트 없음)
- 속성은 계정 크기와 렌트 비용을 증가시킴
- DAS는 빠른 쿼리를 위해 속성을 인덱싱

## 빠른 참조

### 최소 코드

```ts {% title="minimal-attributes.ts" %}
import { addPlugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'Attributes',
    attributeList: [
      { key: 'level', value: '5' },
      { key: 'class', value: 'warrior' },
    ],
  },
}).sendAndConfirm(umi)
```

### 일반적인 속성 패턴

| 사용 사례 | 예시 키 |
|----------|--------------|
| 게임 캐릭터 | `level`, `health`, `xp`, `class` |
| 액세스 제어 | `tier`, `access_level`, `role` |
| 특성 | `background`, `eyes`, `rarity` |
| 상태 | `staked`, `listed`, `locked` |

## FAQ

### 온체인 속성과 오프체인 메타데이터 속성의 차이점은 무엇인가요?

온체인 속성(이 Plugin)은 Solana에 저장되며 프로그램에서 읽을 수 있습니다. 오프체인 속성(URI의 JSON)은 Arweave/IPFS에 저장되며 클라이언트에서만 읽을 수 있습니다.

### 온체인 프로그램이 이러한 속성을 읽을 수 있나요?

예. CPI를 사용하여 Asset 계정을 fetch하고 Attributes Plugin 데이터를 역직렬화합니다.

### 속성이 DAS에서 인덱싱되나요?

예. DAS는 빠른 쿼리를 위해 속성 키-값 쌍을 자동으로 인덱싱합니다.

### 숫자나 불리언을 저장할 수 있나요?

값은 문자열만 가능합니다. 필요에 따라 변환: `{ key: 'level', value: '5' }`, `{ key: 'active', value: 'true' }`.

### 단일 속성을 업데이트하려면 어떻게 하나요?

개별 속성은 업데이트할 수 없습니다. 현재 목록을 fetch하고 수정한 다음 전체 새 목록으로 업데이트합니다.

### 속성의 크기 제한은 무엇인가요?

엄격한 제한은 없지만 속성 목록이 클수록 렌트 비용이 증가합니다. 데이터를 간결하게 유지하세요.

### 소유자가 속성을 업데이트할 수 있나요?

아니요. Attributes Plugin은 Authority Managed이므로 업데이트 권한만 수정할 수 있습니다(소유자가 아님).

## 관련 Plugin

- [Update Delegate](/ko/smart-contracts/core/plugins/update-delegate) - 다른 사람에게 속성 업데이트 권한 부여
- [ImmutableMetadata](/ko/smart-contracts/core/plugins/immutableMetadata) - 이름/URI 잠금(속성은 수정 가능한 상태로 유지)
- [AddBlocker](/ko/smart-contracts/core/plugins/addBlocker) - 새 Plugin 추가 방지

## 용어집

| 용어 | 정의 |
|------|------------|
| **Attributes Plugin** | 온체인 키-값 쌍을 저장하는 Authority Managed Plugin |
| **attributeList** | `{ key, value }` 객체의 배열 |
| **Authority Managed** | 업데이트 권한이 제어하는 Plugin 타입 |
| **온체인 데이터** | Solana 계정에 직접 저장되는 데이터(프로그램에서 읽기 가능) |
| **DAS** | 속성을 인덱싱하는 Digital Asset Standard API |

---

*Metaplex Foundation에서 관리 · 2026년 1월 마지막 확인 · @metaplex-foundation/mpl-core에 적용*
