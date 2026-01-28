---
title: Plugin 위임 및 해제
metaTitle: Plugin 권한 위임 및 해제 | Metaplex Core
description: Core Asset에서 Plugin 권한을 위임하고 해제하는 방법을 알아봅니다. Plugin을 제어하는 사람을 변경하고 Plugin 데이터를 영구적으로 불변으로 만듭니다.
---

이 가이드에서는 Core Asset에서 **Plugin 권한을 위임하고 해제하는** 방법을 설명합니다. Plugin의 제어를 다른 주소로 이전하거나 Plugin 데이터를 영구적으로 불변으로 만듭니다. {% .lead %}

{% callout title="학습 내용" %}

- 다른 주소에 Plugin 권한 위임
- 위임된 권한 해제
- 다른 Plugin 타입의 해제 동작 이해
- Plugin 데이터를 불변으로 만들기

{% /callout %}

## 요약

`approvePluginAuthority()`를 사용하여 Plugin 권한을 위임하고, `revokePluginAuthority()`로 해제합니다. 다른 Plugin 타입은 다른 해제 동작을 가집니다.

- **Owner Managed**: `Owner` 권한으로 복귀
- **Authority Managed**: `UpdateAuthority`로 복귀
- 권한을 `None`으로 설정하면 Plugin이 불변이 됨
- Owner Managed Plugin은 Asset 전송 시 자동 해제

## 범위 외

Plugin 제거([Plugin 제거](/ko/smart-contracts/core/plugins/removing-plugins) 참조), Plugin 추가([Plugin 추가](/ko/smart-contracts/core/plugins/adding-plugins) 참조), Permanent Plugin 권한 변경은 범위 외입니다.

## 빠른 시작

