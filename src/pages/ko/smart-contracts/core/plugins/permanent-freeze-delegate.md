---
title: Permanent Freeze Delegate
metaTitle: Permanent Freeze Delegate | Metaplex Core
description: Permanent Freeze Delegate plugin으로 소울바운드 NFT를 생성하고 전체 Collection을 동결합니다. 영구적으로 유지되는 취소 불가능한 freeze 권한.
updated: '01-31-2026'
keywords:
  - soulbound NFT
  - permanent freeze
  - non-transferable NFT
  - collection freeze
about:
  - Soulbound tokens
  - Permanent plugins
  - Collection freezing
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 소울바운드(양도 불가) 토큰은 어떻게 생성하나요?
    a: PermanentFreezeDelegate로 Asset을 생성하고, frozen을 true로 설정하고, authority를 None으로 설정합니다. Asset은 절대 동결 해제되거나 전송될 수 없습니다.
  - q: Freeze Delegate와 Permanent Freeze Delegate의 차이점은 무엇인가요?
    a: 일반 Freeze Delegate authority는 전송 시 취소되며 Asset에서만 작동합니다. Permanent Freeze Delegate는 영구적으로 유지되고, Collection에서 작동하며, forceApprove를 사용합니다.
  - q: Collection 내의 개별 Asset을 동결할 수 있나요?
    a: 아니요. Permanent Freeze Delegate가 Collection에 있으면 동결은 모든 Asset에 한 번에 영향을 미칩니다. 개별 제어는 Asset 레벨의 Permanent Freeze Delegate를 사용하세요.
  - q: 영구적으로 동결된 Asset을 burn할 수 있나요?
    a: Permanent Burn Delegate도 있는 경우에만 가능합니다. 일반 Burn Delegate는 동결된 Asset을 burn할 수 없지만, Permanent Burn Delegate는 forceApprove를 사용합니다.
---
**Permanent Freeze Delegate Plugin**은 전송 후에도 유지되는 취소 불가능한 freeze 권한을 제공합니다. 소울바운드 토큰, Collection 전체 동결, 영구적인 잠금 메커니즘에 사용합니다. {% .lead %}
{% callout title="학습 내용" %}

- 영구 freeze 기능이 있는 Asset 생성
- 전체 Collection을 한 번에 동결
- 소울바운드(양도 불가) 토큰 구현
- permanent vs 일반 freeze delegate 이해
{% /callout %}

## 개요

**Permanent Freeze Delegate**는 생성 시에만 추가할 수 있는 permanent plugin입니다. 일반 Freeze Delegate와 달리 이 권한은 영구적으로 유지되며 전송 후에도 동결/해제할 수 있습니다.

- Asset/Collection 생성 시에만 추가 가능
- 권한은 전송 후에도 유지 (취소되지 않음)
- `forceApprove` 사용 - 다른 차단 plugin이 있어도 동결 가능
- Collection 레벨 동결은 Collection 내의 모든 Asset에 영향

## 범위 외

일반 freeze delegate ([Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) 참조), 임시 동결, Token Metadata freeze 권한.

## 빠른 시작

