---
title: Assets 업데이트하기
metaTitle: Assets 업데이트하기 | Metaplex Core
description: Solana에서 Core NFT Asset 메타데이터를 업데이트하는 방법을 알아보세요. Metaplex Core SDK를 사용하여 이름, URI, 컬렉션 멤버십을 변경하고 assets를 불변으로 만듭니다.
---

이 가이드는 Metaplex Core SDK를 사용하여 Solana에서 **Core Asset 메타데이터를 업데이트**하는 방법을 보여줍니다. 관리하는 Assets의 이름, URI 또는 컬렉션 멤버십을 수정합니다. {% .lead %}

{% callout title="학습 내용" %}

- Asset 이름과 메타데이터 URI 업데이트하기
- Asset을 다른 컬렉션으로 이동하기
- Asset을 불변(영구적)으로 만들기
- Update Authority 요구 사항 이해하기

{% /callout %}

## 요약

`update` 명령어를 사용하여 Core Asset의 메타데이터를 업데이트합니다. Update Authority(또는 승인된 delegate)만 Asset을 수정할 수 있습니다.

- 메타데이터를 업데이트하려면 `name`과 `uri`를 변경
- 컬렉션 간에 Assets를 이동하려면 `newCollection` 사용
- 불변으로 만들려면 `updateAuthority`를 `None`으로 설정
- 업데이트는 무료 (계정 크기 변경 제외 시 임대 비용 없음)

## 범위 외

Token Metadata NFT 업데이트 (mpl-token-metadata 사용), 플러그인 수정 ([플러그인](/ko/smart-contracts/core/plugins) 참조), 소유권 전송 ([Assets 전송하기](/ko/smart-contracts/core/transfer) 참조).

## 빠른 시작

**바로가기:** [Asset 업데이트](#core-asset-업데이트하기) · [컬렉션 변경](#core-asset의-컬렉션-변경하기) · [불변으로 만들기](#core-asset-데이터를-불변으로-만들기)

1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 현재 상태를 가져오기 위해 Asset 조회
3. 새 값으로 `update(umi, { asset, name, uri })` 호출
4. `fetchAsset()`으로 변경 사항 확인

## 전제 조건

- Asset의 Update Authority인 서명자로 구성된 **Umi**
- 업데이트할 Asset의 **Asset 주소**
- Arweave/IPFS에 업로드된 **새 메타데이터** (URI 변경 시)

Core Asset의 업데이트 권한자 또는 위임자는 Asset의 일부 데이터를 변경할 수 있는 능력을 가집니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}

**명령어 계정 목록**

| 계정               | 설명                                          |
| ------------------ | --------------------------------------------- |
| asset              | MPL Core Asset의 주소.                        |
| collection         | Core Asset이 속한 컬렉션.                      |
| payer              | 저장 수수료를 지불하는 계정.                   |
| authority          | 자산의 소유자 또는 위임자.                     |
| newUpdateAuthority | 자산의 새로운 Update Authority.               |
| systemProgram      | System Program 계정.                          |
| logWrapper         | SPL Noop Program.                             |

**명령어 인수**

| 인수    | 설명                           |
| ------- | ------------------------------ |
| newName | Core Asset의 새 이름.           |
| newUri  | 새 오프체인 메타데이터 URI.     |

일부 계정/인수는 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 여기에서 확인할 수 있습니다. [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)

{% /totem-accordion %}
{% /totem %}

## Core Asset 업데이트하기

다음은 SDK를 사용하여 MPL Core Asset을 업데이트하는 방법입니다.

{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}

## Core Asset의 컬렉션 변경하기

다음은 SDK를 사용하여 Core Asset의 컬렉션을 변경하는 방법입니다.

{% dialect-switcher title="Core Asset의 컬렉션 변경하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import {
  update,
  fetchAsset,
  fetchCollection,
  collectionAddress,
  updateAuthority
} from "@metaplex-foundation/mpl-core";

const assetId = publicKey("11111111111111111111111111111111");

const asset = await fetchAsset(umi, assetId);

const collectionId = collectionAddress(asset)

if (!collectionId) {
  console.log("Collection not found");
  return;
}

const collection = await fetchCollection(umi, collectionId);

const newCollectionId = publicKey("22222222222222222222222222222222")

