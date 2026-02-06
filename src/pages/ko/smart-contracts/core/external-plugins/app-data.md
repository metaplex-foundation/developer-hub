---
title: AppData 플러그인
metaTitle: AppData 플러그인 | Metaplex Core
description: AppData 플러그인으로 Core NFT에 임의의 데이터를 저장합니다. 서드파티 앱, 게임 상태 또는 커스텀 메타데이터를 위한 안전하고 분리된 저장소를 생성합니다.
updated: '01-31-2026'
keywords:
  - AppData plugin
  - NFT data storage
  - game state
  - on-chain storage
about:
  - Data storage
  - Third-party integration
  - Custom metadata
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: AppData와 Attributes 플러그인의 차이점은 무엇인가요?
    a: Attributes는 Update Authority가 제어하는 키-값 문자열을 저장합니다. AppData는 별도의 Data Authority가 제어하는 임의의 데이터를 저장하므로, 서드파티 애플리케이션에 이상적입니다.
  - q: 하나의 Asset에 여러 AppData 플러그인을 가질 수 있나요?
    a: 네. 각 AppData 플러그인은 서로 다른 Data Authority를 가질 수 있어, 여러 서드파티 앱이 동일한 Asset에 데이터를 저장할 수 있습니다.
  - q: 기존 AppData를 어떻게 업데이트하나요?
    a: 새 데이터로 writeData()를 호출합니다. 이는 기존 데이터를 완전히 대체합니다—부분 업데이트는 없습니다.
  - q: AppData가 DAS에 의해 인덱싱되나요?
    a: 네. JSON과 MsgPack 스키마는 자동으로 역직렬화되고 인덱싱됩니다. Binary는 base64로 저장됩니다.
  - q: LinkedAppData란 무엇인가요?
    a: LinkedAppData는 Collection에 추가되며 Data Authority가 각 Asset에 AppData를 개별적으로 추가하지 않고도 해당 Collection의 모든 Asset에 쓸 수 있게 합니다.
---
**AppData 플러그인**은 Core Asset에 안전하고 분리된 데이터 저장소를 제공합니다. 서드파티 애플리케이션은 Data Authority가 제어하는 독점적인 쓰기 접근 권한으로 임의의 데이터(JSON, MsgPack 또는 바이너리)를 저장하고 읽을 수 있습니다. {% .lead %}
{% callout title="배우게 될 내용" %}

- Asset과 Collection에 AppData 추가
- 안전한 쓰기를 위한 Data Authority 구성
- 데이터 스키마 선택 (JSON, MsgPack, Binary)
- 온체인 및 오프체인에서 데이터 읽고 쓰기
{% /callout %}

## 요약

**AppData** 플러그인은 제어된 쓰기 접근 권한으로 Asset에 임의의 데이터를 저장합니다. Data Authority만 플러그인의 데이터 섹션에 쓸 수 있어, 안전한 서드파티 통합을 가능하게 합니다.

- JSON, MsgPack 또는 Binary 데이터 저장
- Data Authority가 독점적인 쓰기 권한 보유
- DAS에 의해 자동 인덱싱 (JSON/MsgPack)
- Collection 전체 쓰기를 위한 LinkedAppData 변형

## 범위 외

Oracle 검증([Oracle 플러그인](/smart-contracts/core/external-plugins/oracle) 참조), 온체인 속성([Attributes 플러그인](/smart-contracts/core/plugins/attribute) 참조), 오프체인 메타데이터 저장.

## 빠른 시작

