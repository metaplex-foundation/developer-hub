---
title: Permanent Burn Delegate
metaTitle: Permanent Burn Delegate | Metaplex Core
description: 동결된 Asset도 파괴할 수 있는 영구적인 burn 권한을 부여합니다. 게임 메커니즘, 구독 만료, 자동화된 자산 수명 주기에 사용할 수 있습니다.
updated: '01-31-2026'
keywords:
  - permanent burn
  - irrevocable burn
  - subscription expiry
  - automated burn
about:
  - Permanent delegation
  - Asset lifecycle
  - Automated destruction
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Burn Delegate와 Permanent Burn Delegate의 차이점은 무엇인가요?
    a: 일반 Burn Delegate는 동결된 Asset을 burn할 수 없으며 전송 시 취소됩니다. Permanent Burn Delegate는 동결된 Asset도 burn 가능(forceApprove)하며 영구적으로 유지됩니다.
  - q: Permanent Burn Delegate가 동결된 Asset을 burn할 수 있나요?
    a: 네. Permanent plugin은 forceApprove를 사용하여 동결 거부를 무시합니다. 이는 아이템을 파괴 가능하게 해야 하는 게임 메커니즘에 유용합니다.
  - q: 기존 Asset에 이것을 추가할 수 있나요?
    a: 아니요. Permanent plugin은 Asset 생성 시에만 추가할 수 있습니다. 기존 Asset에는 일반 Burn Delegate를 사용하세요.
  - q: Collection 레벨의 Permanent Burn Delegate는 어떻게 작동하나요?
    a: delegate는 Collection 내의 개별 Asset을 burn할 수 있지만, 한 번에 모두 burn할 수는 없습니다. 각 burn은 별도의 트랜잭션입니다.
  - q: 이것은 사용하기에 안전한가요?
    a: 주의해서 사용하세요. delegate는 소유자 승인 없이 언제든지 Asset을 burn할 수 있습니다. 신뢰할 수 있는 프로그램이나 주소에만 할당하세요.
---
**Permanent Burn Delegate Plugin**은 영구적으로 유지되는 취소 불가능한 burn 권한을 제공합니다. delegate는 동결 상태에서도 Asset을 burn할 수 있어 게임과 구독 서비스에 이상적입니다. {% .lead %}
{% callout title="학습 내용" %}

- 영구 burn 기능이 있는 Asset 생성
- Collection 전체 burn 권한 활성화
- 동결된 Asset burn (`forceApprove` 동작)
- 사용 사례: 게임, 구독, 자동 정리
{% /callout %}

## 개요

**Permanent Burn Delegate**는 생성 시에만 추가할 수 있는 permanent plugin입니다. delegate는 Asset이 동결된 상태에서도 언제든지 Asset을 burn할 수 있습니다.

- Asset/Collection 생성 시에만 추가 가능
- 권한은 영구적으로 유지 (취소되지 않음)
- `forceApprove` 사용 - 동결 상태에서도 burn 가능
- Collection 레벨: Collection 내의 모든 Asset burn 가능

## 범위 외

일반 burn delegate ([Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) 참조), 조건부 burn, Token Metadata burn 권한.

## 빠른 시작

