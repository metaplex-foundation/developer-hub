---
title: Asset 업데이트
metaTitle: Asset 업데이트 | Metaplex Core
description: Solana에서 Core NFT Asset 메타데이터를 업데이트하는 방법을 배웁니다. Metaplex Core SDK를 사용하여 이름, URI, 컬렉션 멤버십을 변경하고 Asset을 불변으로 만듭니다.
updated: '01-31-2026'
keywords:
  - update NFT
  - change metadata
  - NFT metadata
  - mpl-core update
  - immutable NFT
about:
  - NFT metadata
  - Update authority
  - Asset immutability
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Install SDK with npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi
  - Fetch the Asset to get current state
  - Call update(umi, { asset, name, uri }) with new values
  - Verify changes with fetchAsset()
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
faqs:
  - q: Asset을 불변으로 만든 후 되돌릴 수 있나요?
    a: 아니요. Update Authority를 None으로 설정하는 것은 영구적입니다. Asset의 이름, URI, 컬렉션 멤버십이 영원히 고정됩니다.
  - q: URI를 변경하지 않고 이름만 업데이트하려면 어떻게 하나요?
    a: 변경하려는 필드만 전달합니다. 현재 값을 유지하려면 uri를 생략하세요.
  - q: 업데이트와 전송의 차이점은 무엇인가요?
    a: 업데이트는 Asset의 메타데이터(이름, URI)를 변경합니다. 전송은 소유권을 변경합니다. 서로 다른 권한 요구사항을 가진 별개의 작업입니다.
  - q: 위임자가 Asset을 업데이트할 수 있나요?
    a: 네, Update Delegate 플러그인을 통해 Update Delegate로 지정된 경우 가능합니다.
  - q: 업데이트에 SOL이 드나요?
    a: 새 데이터가 현재 계정 크기보다 큰 경우를 제외하고 업데이트는 무료입니다. 트랜잭션 수수료(약 0.000005 SOL)는 여전히 적용됩니다.
