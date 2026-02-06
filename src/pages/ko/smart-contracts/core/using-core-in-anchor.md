---
title: Anchor에서 Metaplex Core 사용하기
metaTitle: Anchor에서 Metaplex Core 사용하기 | Metaplex Core
description: Metaplex Core를 Anchor 프로그램에 통합합니다. 온체인 NFT 작업을 위한 CPI 호출, 계정 역직렬화 및 플러그인 액세스를 배웁니다.
updated: '01-31-2026'
keywords:
  - Core Anchor
  - mpl-core CPI
  - Anchor NFT
  - on-chain Core
about:
  - Anchor integration
  - CPI patterns
  - On-chain development
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
faqs:
  - q: anchor 기능 플래그가 필요한가요?
    a: 예, Accounts 구조체에서 직접 역직렬화하려면 필요합니다. 없으면 from_bytes()를 수동으로 사용하세요.
  - q: 플러그인이 존재하는지 어떻게 확인하나요?
    a: Option을 반환하는 fetch_plugin()을 사용하세요 - 플러그인이 존재하지 않아도 오류가 발생하지 않습니다.
  - q: 외부 플러그인(Oracle, AppData)에 액세스할 수 있나요?
    a: 예. 적절한 키와 함께 fetch_plugin() 대신 fetch_external_plugin()을 사용하세요.
  - q: 사용 가능한 모든 명령은 어디에서 찾을 수 있나요?
    a: 전체 API 참조는 mpl-core docs.rs 명령 모듈을 참조하세요.
---
Anchor를 사용하여 Core Asset과 상호 작용하는 **온체인 프로그램**을 구축합니다. 이 가이드는 설치, 계정 역직렬화, 플러그인 액세스 및 CPI 패턴을 다룹니다. {% .lead %}
{% callout title="배우게 될 내용" %}

- Anchor 프로젝트에서 mpl-core 설치 및 구성
- 프로그램에서 Core Asset 및 Collection 역직렬화
- 플러그인 데이터(Attributes, Freeze 등) 액세스
- Asset 생성, 전송 및 관리를 위한 CPI 호출
{% /callout %}

## 요약

`mpl-core` Rust 크레이트는 Anchor 프로그램에서 Core와 상호 작용하는 데 필요한 모든 것을 제공합니다. 네이티브 Anchor 계정 역직렬화를 위해 `anchor` 기능 플래그를 활성화하세요.

- `features = ["anchor"]`와 함께 `mpl-core` 추가
- Accounts 구조체에서 Asset/Collection 역직렬화
- 플러그인 데이터를 읽으려면 `fetch_plugin()` 사용
- CPI 빌더로 명령 호출 단순화

## 범위 외

클라이언트 측 JavaScript SDK([JavaScript SDK](/smart-contracts/core/sdk/javascript) 참조), 독립 실행형 Rust 클라이언트([Rust SDK](/smart-contracts/core/sdk/rust) 참조), 클라이언트에서 Core Asset 생성.

## 빠른 시작