const updateTx = await update(umi, {
  asset,
  collection,
  newCollection: newCollectionId,
  newUpdateAuthority: updateAuthority('Collection', [newCollectionId]),
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## Core Asset 데이터를 불변으로 만들기

다음은 SDK를 사용하여 Core Asset을 완전히 불변으로 만드는 방법입니다. [불변성 가이드](/ko/smart-contracts/core/guides/immutability)에 설명된 다양한 수준의 불변성이 있다는 점에 주의하세요.

{% callout type="warning" title="중요" %}

이는 파괴적인 행동으로 자산 업데이트 능력을 제거합니다.

또한 자산이 속해 있던 모든 컬렉션에서 자산을 제거합니다. 컬렉션 자산을 불변으로 만들려면 컬렉션의 Update Authority를 변경해야 합니다.

{% /callout %}

{% dialect-switcher title="Core Asset을 불변으로 만들기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { update, fetchAsset } from '@metaplex-foundation/mpl-core'

const assetId = publicKey('11111111111111111111111111111111')
const asset = await fetchAsset(umi, asset)

await update(umi, {
  asset: asset,
  newUpdateAuthority: updateAuthority('None'),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{instructions::UpdateV1Builder, types::UpdateAuthority};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn update_asset_data_to_immutable() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let update_asset_ix = UpdateV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .new_update_authority(UpdateAuthority::None)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let update_asset_tx = Transaction::new_signed_with_payer(
        &[update_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&update_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

Asset의 Update Authority가 아닙니다. 확인하세요:

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.updateAuthority) // 서명자와 일치해야 합니다
```

### `Collection authority required`

컬렉션을 변경할 때 Asset과 대상 컬렉션 모두에 대한 권한이 필요합니다.

### `Asset is immutable`

Asset의 Update Authority가 `None`으로 설정되어 있습니다. 이는 되돌릴 수 없습니다.

## 참고 사항

- 업데이트 전에 Asset을 조회하여 현재 상태 확인
- Update Authority(또는 delegate)만 Asset을 업데이트할 수 있음
- Asset을 불변으로 만드는 것은 **영구적이고 되돌릴 수 없음**
- 컬렉션을 변경하면 상속된 플러그인(로열티 등)에 영향을 미칠 수 있음
- 업데이트는 Asset의 소유자를 변경하지 않음

## 빠른 참조

### 업데이트 매개변수

| 매개변수 | 설명 |
|-----------|-------------|
| `asset` | 업데이트할 Asset (주소 또는 조회된 객체) |
| `name` | Asset의 새 이름 |
| `uri` | 새 메타데이터 URI |
| `newCollection` | 대상 컬렉션 주소 |
| `newUpdateAuthority` | 새 권한 (불변의 경우 `None`) |

### 권한 유형

| 유형 | 설명 |
|------|-------------|
| `Address` | 특정 공개 키 |
| `Collection` | 컬렉션의 Update Authority |
| `None` | 불변 - 업데이트 불가 |

## FAQ

### Asset을 불변으로 만드는 것을 되돌릴 수 있나요?

아니오. Update Authority를 `None`으로 설정하는 것은 영구적입니다. Asset의 이름, URI, 컬렉션 멤버십은 영원히 동결됩니다. 확실할 때만 하세요.

### URI를 변경하지 않고 이름만 업데이트하려면 어떻게 하나요?

변경하려는 필드만 전달하세요. 현재 값을 유지하려면 `uri`를 생략하세요:

```ts
await update(umi, { asset, name: 'New Name' }).sendAndConfirm(umi)
```

### 업데이트와 전송의 차이점은 무엇인가요?

업데이트는 Asset의 메타데이터(이름, URI)를 변경합니다. 전송은 소유권을 변경합니다. 서로 다른 권한 요구 사항을 가진 별도의 작업입니다.

### delegate가 Asset을 업데이트할 수 있나요?

예, [Update Delegate 플러그인](/ko/smart-contracts/core/plugins/update-delegate)을 통해 Update Delegate로 할당된 경우.

### 업데이트에 SOL이 들어가나요?

새 데이터가 현재 계정 크기보다 큰 경우(드묾)를 제외하고 업데이트는 무료입니다. 트랜잭션 수수료 (~0.000005 SOL)는 여전히 적용됩니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Update Authority** | Asset의 메타데이터를 수정할 권한이 있는 계정 |
| **Immutable** | 업데이트할 수 없는 Asset (Update Authority가 None) |
| **URI** | 오프체인 메타데이터 JSON을 가리키는 URL |
| **Delegate** | 플러그인을 통해 특정 권한이 부여된 계정 |
| **Collection Membership** | Asset이 속한 컬렉션 |

---

*Metaplex Foundation에서 관리 · 2026년 1월 최종 확인 · @metaplex-foundation/mpl-core에 적용*
