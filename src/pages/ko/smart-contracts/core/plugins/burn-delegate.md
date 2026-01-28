---
title: Burn Delegate
metaTitle: Burn Delegate Plugin | Metaplex Core
description: 위임자가 Core NFT Asset을 소각할 수 있도록 허용합니다. 게임 메커니즘, 구독 만료, 자동화된 자산 파괴에 Burn Delegate 플러그인을 사용하세요.
---

**Burn Delegate Plugin**은 지정된 권한이 소유자를 대신하여 Core Asset을 소각할 수 있도록 합니다. 게임 메커니즘, 구독 서비스, 자동화된 자산 수명 주기 관리에 유용합니다. {% .lead %}

{% callout title="학습 내용" %}

- Asset에 Burn Delegate 플러그인 추가
- 다른 주소에 소각 권한 위임
- 소각 권한 철회
- 사용 사례: 게임, 구독, 자동화된 소각

{% /callout %}

## 요약

**Burn Delegate**는 위임자가 Asset을 소각할 수 있게 하는 Owner Managed 플러그인입니다. 추가되면 위임자는 소유자 승인 없이 언제든지 Asset을 소각할 수 있습니다.

- 프로그램이나 지갑에 소각 권한 위임
- Asset 전송 시 권한 철회
- 철회 불가능한 소각 권한을 위해서는 [Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate) 사용
- 추가 인수 불필요

## 범위 외

Collection 소각 (다른 프로세스), 영구 소각 권한 (Permanent Burn Delegate 참조), Token Metadata 소각 권한 (다른 시스템).

## 빠른 시작

**바로가기:** [플러그인 추가](#asset에-burn-플러그인-추가하기) · [권한 위임](#소각-권한-위임) · [철회](#소각-권한-철회)

1. Burn Delegate 플러그인 추가: `addPlugin(umi, { asset, plugin: { type: 'BurnDelegate' } })`
2. 선택적으로 다른 주소에 위임
3. 이제 위임자가 언제든지 Asset을 소각할 수 있음

{% callout type="note" title="Burn vs Permanent Burn Delegate 사용 시기" %}

| 사용 사례 | Burn Delegate | Permanent Burn Delegate |
|----------|---------------|-------------------------|
| 게임 아이템 파괴 | ✅ 최적 선택 | ✅ 사용 가능 |
| 구독 만료 | ✅ 최적 선택 | ❌ 너무 영구적 |
| 동결된 Asset 소각 | ❌ 불가능 | ✅ 강제 소각 가능 |
| 전송 시 권한 유지 | ❌ 철회됨 | ✅ 유지됨 |
| 긴급 소각 기능 | ❌ 제한적 | ✅ 최적 선택 |

소유권 변경 시 소각 권한이 재설정되어야 할 때 **Burn Delegate를 선택**하세요.
권한이 영구적으로 유지되어야 할 때 **[Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate)를 선택**하세요.

{% /callout %}

## 일반적인 사용 사례

- **게임 메커니즘**: 아이템이 게임 내에서 소비, 파괴 또는 분실될 때 NFT 소각
- **구독 서비스**: 만료된 구독 토큰 자동 소각
- **크래프팅 시스템**: 새 아이템 제작 시 재료 NFT 소각
- **업적 교환**: 보상으로 교환 시 업적 토큰 소각
- **이벤트 티켓**: 이벤트 체크인 후 티켓 소각
- **기간 한정 자산**: 만료 기간 후 자산 소각

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ❌  |

## 인수

Burn Plugin은 전달할 인수를 포함하지 않습니다.

## Asset에 Burn 플러그인 추가하기

{% dialect-switcher title="MPL Core Asset에 Burn 플러그인 추가하기" %}
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

## 소각 권한 철회

`revokePluginAuthority` 함수를 사용하여 소각 권한을 철회하고 자산 소유자에게 제어권을 반환할 수 있습니다.

{% dialect-switcher title="소각 권한 철회" %}
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

소각 위임 권한만 Asset을 소각할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

### `Asset is frozen`

동결된 Asset은 소각할 수 없습니다. 동결 권한이 먼저 Asset을 해제해야 합니다.

## 참고 사항

- Owner Managed: 추가하려면 소유자 서명 필요
- Asset 전송 시 권한이 자동으로 철회됨
- 동결된 Asset은 소각 불가
- 전송 후에도 권한이 유지되어야 하면 Permanent Burn Delegate 사용
- 소각은 즉시 실행되며 되돌릴 수 없음

## 빠른 참조

### 누가 소각할 수 있나요?

| 권한 | 소각 가능? |
|------|----------|
| Asset 소유자 | 예 (항상) |
| Burn Delegate | 예 |
| Permanent Burn Delegate | 예 (강제 승인) |
| Update Authority | 아니오 |

## FAQ

### Burn Delegate와 Permanent Burn Delegate의 차이점은 무엇인가요?

Burn Delegate 권한은 전송 시 철회됩니다. Permanent Burn Delegate 권한은 영구적으로 유지되며 `forceApprove`를 사용하므로 Asset이 동결되어 있어도 소각할 수 있습니다.

### Burn Delegate가 있어도 소유자가 소각할 수 있나요?

예. 소유자는 위임자와 관계없이 항상 자신의 Asset을 소각할 수 있습니다.

### Burn Delegate가 동결된 Asset에서 작동하나요?

아니요. 일반 Burn Delegate는 동결된 Asset을 소각할 수 없습니다. 동결된 Asset을 소각해야 한다면 Permanent Burn Delegate를 사용하세요.

### Burn Delegate는 언제 철회되나요?

Asset이 새 소유자에게 전송될 때입니다. 새 소유자는 새 Burn Delegate를 추가해야 합니다.

## 관련 플러그인

- [Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate) - forceApprove가 있는 철회 불가능한 소각 권한
- [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) - 일시적으로 전송과 소각 차단
- [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) - 위임자가 Asset 전송 허용

## 용어 정리

| 용어 | 정의 |
|------|------|
| **Burn Delegate** | 위임자가 Asset을 소각할 수 있게 하는 Owner Managed 플러그인 |
| **Owner Managed** | 추가하려면 소유자 서명이 필요한 플러그인 유형 |
| **Revoke** | 위임자의 소각 권한 제거 |
| **Permanent Burn Delegate** | 전송 후에도 유지되는 철회 불가능한 버전 |
| **forceApprove** | 동결 제한을 무시하는 영구 플러그인 기능 |

---

*Metaplex Foundation 관리 · 2026년 1월 최종 검증 · @metaplex-foundation/mpl-core에 적용*