**바로 가기:** [Asset에 추가](#adding-the-appdata-plugin-to-an-asset) · [데이터 쓰기](#writing-data-to-the-appdata-plugin) · [데이터 읽기](#reading-data-from-the-appdata-plugin)

1. Data Authority 주소와 함께 AppData 플러그인 추가
2. 스키마 선택: JSON, MsgPack 또는 Binary
3. `writeData()`를 사용하여 데이터 쓰기 (Data Authority로 서명 필요)
4. DAS 또는 직접 계정 조회를 통해 데이터 읽기

## AppData 플러그인이란?

`AppData` 외부 플러그인은 `dataAuthority`가 쓸 수 있는 임의의 데이터를 저장하고 포함합니다. 이는 `ExternalRegistryRecord`에 저장된 전체 플러그인 권한과 다릅니다. 권한을 업데이트/취소하거나 플러그인의 다른 메타데이터를 변경할 수 없기 때문입니다.
`AppData`를 특정 권한만 변경하고 쓸 수 있는 Asset의 파티션 데이터 영역이라고 생각하세요.
이는 서드파티 사이트/앱이 제품/앱 내에서 특정 기능을 실행하는 데 필요한 데이터를 저장하는 데 유용합니다.

## 호환 대상

|                       |     |
| --------------------- | --- |
| MPL Core Asset        | ✅  |
| MPL Core Collection\* | ✅  |
\* MPL Core Collection은 `LinkedAppData` 플러그인과도 함께 작동할 수 있습니다.

## LinkedAppData 플러그인이란?

`LinkedAppData` 플러그인은 Collection용으로 제작되었습니다. Collection에 단일 플러그인 어댑터를 추가하여 Collection 내의 모든 Asset에 쓸 수 있게 합니다.

## 인수

| 인수          | 값                          |
| ------------- | --------------------------- |
| dataAuthority | PluginAuthority             |
| schema        | ExternalPluginAdapterSchema |

### dataAuthority

{% dialect-switcher title="AttributeList" %}
{% dialect title="JavaScript" id="js" %}

```ts
const dataAuthority = {
  type: 'Address',
  address: publicKey('11111111111111111111111111111111'),
}
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::{PluginAuthority}
let data_authority = Some(PluginAuthority::Address {address: authority.key()}),
```

{% /dialect %}
{% /dialect-switcher %}

### schema

스키마는 `AppData` 플러그인 내에 저장되는 데이터 유형을 결정합니다. 모든 스키마는 DAS에 의해 인덱싱됩니다.

| 인수              | DAS 지원 | 저장 형식 |
| ----------------- | -------- | --------- |
| Binary (원시 데이터) | ✅       | base64    |
| Json              | ✅       | json      |
| MsgPack           | ✅       | json      |
데이터 인덱싱 시 `JSON` 또는 `MsgPack` 스키마를 읽는 데 오류가 있으면 바이너리로 저장됩니다.
{% dialect-switcher title="AppData 플러그인에 데이터 쓰기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'
// Binary, Json 또는 MsgPack 중 선택
const schema = ExternalPluginAdapterSchema.Json
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// Binary, Json 또는 MsgPack 중 선택
let schema = ExternalPluginAdapterSchema::Json
```

{% /dialect %}
{% /dialect-switcher %}

## Asset에 AppData 플러그인 추가

{% dialect-switcher title="MPL Core Asset에 Attribute 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'
const assetSigner = generateSigner(umi);
const dataAuthority = publicKey('11111111111111111111111111111111')
await create(umi, {
  asset: asset.publicKey,
  name: "My Asset",
  uri: "https://example.com/my-assets.json"
  plugins: [
        {
            type: 'AppData',
            dataAuthority,
            schema: ExternalPluginAdapterSchema.Json,
        },
    ],
}).sendAndConfirm(umi)
// 또는 기존 Asset에 플러그인을 추가할 수 있습니다
await addPlugin(umi, {
  asset,
  plugin: {
        type: 'AppData',
        dataAuthority,
        schema: ExternalPluginAdapterSchema.Json,
    },
})
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddExternalPluginAdapterV1Builder,
    types::{Attribute, Attributes, Plugin,
    ExternalPluginAdapterInitInfo, AppDataInitInfo,
    PluginAuthority},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;
pub async fn add_app_data_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let add_external_plugin_app_data_ix = AddExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .payer(authority.publicKey())
        .init_info(ExternalPluginAdapterInitInfo::AppData(AppDataInitInfo {
            init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
            data_authority: PluginAuthority::Address {address: app_data_authority.key()},
            schema: None,
        }))
        .instruction();
    let signers = vec![&authority];
    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();
    let add_data_plugin_tx = Transaction::new_signed_with_payer(
        &[add_external_plugin_app_data_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );
    let res = rpc_client
        .send_and_confirm_transaction(&add_data_plugin_tx)
        .await
        .unwrap();
    println!("Signature: {:?}", res)
}
```

{% /dialect %}
{% /dialect-switcher %}

## AppData 플러그인에 데이터 쓰기

dataAuthority 주소만 `AppData` 플러그인에 데이터를 쓸 수 있습니다.
`AppData` 플러그인에 데이터를 쓰려면 다음 인수를 받는 `writeData()` 헬퍼를 사용합니다.

| 인수      | 값                                        |
| --------- | ----------------------------------------- |
| key       | { type: string, dataAuthority: publicKey} |
| authority | signer                                    |
| data      | 저장하려는 형식의 데이터                  |
| asset     | publicKey                                 |

### JSON 직렬화

{% dialect-switcher title="JSON 직렬화" %}
{% dialect title="JavaScript" id="js" %}

```ts
const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}
const data = new TextEncoder().encode(JSON.stringify(json))
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// 이것은 `serde`와 `serde_json` 크레이트를 사용합니다.
let struct_data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};
let data = serde_json::to_vec(&struct_data).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}

### MsgPack 직렬화

{% dialect-switcher title="MsgPack 직렬화" %}
{% dialect title="JavaScript" id="js" %}

```ts
// 이 구현은 직렬화에 `msgpack-lite`를 사용합니다
const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}
const data = msgpack.encode(json)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// 이것은 `serde`와 `rmp-serde` 크레이트를 사용합니다.
let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};
let data = rmp_serde::to_vec(&data).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}

