---
title: Anchor로 Core 컬렉션 만드는 방법
metaTitle: Anchor로 Core 컬렉션 만드는 방법 | Core 가이드
description: Anchor를 사용하여 Metaplex Core로 Solana에서 Core 컬렉션을 만드는 방법을 알아보세요!
# remember to update dates also in /components/guides/index.js
created: '08-21-2024'
updated: '08-21-2024'
---

이 가이드는 **Solana** 프로그램에서 **Anchor** 프레임워크를 사용하여 CPI를 통해 **Core NFT 컬렉션**을 생성하기 위한 `mpl-core` Rust SDK 크레이트의 사용을 보여줍니다.

{% callout title="Core란 무엇인가요?" %}

**Core**는 단일 계정 설계를 사용하여 대안과 비교해 민팅 비용을 줄이고 Solana 네트워크 부하를 개선합니다. 또한 개발자가 자산의 동작과 기능을 수정할 수 있는 유연한 플러그인 시스템을 가지고 있습니다.

{% /callout %}

하지만 시작하기 전에 컬렉션에 대해 이야기해봅시다:

{% callout title="컬렉션이란 무엇인가요?" %}

컬렉션은 함께 속하는 자산들의 그룹으로, 같은 시리즈나 그룹의 일부입니다. 자산들을 그룹화하려면 먼저 컬렉션 이름과 컬렉션 이미지와 같은 해당 컬렉션과 관련된 메타데이터를 저장하는 목적의 컬렉션 자산을 만들어야 합니다. 컬렉션 자산은 컬렉션의 표지 역할을 하며 컬렉션 전체 플러그인도 저장할 수 있습니다.

{% /callout %}

## 전제 조건

- 선택한 코드 에디터(**Rust Analyzer 플러그인**이 있는 **Visual Studio Code** 권장)
- Anchor **0.30.1** 이상.

## 초기 설정

이 가이드에서는 **Anchor**를 사용하여 모든 필요한 매크로가 `lib.rs` 파일에서 찾을 수 있는 모노파일 접근법을 활용합니다:
- `declare_id`: 프로그램의 온체인 주소를 지정합니다.
- `#[program]`: 프로그램의 명령어 로직을 포함하는 모듈을 지정합니다.
- `#[derive(Accounts)]`: 명령어에 필요한 계정 목록을 나타내기 위해 구조체에 적용됩니다.
- `#[account]`: 프로그램에 특정한 사용자 정의 계정 유형을 생성하기 위해 구조체에 적용됩니다.

**참고**: 필요에 따라 함수를 수정하고 이동해야 할 수 있습니다.

### 프로그램 초기화

`avm` (Anchor Version Manager)을 사용하여 새 프로젝트를 초기화하는 것으로 시작합니다(선택사항). 초기화하려면 터미널에서 다음 명령어를 실행하세요.

```
anchor init create-core-collection-example
```

### 필요한 크레이트

이 가이드에서는 `anchor` 기능이 활성화된 `mpl_core` 크레이트를 사용합니다. 설치하려면 먼저 `create-core-collection-example` 디렉토리로 이동하세요:

```
cd create-core-collection-example
```

그런 다음 다음 명령어를 실행하세요:

```
cargo add mpl-core --features anchor
```

## 프로그램

### 임포트 및 템플릿

여기서는 이 특정 가이드에 대한 모든 임포트를 정의하고 `lib.rs` 파일에서 Account 구조체와 명령어에 대한 템플릿을 생성합니다.

```rust
use anchor_lang::prelude::*;

use mpl_core::{
    ID as MPL_CORE_ID,
    instructions::CreateCollectionV2CpiBuilder,
};

declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCollectionArgs {

}

#[program]
pub mod create_core_collection_example {
    use super::*;

    pub fn create_core_collection(ctx: Context<CreateCollection>, args: CreateCollectionArgs) -> Result<()> {

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {

}
```

### Args 구조체 생성

