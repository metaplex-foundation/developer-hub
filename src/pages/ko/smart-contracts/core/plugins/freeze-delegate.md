---
title: Freeze Delegate
metaTitle: Freeze Delegate Plugin | Metaplex Core
description: Core NFT Asset을 동결하여 전송 및 소각을 차단하는 방법을 알아보세요. 에스크로 없는 스테이킹, 마켓플레이스 리스팅, 게임 아이템 잠금에 Freeze Delegate 플러그인을 사용하세요.
---

**Freeze Delegate Plugin**은 Core Asset을 동결하여 Asset이 소유자의 지갑에 남아있는 동안 전송과 소각을 차단합니다. 에스크로 없는 스테이킹, 마켓플레이스 리스팅, 게임 메커니즘에 적합합니다. {% .lead %}

{% callout title="학습 내용" %}

- Asset에 Freeze Delegate 플러그인 추가
- Asset 동결 및 해제
- 다른 주소에 동결 권한 위임
- 사용 사례: 스테이킹, 리스팅, 게임 잠금

{% /callout %}

## 요약

**Freeze Delegate**는 Asset을 제자리에 동결하는 Owner Managed 플러그인입니다. 동결되면 동결 권한이 해제할 때까지 Asset을 전송하거나 소각할 수 없습니다.

- 에스크로로 전송하지 않고 Asset 동결
- 프로그램이나 다른 지갑에 동결 권한 위임
- 전송 시 권한이 철회됨 (비영구 버전의 경우)
- 철회 불가능한 동결을 위해서는 [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) 사용

## 범위 외

Collection 수준 동결 (Asset 수준만 사용), 영구 동결 (Permanent Freeze Delegate 참조), Token Metadata 동결 권한 (다른 시스템).

## 빠른 시작

