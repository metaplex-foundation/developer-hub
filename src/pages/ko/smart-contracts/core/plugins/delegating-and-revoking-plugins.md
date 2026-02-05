---
title: 플러그인 위임 및 취소
metaTitle: 플러그인 권한 위임 및 취소 | Metaplex Core
description: Core Asset에서 플러그인 권한을 위임하고 취소하는 방법을 알아보세요. 플러그인을 제어하는 사람을 변경하고 플러그인 데이터를 불변으로 만들 수 있습니다.
updated: '01-31-2026'
keywords:
  - delegate plugin
  - revoke plugin
  - plugin authority
  - immutable plugin
about:
  - Authority delegation
  - Plugin revocation
  - Immutability
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 취소와 제거의 차이점은 무엇인가요?
    a: 취소는 플러그인을 제어하는 사람만 변경합니다 - 플러그인과 데이터는 그대로 유지됩니다. 제거는 플러그인 전체를 삭제합니다.
  - q: 여러 주소에 위임할 수 있나요?
    a: 아니요. 각 플러그인은 한 번에 하나의 권한자만 가집니다. 새 주소에 위임하면 이전 권한자가 대체됩니다.
  - q: Asset을 전송할 때 위임된 플러그인은 어떻게 되나요?
    a: 소유자 관리 플러그인은 자동으로 Owner 권한으로 취소됩니다. 권한 관리 플러그인은 변경되지 않습니다.
  - q: 권한을 None으로 설정한 것을 취소할 수 있나요?
    a: 아니요. 권한을 None으로 설정하면 플러그인이 영구적으로 불변이 됩니다. 이는 되돌릴 수 없습니다.
  - q: 위임자가 스스로 취소할 수 있나요?
    a: 네. 위임된 권한자는 자신의 접근 권한을 취소할 수 있으며, 이는 기본 권한 유형으로 제어권을 반환합니다.