### Binary 직렬화

Binary는 임의의 데이터를 저장할 수 있으므로 데이터를 직렬화하고 역직렬화하는 방법은 여러분이 결정합니다.
{% dialect-switcher title="Binary 직렬화" %}
{% dialect title="JavaScript" id="js" %}

```ts
// 아래 예제는 `true` 또는 `false`로 간주되는 바이트를 생성합니다.
const data = new Uint8Array([1, 0, 0, 1, 0])
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// 이 예제는 `bincode`로 Rust 구조체를 직렬화하는 방법을 보여줍니다.
let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};
let data = bincode::serialize(&data).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}

### 데이터 쓰기

{% dialect-switcher title="MPL Core Asset에 Attribute 플러그인 추가" %}
{% dialect title="JavaScript" id="js" %}

```ts
await writeData(umi, {
  key: {
    type: 'AppData',
    dataAuthority,
  },
  authority: dataAuthoritySigner,
  data: data,
  asset: asset.publicKey,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
/// ### 계정:
///
///   0. `[writable]` asset
///   1. `[writable, optional]` collection
///   2. `[writable, signer]` payer
///   3. `[signer, optional]` authority
///   4. `[optional]` buffer
///   5. `[]` system_program
///   6. `[optional]` log_wrapper
// 저장을 위해 데이터(Binary, Json, MsgPack)를 바이트로 변환해야 합니다.
// 선택한 스키마에 따라 여러 가지 방법으로 이를 달성할 수 있습니다.
let write_to_app_data_plugin_ix = WriteExternalPluginAdapterDataV1CpiBuilder::new()
    .asset(asset)
    .collection(collection)
    .payer(payer)
    .authority(authority)
    .buffer(None)
    .system_program(system_program)
    .log_wrapper(None)
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address {address: plugin_authority.key()}))
    .data(data)
    .instruction()