**바로 가기:** [권한 위임](#권한-위임) · [권한 해제](#권한-해제) · [불변으로 만들기](#plugin-데이터를-불변으로-만들기)

1. 새 권한 주소로 `approvePluginAuthority()` 호출
2. 해제하려면: `revokePluginAuthority()` 호출
3. 불변으로 만들려면: 권한을 `None`으로 설정

## 권한 위임

Plugin은 Delegate Authority 명령어 업데이트로 다른 주소에 위임될 수 있습니다. 위임된 Plugin을 통해 주 권한 이외의 주소가 해당 Plugin의 기능을 제어할 수 있습니다.

{% dialect-switcher title="Plugin 권한 위임" %}
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

## 권한 해제

Plugin에서 권한을 해제하면 해제되는 Plugin 타입에 따라 다른 동작이 발생합니다.

- **Owner Managed Plugin:** `Owner Managed Plugin`에서 주소가 해제되면 Plugin이 `Owner` 권한 타입으로 기본 복원됩니다.

- **Authority Managed Plugin:** `Authority Managed Plugin`에서 주소가 해제되면 Plugin이 `UpdateAuthority` 권한 타입으로 기본 복원됩니다.

### 누가 Plugin을 해제할 수 있나요?

#### Owner Managed Plugin

- Owner Managed Plugin은 소유자가 해제할 수 있으며, 이는 위임자를 해제하고 pluginAuthority 타입을 `Owner`로 설정합니다.
- Plugin의 위임된 권한은 스스로를 해제할 수 있으며, 그러면 Plugin 권한 타입이 `Owner`로 설정됩니다.
- 전송 시, Owner Managed Plugin의 위임된 권한은 자동으로 `Owner Authority` 타입으로 해제됩니다.

#### Authority Managed Plugin

- Asset의 업데이트 권한은 위임자를 해제할 수 있으며, 그러면 pluginAuthority 타입이 `UpdateAuthority`로 설정됩니다.
- Plugin의 위임된 권한은 스스로를 해제할 수 있으며, 그러면 Plugin 권한 타입이 `UpdateAuthority`로 설정됩니다.

Plugin 목록과 해당 타입은 [Plugin 개요](/ko/smart-contracts/core/plugins) 페이지에서 볼 수 있습니다.

{% dialect-switcher title="Plugin 권한 해제" %}
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

모든 Owner Managed Plugin은 Asset 전송 시 위임된 권한이 해제되고 `Owner`의 권한 타입으로 다시 설정됩니다.

여기에는 다음이 포함됩니다:

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## Plugin 데이터를 불변으로 만들기

Plugin의 권한을 `None` 값으로 업데이트하면 Plugin의 데이터가 효과적으로 불변이 됩니다.

{% callout type="warning" %}

**경고** - 이렇게 하면 Plugin 데이터가 불변이 됩니다. 주의해서 진행하세요!

{% /callout %}

{% dialect-switcher title="Plugin을 불변으로 만들기" %}
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

이 Plugin을 위임하거나 해제할 권한이 없습니다. 현재 권한만 위임할 수 있고, 소유자/권한만 해제할 수 있습니다.

### `Plugin not found`

Asset/Collection에 이 Plugin 타입이 연결되어 있지 않습니다.

### `Cannot revoke None authority`

`None` 권한의 Plugin은 불변입니다. 해제할 권한이 없습니다.

## 참고사항

- 위임은 제어를 이전하지만 원래 권한의 해제 능력은 제거되지 않음
- 권한을 `None`으로 설정하는 것은 영구적이고 되돌릴 수 없음
- Owner Managed Plugin은 Asset이 새 소유자에게 전송되면 자동 해제
- 해제는 권한을 기본 타입(Owner 또는 UpdateAuthority)으로 복원

## 빠른 참조

### Plugin 타입별 해제 동작

| Plugin 타입 | 복귀 대상 |
|-------------|------------|
| Owner Managed | `Owner` 권한 |
| Authority Managed | `UpdateAuthority` |

### 누가 위임/해제할 수 있는지

| 액션 | Owner Managed | Authority Managed |
|--------|---------------|-------------------|
| 위임 | 소유자 | 업데이트 권한 |
| 해제 | 소유자 또는 위임자 | 업데이트 권한 또는 위임자 |

## FAQ

### 해제와 Plugin 제거의 차이점은 무엇인가요?

해제는 Plugin을 제어하는 사람만 변경하고 Plugin과 데이터는 유지됩니다. 제거는 Plugin을 완전히 삭제합니다.

### 여러 주소에 위임할 수 있나요?

아니요. 각 Plugin은 한 번에 하나의 권한만 가질 수 있습니다. 새 주소에 위임하면 이전 권한이 대체됩니다.

### Asset을 전송하면 위임된 Plugin은 어떻게 되나요?

Owner Managed Plugin은 자동으로 `Owner` 권한으로 복귀합니다. Authority Managed Plugin은 변경되지 않습니다.

### 권한을 None으로 설정한 후 되돌릴 수 있나요?

아니요. 권한을 `None`으로 설정하면 Plugin이 영구적으로 불변이 됩니다. 이는 되돌릴 수 없습니다.

### 위임자가 자신을 해제할 수 있나요?

예. 위임된 권한은 자신의 액세스를 해제할 수 있으며, 그 후 제어는 기본 권한 타입으로 복귀합니다.

## 관련 작업

- [Plugin 추가](/ko/smart-contracts/core/plugins/adding-plugins) - Asset/Collection에 Plugin 추가
- [Plugin 제거](/ko/smart-contracts/core/plugins/removing-plugins) - Plugin 완전히 삭제
- [Plugin 업데이트](/ko/smart-contracts/core/plugins/update-plugins) - Plugin 데이터 수정
- [Plugin 개요](/ko/smart-contracts/core/plugins) - 사용 가능한 Plugin 전체 목록

## 용어집

| 용어 | 정의 |
|------|------------|
| **위임자** | Plugin의 임시 제어를 부여받은 주소 |
| **해제** | 위임된 권한을 제거하고 기본값으로 복귀 |
| **None 권한** | Plugin을 불변으로 만드는 특별한 권한 타입 |
| **자동 해제** | 전송 시 Owner Managed Plugin의 자동 해제 |
| **Plugin 권한** | Plugin을 제어하는 현재 주소 |

---

*Metaplex Foundation에서 관리 · 2026년 1월 마지막 확인 · @metaplex-foundation/mpl-core에 적용*
