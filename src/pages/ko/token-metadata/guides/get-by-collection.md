---
title: 컬렉션의 민트 가져오기
metaTitle: 컬렉션의 민트 가져오기 | Token Metadata 가이드
description: 컬렉션의 모든 민트를 가져오는 방법에 대한 가이드.
---

Metaplex Token Metadata는 [온체인 컬렉션](/token-metadata/collections)을 가지고 있어 온체인 표준의 부재로 인해 커뮤니티에서 사용하는 다양한 주관적이고 잠재적으로 충돌하는 휴리스틱 대신 NFT 컬렉션을 객관적으로 식별할 수 있습니다.

사양 설계는 주어진 NFT를 찾아보고 그것이 컬렉션에 속하는지, 그렇다면 어떤 컬렉션인지를 메타데이터 계정에서 컬렉션 필드를 간단히 읽음으로써 결정하는 것을 매우 쉽게 만듭니다. 온체인 `Metadata` 구조체는 선택적 `Collection` 구조체를 포함하며, 이는 속해 있는 컬렉션의 SPL 토큰 민트의 Pubkey인 `key` 필드를 가집니다.

```rust
pub struct Metadata {
	pub key: Key,
	pub update_authority: Pubkey,
	pub mint: Pubkey,
	pub data: Data,
	// 불변, 한 번 전환되면 이 메타데이터의 모든 판매는 2차 판매로 간주됩니다.
	pub primary_sale_happened: bool,
	// 데이터 구조체가 변경 가능한지 여부, 기본값은 아니오
	pub is_mutable: bool,
	/// 에디션의 쉬운 계산을 위한 nonce, 있는 경우
	pub edition_nonce: Option<u8>,
	/// 토큰 표준은 결정론적이며 create master edition 호출을 성공적으로 호출하면
	/// SemiFungible에서 NonFungible로 변경됩니다.
	pub token_standard: Option<TokenStandard>,
	/// Metadata를 쉽게 변경할 수 없으므로 여기 끝에 새로운 DataV2 필드를 추가합니다.
	/// 컬렉션
	pub collection: Option<Collection>,
...
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct Collection {
	pub verified: bool, // 컬렉션이 검증되었는지 여부
	pub key: Pubkey,    // 컬렉션 NFT의 SPL 토큰 민트 계정
}
```

그러나 컬렉션 민트 주소가 주어졌을 때, 해당 특정 컬렉션에 속하는 모든 NFT를 찾는 것은 체인에서 직접 읽을 때 상당히 더 어렵습니다. [DAS](/das-api)를 사용하는 하나의 우수한 방법과 체인에서 직접 데이터를 가져오는 두 가지 기본 접근법이 있습니다.

## DAS API
DAS를 사용하여 민트를 가져오는 것은 [이를 지원하는 RPC 공급자](/rpc-providers#metaplex-das-api)를 사용할 때 우수한 방법입니다.

{% dialect-switcher title="getAssetByGroup 예제" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

`endpoint`를 RPC URL로, `collection`을 찾고 있는 컬렉션 주소로 바꾸세요.

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const endpoint = '<ENDPOINT>';
const collection = 'J2ZfLdQsaZ3GCmbucJef3cPnPwGcgjDW1SSYtMdq3L9p'

const umi = createUmi(endpoint).use(dasApi());

const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: collection,
});
console.log(assets.items.length > 0);
```

{% /totem %}
{% /dialect %}
{% dialect title="cURL" id="curl" %}
{% totem %}

셸에서 이 명령어를 실행하세요. `<ENDPOINT>`와 `<<GROUPVALUE>>`를 바꾸는 것을 잊지 마세요.

```sh
curl --request POST --url "<ENDPOINT>" --header 'Content-Type: application/json' --data '{
    "jsonrpc": "2.0",
    "method": "getAssetsByGroup",
    "params": {
        "groupKey": "collection",
        "groupValue": "<GROUPVALUE>",
        "page": 1
    },
    "id": 0
}'
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

DAS에서 더 많은 메서드와 데이터를 가져오고 필터링할 수 있는 추가 메서드는 [DAS 문서](/das-api)에서 찾을 수 있습니다.

## 미리 계산된 오프셋을 사용한 GetProgramAccounts

