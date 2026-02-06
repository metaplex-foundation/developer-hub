---
title: Update Delegate 플러그인
metaTitle: Update Delegate 플러그인 | Metaplex Core
description: Core NFT Asset 및 Collection에 대한 업데이트 권한을 제3자에게 위임합니다. 소유권을 이전하지 않고 다른 사람이 메타데이터를 수정할 수 있게 합니다.
updated: '01-31-2026'
keywords:
  - update delegate
  - delegate update authority
  - metadata permissions
  - third-party updates
about:
  - Update delegation
  - Metadata permissions
  - Authority management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 추가 위임자는 무엇을 할 수 있나요?
    a: 업데이트 권한이 할 수 있는 거의 모든 것 - 메타데이터 업데이트, 플러그인 추가/제거 등. 루트 업데이트 권한 변경, 추가 위임자 목록 수정, Update Delegate 플러그인 권한 변경은 할 수 없습니다.
  - q: 추가 위임자가 더 많은 위임자를 추가할 수 있나요?
    a: 아니요. 루트 업데이트 권한(또는 플러그인 권한)만 추가 위임자를 추가하거나 제거할 수 있습니다.
  - q: 추가 위임자에서 자신을 제거하려면 어떻게 하나요?
    a: 추가 위임자는 additionalDelegates 배열에 자신의 주소 없이 플러그인을 업데이트하여 목록에서 자신을 제거할 수 있습니다.
  - q: 추가 위임자에 제한이 있나요?
    a: 하드 제한은 없지만 위임자가 많을수록 계정 크기와 렌트가 증가합니다. 목록을 적절하게 유지하세요.
  - q: Update Delegate가 Collection에서 작동하나요?
    a: 네. Collection에 Update Delegate를 추가하면 위임자가 Collection 메타데이터와 Collection 수준 플러그인을 업데이트할 수 있습니다.
---
**Update Delegate 플러그인**을 사용하면 추가 주소에 업데이트 권한을 부여할 수 있습니다. 제3자가 기본 업데이트 권한이 아니면서 Asset 메타데이터를 수정해야 할 때 유용합니다. {% .lead %}
{% callout title="학습 내용" %}

- Asset 및 Collection에 Update Delegate 플러그인 추가
- 추가 주소에 업데이트 권한 부여
- 추가 위임자가 할 수 있는 것과 없는 것 이해
- 위임자 목록 업데이트 및 관리
{% /callout %}

## 요약

**Update Delegate**는 업데이트 권한이 다른 주소에 업데이트 권한을 부여할 수 있게 하는 권한 관리 플러그인입니다. 추가 위임자는 대부분의 Asset 데이터를 수정할 수 있지만 핵심 권한 설정은 변경할 수 없습니다.

- 제3자에게 업데이트 권한 부여
- 여러 추가 위임자 추가
- Asset 및 Collection 모두에서 작동
- 위임자는 루트 업데이트 권한을 수정할 수 없음

## 범위 외

영구 업데이트 위임, 소유자 수준 권한 (이것은 권한 관리임), Token Metadata 업데이트 권한 (다른 시스템)은 범위 외입니다.

## 빠른 시작