함수를 체계적으로 유지하고 너무 많은 매개변수로 인한 혼란을 피하기 위해, 구조화된 형식을 통해 모든 입력을 전달하는 것이 표준 관행입니다. 이는 인수 구조체(`CreateCollectionArgs`)를 정의하고 `AnchorDeserialize` 및 `AnchorSerialize`를 파생하여 달성되며, 이를 통해 구조체를 NBOR을 사용하여 바이너리 형식으로 직렬화하고 **Anchor**에서 읽을 수 있게 합니다.

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCollectionArgs {
    name: String,
    uri: String,
}
```

이 `CreateCollectionArgs` 구조체에서 **name** 및 **uri** 필드가 입력으로 제공되며, 이는 **Core 컬렉션**을 생성하는 데 사용되는 `CreateCollectionV2CpiBuilder` 명령어의 인수 역할을 합니다.

**참고**: 이것은 Anchor 중심 가이드이므로 여기서 Uri를 생성하는 방법은 포함하지 않습니다. 확실하지 않다면 [이 예제](/core/guides/javascript/how-to-create-a-core-collection-with-javascript#creating-the-metadata-for-the-collection)를 참조하세요.

### Account 구조체 생성

`Account` 구조체는 명령어가 예상하는 계정들을 정의하고 이러한 계정들이 충족해야 하는 제약조건을 지정하는 곳입니다. 이는 **타입**과 **제약조건**이라는 두 가지 주요 구성요소를 사용하여 수행됩니다.

**계정 타입**

각 타입은 프로그램 내에서 특정 목적을 제공합니다:
- **Signer**: 계정이 트랜잭션에 서명했는지 확인합니다.
- **Option**: 제공될 수도 있고 제공되지 않을 수도 있는 선택적 계정을 허용합니다.
- **Program**: 계정이 특정 프로그램인지 확인합니다.

**제약조건**

계정 타입이 기본 검증을 처리하지만, 프로그램에 필요한 모든 보안 검사에는 충분하지 않습니다. 여기서 제약조건이 중요한 역할을 합니다.

제약조건은 추가 검증 로직을 추가합니다. 예를 들어, `#[account(mut)]` 제약조건은 `collection` 및 `payer` 계정이 변경 가능하도록 설정되어 명령어 중에 이러한 계정 내의 데이터가 수정될 수 있음을 의미합니다.

```rust
#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(mut)]
    pub collection: Signer<'info>,
    /// CHECK: this account will be checked by the mpl_core program
    pub update_authority: Option<UncheckedAccount<'info>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    /// CHECK: this account is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,
}
```

`CreateCollection` 구조체의 일부 계정은 `optional`로 표시됩니다. 이는 `CreateCollectionV2CpiBuilder`의 정의에서 특정 계정들이 생략될 수 있기 때문입니다.

```rust
/// ### Accounts:
///
///   0. `[writable, signer]` collection
///   1. `[optional]` update_authority
///   2. `[writable, signer]` payer
///   3. `[]` system_program
```

예제를 가능한 한 유연하게 만들기 위해, 프로그램 명령어의 모든 `optional` 계정은 `create_core_collection` 명령어의 계정 구조체에서도 `optional`로 처리됩니다.

### 명령어 생성

`create_core_collection` 함수는 앞서 정의한 `CreateCollection` 계정 구조체와 `CreateCollectionArgs` 인수 구조체의 입력을 활용하여 `CreateCollectionV2CpiBuilder` 프로그램 명령어와 상호작용합니다.

```rust
pub fn create_core_collection(ctx: Context<CreateCollection>, args: CreateCollectionArgs) -> Result<()> {
  let update_authority = match &ctx.accounts.update_authority {
      Some(update_authority) => Some(update_authority.to_account_info()),
      None => None,
  };

  CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
      .collection(&ctx.accounts.collection.to_account_info())
      .payer(&ctx.accounts.payer.to_account_info())
      .update_authority(update_authority.as_ref())
      .system_program(&ctx.accounts.system_program.to_account_info())
      .name(args.name)
      .uri(args.uri)
      .invoke()?;

  Ok(())
}
```

이 함수에서 `CreateCollection` 구조체에 정의된 계정들은 `ctx.accounts`를 사용하여 액세스됩니다. 이러한 계정들을 `CreateCollectionV2CpiBuilder` 프로그램 명령어에 전달하기 전에 `.to_account_info()` 메서드를 사용하여 원시 데이터 형식으로 변환해야 합니다.

이 변환은 빌더가 Solana 런타임과 올바르게 상호작용하기 위해 이 형식의 계정을 필요로 하기 때문에 필요합니다.

`CreateAsset` 구조체의 일부 계정은 `optional`이므로 값이 `Some(account)` 또는 `None`일 수 있습니다. 이러한 선택적 계정들을 빌더에 전달하기 전에 처리하기 위해, 계정이 존재하는지(Some) 또는 없는지(None) 확인하고 이 확인에 따라 계정이 존재하면 `Some(account.to_account_info())`로, 존재하지 않으면 `None`으로 바인딩하는 match 문을 사용합니다. 다음과 같이:

```rust
let update_authority = match &ctx.accounts.update_authority {
    Some(update_authority) => Some(update_authority.to_account_info()),
    None => None,
};
```

모든 필요한 계정을 준비한 후, `CreateCollectionV2CpiBuilder`에 전달하고 `.invoke()`를 사용하여 명령어를 실행하거나 signer seed를 사용해야 하는 경우 `.invoke_signed()`를 사용합니다.