```

{% /dialect %}
{% /dialect-switcher %}

## AppData 플러그인에서 데이터 읽기

데이터는 온체인 프로그램과 계정 데이터를 가져오는 외부 소스 모두에서 읽을 수 있습니다.

### 원시 데이터 가져오기

`AppData` 플러그인에 저장된 데이터를 역직렬화하는 첫 번째 단계는 원시 데이터를 가져오고 직렬화 전에 데이터가 저장된 형식을 나타내는 스키마 필드를 확인하는 것입니다.
{% dialect-switcher title="AppData 원시 데이터 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
const assetId = publicKey('11111111111111111111111111111111')
const dataAuthority = publicKey('33333333333333333333333333333333')
const asset = await fetchAsset(umi, assetId)
let appDataPlugin = asset.appDatas?.filter(
  (appData) => (appData.authority.address = dataAuthority)
)
let data
let schema
// 주어진 권한을 가진 `AppData` 플러그인이 존재하는지 확인
if (appDataPlugin && appDataPlugin.length > 0) {
  // 플러그인 데이터를 `data`에 저장
  data = appDataPlugin[0].data
  // 플러그인 스키마를 `schema`에 저장
  schema = appDataPlugin[0].schema
}
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
let plugin_authority = ctx.accounts.authority.key();
let asset = BaseAssetV1::from_bytes(&data).unwrap();
// 플러그인의 Authority를 기반으로 `AppData` 플러그인을 가져옵니다.
let plugin_key = ExternalPluginAdapterKey::AppData(PluginAuthority::Address {
    address: plugin_authority });
let app_data_plugin = fetch_external_plugin_adapter::<BaseAssetV1, AppData>(
        &account_info,
        Some(&base_asset),
        &plugin_key,
    )
    .unwrap();
let (data_offset, data_length) =
        fetch_external_plugin_adapter_data_info(&account_info, Some(&asset), &plugin_key)
            .unwrap();
// account_info에서 app_data 데이터 가져오기
let data = account_info.data.borrow()[data_offset..data_offset + data_length].to_vec();
```

{% /dialect %}
{% /dialect-switcher %}

### 역직렬화

이제 데이터가 있으면 `AppData` 플러그인에 데이터를 쓸 때 선택한 스키마에 따라 데이터를 역직렬화해야 합니다.

#### JSON 스키마 역직렬화

{% dialect-switcher title="JSON 역직렬화" %}
{% dialect title="JavaScript" id="js" %}

```ts
// JS SDK로 인해 MsgPack 스키마의 역직렬화는 자동이며 역직렬화된
// 데이터는 위의 RAW 위치 예제에서 접근할 수 있습니다.
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// `JSON` 스키마의 경우 `serde`와 `serde_json` 크레이트를 사용해야 합니다.
// 구조체의 `derive` 매크로에 `Serialize`와 `Deserialize`를 추가해야 합니다.
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}
let my_data: MyData = serde_json::from_slice(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}
{% /dialect-switcher %}

#### MsgPack 스키마 역직렬화

{% dialect-switcher title="MsgPack 역직렬화" %}
{% dialect title="JavaScript" id="js" %}

```ts
// JS SDK로 인해 MsgPack 스키마의 역직렬화는 자동이며 역직렬화된
// 데이터는 위의 RAW 위치 예제에서 접근할 수 있습니다.
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
// `MsgPack` 스키마의 경우 `serde`와 `rmp_serde` 크레이트를 사용해야 합니다.
// 구조체의 `derive` 매크로에 `Serialize`와 `Deserialize`를 추가해야 합니다.
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}
let my_data: MyData = rmp_serde::decode::from_slice(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}
{% /dialect-switcher %}

#### Binary 스키마 역직렬화

**Binary** 스키마는 임의의 데이터이기 때문에 역직렬화는 사용한 직렬화에 따라 달라집니다.
{% dialect-switcher title="Binary 역직렬화" %}
{% dialect title="JavaScript" id="js" %}

