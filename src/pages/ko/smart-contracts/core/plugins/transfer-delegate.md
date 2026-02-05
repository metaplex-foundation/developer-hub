---
title: Transfer Delegate 플러그인
metaTitle: Transfer Delegate 플러그인 | Metaplex Core
description: Core NFT Asset의 전송을 위임자에게 허용합니다. 에스크로 없는 판매, 게임 메카닉, 마켓플레이스 리스팅에 Transfer Delegate 플러그인을 사용하세요.
updated: '01-31-2026'
keywords:
  - transfer delegate
  - delegate transfer
  - escrowless sale
  - NFT marketplace
about:
  - Transfer delegation
  - Escrowless mechanics
  - Marketplace integration
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 왜 전송 권한이 취소되었나요?
    a: Transfer Delegate 권한은 모든 전송 후 자동으로 취소됩니다. 이는 마켓플레이스 안전을 위해 의도된 설계입니다 - 위임자는 한 번만 전송할 수 있습니다.
  - q: 에스크로 없는 리스팅을 어떻게 구현하나요?
    a: 판매자가 마켓플레이스를 권한으로 하여 Transfer Delegate를 추가합니다. 구매자가 지불하면 마켓플레이스가 Asset을 구매자에게 전송합니다. 권한이 취소되어 판매자는 이중 리스팅을 할 수 없습니다.
  - q: Transfer Delegate와 Permanent Transfer Delegate의 차이점은 무엇인가요?
    a: Transfer Delegate는 한 번 전송 후 취소됩니다. Permanent Transfer Delegate는 영구적으로 유지되며 Asset 생성 시에만 추가할 수 있습니다.
  - q: 위임자로서 동결된 Asset을 전송할 수 있나요?
    a: 아니요. 동결된 Asset은 위임자 전송을 포함한 모든 전송을 차단합니다. 복잡한 에스크로 시나리오에는 Permanent Transfer Delegate와 Permanent Freeze Delegate를 함께 사용하세요.
  - q: 소유자가 각 전송을 승인해야 하나요?
    a: 아니요. Transfer Delegate가 설정되면 위임자는 소유자 승인 없이 전송할 수 있습니다. 하지만 권한이 취소되기 전에 한 번만 가능합니다.
