---
title: Permanent Burn Delegate
metaTitle: Permanent Burn Delegate | Metaplex Core
description: 동결된 상태에서도 Asset을 파괴할 수 있는 영구 소각 권한을 부여합니다. 게임 메커니즘, 구독 만료, 자동화된 자산 수명 주기에 사용하세요.
---

**Permanent Burn Delegate Plugin**은 영구적으로 유지되는 철회 불가능한 소각 권한을 제공합니다. 위임자는 Asset이 동결되어 있어도 소각할 수 있어 게임과 구독 서비스에 이상적입니다. {% .lead %}

{% callout title="학습 내용" %}

- 영구 소각 기능이 있는 Asset 생성
- Collection 전체 소각 권한 활성화
- 동결된 Asset 소각 (forceApprove 동작)
- 사용 사례: 게임, 구독, 자동화된 정리

{% /callout %}

## 요약

**Permanent Burn Delegate**는 생성 시에만 추가할 수 있는 영구 플러그인입니다. 위임자는 Asset이 동결되어 있어도 언제든지 소각할 수 있습니다.

- Asset/Collection 생성 시에만 추가 가능
- 권한은 영구적으로 유지됨 (절대 철회되지 않음)
- `forceApprove` 사용 - 동결되어 있어도 소각 가능
- Collection 수준: Collection의 모든 Asset 소각 허용

## 범위 외

일반 burn delegate ([Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) 참조), 조건부 소각, Token Metadata 소각 권한.

## 빠른 시작

**바로가기:** [Asset 생성](#permanent-burn-plugin과-함께-asset-생성)

1. Asset/Collection 생성 시 `PermanentBurnDelegate` 플러그인 추가
2. 프로그램이나 위임자 주소로 권한 설정
3. 위임자는 동결되어 있어도 언제든지 Asset 소각 가능

{% callout type="note" title="Permanent vs Regular Burn Delegate" %}

| 기능 | Burn Delegate | Permanent Burn Delegate |
|------|---------------|-------------------------|
| 생성 후 추가 | ✅ 예 | ❌ 생성 시에만 |
| 전송 시 권한 유지 | ❌ 철회됨 | ✅ 영구 유지 |
| 동결된 Asset 소각 가능 | ❌ 아니오 | ✅ 예 (forceApprove) |
| Collection과 함께 작동 | ❌ 아니오 | ✅ 예 |
| 긴급 파괴 | ❌ 제한적 | ✅ 최적 선택 |

사용자가 철회할 수 있는 소각 권한을 위해서는 **[Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate)를 선택**하세요.
게임, 긴급 파괴 또는 자동화된 정리를 위해서는 **Permanent Burn Delegate를 선택**하세요.

{% /callout %}

## 일반적인 사용 사례

- **게임 메커니즘**: 아이템이 게임 내에서 소비, 분실 또는 파괴될 때 Asset 파괴
- **구독 만료**: 동결되어 있어도 만료된 구독 토큰 자동 소각
- **긴급 파괴**: 상태와 관계없이 손상되거나 원치 않는 Asset 제거
- **크래프팅 시스템**: 제작 시 (잠겨 있어도) 재료 NFT 소각
- **기간 한정 자산**: 만료된 콘텐츠 자동 파괴
- **규정 준수**: 소유자가 동결하려 해도 이용약관 위반 Asset 제거

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 동작
- **Asset**: 위임된 주소를 사용하여 Asset을 소각할 수 있습니다.
- **Collection**: 컬렉션 권한을 사용하여 컬렉션의 모든 Asset을 소각할 수 있습니다. 한 번에 모두 소각하지는 않습니다.

## 인수

Permanent Burn Plugin은 전달할 인수를 포함하지 않습니다.

## Permanent Burn Plugin과 함께 Asset 생성

{% dialect-switcher title="Permanent Burn 플러그인과 함께 Asset 생성" %}
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

영구 플러그인은 Asset/Collection 생성 시에만 추가할 수 있습니다. 기존 Asset에 Permanent Burn Delegate를 추가할 수 없습니다.

### `Authority mismatch`

플러그인 권한만 소각할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

## 참고 사항

- **생성 시에만**: Asset/Collection 존재 후에는 추가 불가
- **강제 승인**: 동결되어 있어도 소각 가능
- **Collection 동작**: Collection의 모든 Asset을 개별적으로 소각 가능
- **영구 유지**: 권한 절대 철회되지 않음
- **되돌릴 수 없음**: 소각된 Asset은 복구 불가

## FAQ

### Burn Delegate와 Permanent Burn Delegate의 차이점은 무엇인가요?

일반 Burn Delegate는 동결된 Asset을 소각할 수 없고 전송 시 철회됩니다. Permanent Burn Delegate는 동결된 Asset을 소각할 수 있고 (forceApprove) 영구적으로 유지됩니다.

### Permanent Burn Delegate가 동결된 Asset을 소각할 수 있나요?

예. 영구 플러그인은 동결 거부를 무시하는 `forceApprove`를 사용합니다. 이는 아이템을 파괴할 수 있어야 하는 게임 메커니즘에 유용합니다.

### 기존 Asset에 추가할 수 있나요?

아니요. 영구 플러그인은 Asset 생성 시에만 추가할 수 있습니다. 기존 Asset에는 일반 Burn Delegate를 사용하세요.

### Collection 수준 Permanent Burn Delegate는 어떻게 작동하나요?

위임자는 Collection의 개별 Asset을 소각할 수 있지만, 한 번에 모두 소각하지는 않습니다. 각 소각은 별도의 트랜잭션입니다.

### 사용해도 안전한가요?

주의해서 사용하세요. 위임자는 소유자 승인 없이 언제든지 Asset을 소각할 수 있습니다. 신뢰할 수 있는 프로그램이나 주소에만 할당하세요.

## 관련 플러그인

- [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) - 철회 가능한 소각 권한
- [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) - 영구 동결 권한
- [Permanent Transfer Delegate](/ko/smart-contracts/core/plugins/permanent-transfer-delegate) - 영구 전송 권한

## 용어 정리

| 용어 | 정의 |
|------|------|
| **Permanent Plugin** | 생성 시에만 추가할 수 있고 영구적으로 유지되는 플러그인 |
| **forceApprove** | 다른 플러그인 거부를 무시하는 검증 |
| **Collection Burn** | Collection의 모든 Asset을 소각할 수 있는 기능 |

---

*Metaplex Foundation 관리 · 2026년 1월 최종 검증 · @metaplex-foundation/mpl-core에 적용*
