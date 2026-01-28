---
title: Assets 전송하기
metaTitle: Assets 전송하기 | Metaplex Core
description: Solana에서 Core NFT Assets을 지갑 간에 전송하는 방법을 알아보세요. 다른 사용자에게 NFT를 보내고, 컬렉션 전송을 처리하고, Transfer Delegate를 사용합니다.
---

이 가이드는 Metaplex Core SDK를 사용하여 Solana에서 **Core Assets을 지갑 간에 전송**하는 방법을 보여줍니다. 단일 명령어로 NFT를 다른 사용자에게 보낼 수 있습니다. {% .lead %}

{% callout title="학습 내용" %}

- Asset을 새 소유자에게 전송하기
- 컬렉션에 있는 Assets의 전송 처리하기
- 승인된 전송을 위해 Transfer Delegate 사용하기
- 전송 권한 요구 사항 이해하기

{% /callout %}

## 요약

`transfer` 명령어를 사용하여 Core Asset을 새 소유자에게 전송합니다. 현재 소유자(또는 승인된 Transfer Delegate)만 전송을 시작할 수 있습니다.

- 수신자 주소로 `transfer(umi, { asset, newOwner })`를 호출
- 컬렉션 Assets의 경우 `collection` 매개변수 포함
- Transfer Delegate는 소유자를 대신하여 전송 가능
- 전송은 무료 (트랜잭션 수수료만 적용)

## 범위 외

Token Metadata 전송 (mpl-token-metadata 사용), 배치 전송 (Assets 루프 처리), 마켓플레이스 판매 (에스크로 프로그램 사용).

## 빠른 시작