---
이 가이드에서는 Metaplex Core SDK를 사용하여 Solana에서 **Core Asset 메타데이터를 업데이트**하는 방법을 설명합니다. 관리하는 Asset의 이름, URI 또는 컬렉션 멤버십을 변경할 수 있습니다. {% .lead %}
{% callout title="배울 내용" %}
- Asset 이름 및 메타데이터 URI 업데이트
- Asset을 다른 Collection으로 이동
- Asset을 불변(영구적)으로 만들기
- Update Authority 요구사항 이해
{% /callout %}
## 요약
`update` 명령어를 사용하여 Core Asset의 메타데이터를 업데이트합니다. Update Authority(또는 승인된 위임자)만 Asset을 수정할 수 있습니다.
- `name`과 `uri`를 변경하여 메타데이터 업데이트
- `newCollection`을 사용하여 Collection 간 Asset 이동
- `updateAuthority`를 `None`으로 설정하여 불변으로 만들기
- 계정 크기를 변경하지 않는 한 업데이트는 무료(렌트 비용 없음)
## 범위 외
Token Metadata NFT 업데이트(mpl-token-metadata 사용), 플러그인 수정([플러그인](/ko/smart-contracts/core/plugins) 참조), 소유권 전송([Asset 전송](/ko/smart-contracts/core/transfer) 참조).
## 빠른 시작
**바로가기:** [Asset 업데이트](#core-asset-업데이트) · [Collection 변경](#core-asset의-collection-변경) · [불변화](#core-asset-데이터-불변화)
1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. 현재 상태를 가져오기 위해 Asset 페치
3. 새 값으로 `update(umi, { asset, name, uri })` 호출
4. `fetchAsset()`으로 변경 사항 확인
## 전제 조건
- Asset의 Update Authority인 서명자가 구성된 **Umi**
- 업데이트할 **Asset 주소**
- Arweave/IPFS에 업로드된 **새 메타데이터**(URI 변경 시)
Core Asset의 Update Authority 또는 위임자는 Asset 데이터의 일부를 변경할 권한이 있습니다.
{% totem %}
{% totem-accordion title="기술적 명령어 상세" %}
**명령어 계정 목록**
| 계정               | 설명                                     |
| ------------------ | ---------------------------------------- |
| asset              | MPL Core Asset의 주소                    |
| collection         | Core Asset이 속하는 Collection           |
| payer              | 스토리지 수수료를 지불하는 계정          |
| authority          | Asset의 소유자 또는 위임자               |
| newUpdateAuthority | Asset의 새 Update Authority              |
| systemProgram      | System Program 계정                      |
| logWrapper         | SPL Noop Program                         |
**명령어 인수**
| 인수     | 설명                       |
| ------- | ------------------------- |
| newName | Core Asset의 새 이름       |
| newUri  | 새 오프체인 메타데이터 URI |
일부 계정/인수는 SDK에서 사용 편의를 위해 추상화되거나 선택 사항일 수 있습니다.
온체인 명령어의 전체 상세 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/clients/rust/src/generated/instructions/update_v1.rs#L126)에서 확인할 수 있습니다.
{% /totem-accordion %}
{% /totem %}
## Core Asset 업데이트
SDK를 사용하여 MPL Core Asset을 업데이트하는 방법입니다.
{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}
## Core Asset의 Collection 변경
SDK를 사용하여 Core Asset의 Collection을 변경하는 방법입니다.
{% dialect-switcher title="Core Asset의 Collection 변경" %}
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
## Core Asset 데이터 불변화
SDK를 사용하여 Core Asset을 완전히 불변으로 만드는 방법입니다. [불변성 가이드](/ko/smart-contracts/core/guides/immutability)에서 설명하는 다양한 수준의 불변성이 있다는 점에 유의하세요.
{% callout type="warning" title="중요" %}
이것은 파괴적인 작업이며 Asset을 업데이트하는 기능이 제거됩니다.
또한 Asset이 속해 있던 모든 Collection에서도 제거됩니다. Collection Asset을 불변으로 만들려면 Collection의 Update Authority를 변경해야 합니다.
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
당신은 Asset의 Update Authority가 아닙니다. 확인하세요:
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.updateAuthority) // 서명자와 일치해야 합니다
```
### `Collection authority required`
Collection을 변경할 때 Asset과 대상 Collection 모두에서 권한이 필요합니다.
### `Asset is immutable`
Asset의 Update Authority가 `None`으로 설정되어 있습니다. 이것은 되돌릴 수 없습니다.
## 참고 사항
- 업데이트 전에 Asset을 페치하여 현재 상태 확인
- Update Authority(또는 위임자)만 Asset을 업데이트할 수 있음
- Asset을 불변으로 만드는 것은 **영구적이고 되돌릴 수 없음**
- Collection을 변경하면 상속된 플러그인(로열티 등)에 영향을 줄 수 있음
- 업데이트로 Asset의 소유자는 변경되지 않음
## 빠른 참조
### 업데이트 매개변수
| 매개변수 | 설명 |
|-----------|-------------|
| `asset` | 업데이트할 Asset(주소 또는 페치된 객체) |
| `name` | Asset의 새 이름 |
| `uri` | 새 메타데이터 URI |
| `newCollection` | 대상 Collection 주소 |
| `newUpdateAuthority` | 새 Authority(또는 불변의 경우 `None`) |
### Authority 타입
| 타입 | 설명 |
|------|-------------|
| `Address` | 특정 공개 키 |
| `Collection` | Collection의 Update Authority |
| `None` | 불변 - 업데이트 불가 |
## FAQ
### Asset을 불변으로 만든 후 되돌릴 수 있나요?
아니요. Update Authority를 `None`으로 설정하는 것은 영구적입니다. Asset의 이름, URI, 컬렉션 멤버십이 영원히 고정됩니다. 확실할 때만 수행하세요.
### URI를 변경하지 않고 이름만 업데이트하려면 어떻게 하나요?
변경하려는 필드만 전달합니다. 현재 값을 유지하려면 `uri`를 생략하세요:
```ts
await update(umi, { asset, name: 'New Name' }).sendAndConfirm(umi)
```
### 업데이트와 전송의 차이점은 무엇인가요?
업데이트는 Asset의 메타데이터(이름, URI)를 변경합니다. 전송은 소유권을 변경합니다. 서로 다른 권한 요구사항을 가진 별개의 작업입니다.
### 위임자가 Asset을 업데이트할 수 있나요?
네, [Update Delegate 플러그인](/ko/smart-contracts/core/plugins/update-delegate)을 통해 Update Delegate로 지정된 경우 가능합니다.
### 업데이트에 SOL이 드나요?
새 데이터가 현재 계정 크기보다 큰 경우(드물게)를 제외하고 업데이트는 무료입니다. 트랜잭션 수수료(약 0.000005 SOL)는 여전히 적용됩니다.
## 용어집
| 용어 | 정의 |
|------|------------|
| **Update Authority** | Asset의 메타데이터를 수정할 권한이 있는 계정 |
| **불변(Immutable)** | 업데이트할 수 없는 Asset(Update Authority가 None) |
| **URI** | 오프체인 메타데이터 JSON을 가리키는 URL |
| **위임자** | 플러그인을 통해 특정 권한이 부여된 계정 |
| **컬렉션 멤버십** | Asset이 속하는 Collection |
