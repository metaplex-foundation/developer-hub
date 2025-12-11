---
title: Anchor에서 Metaplex Core 사용하기
metaTitle: Anchor에서 Metaplex Core 사용하기 | Core
description: Anchor 프로그램 내에서 Metaplex Core crate를 활용하는 방법을 알아보세요.
---

## 설치

Anchor 프로젝트에서 Core를 사용하기 시작하려면, 먼저 다음을 실행하여 프로젝트에 최신 버전의 crate를 추가했는지 확인하세요:

```rust
cargo add mpl-core
```

또는 cargo.toml 파일에서 수동으로 버전을 지정할 수 있습니다:

```rust
[dependencies]
mpl-core = "x.x.x"
```

### 기능 플래그

Core crate를 사용하면 `cargo.toml`의 종속성 항목을 수정하여 mpl-core crate에서 anchor 기능 플래그를 활성화하여 Anchor 특정 기능에 액세스할 수 있습니다:

```rust
[dependencies]
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
```

### Core Rust SDK 모듈

Core Rust SDK는 여러 모듈로 구성됩니다:

- `accounts`: 프로그램의 계정을 나타냅니다.
- `errors`: 프로그램의 오류를 열거합니다.
- `instructions`: 명령어, 명령어 인수 및 CPI 명령어의 생성을 용이하게 합니다.
- `types`: 프로그램에서 사용하는 타입을 나타냅니다.

다양한 명령어가 호출되고 사용되는 방법에 대한 자세한 정보는 [mpl-core docs.rs 웹사이트](https://docs.rs/mpl-core/0.7.2/mpl_core/)를 참조하거나 명령어에서 `cmd + left click` (mac) 또는 `ctrl + left click` (windows)를 사용하여 확장할 수 있습니다.

## 계정 역직렬화

### 역직렬화 가능한 계정

`mpl-core` crate 내에서 역직렬화를 위해 사용할 수 있는 계정 구조체는 다음과 같습니다:

```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```

Anchor 내에서 Core 계정을 역직렬화하는 방법에는 두 가지가 있습니다.

- Anchors Account 목록 구조체 사용 (대부분의 경우 권장),
- `<Account>::from_bytes()`를 사용하여 명령어 함수 본문에서 직접 사용.

### Anchor Accounts 목록 방법

`anchor flag`를 활성화하면 Anchor Accounts 목록 구조체에서 `BaseAssetV1`과 `BaseCollectionV1` 계정을 모두 직접 역직렬화할 수 있습니다:

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

### 계정 from_bytes() 방법

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

Asset 또는 Collection 계정 내의 개별 플러그인에 액세스하려면 `fetch_plugin()` 함수를 사용하세요. 이 함수는 플러그인 데이터 또는 하드 오류를 발생시키지 않고 `null` 응답을 반환하므로 데이터에 액세스하지 않고도 플러그인이 존재하는지 확인할 수 있습니다.

`fetch_plugin()` 함수는 Assets와 Collections 계정 모두에 사용되며 적절한 타이핑을 지정하여 모든 플러그인 타입을 처리할 수 있습니다. 플러그인 내부의 데이터에 액세스하려면 이 함수에서 반환되는 중간 값을 사용하세요.

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

## CPI 명령어 빌더

Core crate의 각 명령어에는 **CpiBuilder** 버전이 제공됩니다. CpiBuilder 버전은 `명령어 이름` + `CpiBuilder`를 사용하여 생성되며 많은 보일러플레이트 코드를 추상화하여 코드를 크게 단순화합니다!

Core에서 사용할 수 있는 모든 명령어에 대해 더 자세히 알아보려면 [mpl-core docs.rs 웹사이트](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/index.html)에서 찾을 수 있습니다.

### CPI 예시

`CreateCollectionV2CpiBuilder` 명령어를 예시로 살펴보겠습니다.

`CpiBuilder`에서 `new`를 호출하고 core 프로그램을 `AccountInfo`로 전달하여 빌더를 초기화합니다:

```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```

그런 다음 Cmd + left click (Windows 사용자의 경우 Ctrl + left click)을 사용하여 이 CPI 호출에 필요한 모든 CPI 인수를 확인합니다:

```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```