**바로가기:** [설치](#설치) · [계정 역직렬화](#계정-역직렬화) · [플러그인 액세스](#플러그인-역직렬화) · [CPI 예제](#cpi-명령-빌더)

1. Cargo.toml에 `mpl-core = { version = "x.x.x", features = ["anchor"] }` 추가
2. `Account<'info, BaseAssetV1>`로 Asset 역직렬화
3. `fetch_plugin::<BaseAssetV1, PluginType>()`으로 플러그인 액세스
4. `CreateV2CpiBuilder`, `TransferV1CpiBuilder` 등으로 CPI 호출

## 설치

Anchor 프로젝트에서 Core를 사용하려면 먼저 다음을 실행하여 프로젝트에 최신 버전의 크레이트를 추가했는지 확인하세요:

```rust
cargo add mpl-core
```

또는 cargo.toml 파일에서 버전을 수동으로 지정할 수 있습니다:

```rust
[dependencies]
mpl-core = "x.x.x"
```

### 기능 플래그

Core 크레이트를 사용하면 `cargo.toml`의 종속성 항목을 수정하여 mpl-core 크레이트에서 anchor 기능 플래그를 활성화하여 Anchor 전용 기능에 액세스할 수 있습니다:

```rust
[dependencies]
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
```

### Core Rust SDK 모듈

Core Rust SDK는 여러 모듈로 구성됩니다:

- `accounts`: 프로그램의 계정을 나타냅니다.
- `errors`: 프로그램의 오류를 열거합니다.
- `instructions`: 명령, 명령 인수 및 CPI 명령 생성을 용이하게 합니다.
- `types`: 프로그램에서 사용되는 유형을 나타냅니다.
다양한 명령이 호출되고 사용되는 방법에 대한 자세한 정보는 [mpl-core docs.rs 웹사이트](https://docs.rs/mpl-core/0.7.2/mpl_core/)를 참조하거나 명령에서 `cmd + 왼쪽 클릭`(mac) 또는 `ctrl + 왼쪽 클릭`(windows)을 사용하여 확장할 수 있습니다.

## 계정 역직렬화

### 역직렬화 가능한 계정

`mpl-core` 크레이트 내에서 다음 계정 구조체를 역직렬화할 수 있습니다:

```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```

Anchor 내에서 Core 계정을 역직렬화하는 두 가지 방법이 있습니다.

- Anchor의 Account 목록 구조체 사용(대부분의 경우 권장),
- `<Account>::from_bytes()`를 사용하여 명령 함수 본문에서 직접.

### Anchor Accounts 목록 방법

`anchor 플래그`를 활성화하면 Anchor Accounts 목록 구조체에서 `BaseAssetV1` 및 `BaseCollectionV1` 계정을 직접 역직렬화할 수 있습니다:
{% dialect-switcher title="계정 역직렬화" %}
{% dialect title="Asset" id="asset" %}

```rust
#[derive(Accounts)]
pub struct ExampleAccountStruct<'info> {
    ...
    pub asset: Account<'info, BaseAssetV1>,
}
```

{% /dialect %}
{% dialect title="Collection" id="collection" %}

```rust
#[derive(Accounts)]
pub struct ExampleAccountStruct<'info> {
    ...
    pub collection: Account<'info, BaseCollectionV1>,
}
```

{% /dialect %}
{% /dialect-switcher %}

### Account from_bytes() 방법

`try_borrow_data()` 함수를 사용하여 asset/collection 계정 내부의 데이터를 빌려오고 해당 바이트에서 asset/collection 구조체를 생성합니다:
{% dialect-switcher title="계정 역직렬화" %}
{% dialect title="Asset" id="asset" %}

```rust
let data = ctx.accounts.asset.try_borrow_data()?;
let base_asset: BaseAssetV1 = BaseAssetV1::from_bytes(&data.as_ref())?;
```

{% /dialect %}
{% dialect title="Collection" id="collection" %}

```rust
let data = ctx.accounts.collectino.try_borrow_data()?;
let base_collection: BaseCollectionV1 = BaseCollectionV1::from_bytes(&data.as_ref())?;
```

{% /dialect %}
{% /dialect-switcher %}

### 플러그인 역직렬화

Asset 또는 Collection 계정 내의 개별 플러그인에 액세스하려면 `fetch_plugin()` 함수를 사용하세요. 이 함수는 하드 오류를 발생시키지 않고 플러그인 데이터 또는 `null` 응답을 반환하므로 데이터에 액세스하지 않고도 플러그인이 존재하는지 확인할 수 있습니다.
`fetch_plugin()` 함수는 Asset 및 Collection 계정 모두에 사용되며 적절한 타이핑을 지정하여 모든 플러그인 유형을 처리할 수 있습니다. 플러그인 내부의 데이터에 액세스하려면 이 함수가 반환하는 중간 값을 사용하세요.
{% dialect-switcher title="플러그인 역직렬화" %}
{% dialect title="Asset" id="asset" %}

```rust
let (_, attribute_list, _) = fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)?;
```

{% /dialect %}
{% dialect title="Collection" id="collection" %}

```rust
let (_, attribute_list, _) = fetch_plugin::<BaseCollectionV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)?;
```

{% /dialect %}
{% /dialect-switcher %}
**참고**: `fetch_plugin()` 함수는 비외부 플러그인에만 사용됩니다. 외부 플러그인을 읽으려면 `fetch_plugin()`과 동일한 방식으로 작동하는 `fetch_external_plugin()` 함수를 사용하세요.

## CPI 명령 빌더

Core 크레이트의 각 명령에는 **CpiBuilder** 버전이 있습니다. CpiBuilder 버전은 `명령 이름` + `CpiBuilder`를 사용하여 생성되며 많은 상용구 코드를 추상화하여 코드를 크게 단순화합니다!
Core에서 사용 가능한 모든 명령에 대해 자세히 알아보려면 [mpl-core docs.rs 웹사이트](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/index.html)에서 찾을 수 있습니다.

### CPI 예제

`CreateCollectionV2CpiBuilder` 명령을 예로 들어보겠습니다.
`CpiBuilder`에서 `new`를 호출하고 core 프로그램을 `AccountInfo`로 전달하여 빌더를 초기화합니다:

```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```

그런 다음 Cmd + 왼쪽 클릭(Windows 사용자는 Ctrl + 왼쪽 클릭)을 사용하여 이 CPI 호출에 필요한 모든 CPI 인수를 확인합니다:

```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```

## 일반적인 오류

### `AccountNotInitialized`

Asset 또는 Collection 계정이 존재하지 않거나 아직 생성되지 않았습니다.

### `PluginNotFound`

가져오려는 플러그인이 Asset에 존재하지 않습니다. 안전하게 `None`을 반환하는 `fetch_plugin()`으로 확인하세요.

### `InvalidAuthority`

서명자에게 이 작업에 대한 권한이 없습니다. 올바른 authority가 서명하고 있는지 확인하세요.

## 참고 사항

- 네이티브 역직렬화를 위해 항상 `features = ["anchor"]` 활성화
- 기본 제공 플러그인에는 `fetch_plugin()`, 외부 플러그인에는 `fetch_external_plugin()` 사용
- CPI 빌더는 계정 순서 복잡성을 추상화
- 전체 API 참조는 [docs.rs/mpl-core](https://docs.rs/mpl-core/) 확인

## 빠른 참조

### 일반적인 CPI 빌더

| 작업 | CPI 빌더 |
|-----------|-------------|
| Asset 생성 | `CreateV2CpiBuilder` |
| Collection 생성 | `CreateCollectionV2CpiBuilder` |
| Asset 전송 | `TransferV1CpiBuilder` |
| Asset 소각 | `BurnV1CpiBuilder` |
| Asset 업데이트 | `UpdateV1CpiBuilder` |
| 플러그인 추가 | `AddPluginV1CpiBuilder` |
| 플러그인 업데이트 | `UpdatePluginV1CpiBuilder` |

### 계정 유형

| 계정 | 구조체 |
|---------|--------|
| Asset | `BaseAssetV1` |
| Collection | `BaseCollectionV1` |
| Hashed Asset | `HashedAssetV1` |
| Plugin Header | `PluginHeaderV1` |
| Plugin Registry | `PluginRegistryV1` |

## FAQ

### anchor 기능 플래그가 필요한가요?

예, Accounts 구조체에서 직접 역직렬화하려면 필요합니다. 없으면 `from_bytes()`를 수동으로 사용하세요.

### 플러그인이 존재하는지 어떻게 확인하나요?

`Option`을 반환하는 `fetch_plugin()`을 사용하세요 - 플러그인이 존재하지 않아도 오류가 발생하지 않습니다.

### 외부 플러그인(Oracle, AppData)에 액세스할 수 있나요?

예. 적절한 키와 함께 `fetch_plugin()` 대신 `fetch_external_plugin()`을 사용하세요.

### 사용 가능한 모든 명령은 어디에서 찾을 수 있나요?

[mpl-core docs.rs 명령 모듈](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)을 참조하세요.

## 용어집

| 용어 | 정의 |
|------|------------|
| **CPI** | Cross-Program Invocation - 한 프로그램에서 다른 프로그램 호출 |
| **CpiBuilder** | CPI 호출 구성을 위한 헬퍼 구조체 |
| **BaseAssetV1** | 역직렬화를 위한 Core Asset 계정 구조체 |
| **fetch_plugin()** | 계정에서 플러그인 데이터를 읽는 함수 |
| **anchor feature** | Anchor 네이티브 역직렬화를 활성화하는 Cargo 기능 |

## 관련 페이지

- [Anchor 스테이킹 예제](/smart-contracts/core/guides/anchor/anchor-staking-example) - 완전한 스테이킹 프로그램
- [Anchor로 Asset 생성](/smart-contracts/core/guides/anchor/how-to-create-a-core-nft-asset-with-anchor) - 단계별 가이드
- [Rust SDK](/smart-contracts/core/sdk/rust) - 독립 실행형 Rust 클라이언트 사용
- [mpl-core docs.rs](https://docs.rs/mpl-core/) - 전체 API 참조
