---
title: Permanent Freeze Delegate
metaTitle: Permanent Freeze Delegate | Metaplex Core
description: Permanent Freeze Delegate 플러그인으로 소울바운드 NFT를 생성하고 전체 Collection을 동결하세요. 영구적으로 유지되는 철회 불가능한 동결 권한입니다.
---

**Permanent Freeze Delegate Plugin**은 전송 후에도 유지되는 철회 불가능한 동결 권한을 제공합니다. 소울바운드 토큰, Collection 전체 동결, 영구 잠금 메커니즘에 사용하세요. {% .lead %}

{% callout title="학습 내용" %}

- 영구 동결 기능이 있는 Asset 생성
- 전체 Collection을 한 번에 동결
- 소울바운드 (전송 불가) 토큰 구현
- 영구 vs 일반 freeze delegate 이해

{% /callout %}

## 요약

**Permanent Freeze Delegate**는 생성 시에만 추가할 수 있는 영구 플러그인입니다. 일반 Freeze Delegate와 달리, 이 권한은 영구적으로 유지되며 전송 후에도 동결/해제할 수 있습니다.

- Asset/Collection 생성 시에만 추가 가능
- 권한은 전송 후에도 유지됨 (절대 철회되지 않음)
- `forceApprove` 사용 - 다른 차단 플러그인이 있어도 동결 가능
- Collection 수준 동결은 Collection의 모든 Asset에 영향

## 범위 외

일반 freeze delegate ([Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) 참조), 임시 동결, Token Metadata 동결 권한.

## 빠른 시작

**바로가기:** [Asset 생성](#permanent-freeze-플러그인과-함께-asset-생성) · [Collection 생성](#permanent-freeze-플러그인과-함께-collection-생성) · [업데이트 (해제)](#asset에서-permanent-freeze-delegate-플러그인-업데이트)

1. Asset/Collection 생성 시 `PermanentFreezeDelegate` 플러그인 추가
2. 즉시 동결을 위해 `frozen: true` 설정, 나중에 동결하려면 `false`
3. 위임자는 전송 후에도 언제든지 동결/해제 가능

{% callout type="note" title="Permanent vs Regular Freeze Delegate" %}

| 기능 | Freeze Delegate | Permanent Freeze Delegate |
|------|-----------------|---------------------------|
| 생성 후 추가 | ✅ 예 | ❌ 생성 시에만 |
| 전송 시 권한 유지 | ❌ 철회됨 | ✅ 유지됨 |
| Collection과 함께 작동 | ❌ 아니오 | ✅ 예 |
| forceApprove | ❌ 아니오 | ✅ 예 |
| 소울바운드 토큰 | ❌ 제한적 | ✅ 최적 선택 |

임시적이고 철회 가능한 동결을 위해서는 **[Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate)를 선택**하세요.
영구 권한이나 Collection 전체 동결을 위해서는 **Permanent Freeze Delegate를 선택**하세요.

{% /callout %}

## 일반적인 사용 사례

- **소울바운드 토큰**: 전송 불가능한 자격증, 업적 또는 멤버십 생성
- **Collection 전체 동결**: 하나의 플러그인으로 Collection의 모든 Asset 동결
- **영구 담보**: 소유권 변경에도 유지되는 담보 Asset 잠금
- **게임 아이템 영구성**: 거래와 관계없이 잠금 상태가 유지되는 아이템
- **규정 준수 요구사항**: 규제상 동결 상태를 유지해야 하는 Asset

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 동작
- **Asset**: 위임된 주소가 언제든지 NFT를 동결하고 해제할 수 있습니다.
- **Collection**: 컬렉션 권한이 전체 컬렉션을 한 번에 동결하고 해제할 수 있습니다. 이 위임자를 사용하여 컬렉션의 단일 에셋을 동결할 수는 **없습니다**.

## 인수

| 인수    | 값 |
| ------ | ----- |
| frozen | bool  |

## Permanent Freeze 플러그인과 함께 Asset 생성
다음 예시는 Permanent Freeze 플러그인과 함께 Asset을 생성하는 방법을 보여줍니다.

{% dialect-switcher title="Permanent Freeze 플러그인과 함께 Asset 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi)
const delegate = publicKey('33333333333333333333333333333')

await create(umi, {
  asset: assetSigner,
  name: 'My NFT',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      type: 'PermanentFreezeDelegate',
      frozen: true,
      authority: { type: 'Address', address: delegate },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use std::str::FromStr;
use mpl_core::{
    instructions::CreateV1Builder,
    types::{PermanentFreezeDelegate, Plugin, PluginAuthority, PluginAuthorityPair},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};

pub async fn create_asset_with_permanent_freeze_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let delegate = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }),
            authority: Some(PluginAuthority::Address { address: delegate }),
        }])
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_permanent_freeze_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_permanent_freeze_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_permanent_freeze_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## Asset에서 Permanent Freeze Delegate 플러그인 업데이트
다음 예시는 Asset에서 Permanent Freeze Delegate 플러그인을 업데이트하는 방법을 보여줍니다. `frozen` 인수를 각각 `true` 또는 `false`로 설정하여 동결하거나 해제합니다. 서명하는 지갑이 플러그인 권한이라고 가정합니다.