---
**Transfer Delegate 플러그인**은 지정된 권한이 소유자를 대신하여 Core Asset을 전송할 수 있게 합니다. 에스크로 없는 마켓플레이스 판매, 게임 메카닉, 구독 서비스에 필수적입니다. {% .lead %}
{% callout title="학습 내용" %}
- Asset에 Transfer Delegate 플러그인 추가
- 마켓플레이스 또는 프로그램에 전송 권한 위임
- 위임자로서 전송 실행
- 전송 시 권한 동작
{% /callout %}
## 요약
**Transfer Delegate**는 위임자가 Asset을 전송할 수 있게 하는 소유자 관리 플러그인입니다. 일단 위임되면 권한이 소유자 승인 없이 Asset을 모든 주소로 전송할 수 있습니다.
- 에스크로 없는 마켓플레이스 리스팅 가능
- **전송 후 권한 취소** (일회용)
- 영구적 권한을 위해 [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) 사용
- 추가 인수 필요 없음
## 범위 외
영구 전송 권한 (Permanent Transfer Delegate 참조), Collection 수준 전송, Token Metadata 전송 권한 (다른 시스템)은 범위 외입니다.
## 빠른 시작
**바로가기:** [플러그인 추가](#asset에-transfer-delegate-플러그인-추가) · [권한 위임](#전송-권한-위임) · [위임자로서 전송](#위임자로서-asset-전송)
1. 위임자 주소로 Transfer Delegate 플러그인 추가
2. 이제 위임자가 Asset을 한 번 전송 가능
3. 전송 후 권한 자동 취소
## 개요
`Transfer Delegate` 플러그인은 Transfer Delegate 플러그인의 권한이 언제든지 Asset을 전송할 수 있게 하는 `소유자 관리` 플러그인입니다.
Transfer 플러그인은 다음과 같은 영역에서 작동합니다:
- Asset의 에스크로 없는 판매: 에스크로 계정 없이 NFT를 구매자에게 직접 전송
- 사용자가 이벤트에 따라 자산을 교환/잃는 게임 시나리오: 게임 이벤트 발생 시 자산 자동 전송
- 구독 서비스: 구독 서비스의 일부로 NFT 전송
{% callout type="note" title="Transfer vs Permanent Transfer Delegate 사용 시기" %}
| 사용 사례 | Transfer Delegate | Permanent Transfer Delegate |
|----------|-------------------|----------------------------|
| 마켓플레이스 리스팅 | ✅ 최선의 선택 | ❌ 너무 위험 |
| 일회성 전송 | ✅ 최선의 선택 | ❌ 과도함 |
| 렌탈 반환 | ❌ 일회용 | ✅ 최선의 선택 |
| 게임 자산 교환 | ✅ 최선의 선택 | ✅ 작동함 |
| 전송 시 권한 유지 | ❌ 취소됨 | ✅ 유지됨 |
**Transfer Delegate 선택**: 일회성 에스크로 없는 판매에 사용 (전송 후 권한 취소).
**[Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) 선택**: 권한이 영구적으로 유지되어야 할 때.
{% /callout %}
{% callout title="경고!" %}
Transfer delegate 권한은 일시적이며 자산 전송 시 재설정됩니다.
{% /callout %}
## 호환성
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
## 인수
Transfer 플러그인은 전달할 인수가 없습니다.
## 함수
### Asset에 Transfer Delegate 플러그인 추가
`addPlugin` 명령은 Asset에 Transfer Delegate 플러그인을 추가합니다. 이 플러그인을 통해 위임자가 언제든지 Asset을 전송할 수 있습니다.
{% dialect-switcher title="MPL Core Asset에 Transfer 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
const delegate = publicKey('22222222222222222222222222222222')
await addPlugin(umi, {
  asset: assetAddress,
  plugin: {
    type: 'TransferDelegate',
    authority: { type: 'Address', address: delegate },
  },
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
    .plugin(Plugin::TransferDelegate(TransferDelegate {}))
    .invoke();
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, TransferDelegate},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_transfer_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::TransferDelegate(TransferDelegate {}))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_plugin_tx = Transaction::new_signed_with_payer(
        &[add_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
### 전송 권한 위임
`approvePluginAuthority` 명령은 전송 권한을 다른 주소에 위임합니다. 이를 통해 다른 주소가 소유권을 유지하면서 Asset을 전송할 수 있습니다.
{% dialect-switcher title="전송 권한 위임" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
const asset = publicKey("11111111111111111111111111111111");
const collection = publicKey("22222222222222222222222222222222");
const delegateAddress = publicKey("33333333333333333333333333333333");
await approvePluginAuthority(umi, {
  asset: asset,
  collection: collection,
  plugin: { type: "TransferDelegate" },
  newAuthority: { type: "Address", address: delegateAddress },
}).sendAndConfirm(umi);
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
ApprovePluginAuthorityV1CpiBuilder::new(ctx.accounts.mpl_core_program)
    .asset(ctx.accounts.asset)
    .collection(Some(ctx.accounts.collection))
    .authority(Some(ctx.accounts.authority))
    .payer(ctx.accounts.payer)
    .plugin_type(PluginType::TransferDelegate)
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
    let approve_plugin_authority_ix = ApprovePluginAuthorityV1Builder::new()
        .asset(asset)
        // Asset이 Collection의 일부인 경우 Collection을 전달해야 함
        .collection(Some(collection))
        .authority(Some(authority.pubkey()))
        .payer(authority.pubkey())
        .plugin_type(PluginType::TransferDelegate)
        .new_authority(PluginAuthority::Address { address: new_authority.pubkey() })
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let approve_plugin_authority_tx = Transaction::new_signed_with_payer(
        &[approve_plugin_authority_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&approve_plugin_authority_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res);
}
```
{% /dialect %}
{% /dialect-switcher %}
### 위임자로서 Asset 전송
`transfer` 명령어는 Transfer delegate 권한을 사용하여 Asset을 다른 주소로 전송합니다.
{% dialect-switcher title="MPL Core Asset 전송" %}
{% dialect title="JavaScript" id="js" %}
```ts
import {
  fetchAsset,
  fetchCollection,
  transfer,
} from "@metaplex-foundation/mpl-core";
import { publicKey } from "@metaplex-foundation/umi";
// 전송할 Asset ID
const assetId = publicKey("11111111111111111111111111111111");
// Asset 가져오기
const assetItem = await fetchAsset(umi, assetId);
// Asset이 Collection의 일부인 경우 Collection 가져오기
const collectionItem =
    assetItem.updateAuthority.type == "Collection" &&
    assetItem.updateAuthority.address
      ? await fetchCollection(umi, assetItem.updateAuthority.address)
      : undefined;
// Core NFT Asset 전송
const { signature } = await transfer(umi, {
    asset: assetItem,
    newOwner: publicKey("22222222222222222222222222222222"),
    collection: collectionItem,
  })
  .sendAndConfirm(umi);
```
{% /dialect %}
{% dialect title="Rust CPI" id="rust-cpi" %}
```rust
TransferV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .new_owner(&ctx.accounts.new_owner.to_account_info())
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.delegate_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .invoke()?;
```
{% /dialect %}
{% /dialect-switcher %}
## Transfer Delegate 권한 업데이트
Transfer Delegate 플러그인은 업데이트할 플러그인 데이터가 없으므로 (빈 객체 `{}`), 주요 "업데이트" 작업은 플러그인 권한을 변경하는 것입니다. 이를 통해 다른 주소에 전송 권한을 위임할 수 있습니다.
### Transfer Delegate 권한 변경
`approvePluginAuthority` 함수를 사용하여 전송 권한이 있는 사람을 변경할 수 있습니다:
{% dialect-switcher title="Transfer Delegate 권한 업데이트" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('44444444444444444444444444444444')
    // Transfer delegate를 새 주소로 변경
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'TransferDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
### Transfer Delegate 권한 취소
`revokePluginAuthority` 함수를 사용하여 전송 권한을 취소하고 전송 제어를 자산 소유자에게 반환할 수 있습니다.
{% dialect-switcher title="Transfer Delegate 권한 취소" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'
const assetAddress = publicKey('11111111111111111111111111111111')
await revokePluginAuthority(umi, {
  asset: assetAddress,
  plugin: { type: 'TransferDelegate' },
}).sendAndConfirm(umi)
```
{% /dialect %}
{% /dialect-switcher %}
## 일반적인 오류
### `Authority mismatch`
Transfer delegate 권한만 Asset을 전송할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.
### `Asset is frozen`
동결된 Asset은 전송할 수 없습니다. 동결 권한이 먼저 Asset을 해동해야 합니다.
### `Transfer delegate not found`
Asset에 Transfer Delegate 플러그인이 없거나 이전 전송 후 권한이 이미 취소되었습니다.
## 참고 사항
- 소유자 관리: 추가하려면 소유자 서명 필요
- **전송 후 권한 자동 취소**
- 각 전송마다 새 소유자에 의한 재위임 필요
- 동결된 Asset은 위임자가 전송 불가
- 영구적 권한을 위해 Permanent Transfer Delegate 사용
## 빠른 참조
### 권한 라이프사이클
| 이벤트 | 권한 상태 |
|-------|------------------|
| 플러그인 추가 | 활성 |
| Asset 전송됨 | **취소됨** |
| 새 소유자가 플러그인 추가 | 활성 (새 위임자) |
### 누가 전송할 수 있나요?
| 권한 | 전송 가능? |
|-----------|---------------|
| Asset 소유자 | 예 (항상) |
| Transfer Delegate | 예 (한 번) |
| Permanent Transfer Delegate | 예 (항상) |
| 업데이트 권한 | 아니요 |
## FAQ
### 왜 전송 권한이 취소되었나요?
Transfer Delegate 권한은 모든 전송 후 자동으로 취소됩니다. 이는 마켓플레이스 안전을 위해 의도된 설계입니다 - 위임자는 한 번만 전송할 수 있습니다.
### 에스크로 없는 리스팅을 어떻게 구현하나요?
1. 판매자가 마켓플레이스를 권한으로 하여 Transfer Delegate 추가
2. 구매자가 지불하면 마켓플레이스가 Asset을 구매자에게 전송
3. 권한이 취소됨; 판매자는 이중 리스팅 불가
### Transfer Delegate와 Permanent Transfer Delegate의 차이점은 무엇인가요?
Transfer Delegate는 한 번 전송 후 취소됩니다. Permanent Transfer Delegate는 영구적으로 유지되며 Asset 생성 시에만 추가할 수 있습니다.
### 위임자로서 동결된 Asset을 전송할 수 있나요?
아니요. 동결된 Asset은 위임자 전송을 포함한 모든 전송을 차단합니다. 복잡한 에스크로 시나리오에는 Permanent Transfer Delegate와 Permanent Freeze Delegate를 함께 사용하세요.
### 소유자가 각 전송을 승인해야 하나요?
아니요. Transfer Delegate가 설정되면 위임자는 소유자 승인 없이 전송할 수 있습니다. 하지만 권한이 취소되기 전에 한 번만 가능합니다.
## 관련 플러그인
- [Permanent Transfer Delegate](/smart-contracts/core/plugins/permanent-transfer-delegate) - 취소 불가능한 전송 권한
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - 일시적으로 전송 차단
- [Burn Delegate](/smart-contracts/core/plugins/burn-delegate) - 위임자가 Asset 소각 허용
## 용어집
| 용어 | 정의 |
|------|------------|
| **Transfer Delegate** | 일회성 전송 권한을 허용하는 소유자 관리 플러그인 |
| **소유자 관리** | 추가하려면 소유자 서명이 필요한 플러그인 유형 |
| **에스크로 없음** | 보관 계정으로 전송하지 않고 판매 |
| **Permanent Transfer Delegate** | 생성 시 추가되는 취소 불가능한 버전 |
