---
title: Asset 소각
metaTitle: Asset 소각 | Metaplex Core
description: Solana에서 Core NFT Asset을 소각하는 방법을 배웁니다. Metaplex Core SDK를 사용하여 Asset을 영구적으로 파괴하고 렌트를 회수합니다.
created: '06-15-2024'
updated: '01-31-2026'
keywords:
  - burn NFT
  - destroy asset
  - recover rent
  - Solana NFT
  - mpl-core burn
about:
  - NFT burning
  - Rent recovery
  - Asset destruction
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - npm install @metaplex-foundation/mpl-core로 SDK 설치
  - Asset을 가져와서 소유권 확인
  - 소유자로서 burn(umi, { asset }) 호출
  - 렌트가 자동으로 지갑에 반환됨
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: 계정에 남아있는 ~0.0009 SOL을 회수할 수 있나요?
    a: 아니요. 이 소액은 계정을 소각됨으로 표시하고 주소 재사용을 방지하기 위해 의도적으로 남겨집니다.
  - q: 소각 후 Asset의 메타데이터는 어떻게 되나요?
    a: 온체인 계정이 지워집니다. Arweave/IPFS의 오프체인 메타데이터는 접근 가능하지만 온체인 링크는 없습니다.
  - q: Burn Delegate가 소유자 승인 없이 소각할 수 있나요?
    a: 예. 한 번 할당되면 Burn Delegate는 언제든지 Asset을 소각할 수 있습니다. 신뢰할 수 있는 주소만 할당하세요.
  - q: 소각이 Collection 카운트에 영향을 미치나요?
    a: 예. Collection의 currentSize가 감소합니다. numMinted 카운터는 변경되지 않습니다.
  - q: 여러 Asset을 한 번에 소각할 수 있나요?
    a: 단일 명령어로는 불가능합니다. 크기 제한 내에서 하나의 트랜잭션에 여러 소각 명령어를 배치할 수 있습니다.
---
이 가이드는 Metaplex Core SDK를 사용하여 Solana에서 **Core Asset을 소각**하는 방법을 보여줍니다. Asset을 영구적으로 파괴하고 렌트 보증금의 대부분을 회수합니다. {% .lead %}
{% callout title="학습 내용" %}

- Asset을 소각하고 렌트 회수
- Collection 내 Asset의 소각 처리
- Burn Delegate 권한 이해
- 소각 후 계정에 무슨 일이 일어나는지 알기
{% /callout %}

## 요약

Core Asset을 소각하여 영구적으로 파괴하고 렌트를 회수합니다. 소유자(또는 Burn Delegate)만 Asset을 소각할 수 있습니다.

- `burn(umi, { asset })`을 호출하여 Asset 파괴
- 대부분의 렌트(~0.0028 SOL)가 지불자에게 반환됨
- 소액(~0.0009 SOL)이 계정 재사용 방지를 위해 남음
- 소각은 **영구적이며 되돌릴 수 없음**

## 범위 외

Token Metadata 소각(mpl-token-metadata 사용), 압축 NFT 소각(Bubblegum 사용), Collection 소각(Collection은 자체 소각 프로세스가 있음).

## 빠른 시작

**바로가기:** [Asset 소각](#code-example) · [Collection 내 소각](#burning-an-asset-that-is-part-of-a-collection)

1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Asset을 가져와서 소유권 확인
3. 소유자로서 `burn(umi, { asset })` 호출
4. 렌트가 자동으로 지갑에 반환됨

## 전제 조건

- Asset을 소유한(또는 Burn Delegate인) 서명자로 구성된 **Umi**
- 소각할 Asset의 **Asset 주소**
- **Collection 주소** (Asset이 Collection 내에 있는 경우)
Asset은 `burn` 명령어를 사용하여 소각할 수 있습니다. 이렇게 하면 렌트 면제 수수료가 소유자에게 반환됩니다. 계정이 다시 열리는 것을 방지하기 위해 매우 소액의 SOL(0.00089784)만 계정에 남습니다.
{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}
**명령어 계정 목록**
| 계정 | 설명 |
| ------------- | ----------------------------------------------- |
| asset         | MPL Core Asset의 주소 |
| collection    | Core Asset이 속한 컬렉션 |
| payer         | 스토리지 수수료를 지불하는 계정 |
| authority     | 자산의 소유자 또는 위임자 |
| systemProgram | System Program 계정 |
| logWrapper    | SPL Noop Program |
사용 편의를 위해 일부 계정은 SDK에서 추상화되거나 선택 사항일 수 있습니다.
온체인 명령어의 전체 세부사항은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123)에서 확인할 수 있습니다.
{% /totem-accordion %}
{% /totem %}