**바로가기:** [Asset에 추가](#asset에-update-delegate-플러그인-추가) · [위임자 업데이트](#update-delegate-플러그인-업데이트) · [Collection](#collection에서-update-delegate-플러그인-업데이트)

1. 위임자 주소로 Update Delegate 플러그인 추가
2. 선택적으로 추가 위임자 추가
3. 이제 위임자가 Asset 메타데이터를 업데이트할 수 있음
{% callout type="note" title="Update Delegate 사용 시기" %}
| 시나리오 | 솔루션 |
|----------|----------|
| 제3자가 메타데이터를 업데이트해야 함 | ✅ Update Delegate |
| 게임 프로그램이 스탯을 수정해야 함 | ✅ Update Delegate (프로그램에 위임) |
| 여러 팀원이 업데이트 액세스 필요 | ✅ 추가 위임자 |
| 영구적으로 취소 불가능한 업데이트 액세스 | ❌ 지원되지 않음 (멀티시그 권한 사용) |
| 소유자가 업데이트를 제어해야 함 | ❌ 기본 권한 사용 |
**Update Delegate 사용**: 루트 권한을 이전하지 않고 프로그램이나 제3자에게 업데이트 권한을 부여해야 할 때.
{% /callout %}

## 일반적인 사용 사례

- **제3자 서비스**: 플랫폼이 귀하를 대신하여 메타데이터를 업데이트하도록 허용
- **게임 프로그램**: 게임 프로그램에 Asset 속성 수정 권한 부여
- **팀 협업**: 여러 팀원이 키 공유 없이 업데이트 가능
- **마켓플레이스**: 마켓플레이스가 리스팅 관련 메타데이터를 업데이트하도록 허용
- **동적 콘텐츠**: Asset 데이터를 자동으로 업데이트하는 서비스

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 인수

|                     |             |
| ------------------- | ----------- |
| additionalDelegates | publickey[] |

### additionalDelegates

추가 위임자를 사용하면 updateDelegate 플러그인에 하나 이상의 위임자를 추가할 수 있습니다.
추가 위임자는 업데이트 권한이 할 수 있는 모든 것을 할 수 있지만 다음은 예외입니다:

- 추가 위임자 배열 추가 또는 변경 (자신을 제거하는 것은 제외).
- updateAuthority 플러그인의 플러그인 권한 변경.
- Collection의 루트 업데이트 권한 변경.

## Asset에 Update Delegate 플러그인 추가

{% dialect-switcher title="MPL Core Asset에 Update Delegate 플러그인 추가" %}
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

## Update Delegate 플러그인 업데이트

Update Delegate 플러그인은 추가 위임자 목록을 수정하거나 플러그인 권한을 변경하도록 업데이트할 수 있습니다.
{% dialect-switcher title="Asset에서 Update Delegate 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const newDelegate = publicKey('33333333333333333333333333333333')
const existingDelegate = publicKey('22222222222222222222222222222222')
await updatePlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'UpdateDelegate',
    additionalDelegates: [existingDelegate, newDelegate], // 위임자 추가 또는 제거
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let new_delegate = Pubkey::from_str("33333333333333333333333333333333").unwrap();
    let existing_delegate = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let update_update_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {
            additional_delegates: vec![existing_delegate, new_delegate], // 위임자 추가 또는 제거
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_update_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## Collection에서 Update Delegate 플러그인 업데이트

{% dialect-switcher title="Collection에서 Update Delegate 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'
const collectionAddress = publicKey('11111111111111111111111111111111')
const delegate1 = publicKey('22222222222222222222222222222222')
const delegate2 = publicKey('33333333333333333333333333333333')
await updateCollectionPlugin(umi, {
  collection: collectionAddress,
  plugin: {
    type: 'UpdateDelegate',
    additionalDelegates: [delegate1, delegate2], // 업데이트된 위임자 목록
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::UpdateCollectionPluginV1Builder,
    types::{Plugin, UpdateDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn update_collection_update_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let delegate1 = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let delegate2 = Pubkey::from_str("33333333333333333333333333333333").unwrap();
    let update_collection_update_delegate_plugin_ix = UpdateCollectionPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .plugin(Plugin::UpdateDelegate(UpdateDelegate {
            additional_delegates: vec![delegate1, delegate2], // 업데이트된 위임자 목록
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let update_collection_update_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_collection_update_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&update_collection_update_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

업데이트 권한(또는 기존 플러그인 권한)만 Update Delegate 플러그인을 추가/수정할 수 있습니다.

### `Cannot modify root authority`

추가 위임자는 루트 업데이트 권한을 변경하거나 추가 위임자 목록을 수정할 수 없습니다 (자신을 제거하는 것은 예외).

## 참고 사항

- 권한 관리: 업데이트 권한이 소유자 서명 없이 추가 가능
- 추가 위임자는 거의 모든 업데이트 권한을 가짐
- 위임자는 루트 업데이트 권한을 변경할 수 없음
- 위임자는 추가 위임자 목록을 수정할 수 없음 (자신을 제거하는 것은 예외)
- Asset 및 Collection 모두에서 작동

## 빠른 참조

### 추가 위임자 권한

| 작업 | 허용됨? |
|--------|----------|
| 이름/URI 업데이트 | ✅ |
| 플러그인 추가 | ✅ |
| 플러그인 업데이트 | ✅ |
| 플러그인 제거 | ✅ |
| 루트 업데이트 권한 변경 | ❌ |
| 추가 위임자 수정 | ❌ (자기 제거 제외) |
| 플러그인 권한 변경 | ❌ |

## FAQ

### 추가 위임자는 무엇을 할 수 있나요?

업데이트 권한이 할 수 있는 거의 모든 것: 메타데이터 업데이트, 플러그인 추가/제거 등. 루트 업데이트 권한 변경, 추가 위임자 목록 수정, Update Delegate 플러그인 권한 변경은 할 수 없습니다.

### 추가 위임자가 더 많은 위임자를 추가할 수 있나요?

아니요. 루트 업데이트 권한(또는 플러그인 권한)만 추가 위임자를 추가하거나 제거할 수 있습니다.

### 추가 위임자에서 자신을 제거하려면 어떻게 하나요?

추가 위임자는 `additionalDelegates` 배열에 자신의 주소 없이 플러그인을 업데이트하여 목록에서 자신을 제거할 수 있습니다.

### 추가 위임자에 제한이 있나요?

하드 제한은 없지만 위임자가 많을수록 계정 크기와 렌트가 증가합니다. 목록을 적절하게 유지하세요.

### Update Delegate가 Collection에서 작동하나요?

네. Collection에 Update Delegate를 추가하면 위임자가 Collection 메타데이터와 Collection 수준 플러그인을 업데이트할 수 있습니다.

## 관련 플러그인

- [Attributes](/smart-contracts/core/plugins/attribute) - 위임자가 업데이트할 수 있는 온체인 데이터 저장
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - 메타데이터를 변경 불가능하게 만듦 (위임자 재정의)
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - 위임자가 새 플러그인을 추가하지 못하도록 방지

## 용어집

| 용어 | 정의 |
|------|------------|
| **Update Delegate** | 업데이트 권한을 부여하기 위한 권한 관리 플러그인 |
| **추가 위임자** | 업데이트 권한이 있는 추가 주소 |
| **권한 관리** | 업데이트 권한에 의해 제어되는 플러그인 유형 |
| **루트 업데이트 권한** | Asset/Collection의 기본 업데이트 권한 |