**바로가기:** [플러그인 추가](#asset에-freeze-delegate-plugin-추가) · [권한 위임](#freeze-권한-위임) · [동결](#asset-동결) · [해제](#동결된-asset-해제)

1. Freeze Delegate 플러그인 추가: `addPlugin(umi, { asset, plugin: { type: 'FreezeDelegate', data: { frozen: true } } })`
2. 이제 Asset이 동결되어 전송할 수 없음
3. 준비되면 해제: `frozen: false`로 플러그인 업데이트
4. 전송 시 권한 철회

{% callout type="note" title="Freeze vs Permanent Freeze Delegate 사용 시기" %}

| 사용 사례 | Freeze Delegate | Permanent Freeze Delegate |
|----------|-----------------|---------------------------|
| 마켓플레이스 리스팅 | ✅ 최적 선택 | ❌ 과도함 |
| 에스크로 없는 스테이킹 | ✅ 최적 선택 | ✅ 사용 가능 |
| 소울바운드 토큰 | ❌ 전송 시 철회됨 | ✅ 최적 선택 |
| Collection 전체 동결 | ❌ Asset 전용 | ✅ Collection 지원 |
| 렌탈 프로토콜 | ✅ 최적 선택 | ✅ 사용 가능 |

소유권 변경 시 권한이 재설정되어야 할 때 **Freeze Delegate를 선택**하세요.
권한이 영구적으로 유지되어야 할 때 **[Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate)를 선택**하세요.

{% /callout %}

## 일반적인 사용 사례

- **에스크로 없는 스테이킹**: 에스크로로 전송하지 않고 스테이킹 중 NFT 동결
- **마켓플레이스 리스팅**: 에스크로 계정 없이 판매용 NFT 잠금
- **게임 아이템 잠금**: 게임플레이 중 아이템 일시적 잠금
- **렌탈 프로토콜**: 대여 중 NFT 잠금
- **거버넌스**: 투표 기간 동안 토큰 잠금
- **담보**: 대출 담보로 사용되는 NFT 잠금
- **토너먼트**: 대회 참가 중 NFT 잠금

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

Collection 수준 동결을 위해서는 [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate)를 대신 사용하세요.

## 인수

| 인수    | 값 |
| ------ | ----- |
| frozen | bool  |

## 함수

### Asset에 Freeze Delegate Plugin 추가

`addPlugin` 명령은 Asset에 Freeze Delegate Plugin을 추가합니다. 이 플러그인을 통해 Asset을 동결하여 전송과 소각을 방지할 수 있습니다.

{% dialect-switcher title="MPL Core Asset에 Freeze Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')

await addPlugin(umi, {
  asset: assetAddress,
  plugin: { type: 'FreezeDelegate', data: { frozen: true } },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
AddPluginV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke();
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_freeze_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::FreezeDelegate(FreezeDelegate {frozen: true}))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_freeze_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_freeze_delegate_plugin_ix_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Freeze 권한 위임

`approvePluginAuthority` 명령은 동결 권한을 다른 주소에 위임합니다. 이를 통해 소유권을 유지하면서 다른 주소가 Asset을 동결하고 해제할 수 있습니다.

{% dialect-switcher title="Freeze 권한 위임" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const delegateAddress = publicKey('22222222222222222222222222222222')

await approvePluginAuthority(umi, {
  asset: asset.publicKey,
  plugin: { type: 'FreezeDelegate' },
  newAuthority: { type: 'Address', address: delegateAddress },
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
ApprovePluginAuthorityV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin_type(PluginType::FreezeDelegate)
    .new_authority(PluginAuthority::Address { address: ctx.accounts.new_authority.key() })
    .invoke()?;
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

pub async fn approve_plugin_authority() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let new_authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();

    let approve_plugin_authority_plugin_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // Asset이 컬렉션의 일부인 경우, 컬렉션을 전달해야 합니다
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::FreezeDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_attributes_plugin_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_attributes_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

## Freeze Delegate Plugin 업데이트

Freeze Delegate Plugin은 Asset의 동결 상태를 변경하기 위해 업데이트할 수 있습니다. 이는 아래에 표시된 [Asset 동결](#asset-동결) 및 [동결된 Asset 해제](#동결된-asset-해제) 함수를 사용하는 것과 동일합니다.

### Asset 동결

`freezeAsset` 명령은 Asset을 동결하여 전송이나 소각을 방지합니다. 이는 에스크로 없는 스테이킹이나 마켓플레이스 리스팅에 유용합니다.

{% dialect-switcher title="MPL Core Asset 동결" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { freezeAsset, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)

const delegateSigner = generateSigner(umi)

await freezeAsset(umi, {
    asset: assetAccount,
    delegate: delegateSigner.publicKey,
    authority: delegateSigner,
  }).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // FreezeDelegate 플러그인을 `frozen: true`로 설정
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
    .invoke()?;
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let update_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Asset이 컬렉션의 일부인 경우 Collection을 전달
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeDelegate 플러그인을 `frozen: true`로 설정
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[update_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

### 동결된 Asset 해제

`thawAsset` 명령은 동결된 Asset을 해제하여 전송과 소각 기능을 복원합니다.

{% dialect-switcher title="MPL Core Asset 해제" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { thawAsset, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetAddress = publicKey('11111111111111111111111111111111')
const assetAccount = await fetchAsset(umi, assetAddress)

const delegateSigner = generateSigner(umi)

await thawAsset(umi, {
  asset: assetAccount,
  delegate: delegateSigner,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    // FreezeDelegate 플러그인을 `frozen: false`로 설정
    .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
    .invoke()?;
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::UpdatePluginV1Builder,
    types::{FreezeDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn thaw_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let thaw_freeze_delegate_plugin_ix = UpdatePluginV1Builder::new()
        .asset(asset)
        // Asset이 컬렉션의 일부인 경우 Collection을 전달
        .collection(Some(collection))
        .payer(authority.pubkey())
        // FreezeDelegate 플러그인을 `frozen: false`로 설정
        .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let thaw_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[thaw_freeze_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&thaw_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res);
}
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Asset is frozen`

동결된 Asset을 전송하거나 소각하려고 했습니다. 동결 권한이 먼저 해제해야 합니다.

### `Authority mismatch`

동결 위임 권한만 Asset을 동결/해제할 수 있습니다. 누가 플러그인 권한을 가지고 있는지 확인하세요.

### `Plugin not found`

Asset에 Freeze Delegate 플러그인이 없습니다. 먼저 `addPlugin`으로 추가하세요.

## 참고 사항

- Owner Managed: 추가하려면 소유자 서명 필요
- Asset 전송 시 권한이 자동으로 철회됨
- 동결된 Asset은 여전히 업데이트 가능 (메타데이터 변경 허용)
- 전송 후에도 권한이 유지되어야 하면 Permanent Freeze Delegate 사용
- 동결은 즉시 적용됨 - 확인 기간 없음

## 빠른 참조

### 동결 상태

| 상태 | 전송 가능 | 소각 가능 | 업데이트 가능 |
|-------|----------|---------|-----------|
| 해제됨 | 예 | 예 | 예 |
| 동결됨 | 아니오 | 아니오 | 예 |

### 권한 동작

| 이벤트 | 권한 결과 |
|-------|----------|
| Asset 전송 | 권한 철회됨 |
| 플러그인 제거 | 권한 사라짐 |
| 해제 | 권한 유지됨 |

## FAQ

### 내가 소유하지 않은 Asset을 동결할 수 있나요?

아니요. Freeze Delegate는 Owner Managed이므로 소유자만 추가할 수 있습니다. 추가 후에는 다른 주소에 권한을 위임할 수 있습니다.

### Freeze Delegate와 Permanent Freeze Delegate의 차이점은 무엇인가요?

Freeze Delegate 권한은 전송 시 철회됩니다. Permanent Freeze Delegate 권한은 영구적으로 유지되며 생성 시에만 추가할 수 있습니다.

### 동결된 Asset을 소각할 수 있나요?

아니요. 동결된 Asset은 전송과 소각이 모두 차단됩니다. 소각하려면 먼저 Asset을 해제하세요.

### Collection 전체를 한 번에 동결할 수 있나요?

일반 Freeze Delegate로는 불가능합니다 (Asset 전용). 대신 Collection에 [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate)를 사용하세요 - Collection 수준 동결을 지원하며 해당 Collection의 모든 Asset을 한 번에 동결합니다. Permanent Freeze Delegate는 Collection 생성 시에만 추가할 수 있습니다.

### 동결이 메타데이터 업데이트에 영향을 주나요?

아니요. Asset 소유자 또는 업데이트 권한은 동결된 상태에서도 메타데이터(이름, URI)를 업데이트할 수 있습니다. 전송과 소각만 차단됩니다.

### 에스크로 없는 스테이킹을 어떻게 구현하나요?

1. 스테이킹 프로그램을 권한으로 하여 Freeze Delegate 플러그인 추가
2. 사용자가 스테이킹할 때: Asset 동결
3. 사용자가 언스테이킹할 때: Asset 해제
4. NFT는 절대 사용자 지갑을 떠나지 않음

## 관련 플러그인

- [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) - 철회 불가능한 동결 권한, Collection 지원
- [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) - 위임자가 Asset 전송 허용
- [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) - 위임자가 Asset 소각 허용

## 용어 정리

| 용어 | 정의 |
|------|------|
| **Freeze Delegate** | 전송과 소각을 차단하는 Owner Managed 플러그인 |
| **Frozen** | 전송과 소각이 차단된 Asset 상태 |
| **Thaw** | 전송을 다시 허용하기 위해 Asset 동결 해제 |
| **Delegate Authority** | Asset을 동결/해제할 권한이 있는 계정 |
| **Escrowless** | 보관 계정으로 전송하지 않는 스테이킹/리스팅 |
| **Owner Managed** | 추가하려면 소유자 서명이 필요한 플러그인 유형 |

---

*Metaplex Foundation 관리 · 2026년 1월 최종 검증 · @metaplex-foundation/mpl-core에 적용*
