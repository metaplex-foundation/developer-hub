---
title: Permanent Transfer Delegate
metaTitle: Permanent Transfer Delegate | Metaplex Core
description: 소유권 변경 후에도 유지되는 영구 전송 권한을 부여합니다. 게임 메커니즘, 구독 서비스, 자동화된 자산 관리에 사용하세요.
---

**Permanent Transfer Delegate Plugin**은 영구적으로 유지되는 철회 불가능한 전송 권한을 제공합니다. 일반 Transfer Delegate와 달리, 이 권한은 절대 철회되지 않으며 Asset을 반복적으로 전송할 수 있습니다. {% .lead %}

{% callout title="학습 내용" %}

- 영구 전송 기능이 있는 Asset 생성
- Collection 전체 전송 권한 활성화
- 사용 사례: 게임, 구독, 자동화된 시스템
- 영구 vs 일반 transfer delegate 이해

{% /callout %}

## 요약

**Permanent Transfer Delegate**는 생성 시에만 추가할 수 있는 영구 플러그인입니다. 위임자는 소유자 승인 없이 Asset을 무제한으로 전송할 수 있습니다.

- Asset/Collection 생성 시에만 추가 가능
- 권한은 영구적으로 유지됨 (절대 철회되지 않음)
- `forceApprove` 사용 - 동결되어 있어도 전송 가능
- Collection 수준: Collection의 모든 Asset 전송 허용

## 범위 외

일반 transfer delegate ([Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) 참조), 에스크로 없는 리스팅 (일반 delegate 사용), Token Metadata 전송 권한.

## 빠른 시작

**바로가기:** [Asset 생성](#permanent-transfer-plugin과-함께-mpl-core-asset-생성)

1. Asset/Collection 생성 시 `PermanentTransferDelegate` 플러그인 추가
2. 프로그램이나 위임자 주소로 권한 설정
3. 위임자는 언제든지 무제한으로 Asset 전송 가능

{% callout type="note" title="Permanent vs Regular Transfer Delegate" %}

| 기능 | Transfer Delegate | Permanent Transfer Delegate |
|------|-------------------|----------------------------|
| 생성 후 추가 | ✅ 예 | ❌ 생성 시에만 |
| 전송 시 권한 유지 | ❌ 1회 전송 후 철회 | ✅ 영구 유지 |
| 다중 전송 | ❌ 일회용 | ✅ 무제한 |
| 동결된 Asset 전송 가능 | ❌ 아니오 | ✅ 예 (forceApprove) |
| Collection과 함께 작동 | ❌ 아니오 | ✅ 예 |

일회성 에스크로 없는 판매를 위해서는 **[Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate)를 선택**하세요.
반복 전송이 필요한 게임, 렌탈 또는 자동화된 시스템을 위해서는 **Permanent Transfer Delegate를 선택**하세요.

{% /callout %}

## 일반적인 사용 사례

- **게임 메커니즘**: 게임 이벤트 발생 시 Asset 전송 (전투 패배, 거래)
- **렌탈 반환**: 대여된 NFT를 소유자에게 자동 반환
- **구독 관리**: 구독 종료 또는 갱신 시 토큰 전송
- **DAO 재무 관리**: DAO가 Asset 배포 관리 가능
- **자동화된 시스템**: 전송별 승인 없이 Asset을 이동해야 하는 프로그램

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 동작
- **Asset**: 위임된 주소를 사용하여 Asset을 전송할 수 있습니다.
- **Collection**: 컬렉션 권한을 사용하여 컬렉션의 모든 Asset을 전송할 수 있습니다. 한 번에 모두 전송하지는 않습니다.

## 인수

| 인수    | 값 |
| ------ | ----- |
| frozen | bool  |

## Permanent Transfer Plugin과 함께 MPL Core Asset 생성

{% dialect-switcher title="Permanent Transfer Plugin과 함께 MPL Core Asset 생성" %}
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
      type: 'PermanentTransferDelegate',
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
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Cannot add permanent plugin after creation`

영구 플러그인은 Asset/Collection 생성 시에만 추가할 수 있습니다. 기존 Asset에 Permanent Transfer Delegate를 추가할 수 없습니다.

### `Authority mismatch`

플러그인 권한만 전송할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

## 참고 사항

- **생성 시에만**: Asset/Collection 존재 후에는 추가 불가
- **강제 승인**: 동결되어 있어도 전송 가능
- **Collection 동작**: Collection의 모든 Asset을 개별적으로 전송 가능
- **영구 유지**: 권한 절대 철회되지 않음
- **무제한 전송**: 위임자가 전송할 수 있는 횟수에 제한 없음

## FAQ

### Transfer Delegate와 Permanent Transfer Delegate의 차이점은 무엇인가요?

일반 Transfer Delegate는 한 번의 전송 후 철회됩니다. Permanent Transfer Delegate는 영구적으로 유지되며 무제한 전송할 수 있습니다.

### Permanent Transfer Delegate가 동결된 Asset을 전송할 수 있나요?

예. 영구 플러그인은 동결 거부를 무시하는 `forceApprove`를 사용합니다.

### 기존 Asset에 추가할 수 있나요?

아니요. 영구 플러그인은 Asset 생성 시에만 추가할 수 있습니다. 기존 Asset에는 일반 Transfer Delegate를 사용하세요.

### Collection 수준 Permanent Transfer Delegate는 어떻게 작동하나요?

위임자는 Collection의 개별 Asset을 전송할 수 있지만, 한 번에 모두 전송하지는 않습니다. 각 전송은 별도의 트랜잭션입니다.

## 관련 플러그인

- [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) - 일회성 전송 권한
- [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) - 영구 동결 권한
- [Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate) - 영구 소각 권한

## 용어 정리

| 용어 | 정의 |
|------|------|
| **Permanent Plugin** | 생성 시에만 추가할 수 있고 영구적으로 유지되는 플러그인 |
| **forceApprove** | 다른 플러그인 거부를 무시하는 검증 |
| **Collection Transfer** | Collection의 모든 Asset을 전송할 수 있는 기능 |

---

*Metaplex Foundation 관리 · 2026년 1월 최종 검증 · @metaplex-foundation/mpl-core에 적용*