**바로가기:** [Asset 생성](#creating-an-asset-with-a-permanent-burn-plugin)

1. Asset/Collection 생성 시 `PermanentBurnDelegate` plugin 추가
2. authority를 프로그램 또는 delegate 주소로 설정
3. delegate는 동결 상태에서도 언제든지 Asset burn 가능
{% callout type="note" title="Permanent vs 일반 Burn Delegate" %}
| 기능 | Burn Delegate | Permanent Burn Delegate |
|---------|---------------|-------------------------|
| 생성 후 추가 | ✅ 가능 | ❌ 생성 시에만 |
| 전송 후 권한 유지 | ❌ 취소됨 | ✅ 영구 유지 |
| 동결된 Asset burn 가능 | ❌ 불가 | ✅ 가능 (forceApprove) |
| Collection에서 동작 | ❌ 불가 | ✅ 가능 |
| 긴급 파괴 | ❌ 제한적 | ✅ 최적의 선택 |
**[Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) 선택**: 사용자가 취소 가능한 burn 권한이 필요한 경우.
**Permanent Burn Delegate 선택**: 게임, 긴급 파괴, 자동 정리가 필요한 경우.
{% /callout %}

## 일반적인 사용 사례

- **게임 메커니즘**: 게임 내에서 아이템이 소비, 분실, 파괴될 때 Asset 파괴
- **구독 만료**: 동결 상태에서도 만료된 구독 토큰 자동 burn
- **긴급 파괴**: 상태에 관계없이 손상되거나 원치 않는 Asset 제거
- **제작 시스템**: 제작 시 재료 NFT burn (잠금 상태에서도 가능)
- **기간 한정 자산**: 만료된 콘텐츠 자동 파괴
- **규정 준수**: 소유자가 동결하려 해도 약관을 위반하는 Asset 제거

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 동작

- **Asset**: delegated 주소를 사용하여 Asset burn을 허용합니다.
- **Collection**: collection authority를 사용하여 Collection 내의 모든 Asset burn을 허용합니다. 한 번에 모두 burn하지 않습니다.

## 인수

Permanent Burn Plugin에는 전달할 인수가 없습니다.

## Permanent Burn Plugin이 있는 Asset 생성

{% dialect-switcher title="Permanent Freeze plugin이 있는 Asset 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')
await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentBurnDelegate',
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};
pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let payer = Keypair::new();
    let asset = Keypair::new();
    let create_asset_with_permanent_burn_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::None),
        }])
        .instruction();
    let signers = vec![&asset, &payer];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let create_asset_with_permanent_burn_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_burn_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_burn_delegate_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Cannot add permanent plugin after creation`

Permanent plugin은 Asset/Collection 생성 시에만 추가할 수 있습니다. 기존 Asset에는 Permanent Burn Delegate를 추가할 수 없습니다.

### `Authority mismatch`

plugin authority만 burn할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

## 참고 사항

- **생성 시에만**: Asset/Collection 존재 후에는 추가 불가
- **Force approve**: 동결 상태에서도 burn 가능
- **Collection 동작**: Collection 내의 모든 Asset을 개별적으로 burn 가능
- **영구적**: 권한은 취소되지 않음
- **비가역적**: burn된 Asset은 복구 불가

## FAQ

### Burn Delegate와 Permanent Burn Delegate의 차이점은 무엇인가요?

일반 Burn Delegate는 동결된 Asset을 burn할 수 없으며 전송 시 취소됩니다. Permanent Burn Delegate는 동결된 Asset도 burn 가능(forceApprove)하며 영구적으로 유지됩니다.

### Permanent Burn Delegate가 동결된 Asset을 burn할 수 있나요?

네. Permanent plugin은 `forceApprove`를 사용하여 동결 거부를 무시합니다. 이는 아이템을 파괴 가능하게 해야 하는 게임 메커니즘에 유용합니다.

### 기존 Asset에 이것을 추가할 수 있나요?

아니요. Permanent plugin은 Asset 생성 시에만 추가할 수 있습니다. 기존 Asset에는 일반 Burn Delegate를 사용하세요.

### Collection 레벨의 Permanent Burn Delegate는 어떻게 작동하나요?

delegate는 Collection 내의 개별 Asset을 burn할 수 있지만, 한 번에 모두 burn할 수는 없습니다. 각 burn은 별도의 트랜잭션입니다.

### 이것은 사용하기에 안전한가요?

주의해서 사용하세요. delegate는 소유자 승인 없이 언제든지 Asset을 burn할 수 있습니다. 신뢰할 수 있는 프로그램이나 주소에만 할당하세요.

## 관련 Plugin

- [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) - 취소 가능한 burn 권한
- [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) - 영구적인 freeze 권한
- [Permanent Transfer Delegate](/ko/smart-contracts/core/plugins/permanent-transfer-delegate) - 영구적인 transfer 권한

## 용어집

| 용어 | 정의 |
|------|------------|
| **Permanent Plugin** | 생성 시에만 추가할 수 있고 영구적으로 유지되는 Plugin |
| **forceApprove** | 다른 plugin의 거부를 무시하는 검증 |
| **Collection Burn** | Collection 내의 모든 Asset을 burn하는 기능 |