```js
// 바이너리 데이터는 임의이므로 앱/웹사이트가 이해할 수 있는
// 사용 가능한 형식으로 데이터를 파싱하려면 자체 역직렬화기를 포함해야 합니다.
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}
// 아래 예제에서는 `bincode` 크레이트를 사용하여
// 구조체로 역직렬화하는 것을 살펴봅니다.
let my_data: MyData = bincode::deserialize(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}
{% /dialect-switcher %}

## 일반적인 오류

### `Authority mismatch`

Data Authority만 데이터를 쓸 수 있습니다. 올바른 키페어로 서명하고 있는지 확인하세요.

### `Data too large`

데이터가 계정 크기 제한을 초과합니다. 데이터를 압축하거나 여러 플러그인에 분할하는 것을 고려하세요.

### `Invalid schema`

데이터가 선언된 스키마와 일치하지 않습니다. JSON이 유효하거나 MsgPack이 올바르게 인코딩되었는지 확인하세요.

## 참고 사항

- Data Authority는 플러그인 권한과 별개입니다
- DAS 인덱싱을 위해 JSON 또는 MsgPack 선택
- 커스텀 직렬화 형식을 위한 Binary 스키마
- LinkedAppData는 Collection 내의 모든 Asset에 쓸 수 있게 합니다

## 빠른 참조

### 스키마 비교

| 스키마 | DAS 인덱싱 | 최적 용도 |
|--------|------------|-----------|
| JSON | ✅ JSON으로 | 사람이 읽기 쉬움, 웹 앱 |
| MsgPack | ✅ JSON으로 | 컴팩트, 타입 데이터 |
| Binary | ✅ base64로 | 커스텀 형식, 최대 효율 |

### AppData vs Attributes 플러그인

| 기능 | AppData | Attributes |
|------|---------|------------|
| 쓰기 권한 | Data Authority만 | Update Authority |
| 데이터 형식 | 모두 (JSON, MsgPack, Binary) | 키-값 문자열 |
| 서드파티 친화적 | ✅ 예 | ❌ Update Authority 필요 |
| DAS 인덱싱 | ✅ 예 | ✅ 예 |

## FAQ

### AppData와 Attributes 플러그인의 차이점은 무엇인가요?

Attributes는 Update Authority가 제어하는 키-값 문자열을 저장합니다. AppData는 별도의 Data Authority가 제어하는 임의의 데이터를 저장하므로, 서드파티 애플리케이션에 이상적입니다.

### 하나의 Asset에 여러 AppData 플러그인을 가질 수 있나요?

네. 각 AppData 플러그인은 서로 다른 Data Authority를 가질 수 있어, 여러 서드파티 앱이 동일한 Asset에 데이터를 저장할 수 있습니다.

### 기존 AppData를 어떻게 업데이트하나요?

새 데이터로 `writeData()`를 호출합니다. 이는 기존 데이터를 완전히 대체합니다—부분 업데이트는 없습니다.

### AppData가 DAS에 의해 인덱싱되나요?

네. JSON과 MsgPack 스키마는 자동으로 역직렬화되고 인덱싱됩니다. Binary는 base64로 저장됩니다.

### LinkedAppData란 무엇인가요?

LinkedAppData는 Collection에 추가되며 Data Authority가 각 Asset에 AppData를 개별적으로 추가하지 않고도 해당 Collection의 모든 Asset에 쓸 수 있게 합니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **AppData** | Asset에 임의의 데이터를 저장하기 위한 외부 플러그인 |
| **Data Authority** | 독점적인 쓰기 권한을 가진 주소 |
| **LinkedAppData** | 모든 Asset에 쓸 수 있는 Collection 수준 변형 |
| **Schema** | 데이터 형식: JSON, MsgPack 또는 Binary |
| **writeData()** | AppData 플러그인에 데이터를 쓰는 함수 |

## 관련 페이지

- [외부 플러그인 개요](/smart-contracts/core/external-plugins/overview) - 외부 플러그인 이해하기
- [Oracle 플러그인](/smart-contracts/core/external-plugins/oracle) - 데이터 저장 대신 검증
- [Attributes 플러그인](/smart-contracts/core/plugins/attribute) - 내장 키-값 저장소
- [온체인 티켓팅 가이드](/smart-contracts/core/guides/onchain-ticketing-with-appdata) - AppData 예제