{% dialect-switcher title="Asset에서 Permanent Freeze Delegate 플러그인 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin } from '@metaplex-foundation/mpl-core'

const updateAssetResponse = await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: "PermanentFreezeDelegate",
    frozen: false,
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}



## Permanent Freeze 플러그인과 함께 Collection 생성
다음 예시는 Permanent Freeze 플러그인과 함께 컬렉션을 생성하는 방법을 보여줍니다.

{% dialect-switcher title="Permanent Freeze 플러그인과 함께 Collection 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createCollection } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: "Frozen Collection",
  uri: "https://example.com/my-collection.json",
  plugins: [
      {
        type: 'PermanentFreezeDelegate',
        frozen: true,
        authority: { type: "UpdateAuthority"}, // 업데이트 권한이 동결을 해제할 수 있습니다
      },
    ],
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Permanent Freeze 플러그인과 함께 Collection 업데이트
다음 예시는 Collection에서 Permanent Freeze Delegate 플러그인을 업데이트하는 방법을 보여줍니다. `frozen` 인수를 각각 `true` 또는 `false`로 설정하여 동결하거나 해제합니다. 서명하는 지갑이 플러그인 권한이라고 가정합니다.

{% dialect-switcher title="Permanent Freeze 플러그인과 함께 Collection 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updateCollectionPlugin } from '@metaplex-foundation/mpl-core'

const updateCollectionResponse =  await updateCollectionPlugin(umi, {
  collection: collectionSigner.publicKey,
  plugin: {
      type: "PermanentFreezeDelegate",
      frozen: false,
    },
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Cannot add permanent plugin after creation`

영구 플러그인은 Asset/Collection 생성 시에만 추가할 수 있습니다. 기존 Asset에 Permanent Freeze Delegate를 추가할 수 없습니다.

### `Authority mismatch`

플러그인 권한만 동결/해제할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

## 참고 사항

- **생성 시에만**: Asset/Collection 존재 후에는 추가 불가
- **강제 승인**: 충돌하는 플러그인이 있어도 동결 가능
- **Collection 동작**: 개별이 아닌 모든 Asset을 한 번에 동결
- **영구 유지**: 전송 후에도 권한 절대 철회되지 않음
- 소울바운드 토큰의 경우 `frozen: true`와 권한 `None`으로 설정

## FAQ

### 소울바운드 (전송 불가) 토큰을 어떻게 생성하나요?

`PermanentFreezeDelegate`로 Asset을 생성하고, `frozen: true`로 설정하고, 권한을 `None`으로 설정합니다. Asset은 절대 해제되거나 전송될 수 없습니다.

### Freeze Delegate와 Permanent Freeze Delegate의 차이점은 무엇인가요?

일반 Freeze Delegate 권한은 전송 시 철회되며 Asset에서만 작동합니다. Permanent Freeze Delegate는 영구적으로 유지되고, Collection에서 작동하며, `forceApprove`를 사용합니다.

### Collection의 개별 Asset을 동결할 수 있나요?

아니요. Permanent Freeze Delegate가 Collection에 있으면 동결은 모든 Asset에 한 번에 영향을 미칩니다. 개별 제어를 위해서는 Asset 수준의 Permanent Freeze Delegate를 사용하세요.

### 영구적으로 동결된 Asset을 소각할 수 있나요?

Permanent Burn Delegate도 있는 경우에만 가능합니다. 일반 Burn Delegate는 동결된 Asset을 소각할 수 없지만, Permanent Burn Delegate는 `forceApprove`를 사용합니다.

## 관련 플러그인

- [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) - 임시 잠금을 위한 철회 가능한 동결
- [Permanent Transfer Delegate](/ko/smart-contracts/core/plugins/permanent-transfer-delegate) - 영구 전송 권한
- [Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate) - 동결된 Asset도 소각

## 용어 정리

| 용어 | 정의 |
|------|------|
| **Permanent Plugin** | 생성 시에만 추가할 수 있고 영구적으로 유지되는 플러그인 |
| **forceApprove** | 다른 플러그인 거부를 무시하는 검증 |
| **Soulbound** | 지갑에 영구적으로 동결된 전송 불가 토큰 |
| **Collection Freeze** | Collection의 모든 Asset을 한 번에 동결 |

---

*Metaplex Foundation 관리 · 2026년 1월 최종 검증 · @metaplex-foundation/mpl-core에 적용*
