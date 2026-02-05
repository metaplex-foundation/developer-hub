---
title: Burn Delegate
metaTitle: Burn Delegate 플러그인 | Metaplex Core
description: 위임자가 Core NFT Asset을 소각할 수 있도록 합니다. 게임 메커니즘, 구독 만료 및 자동화된 자산 파기에 Burn Delegate 플러그인을 사용하세요.
updated: '01-31-2026'
keywords:
  - burn delegate
  - delegate burn
  - automated burn
  - NFT lifecycle
about:
  - Burn delegation
  - Game mechanics
  - Asset lifecycle
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Burn Delegate와 Permanent Burn Delegate의 차이점은 무엇인가요?
    a: Burn Delegate 권한은 전송 시 취소됩니다. Permanent Burn Delegate 권한은 영구적으로 유지되며 forceApprove를 사용하므로 Asset이 동결되어 있어도 소각할 수 있습니다.
  - q: Burn Delegate가 있어도 소유자가 소각할 수 있나요?
    a: 네. 소유자는 위임자와 관계없이 항상 자신의 Asset을 소각할 수 있습니다.
  - q: Burn Delegate가 동결된 Asset에 작동하나요?
    a: 아니요. 일반 Burn Delegate는 동결된 Asset을 소각할 수 없습니다. 동결된 Asset을 소각해야 하는 경우 Permanent Burn Delegate를 사용하세요.
  - q: Burn Delegate는 언제 취소되나요?
    a: Asset이 새 소유자에게 전송될 때. 새 소유자는 새로운 Burn Delegate를 추가해야 합니다.