`Collection` 구조체로의 오프셋과 함께 [getProgramAccounts](https://docs.solana.com/developing/clients/jsonrpc-api#getprogramaccounts) 호출을 사용하여 컬렉션 id를 `key` 필드와 일치시킬 수 있다고 생각하기 쉽습니다. 이는 대부분의 클라이언트 프로그램이 특정 캔디 머신이나 크리에이터 ID에 속하는 NFT 민트 계정의 스냅샷을 찾는 방법과 동일합니다. 그러나 `edition_nonce`, `token_standard`, `collection`이 모두 Rust `Option`이라는 사실로 인해 이것은 상당히 더 복잡해집니다.

Rust `Option`은 [Borsh](https://borsh.io/) 인코딩에서 `None` 변형에 대해서는 0, `Some` 변형에 대해서는 1과 함께 `Some` 변형의 포함된 값에 대한 일반적인 인코딩으로 표현됩니다. (예를 들어, `u8`의 경우 1바이트.) 이는 `Collection` 필드 이전의 두 `Option` 각각에 어떤 변형 유형이 있는지 알지 못하면 `Collection` 구조체로의 오프셋을 계산할 수 없다는 의미입니다.

이를 수행하는 두 가지 방법이 있습니다: 무차별 대입과 변형에 대한 사전 지식 수집.

무차별 대입은 모든 가능한 변형을 계산하고 여러 `getProgramAccount` 호출을 병렬로 실행해야 합니다. 크리에이터 배열에 최대 5명의 크리에이터와 `Collection` 이전의 두 `Option` 필드 각각에 대한 두 가지 가능한 옵션이 주어지면, 총 20가지 가능한 조합이 있어 이 접근법을 취하기 위해 다양한 오프셋으로 20개의 `getProgramAccount` 호출을 해야 합니다. 이는 명백히 실행 가능하거나 확장 가능한 접근법이 아닙니다.

그러나 컬렉션에 대한 일부 사전 정보가 알려져 있다면, 이는 더 적은 수의 호출로 줄일 수 있습니다. 크리에이터가 몇 명인지 아는 것이 가장 큰 이득이며, `getProgramAccount` 호출 수를 병렬로 실행할 수 있는 단 4개로 줄입니다.

이 접근법은 포함하는 엣지 케이스의 수가 많고 크리에이터가 한 명뿐이거나 크리에이터 수의 변형 수를 미리 알고 있는 컬렉션에서만 실용적으로 사용할 수 있다는 사실 때문에 권장되지 않습니다.

대신 트랜잭션 크롤링 접근법을 사용하는 것을 권장합니다.

## 트랜잭션 크롤링

트랜잭션 크롤링은 컬렉션 민트 주소와 연관된 모든 트랜잭션을 가져온 다음 이를 파싱하여 컬렉션을 생성하는 특정 명령어를 찾는 것을 포함합니다. 여기서 어떤 민트 계정이 컬렉션의 일부인지 결정할 수 있습니다.

이를 수행하는 알고리즘은 아래에 나와 있습니다:

- 컬렉션 민트 주소에 대해 `[getSignaturesForAddress](https://docs.solana.com/developing/clients/jsonrpc-api#getsignaturesforaddress)`를 호출하여 어떤 식으로든 컬렉션 민트 주소와 관련된 모든 트랜잭션 서명을 가져옵니다.
- 각 서명에 대해 `[getTransaction](https://docs.solana.com/developing/clients/jsonrpc-api#gettransaction)`을 호출하여 각 서명의 실제 트랜잭션 데이터를 가져옵니다.
- 트랜잭션을 파싱하여 프로그램 ID를 찾고 주소가 `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`인 `token-metadata` 프로그램과 관련되지 않은 것들을 필터링합니다.
- 검증된 컬렉션 멤버만 검색하고 싶으며, 컬렉션 멤버를 검증하는 `token-metadata`의 핸들러는 `verify_collection`과 `set_and_verify` 두 개뿐이며, 이들은 `MetadataInstruction` 열거형에서 각각 `18`과 `25` 위치를 가지며, base58 값으로는 `K`와 `S`입니다.
- `data` 값이 `K` 또는 `S`인 명령어만 필터링하여 해당 특정 `token-metadata` 핸들러만 가져오도록 합니다.
- 검증되는 `metadata` 주소는 이러한 핸들러 중 하나에 전달되는 첫 번째 계정이 됩니다.
- 중복을 방지하기 위해 `metadata` 주소를 `Set`에 추가합니다.

- 모든 `metadata` 주소가 발견되면, 이들을 반복하며 `getAccountInfo`를 호출하여 계정 데이터를 찾습니다.
    - 계정 데이터를 Metadata 구조체/객체로 역직렬화하고, `mint` 필드에서 민트 주소를 찾습니다. `mint` 주소를 Set에 추가합니다.
    - 이 최종 Set이 컬렉션의 모든 항목에 대한 민트 주소 목록입니다.

컬렉션 멤버를 가져오기 위한 트랜잭션 크롤링의 예제 Rust 및 TypeScript 코드는 [여기](https://github.com/metaplex-foundation/get-collection)에서 찾을 수 있습니다.