## 코드 예제

SDK를 사용하여 Core asset을 소각하는 방법입니다. 이 스니펫은 당신이 자산의 소유자라고 가정합니다.
{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}

## Collection에 속한 Asset 소각

컬렉션의 일부인 Core asset을 소각하기 위한 SDK 사용 방법입니다. 이 스니펫은 당신이 자산의 소유자라고 가정합니다.
{% dialect-switcher title="Collection에 속한 Asset 소각" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  burn,
  fetchAsset,
  collectionAddress,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, assetId)
const collectionId = collectionAddress(asset)

let collection = undefined
if (collectionId) {
  collection = await fetchCollection(umi, collectionId)
}

await burn(umi, {
  asset,
  collection,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::BurnV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn burn_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("2222222222222222222222222222222").unwrap();
    let burn_asset_in_collection_ix = BurnV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let burn_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[burn_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&burn_asset_in_collection_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

Asset의 소유자나 Burn Delegate가 아닙니다. 소유권을 확인하세요:

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 서명자와 일치해야 함
```

### `Asset is frozen`

Asset에 Freeze Delegate 플러그인이 있고 현재 동결되어 있습니다. 소각하기 전에 동결 권한자가 해제해야 합니다.

### `Missing collection parameter`

Collection 내 Asset의 경우 `collection` 주소를 전달해야 합니다. 먼저 Asset을 가져와서 컬렉션을 확인하세요:

```ts
const asset = await fetchAsset(umi, assetAddress)
const collectionId = collectionAddress(asset)
```

## 참고사항

- 소각은 **영구적이며 되돌릴 수 없음** - Asset을 복구할 수 없음
- 렌트는 소유자에게 반환됨 (금액은 자산 크기와 플러그인에 따라 다름)
- 남은 SOL은 계정 주소의 재사용을 방지함
- Burn Delegate는 소유자를 대신하여 소각 가능 (Burn Delegate 플러그인을 통해)
- 동결된 Asset은 소각 전에 해제해야 함

## 빠른 참조

### 소각 파라미터

| 파라미터 | 필수 | 설명 |
|-----------|----------|-------------|
| `asset` | 예 | Asset 주소 또는 가져온 객체 |
| `collection` | 컬렉션 내인 경우 | Collection 주소 |
| `authority` | 아니요 | 기본값은 서명자 (위임자용) |

### 누가 소각할 수 있나요?

| 권한 | 소각 가능? |
|-----------|-----------|
| Asset 소유자 | 예 |
| Burn Delegate | 예 |
| Transfer Delegate | 아니요 |
| Update Authority | 아니요 |

### 렌트 회수

| 항목 | 금액 |
|------|--------|
| 지불자에게 반환 | 기본 + 플러그인 스토리지 렌트 |
| 계정에 남음 | ~0.0009 SOL |

## FAQ

### 계정에 남아있는 ~0.0009 SOL을 회수할 수 있나요?

아니요. 이 소액은 계정을 "소각됨"으로 표시하고 해당 주소가 새 Asset에 재사용되는 것을 방지하기 위해 의도적으로 남겨집니다.

### 소각 후 Asset의 메타데이터는 어떻게 되나요?

온체인 계정이 지워집니다(0으로 초기화). 오프체인 메타데이터는 원래 URI를 통해 접근 가능하지만, 이를 연결하는 온체인 기록은 없습니다.

### Burn Delegate가 소유자의 승인 없이 소각할 수 있나요?

예. 소유자가 플러그인을 통해 Burn Delegate를 할당하면 위임자는 언제든지 Asset을 소각할 수 있습니다. 소유자는 신뢰할 수 있는 주소만 Burn Delegate로 할당해야 합니다.

### 소각이 Collection의 카운트에 영향을 미치나요?

예. Asset이 소각되면 Collection의 `currentSize`가 감소합니다. `numMinted` 카운터는 변경되지 않습니다 (지금까지 민팅된 총 수를 추적함).

### 여러 Asset을 한 번에 소각할 수 있나요?

단일 명령어로는 불가능합니다. 하나의 트랜잭션에 여러 소각 명령어를 배치할 수 있습니다 (트랜잭션 크기 제한 내에서).

## 용어집

| 용어 | 정의 |
|------|------------|
| **소각** | Asset을 영구적으로 파괴하고 렌트를 회수 |
| **Burn Delegate** | 소유자를 대신하여 소각할 권한이 있는 계정 |
| **렌트** | Solana에서 계정을 유지하기 위해 예치하는 SOL |
| **동결** | 소각과 전송이 차단되는 Asset 상태 |
| **Collection** | Asset이 속할 수 있는 그룹 계정 |