---
**Burn Delegate 플러그인**은 지정된 권한자가 소유자를 대신하여 Core Asset을 소각할 수 있게 합니다. 게임 메커니즘, 구독 서비스 및 자동화된 자산 수명 주기 관리에 유용합니다. {% .lead %}
{% callout title="학습 내용" %}
- Asset에 Burn Delegate 플러그인 추가
- 소각 권한을 다른 주소에 위임
- 소각 권한 취소
- 사용 사례: 게임, 구독, 자동화 소각
{% /callout %}
## 요약
**Burn Delegate**는 위임자가 Asset을 소각할 수 있게 하는 소유자 관리 플러그인입니다. 추가되면 위임자는 소유자 승인 없이 언제든지 Asset을 소각할 수 있습니다.
- 프로그램이나 지갑에 소각 권한 위임
- Asset 전송 시 권한 취소됨
- 취소 불가능한 소각 권한은 [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) 사용
- 추가 인자 필요 없음
## 범위 외
Collection 소각 (다른 프로세스), 영구 소각 권한 (Permanent Burn Delegate 참조), Token Metadata 소각 권한 (다른 시스템).
## 빠른 시작
**바로 가기:** [플러그인 추가](#asset에-burn-플러그인-추가) · [권한 위임](#소각-권한-위임) · [취소](#소각-권한-취소)
1. Burn Delegate 플러그인 추가: `addPlugin(umi, { asset, plugin: { type: 'BurnDelegate' } })`
2. 선택적으로 다른 주소에 위임
3. 위임자가 이제 언제든지 Asset을 소각할 수 있음
{% callout type="note" title="Burn vs Permanent Burn Delegate 사용 시기" %}
| 사용 사례 | Burn Delegate | Permanent Burn Delegate |
|----------|---------------|-------------------------|
| 게임 아이템 파기 | ✅ 최선의 선택 | ✅ 사용 가능 |
| 구독 만료 | ✅ 최선의 선택 | ❌ 너무 영구적 |
| 동결된 Asset 소각 | ❌ 소각 불가 | ✅ 강제 소각 가능 |
| 전송 시 권한 유지 | ❌ 취소됨 | ✅ 유지됨 |
| 긴급 소각 기능 | ❌ 제한적 | ✅ 최선의 선택 |
**Burn Delegate 선택** 소유권 변경 시 소각 권한이 재설정되어야 할 때.
**[Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) 선택** 권한이 영원히 유지되어야 할 때.
{% /callout %}
## 일반적인 사용 사례
- **게임 메커니즘**: 아이템이 소비, 파괴 또는 게임 내에서 분실될 때 NFT 소각
- **구독 서비스**: 만료된 구독 토큰 자동 소각
- **제작 시스템**: 새 아이템을 제작할 때 재료 NFT 소각
- **업적 교환**: 보상으로 교환 시 업적 토큰 소각
- **이벤트 티켓**: 이벤트 체크인 후 티켓 소각
- **한정 시간 자산**: 만료 기간 후 자산 소각
## 호환 대상
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |
## 인자
Burn 플러그인은 전달할 인자가 없습니다.
## Asset에 Burn 플러그인 추가
{% dialect-switcher title="MPL Core Asset에 Burn 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin } from '@metaplex-foundation/mpl-core'
(async () => {
    const asset = publicKey('11111111111111111111111111111111')
    await addPlugin(umi, {
    asset: asset,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```ts
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{BurnDelegate, Plugin},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_burn_delegate_plugin_ix = AddPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .plugin(Plugin::BurnDelegate(BurnDelegate {}))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_burn_delegate_plugin_ix_tx = Transaction::new_signed_with_payer(
        &[add_burn_delegate_plugin_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_burn_delegate_plugin_ix_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```
{% /dialect %}
{% /dialect-switcher %}
## 소각 권한 위임
Burn Delegate 플러그인 권한은 `approvePluginAuthority` 함수를 사용하여 다른 주소에 위임할 수 있습니다. 이를 통해 누가 Asset을 소각할 수 있는지 변경할 수 있습니다.
{% dialect-switcher title="소각 권한 위임" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { approvePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    const newDelegate = publicKey('22222222222222222222222222222222')
    await approvePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    newAuthority: { type: 'Address', address: newDelegate },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## 소각 권한 취소
소각 권한은 `revokePluginAuthority` 함수를 사용하여 취소할 수 있으며, 이는 자산 소유자에게 제어권을 반환합니다.
{% dialect-switcher title="소각 권한 취소" %}
{% dialect title="JavaScript" id="js" %}
```ts
import { publicKey } from '@metaplex-foundation/umi'
import { revokePluginAuthority } from '@metaplex-foundation/mpl-core'
(async () => {
    const assetAddress = publicKey('11111111111111111111111111111111')
    await revokePluginAuthority(umi, {
    asset: assetAddress,
    plugin: { type: 'BurnDelegate' },
    }).sendAndConfirm(umi)
})();
```
{% /dialect %}
{% /dialect-switcher %}
## 일반적인 오류
### `Authority mismatch`
소각 위임 권한자만 Asset을 소각할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.
### `Asset is frozen`
동결된 Asset은 소각할 수 없습니다. 동결 권한자가 먼저 Asset을 해동해야 합니다.
## 참고 사항
- 소유자 관리: 추가하려면 소유자 서명 필요
- Asset 전송 시 권한이 자동으로 취소됨
- 동결된 Asset은 소각 불가
- 전송 후에도 권한이 유지되어야 하면 Permanent Burn Delegate 사용
- 소각은 즉시 적용되며 되돌릴 수 없음
## 빠른 참조
### 누가 소각할 수 있나요?
| 권한자 | 소각 가능? |
|-----------|-----------|
| Asset 소유자 | 예 (항상) |
| Burn Delegate | 예 |
| Permanent Burn Delegate | 예 (force approve) |
| 업데이트 권한자 | 아니요 |
## FAQ
### Burn Delegate와 Permanent Burn Delegate의 차이점은 무엇인가요?
Burn Delegate 권한은 전송 시 취소됩니다. Permanent Burn Delegate 권한은 영구적으로 유지되며 `forceApprove`를 사용하므로 Asset이 동결되어 있어도 소각할 수 있습니다.
### Burn Delegate가 있어도 소유자가 소각할 수 있나요?
네. 소유자는 위임자와 관계없이 항상 자신의 Asset을 소각할 수 있습니다.
### Burn Delegate가 동결된 Asset에 작동하나요?
아니요. 일반 Burn Delegate는 동결된 Asset을 소각할 수 없습니다. 동결된 Asset을 소각해야 하는 경우 Permanent Burn Delegate를 사용하세요.
### Burn Delegate는 언제 취소되나요?
Asset이 새 소유자에게 전송될 때. 새 소유자는 새로운 Burn Delegate를 추가해야 합니다.
## 관련 플러그인
- [Permanent Burn Delegate](/smart-contracts/core/plugins/permanent-burn-delegate) - forceApprove가 있는 취소 불가능한 소각 권한
- [Freeze Delegate](/smart-contracts/core/plugins/freeze-delegate) - 일시적으로 전송과 소각 차단
- [Transfer Delegate](/smart-contracts/core/plugins/transfer-delegate) - 위임자가 Asset을 전송할 수 있도록 허용
## 용어집
| 용어 | 정의 |
|------|------------|
| **Burn Delegate** | 위임자가 Asset을 소각할 수 있게 하는 소유자 관리 플러그인 |
| **소유자 관리** | 추가하려면 소유자 서명이 필요한 플러그인 유형 |
| **취소** | 위임자의 소각 권한 제거 |
| **Permanent Burn Delegate** | 전송 후에도 유지되는 취소 불가능한 버전 |
| **forceApprove** | 동결 제한을 무시하는 영구 플러그인 기능 |