---
이 가이드는 Core Asset에서 **플러그인 권한을 위임하고 취소하는 방법**을 보여줍니다. 플러그인 제어권을 다른 주소에 전달하거나 플러그인 데이터를 영구적으로 불변으로 만들 수 있습니다. {% .lead %}
{% callout title="학습 내용" %}
- 플러그인 권한을 다른 주소에 위임
- 위임된 권한 취소
- 다양한 플러그인 유형의 취소 동작 이해
- 플러그인 데이터를 불변으로 만들기
{% /callout %}
## 요약
`approvePluginAuthority()`를 사용하여 플러그인 권한을 위임하고 `revokePluginAuthority()`로 취소합니다. 다양한 플러그인 유형에는 다양한 취소 동작이 있습니다.
- **소유자 관리**: `Owner` 권한으로 취소됨
- **권한 관리**: `UpdateAuthority`로 취소됨
- 권한을 `None`으로 설정하면 플러그인이 불변
- 소유자 관리 플러그인은 Asset 전송 시 자동 취소
## 범위 외
플러그인 제거 ([플러그인 제거](/smart-contracts/core/plugins/removing-plugins) 참조), 플러그인 추가 ([플러그인 추가](/smart-contracts/core/plugins/adding-plugins) 참조), 영구 플러그인 권한 변경.
## 빠른 시작
**바로 가기:** [권한 위임](#권한-위임) · [권한 취소](#권한-취소) · [불변으로 만들기](#플러그인-데이터를-불변으로-만들기)
1. 새 권한 주소로 `approvePluginAuthority()` 호출
2. 취소하려면: `revokePluginAuthority()` 호출
3. 불변으로 만들려면: 권한을 `None`으로 설정
## 권한 위임
플러그인은 Delegate Authority 명령 업데이트를 통해 다른 주소에 위임할 수 있습니다. 위임된 플러그인은 주요 권한자 외의 주소가 해당 플러그인 기능을 제어할 수 있게 합니다.
{% dialect-switcher title="플러그인 권한 위임" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('33333333333333333333333333333')
await approvePluginAuthority(umi, {
  asset: assetAddress,
  plugin: { type: 'Attributes' },
  newAuthority: { type: 'Address', address: delegate },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn delegate_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let delegate_authority = Pubkey::from_str("22222222222222222222222222222222").unwrap();
    let delegate_plugin_authority_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address {
            address: delegate_authority,
        })
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let delegate_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[delegate_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&delegate_plugin_authority_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 권한 취소
플러그인 권한을 취소하면 플러그인 유형에 따라 다른 동작이 발생합니다.
- **소유자 관리 플러그인:** `소유자 관리 플러그인`에서 주소가 취소되면 플러그인은 기본적으로 `Owner` 권한 유형으로 돌아갑니다.
- **권한 관리 플러그인:** `권한 관리 플러그인`에서 주소가 취소되면 플러그인은 기본적으로 `UpdateAuthority` 권한 유형으로 돌아갑니다.
### 누가 플러그인을 취소할 수 있나요?
#### 소유자 관리 플러그인
- 소유자가 소유자 관리 플러그인을 취소하면 위임을 취소하고 pluginAuthority 유형을 `Owner`로 설정합니다.
- 플러그인의 위임된 권한자가 스스로 취소할 수 있으며, 이는 플러그인 권한 유형을 `Owner`로 설정합니다.
- 전송 시, 소유자 관리 플러그인의 위임된 권한자는 자동으로 `Owner Authority` 유형으로 취소됩니다.
#### 권한 관리 플러그인
- Asset의 업데이트 권한자가 위임을 취소할 수 있으며, 이는 pluginAuthority 유형을 `UpdateAuthority`로 설정합니다.
- 플러그인의 위임된 권한자가 스스로 취소할 수 있으며, 이는 플러그인 권한 유형을 `UpdateAuthority`로 설정합니다.
플러그인과 해당 유형 목록은 [플러그인 개요](/smart-contracts/core/plugins) 페이지에서 확인할 수 있습니다.
{% dialect-switcher title="플러그인 권한 취소" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'
await revokePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'Attributes' },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{instructions::RevokePluginAuthorityV1Builder, types::PluginType};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn revoke_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let revoke_plugin_authority_ix = RevokePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let revoke_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[revoke_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&revoke_plugin_authority_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
### Asset 전송 시 위임 재설정
모든 소유자 관리 플러그인은 Asset 전송 시 위임된 권한자가 취소되어 `Owner` 권한 유형으로 다시 설정됩니다.
여기에는 다음이 포함됩니다:
- Freeze Delegate
- Transfer Delegate
- Burn Delegate
## 플러그인 데이터를 불변으로 만들기
플러그인 권한을 `None` 값으로 업데이트하면 플러그인 데이터가 효과적으로 불변이 됩니다.
{% callout type="warning" %}
**경고** - 이렇게 하면 플러그인 데이터가 불변이 됩니다. 주의하세요!
{% /callout %}
{% dialect-switcher title="플러그인을 불변으로 만들기" %}
{% dialect title="JavaScript" id="js" %}
```ts
import {
  approvePluginAuthority
} from '@metaplex-foundation/mpl-core'
await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'None' },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::ApprovePluginAuthorityV1Builder,
    types::{PluginAuthority, PluginType},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn make_plugin_data_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let make_plugin_data_immutable_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::None)
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let make_plugin_data_immutable_tx = Transaction::new_signed_with_payer(
        &[make_plugin_data_immutable_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&make_plugin_data_immutable_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 일반적인 오류
### `Authority mismatch`
이 플러그인을 위임하거나 취소할 권한이 없습니다. 현재 권한자만 위임할 수 있고; 소유자/권한자만 취소할 수 있습니다.
### `Plugin not found`
Asset/Collection에 이 플러그인 유형이 첨부되어 있지 않습니다.
### `Cannot revoke None authority`
`None` 권한이 있는 플러그인은 불변입니다. 취소할 권한이 없습니다.
## 참고 사항
- 위임은 제어권을 전달하지만 원래 권한자의 취소 능력을 제거하지 않음
- 권한을 `None`으로 설정하면 영구적이며 되돌릴 수 없음
- 소유자 관리 플러그인은 Asset이 새 소유자에게 전송될 때 자동 취소됨
- 취소는 기본 유형 (Owner 또는 UpdateAuthority)으로 권한을 반환
## 빠른 참조
### 플러그인 유형별 취소 동작
| 플러그인 유형 | 취소 대상 |
|-------------|------------|
| 소유자 관리 | `Owner` 권한 |
| 권한 관리 | `UpdateAuthority` |
### 누가 위임/취소할 수 있나요
| 작업 | 소유자 관리 | 권한 관리 |
|--------|---------------|-------------------|
| 위임 | 소유자 | 업데이트 권한자 |
| 취소 | 소유자 또는 위임자 | 업데이트 권한자 또는 위임자 |
## FAQ
### 취소와 제거의 차이점은 무엇인가요?
취소는 플러그인을 제어하는 사람만 변경합니다—플러그인과 데이터는 그대로 유지됩니다. 제거는 플러그인 전체를 삭제합니다.
### 여러 주소에 위임할 수 있나요?
아니요. 각 플러그인은 한 번에 하나의 권한자만 가집니다. 새 주소에 위임하면 이전 권한자가 대체됩니다.
### Asset을 전송할 때 위임된 플러그인은 어떻게 되나요?
소유자 관리 플러그인은 자동으로 `Owner` 권한으로 취소됩니다. 권한 관리 플러그인은 변경되지 않습니다.
### 권한을 None으로 설정한 것을 취소할 수 있나요?
아니요. 권한을 `None`으로 설정하면 플러그인이 영구적으로 불변이 됩니다. 이는 되돌릴 수 없습니다.
### 위임자가 스스로 취소할 수 있나요?
네. 위임된 권한자는 자신의 접근 권한을 취소할 수 있으며, 이는 기본 권한 유형으로 제어권을 반환합니다.
## 관련 작업
- [플러그인 추가](/smart-contracts/core/plugins/adding-plugins) - Asset/Collection에 플러그인 추가
- [플러그인 제거](/smart-contracts/core/plugins/removing-plugins) - 플러그인 완전 삭제
- [플러그인 업데이트](/smart-contracts/core/plugins/update-plugins) - 플러그인 데이터 수정
- [플러그인 개요](/smart-contracts/core/plugins) - 사용 가능한 플러그인 전체 목록
## 용어집
| 용어 | 정의 |
|------|------------|
| **위임자** | 플러그인의 임시 제어권을 부여받은 주소 |
| **취소** | 위임된 권한 제거, 기본값으로 반환 |
| **None 권한** | 플러그인을 불변으로 만드는 특수 권한 유형 |
| **자동 취소** | 전송 시 소유자 관리 플러그인의 자동 취소 |
| **플러그인 권한** | 플러그인을 제어하는 현재 주소 |