Metaplex CPI Builder의 작동 방식에 대한 자세한 내용은 이 [문서](/guides/rust/how-to-cpi-into-a-metaplex-program#using-metaplex-rust-transaction-cpi-builders)를 참조할 수 있습니다.

### 추가 작업

계속하기 전에, `FreezeDelegate` 플러그인이나 `AppData` 외부 플러그인과 같은 플러그인 및/또는 외부 플러그인이 이미 포함된 상태로 자산을 생성하려면 어떻게 해야 할까요? 방법은 다음과 같습니다.

먼저 필요한 모든 추가 임포트를 추가해봅시다:

```rust
use mpl_core::types::{
    Plugin, FreezeDelegate, PluginAuthority,
    ExternalPluginAdapterInitInfo, AppDataInitInfo,
    ExternalPluginAdapterSchema
};
```

그런 다음 플러그인과 외부 플러그인 어댑터를 보관할 벡터를 생성하여 올바른 임포트를 사용하여 플러그인(또는 더 많은)을 쉽게 추가할 수 있도록 합니다:

```rust
let mut plugins: Vec<PluginAuthorityPair> = vec![];

plugins.push(
  PluginAuthorityPair {
      plugin: Plugin::FreezeDelegate(FreezeDelegate {frozen: true}),
      authority: Some(PluginAuthority::UpdateAuthority)
  }
);

let mut external_plugin_adapters: Vec<ExternalPluginAdapterInitInfo> = vec![];

external_plugin_adapters.push(
  ExternalPluginAdapterInitInfo::AppData(
    AppDataInitInfo {
      init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
      data_authority: PluginAuthority::Address{ address: data_authority },
      schema: Some(ExternalPluginAdapterSchema::Binary),
    }
  )
);
```

마지막으로, 이러한 플러그인들을 다음과 같이 `CreateCollectionV2CpiBuilder` 프로그램 명령어에 통합해봅시다:

```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
  .collection(&ctx.accounts.collection.to_account_info())
  .payer(&ctx.accounts.payer.to_account_info())
  .update_authority(update_authority.as_ref())
  .system_program(&ctx.accounts.system_program.to_account_info())
  .name(args.name)
  .uri(args.uri)
  .plugins(plugins)
  .external_plugin_adapters(external_plugin_adapters)
  .invoke()?;
```

**참고**: 사용할 필드와 플러그인에 대해 확실하지 않다면 [문서](/core/plugins)를 참조하세요!

## 클라이언트

이제 Core 컬렉션 생성을 위한 가이드의 "테스트" 부분에 도달했습니다. 하지만 구축한 프로그램을 테스트하기 전에 작업공간을 컴파일해야 합니다. 배포와 테스트를 위해 모든 것을 준비하려면 다음 명령어를 사용하세요:

```
anchor build
```

빌드 후, 스크립트로 액세스할 수 있도록 프로그램을 배포해야 합니다. `anchor.toml` 파일에서 프로그램을 배포할 클러스터를 설정하고 다음 명령어를 사용할 수 있습니다:

```
anchor deploy
```

마지막으로 프로그램을 테스트할 준비가 되었지만, 그 전에 tests 폴더의 `create_core_collection_example.ts`를 작업해야 합니다.

### 임포트 및 템플릿

다음은 테스트에 필요한 모든 임포트와 일반 템플릿입니다.

```ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CreateCoreCollectionExample } from "../target/types/create_core_collection_example";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

describe("create-core-asset-example", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const wallet = anchor.Wallet.local();
  const program = anchor.workspace.CreateCoreCollectionExample as Program<CreateCoreCollectionExample>;

  let collection = Keypair.generate();

  it("Create Collection", async () => {

  });
});
```

### 테스트 함수 생성

테스트 함수에서는 `createCollectionArgs` 구조체를 정의하고 `createCoreCollection` 함수에 필요한 모든 계정을 전달합니다.

```ts
it("Create Collection", async () => {

  let createCollectionArgs = {
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
  };

  const createCollectionTx = await program.methods.createCoreCollection(createCollectionArgs)
    .accountsPartial({
      collection: collection.publicKey,
      payer: wallet.publicKey,
      updateAuthority: null,
      systemProgram: SystemProgram.programId,
      mplCoreProgram: MPL_CORE_PROGRAM_ID
    })
    .signers([collection, wallet.payer])
    .rpc();

  console.log(createCollectionTx);
});
```

방금 생성한 `createCollectionArgs` 구조체를 입력으로 전달하여 `createCoreCollection` 메서드를 호출하는 것으로 시작합니다:

```ts
await program.methods.createCoreCollection(createCollectionArgs)
```

다음으로, 함수에 필요한 모든 계정을 지정합니다. 이러한 계정 중 일부는 `optional`이므로 계정이 필요하지 않은 경우 간단히 `null`을 전달할 수 있습니다:

```ts
.accountsPartial({
  collection: collection.publicKey,
  payer: wallet.publicKey,
  updateAuthority: null,
  systemProgram: SystemProgram.programId,
  mplCoreProgram: MPL_CORE_PROGRAM_ID
})
```

마지막으로, 서명자를 제공하고 `.rpc()` 메서드를 사용하여 트랜잭션을 전송합니다:

```ts
.signers([collection, wallet.payer])
.rpc();
```