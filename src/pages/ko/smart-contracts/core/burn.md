---
title: 자산 소각
metaTitle: 자산 소각 | Metaplex Core
description: Solana에서 Core NFT 자산을 소각하는 방법을 배웁니다. Metaplex Core SDK를 사용하여 자산을 영구적으로 파괴하고 렌트를 회수합니다.
---

이 가이드에서는 Metaplex Core SDK를 사용하여 Solana에서 **Core 자산을 소각**하는 방법을 보여줍니다. 자산을 영구적으로 파괴하고 렌트 예치금의 대부분을 회수합니다. {% .lead %}

{% callout title="배울 내용" %}

- 자산을 소각하고 렌트 회수하기
- 컬렉션 내 자산의 소각 처리하기
- 소각 위임 권한 이해하기
- 소각 후 계정 상태 알기

{% /callout %}

## 요약

Core 자산을 소각하여 영구적으로 파괴하고 렌트를 회수합니다. 소유자(또는 소각 위임)만 자산을 소각할 수 있습니다.

- `burn(umi, { asset })`을 호출하여 자산 파괴
- 대부분의 렌트(약 0.0028 SOL)가 지불자에게 반환됨
- 계정 재사용을 방지하기 위해 소액(약 0.0009 SOL)이 남음
- 소각은 **영구적이며 되돌릴 수 없음**

## 다루지 않는 내용

Token Metadata 소각(mpl-token-metadata 사용), 압축 NFT 소각(Bubblegum 사용), 컬렉션 소각(컬렉션은 자체 소각 프로세스가 있음).

## 빠른 시작

**바로가기:** [자산 소각](#코드-예제) · [컬렉션 내 소각](#컬렉션의-일부인-자산-소각)

1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 자산을 가져와 소유권 확인
3. 소유자로서 `burn(umi, { asset })` 호출
4. 렌트가 자동으로 지갑에 반환됨

## 전제 조건

- 자산을 소유하는(또는 소각 위임인) 서명자로 구성된 **Umi**
- 소각할 자산의 **자산 주소**
- **컬렉션 주소** (자산이 컬렉션에 있는 경우)

`burn` 명령을 사용하여 자산을 소각할 수 있습니다. 이렇게 하면 렌트 면제 수수료가 소유자에게 반환됩니다. 계정이 다시 열리는 것을 방지하기 위해 아주 적은 양의 SOL(0.00089784)만 계정에 남습니다.

{% totem %}
{% totem-accordion title="기술 명령 세부사항" %}
**명령 계정 목록**

| 계정 | 설명 |
| ------------- | ----------------------------------------------- |
| asset | MPL Core 자산의 주소 |
| collection | Core 자산이 속한 컬렉션 |
| payer | 스토리지 수수료를 지불하는 계정 |
| authority | 자산의 소유자 또는 위임 |
| systemProgram | System Program 계정 |
| logWrapper | SPL Noop Program |

일부 계정은 사용 편의를 위해 SDK에서 추상화될 수 있습니다.
온체인 명령의 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L123)에서 확인할 수 있습니다.
{% /totem-accordion %}
{% /totem %}

## 코드 예제

SDK를 사용하여 Core 자산을 소각하는 방법입니다. 이 스니펫은 당신이 자산의 소유자라고 가정합니다.

{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}

## 컬렉션의 일부인 자산 소각

컬렉션의 일부인 Core 자산을 소각하는 방법입니다. 이 스니펫은 당신이 자산의 소유자라고 가정합니다.

{% dialect-switcher title="컬렉션의 일부인 자산 소각" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { burnV1, fetchAsset } from '@metaplex-foundation/mpl-core'

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
  collection = await fetchCollection(umi, collection)
}

await burn(umi, {
  asset: asset,
  collection: collection,
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

자산의 소유자 또는 소각 위임이 아닙니다. 소유권을 확인하세요:

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 서명자와 일치해야 함
```

### `Asset is frozen`

자산에 동결 위임 플러그인이 있고 현재 동결되어 있습니다. 소각하기 전에 동결 권한자가 동결을 해제해야 합니다.

### `Missing collection parameter`

컬렉션 내 자산의 경우 `collection` 주소를 전달해야 합니다. 먼저 자산을 가져와서 컬렉션을 확인하세요:

```ts
const asset = await fetchAsset(umi, assetAddress)
const collectionId = collectionAddress(asset)
```

## 참고 사항

- 소각은 **영구적이며 되돌릴 수 없음** - 자산을 복구할 수 없습니다
- 렌트에서 약 0.0028 SOL이 반환되지만 약 0.0009 SOL이 계정에 남습니다
- 남은 SOL은 계정 주소가 재사용되는 것을 방지합니다
- 소각 위임은 소유자를 대신하여 소각할 수 있습니다 (소각 위임 플러그인을 통해)
- 동결된 자산은 소각하기 전에 동결을 해제해야 합니다

## 빠른 참조

### 소각 매개변수

| 매개변수 | 필수 | 설명 |
|-----------|----------|-------------|
| `asset` | 예 | 자산 주소 또는 가져온 객체 |
| `collection` | 컬렉션에 있는 경우 | 컬렉션 주소 |
| `authority` | 아니오 | 기본값은 서명자 (위임용) |

### 소각 권한

| 권한 | 소각 가능? |
|-----------|-----------|
| 자산 소유자 | 예 |
| 소각 위임 | 예 |
| 전송 위임 | 아니오 |
| 업데이트 권한자 | 아니오 |

### 렌트 회수

| 항목 | 금액 |
|------|--------|
| 지불자에게 반환 | 약 0.0028 SOL |
| 계정에 남음 | 약 0.0009 SOL |
| **원래 렌트 총계** | **약 0.0029 SOL** |

## FAQ

### 계정에 남은 약 0.0009 SOL을 회수할 수 있나요?

아니요. 이 소액은 계정을 "소각됨"으로 표시하고 새 자산에 주소가 재사용되는 것을 방지하기 위해 의도적으로 남겨집니다.

### 소각 후 자산의 메타데이터는 어떻게 되나요?

온체인 계정이 지워집니다(0으로 채워짐). 오프체인 메타데이터(Arweave/IPFS)는 원래 URI로 계속 접근 가능하지만, 연결된 온체인 레코드는 없습니다.

### 소각 위임이 소유자 승인 없이 소각할 수 있나요?

예. 소유자가 플러그인을 통해 소각 위임을 할당하면 위임은 언제든지 자산을 소각할 수 있습니다. 소유자는 신뢰할 수 있는 주소만 소각 위임으로 할당해야 합니다.

### 소각이 컬렉션 카운트에 영향을 주나요?

예. 자산이 소각되면 컬렉션의 `currentSize`가 감소합니다. `numMinted` 카운터는 변경되지 않습니다(총 민팅 수를 추적함).

### 여러 자산을 한 번에 소각할 수 있나요?

단일 명령으로는 불가능합니다. 하나의 트랜잭션에 여러 소각 명령을 배치할 수 있습니다(트랜잭션 크기 제한까지).

## 용어집

| 용어 | 정의 |
|------|------------|
| **소각** | 자산을 영구적으로 파괴하고 렌트를 회수 |
| **소각 위임** | 소유자를 대신하여 소각할 권한이 있는 계정 |
| **렌트** | Solana에서 계정을 유지하기 위해 예치한 SOL |
| **동결** | 소각과 전송이 차단되는 자산 상태 |
| **컬렉션** | 자산이 속할 수 있는 그룹 계정 |

---

*Metaplex Foundation 관리 · 최종 확인: 2026년 1월 · @metaplex-foundation/mpl-core 적용*