**바로가기:** [기본 전송](#core-asset-전송하기) · [컬렉션 전송](#컬렉션에-있는-core-asset-전송하기) · [Delegate 전송](#asset의-transfer-delegate인-경우는-어떻게-하나요)

1. 설치: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. Asset을 가져와 소유권과 컬렉션 멤버십 확인
3. `transfer(umi, { asset, newOwner })` 호출
4. `fetchAsset()`으로 소유권 변경 확인

## 전제 조건

- Asset을 소유하거나 Transfer Delegate인 서명자로 구성된 **Umi**
- 전송할 Asset의 **Asset 주소**
- 새 소유자의 **수신자 주소** (공개 키)

Core Asset의 소유자는 MPL Core 프로그램에 `transfer` 명령어를 사용하여 다른 계정으로 소유권을 전송할 수 있습니다.

{% totem %}
{% totem-accordion title="기술적 명령어 세부사항" %}
**명령어 계정 목록**

| 계정          | 설명                                          |
| ------------- | --------------------------------------------- |
| asset         | MPL Core Asset의 주소.                        |
| collection    | Core Asset이 속한 컬렉션.                      |
| authority     | 자산의 소유자 또는 위임자.                     |
| payer         | 저장 수수료를 지불하는 계정.                   |
| newOwner      | 자산을 전송받을 새 소유자.                     |
| systemProgram | System Program 계정.                          |
| logWrapper    | SPL Noop Program.                             |

일부 계정은 사용 편의성을 위해 SDK에서 추상화되거나 선택적일 수 있습니다.
온체인 명령어에 대한 자세한 내용은 [Github](https://github.com/metaplex-foundation/mpl-core/blob/5a45f7b891f2ca58ad1fc18e0ebdd0556ad59a4b/programs/mpl-core/src/instruction.rs#L139)에서 확인할 수 있습니다.
{% /totem-accordion %}
{% /totem %}

## Core Asset 전송하기

{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}

## 컬렉션에 있는 Core Asset 전송하기

컬렉션이 있는 Asset을 전송하는 경우 컬렉션 주소를 전달해야 합니다.
[자산이 컬렉션에 있는지 어떻게 알 수 있나요?]()

{% dialect-switcher title="컬렉션의 일부인 Asset 전송하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferV1 } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')

await transferV1(umi, {
  asset: asset.publicKey,
  newOwner: newOwner.publicKey,
  collection: colleciton.publicKey,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::instructions::TransferV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn transfer_asset_in_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let collection = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let new_owner = Pubkey::from_str("33333333333333333333333333333333").unwrap();

    let transfer_asset_in_collection_ix = TransferV1Builder::new()
        .asset(asset)
        .collection(Some(collection))
        .payer(authority.pubkey())
        .new_owner(new_owner)
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let transfer_asset_in_collection_tx = Transaction::new_signed_with_payer(
        &[transfer_asset_in_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&transfer_asset_in_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}

## Asset의 Transfer Delegate인 경우는 어떻게 하나요?

[Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) 플러그인을 통해 Asset의 Transfer Delegate라면, Asset의 소유자인 것처럼 `transferV1` 함수를 호출할 수 있습니다.

## 일반적인 오류

### `Authority mismatch`

Asset의 소유자 또는 Transfer Delegate가 아닙니다. 소유권을 확인하세요:

```ts
const asset = await fetchAsset(umi, assetAddress)
console.log(asset.owner) // 서명자와 일치해야 합니다
```

### `Asset is frozen`

Asset에 Freeze Delegate 플러그인이 있고 현재 동결되어 있습니다. 전송 전에 동결 권한자가 동결을 해제해야 합니다.

### `Missing collection parameter`

컬렉션에 있는 Asset의 경우 `collection` 주소를 전달해야 합니다. Asset에 컬렉션이 있는지 확인하세요:

```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  console.log('Collection:', asset.updateAuthority.address)
}
```

## 참고 사항

- 전송은 **무료** - 임대 비용 없음, 트랜잭션 수수료만 (~0.000005 SOL)
- 새 소유자는 Asset의 완전한 제어권을 받습니다
- Transfer Delegate는 성공적인 전송 후 취소됩니다
- 동결된 Assets는 동결 해제될 때까지 전송할 수 없습니다
- 항상 먼저 Asset을 가져와 컬렉션 멤버십을 확인하세요

## 빠른 참조

### 전송 매개변수

| 매개변수 | 필수 | 설명 |
|-----------|----------|-------------|
| `asset` | 예 | Asset 주소 또는 가져온 객체 |
| `newOwner` | 예 | 수신자의 공개 키 |
| `collection` | 컬렉션에 있는 경우 | 컬렉션 주소 |
| `authority` | 아니오 | 기본값은 서명자 (delegate에 사용) |

### 누가 전송할 수 있나요?

| 권한 | 전송 가능? |
|-----------|---------------|
| Asset 소유자 | 예 |
| Transfer Delegate | 예 (이후 취소됨) |
| Update Authority | 아니오 |
| Collection Authority | 아니오 |

## FAQ

### Asset이 컬렉션에 있는지 어떻게 알 수 있나요?

Asset을 가져와 `updateAuthority`를 확인하세요:

```ts
const asset = await fetchAsset(umi, assetAddress)
if (asset.updateAuthority.type === 'Collection') {
  // asset.updateAuthority.address를 collection 매개변수로 전달
}
```

### 나 자신에게 전송할 수 있나요?

예. 자신의 주소로 전송하는 것은 유효합니다 (지갑 통합이나 테스트에 유용).

### 전송 후 Transfer Delegate는 어떻게 되나요?

Transfer Delegate 플러그인은 전송이 완료되면 자동으로 취소됩니다. 새 소유자는 필요한 경우 새 delegate를 할당해야 합니다.

### 전송을 취소할 수 있나요?

아니오. 전송은 원자적입니다 - 트랜잭션이 확인되면 소유권이 변경됩니다. 취소할 보류 상태가 없습니다.

### 한 번에 여러 Assets를 전송할 수 있나요?

단일 명령어로는 안 됩니다. 하나의 트랜잭션에서 여러 전송 명령어를 배치 처리할 수 있지만 (트랜잭션 크기 제한까지), 각 Asset에는 자체 전송 호출이 필요합니다.

### 전송하면 Update Authority가 변경되나요?

아니오. 전송은 소유권만 변경합니다. Update Authority는 `update` 명령어를 통해 명시적으로 변경하지 않는 한 동일하게 유지됩니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Owner** | 현재 Asset을 소유한 지갑 |
| **Transfer Delegate** | 소유자를 대신하여 전송할 권한이 있는 계정 |
| **Frozen** | 전송이 차단된 Asset 상태 |
| **New Owner** | Asset을 받는 수신자 지갑 |
| **Collection** | Asset이 속한 컬렉션 (전송 요구 사항에 영향) |

---

*Metaplex Foundation에서 관리 · 2026년 1월 최종 확인 · @metaplex-foundation/mpl-core에 적용*