**바로가기:** [Asset 생성](#creating-an-asset-with-a-permanent-freeze-plugin) · [Collection 생성](#creating-a-collection-with-a-permanent-freeze-plugin) · [업데이트 (해제)](#updating-the-permanent-freeze-delegate-plugin-on-an-asset)

1. Asset/Collection 생성 시 `PermanentFreezeDelegate` plugin 추가
2. 즉시 동결은 `frozen: true`, 나중에 동결은 `false` 설정
3. delegate는 전송 후에도 언제든지 동결/해제 가능
{% callout type="note" title="Permanent vs 일반 Freeze Delegate" %}
| 기능 | Freeze Delegate | Permanent Freeze Delegate |
|---------|-----------------|---------------------------|
| 생성 후 추가 | ✅ 가능 | ❌ 생성 시에만 |
| 전송 후 권한 유지 | ❌ 취소됨 | ✅ 유지 |
| Collection에서 동작 | ❌ 불가 | ✅ 가능 |
| forceApprove | ❌ 없음 | ✅ 있음 |
| 소울바운드 토큰 | ❌ 제한적 | ✅ 최적의 선택 |
**[Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) 선택**: 임시적이고 취소 가능한 동결이 필요한 경우.
**Permanent Freeze Delegate 선택**: 영구적인 권한 또는 Collection 전체 동결이 필요한 경우.
{% /callout %}

## 일반적인 사용 사례

- **소울바운드 토큰**: 양도 불가 자격증, 업적, 멤버십 생성
- **Collection 전체 동결**: 하나의 plugin으로 Collection 내의 모든 Asset 동결
- **영구적인 담보**: 소유권 변경 후에도 유지되는 담보로 Asset 잠금
- **게임 아이템 영속성**: 거래에 관계없이 잠금 상태로 유지되는 아이템
- **규정 준수 요구 사항**: 규제상의 이유로 동결 상태를 유지해야 하는 Asset

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

### 동작

- **Asset**: delegated 주소가 언제든지 NFT를 동결 및 해제할 수 있도록 합니다.
- **Collection**: collection authority가 전체 Collection을 한 번에 동결 및 해제할 수 있도록 합니다. 이 delegate를 사용하여 Collection 내의 단일 asset을 동결하는 것은 **불가능**합니다.

## 인수

| 인수    | 값 |
| ------ | ----- |
| frozen | bool  |

## Permanent Freeze plugin이 있는 Asset 생성

다음 예제는 Permanent Freeze plugin이 있는 Asset을 생성하는 방법을 보여줍니다.
{% dialect-switcher title="Permanent Freeze plugin이 있는 Asset 생성" %}
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

## Asset의 Permanent Freeze Delegate plugin 업데이트

다음 예제는 Asset의 Permanent Freeze Delegate plugin을 업데이트하는 방법을 보여줍니다. `frozen` 인수를 `true` 또는 `false`로 설정하여 동결 또는 해제합니다. 서명 지갑이 plugin authority임을 전제로 합니다.
{% dialect-switcher title="Asset의 Permanent Freeze Delegate plugin 업데이트" %}
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

## Permanent Freeze plugin이 있는 Collection 생성

다음 예제는 Permanent Freeze plugin이 있는 Collection을 생성하는 방법을 보여줍니다.
{% dialect-switcher title="Permanent Freeze plugin이 있는 Collection 생성" %}
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
        authority: { type: "UpdateAuthority"}, // The update authority can unfreeze it
      },
    ],
  }).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Permanent Freeze plugin이 있는 Collection 업데이트

다음 예제는 Collection의 Permanent Freeze Delegate plugin을 업데이트하는 방법을 보여줍니다. `frozen` 인수를 `true` 또는 `false`로 설정하여 동결 또는 해제합니다. 서명 지갑이 plugin authority임을 전제로 합니다.
{% dialect-switcher title="Permanent Freeze plugin이 있는 Collection 업데이트" %}
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

Permanent plugin은 Asset/Collection 생성 시에만 추가할 수 있습니다. 기존 Asset에는 Permanent Freeze Delegate를 추가할 수 없습니다.

### `Authority mismatch`

plugin authority만 동결/해제할 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

## 참고 사항

- **생성 시에만**: Asset/Collection 존재 후에는 추가 불가
- **Force approve**: 충돌하는 plugin이 있어도 동결 가능
- **Collection 동작**: 모든 Asset을 한 번에 동결, 개별적으로가 아님
- **영구적**: 권한은 전송 후에도 취소되지 않음
- 소울바운드 토큰에는 `frozen: true`와 authority `None` 설정 사용

## FAQ

### 소울바운드(양도 불가) 토큰은 어떻게 생성하나요?

`PermanentFreezeDelegate`로 Asset을 생성하고, `frozen: true`로 설정하고, authority를 `None`으로 설정합니다. Asset은 절대 동결 해제되거나 전송될 수 없습니다.

### Freeze Delegate와 Permanent Freeze Delegate의 차이점은 무엇인가요?

일반 Freeze Delegate authority는 전송 시 취소되며 Asset에서만 작동합니다. Permanent Freeze Delegate는 영구적으로 유지되고, Collection에서 작동하며, `forceApprove`를 사용합니다.

### Collection 내의 개별 Asset을 동결할 수 있나요?

아니요. Permanent Freeze Delegate가 Collection에 있으면 동결은 모든 Asset에 한 번에 영향을 미칩니다. 개별 제어는 Asset 레벨의 Permanent Freeze Delegate를 사용하세요.

### 영구적으로 동결된 Asset을 burn할 수 있나요?

Permanent Burn Delegate도 있는 경우에만 가능합니다. 일반 Burn Delegate는 동결된 Asset을 burn할 수 없지만, Permanent Burn Delegate는 `forceApprove`를 사용합니다.

## 관련 Plugin

- [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) - 임시 잠금을 위한 취소 가능한 freeze
- [Permanent Transfer Delegate](/ko/smart-contracts/core/plugins/permanent-transfer-delegate) - 영구적인 transfer 권한
- [Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate) - 동결된 Asset도 burn 가능

## 용어집

| 용어 | 정의 |
|------|------------|
| **Permanent Plugin** | 생성 시에만 추가할 수 있고 영구적으로 유지되는 Plugin |
| **forceApprove** | 다른 plugin의 거부를 무시하는 검증 |
| **Soulbound** | 지갑에 영구적으로 동결된 양도 불가 토큰 |
| **Collection Freeze** | Collection 내의 모든 Asset을 한 번에 동결 |
