---
title: 자산 업데이트
metaTitle: 자산 업데이트 | Token Metadata
description: Token Metadata에서 자산을 업데이트하는 방법을 알아보세요
---

자산의 업데이트 권한은 **Is Mutable** 속성이 `true`로 설정되어 있는 한 **Update** 명령어를 사용하여 **Metadata** 계정을 업데이트할 수 있습니다. **Update** 명령어는 **업데이트 권한**이 트랜잭션에 서명하는 것을 요구하며 **Metadata** 계정의 다음 속성을 업데이트할 수 있습니다:

## 업데이트 가능한 필드

특정 위임된 권한도 "[위임된 권한](/token-metadata/delegates)" 페이지에서 논의된 바와 같이 자산의 **Metadata** 계정을 업데이트할 수 있다는 점에 주목하세요.

아래는 `UpdateV1` 명령어에서 업데이트할 수 있는 모든 개별 필드에 대한 설명입니다.

### 데이터 객체

자산의 이름, 심볼, URI, 판매자 수수료 기준점 및 크리에이터 배열을 정의하는 객체입니다. 업데이트 권한은 크리에이터 배열에서 확인되지 않은 크리에이터만 추가 및/또는 제거할 수 있다는 점에 주목하세요. 유일한 예외는 크리에이터가 업데이트 권한인 경우이며, 이 경우 추가되거나 제거된 크리에이터가 확인될 수 있습니다.

{% dialect-switcher title="데이터 객체" %}
{% dialect title="JavaScript" id="js" %}

```ts
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
pub struct DataV2 {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub seller_fee_basis_points: u16,
    pub creators: Option<Vec<Creator>>,
    pub collection: Option<Collection>,
    pub uses: Option<Uses>,
}
```

{% /dialect %}

{% /dialect-switcher %}

### 1차 판매 발생

1차 판매 발생: 자산이 이전에 판매되었는지를 나타내는 불리언 값입니다.

{% dialect-switcher title="1차 판매 발생" %}
{% dialect title="JavaScript" id="js" %}

```ts
primarySaleHappened: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
primary_sale_happened: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### 변경 가능

자산을 다시 업데이트할 수 있는지를 나타내는 불리언 값입니다. 이를 false로 변경하면 향후 모든 업데이트가 실패합니다.

{% dialect-switcher title="변경 가능" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
is_mutable: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### 컬렉션

이 속성을 통해 자산의 컬렉션을 설정하거나 지울 수 있습니다. 새 컬렉션을 설정할 때 verified 불리언은 false로 설정되어야 하며 [다른 명령어를 사용하여 확인](/token-metadata/collections)되어야 한다는 점에 주목하세요.

#### 컬렉션 설정

{% dialect-switcher title="컬렉션 설정" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle('Set', [
  {
    key: publicKey('11111111111111111111111111111111'),
    verified: false,
  },
])
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: Some( Collection {
  key: PubKey,
  verified: Boolean,
}),
```

{% /dialect %}
{% /dialect-switcher %}

#### 컬렉션 지우기

{% dialect-switcher title="컬렉션 지우기" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle("Clear"),
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: None,
```

{% /dialect %}
{% /dialect-switcher %}

### 새 업데이트 권한

`newUpdateAuthority` 필드를 전달하여 자산에 새로운 업데이트 권한을 할당할 수 있습니다.

{% dialect-switcher title="새 업데이트 권한" %}
{% dialect title="JavaScript" id="js" %}

```ts
newUpdateAuthority: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
new_update_authority: Option<PubKey>,
```

{% /dialect %}
{% /dialect-switcher %}

### 프로그래머블 RuleSet

이 속성을 통해 자산의 규칙 세트를 설정하거나 지울 수 있습니다. 이는 [프로그래머블 대체 불가능](/token-metadata/pnfts)에만 관련이 있습니다.

{% dialect-switcher title="프로그래머블 RuleSet" %}
{% dialect title="JavaScript" id="js" %}

```ts
ruleSet: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
// Rust anchor-spl SDK에서 사용할 수 없음
```

{% /dialect %}
{% /dialect-switcher %}

다음은 SDK를 사용하여 Token Metadata에서 자산을 업데이트하는 방법입니다.

## 업데이트 권한으로 업데이트

### NFT 자산

이 예제는 자산의 업데이트 권한으로서 NFT 자산을 업데이트하는 방법을 보여줍니다.

{% dialect-switcher title="자산 업데이트" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  updateV1,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateV1(umi, {
  mint,
  authority: updateAuthority,
  data: { ...initialMetadata, name: 'Updated Asset' },
}).sendAndConfirm(umi)
```

**Metadata** 계정의 **Data** 속성 이상을 업데이트하고 싶다면, 이러한 속성을 `updateV1` 메서드에 간단히 제공하세요.

```ts
import {
  updateV1,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateV1(umi, {
  mint,
  authority: updateAuthority,
  data: { ...initialMetadata, name: 'Updated Asset' },
  primarySaleHappened: true,
  isMutable: true,
  // ...
}).sendAndConfirm(umi)
```

{% /totem %}

{% /dialect %}

{% dialect title="Anchor - mpl-token-metadata" id="rust-anchor-mpl-token-metadata" %}

```rust
use anchor_lang::prelude::*;
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::UpdateAsUpdateAuthorityV2CpiBuilder, types::Data,
};

#[derive(Accounts)]
pub struct NftUpdateMpl<'info> {
    pub mint: AccountInfo<'info>,
    /// CHECK: CPI에서 처리됨
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: CPI에서 처리됨
    pub token_metadata_program: AccountInfo<'info>,
}

pub fn update_nft_mpl_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, NftUpdateMpl<'info>>,
    new_name: Option<String>,
    new_uri: Option<String>,
) -> Result<()> {
    let mint = ctx.accounts.mint.to_account_info();
    let metadata = ctx.accounts.metadata.to_account_info();
    let token_metadata_program = ctx.accounts.token_metadata_program.to_account_info();

    // 원본 메타데이터 값 가져오기
    let metadata_account = Metadata::try_from(&metadata)?;

    let original_metadata = Data {
        name: metadata_account.name,
        symbol: metadata_account.symbol,
        uri: metadata_account.uri,
        seller_fee_basis_points: metadata_account.seller_fee_basis_points,
        creators: metadata_account.creators,
    };

    let new_metadata = Data {
        name: new_name.unwrap_or(original_metadata.name),
        uri: new_uri.unwrap_or(original_metadata.uri),
        ..original_metadata // 나머지 메타데이터는 동일하게 유지
    };

    UpdateAsUpdateAuthorityV2CpiBuilder::new(&token_metadata_program)
        .mint(&mint)
        .metadata(&metadata)
        .authority(&ctx.accounts.update_authority)
        .data(new_metadata)
        // 필요한 경우 CPI에 조정할 나머지 데이터 필드/계정 추가
        // https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/instructions/struct.UpdateAsUpdateAuthorityV2CpiBuilder.html
        .invoke()?;

    Ok(())
}
```

{% /dialect %}

{% dialect title="Anchor - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{mpl_token_metadata::types::DataV2, update_metadata_accounts_v2, MetadataAccount, UpdateMetadataAccountsV2},
    token::Mint,
};

#[derive(Accounts)]
pub struct UpdateNft<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    /// CHECK: CPI에서 처리됨
    #[account(mut)]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: CPI에서 처리됨
    pub token_metadata_program: AccountInfo<'info>,
}

pub fn update_nft_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdateNft<'info>>,
    new_name: Option<String>,
    new_uri: Option<String>,
) {
    let cpi_accounts = UpdateMetadataAccountsV2 {
        metadata: ctx.accounts.metadata.to_account_info().clone(),
        update_authority: ctx.accounts.update_authority.to_account_info().clone(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_metadata_program.clone(),
        cpi_accounts,
    );

    let original_metadata = DataV2 {
        name: ctx.accounts.metadata.name.clone(),
        symbol: ctx.accounts.metadata.symbol.clone(),
        uri: ctx.accounts.metadata.uri.clone(),
        seller_fee_basis_points: ctx.accounts.metadata.seller_fee_basis_points,
        creators: ctx.accounts.metadata.creators.clone(),
        collection: ctx.accounts.metadata.collection.clone(),
        uses: ctx.accounts.metadata.uses.clone(),
    };

    let new_metadata = DataV2 {
        name: new_name.clone().unwrap_or(original_metadata.name),
        uri: new_uri.clone().unwrap_or(original_metadata.uri),
        ..original_metadata
    };

    update_metadata_accounts_v2(
        cpi_ctx,
        None, // 새 업데이트 권한
        Some(new_metadata), // 데이터
        None, // 1차 판매 발생
        None, // 변경 가능
    ).expect("NFT 메타데이터 업데이트 실패");
}
```

{% /dialect %}
{% /dialect-switcher %}

### pNFT 자산

이 예제는 자산의 업데이트 권한으로서 프로그래머블 NFT (pNFT) 자산을 업데이트하는 방법을 보여줍니다.

#### 추가 계정

`pNFT`는 명령어가 작동하기 위해 추가 계정을 전달해야 할 수 있습니다. 여기에는 다음이 포함됩니다:

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% dialect-switcher title="pNFT 자산 업데이트" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getMplTokenAuthRulesProgramId } from '@metaplex-foundation/mpl-candy-machine'
import {
  collectionToggle,
  fetchMetadataFromSeeds,
  TokenStandard,
  updateAsUpdateAuthorityV2,
} from '@metaplex-foundation/mpl-token-metadata'
import { publicKey, unwrapOptionRecursively } from '@metaplex-foundation/umi'

// pNFT 자산의 Mint ID
const mintId = publicKey('1111111111111111111111111111111')

// pNFT 자산의 메타데이터 가져오기
const metadata = await fetchMetadataFromSeeds(umi, { mint: mintId })

// pNFT 자산의 새 데이터 설정
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}

// 업데이트 권한으로 pNFT 업데이트
const txRes = await updateAsUpdateAuthorityV2(umi, {
  mint: mintId,
  data: data,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  collection: collectionToggle('Clear'),
  // pNFT 자산이 인증 규칙을 가지고 있는지 확인
  authorizationRules:
    unwrapOptionRecursively(metadata.programmableConfig)?.ruleSet || undefined,
  // 인증 규칙 프로그램 ID
  authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
  // 인증 규칙에서 필요한 경우 authorizationData를 설정해야 할 수 있습니다
  authorizationData: undefined,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}

{% dialect title="Anchor - mpl-token-metadata" id="rust-anchor-mpl-token-metadata" %}

```rust
use anchor_lang::prelude::*;
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::UpdateAsUpdateAuthorityV2CpiBuilder, types::Data,
};

#[derive(Accounts)]
pub struct NftUpdateMpl<'info> {
    pub mint: AccountInfo<'info>,
    /// CHECK: CPI에서 처리됨
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: CPI에서 처리됨
    pub token_metadata_program: AccountInfo<'info>,
    // 필요한 경우 아래에 추가 계정 추가
}

pub fn update_nft_mpl_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, NftUpdateMpl<'info>>,
    new_name: Option<String>,
    new_uri: Option<String>,
) -> Result<()> {
    let mint = ctx.accounts.mint.to_account_info();
    let metadata = ctx.accounts.metadata.to_account_info();
    let token_metadata_program = ctx.accounts.token_metadata_program.to_account_info();

    // 원본 메타데이터 값 가져오기
    let metadata_account = Metadata::try_from(&metadata)?;

    let original_metadata = Data {
        name: metadata_account.name,
        symbol: metadata_account.symbol,
        uri: metadata_account.uri,
        seller_fee_basis_points: metadata_account.seller_fee_basis_points,
        creators: metadata_account.creators,
    };

    let new_metadata = Data {
        name: new_name.unwrap_or(original_metadata.name),
        uri: new_uri.unwrap_or(original_metadata.uri),
        ..original_metadata // 나머지 메타데이터는 동일하게 유지
    };

    UpdateAsUpdateAuthorityV2CpiBuilder::new(&token_metadata_program)
        .mint(&mint)
        .metadata(&metadata)
        .authority(&ctx.accounts.update_authority)
        .data(new_metadata)

        // 필요한 경우 CPI에 조정할 나머지 데이터 필드 추가
        // https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/instructions/struct.UpdateAsUpdateAuthorityV2CpiBuilder.html
        //
        // .authorization_rules(authorization_rules)
        // .authorization_rules_program(authorization_rules_program)
        // .token_record(token_record)
        .invoke()?;

    Ok(())
}

```

{% /dialect %}

{% dialect title="Anchor - anchor-spl 0.31.0" id="rust-anchor-anchor-spl" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{
        mpl_token_metadata::types::DataV2, update_metadata_accounts_v2, MetadataAccount,
        UpdateMetadataAccountsV2,
    },
    token::Mint,
};

#[derive(Accounts)]
pub struct UpdatePnft<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    /// CHECK: CPI에서 처리됨
    #[account(mut)]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: CPI에서 처리됨
    pub token_metadata_program: AccountInfo<'info>,
    /// CHECK: 선택적 컬렉션 메타데이터
    #[account(mut)]
    pub collection_metadata: Option<AccountInfo<'info>>,
}

pub fn update_pnft_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdatePnft<'info>>,
    new_name: Option<String>,
    new_uri: Option<String>,
) {
    let cpi_accounts = UpdateMetadataAccountsV2 {
        metadata: ctx.accounts.metadata.to_account_info().clone(),
        update_authority: ctx.accounts.update_authority.to_account_info().clone(),
    };

    let remaining_accounts: Vec<AccountInfo> = ctx
        .remaining_accounts
        .iter()
        .map(|a| (*a).clone())
        .collect();

    // CPI 컨텍스트 생성
    let cpi_ctx = CpiContext::new(ctx.accounts.token_metadata_program.clone(), cpi_accounts)
        // 포함할 두 개의 나머지 계정(토큰 인증 규칙이 사용되는 경우):
        // 토큰 인증 규칙 프로그램
        // 토큰 인증 규칙 계정
        .with_remaining_accounts(remaining_accounts);

    let original_metadata = DataV2 {
        name: ctx.accounts.metadata.name.clone(),
        symbol: ctx.accounts.metadata.symbol.clone(),
        uri: ctx.accounts.metadata.uri.clone(),
        seller_fee_basis_points: ctx.accounts.metadata.seller_fee_basis_points,
        creators: ctx.accounts.metadata.creators.clone(),
        collection: ctx.accounts.metadata.collection.clone(),
        uses: ctx.accounts.metadata.uses.clone(),
    };

    let new_metadata = DataV2 {
        name: new_name.clone().unwrap_or(original_metadata.name),
        uri: new_uri.clone().unwrap_or(original_metadata.uri),
        ..original_metadata
    };

    // NFT의 메타데이터 업데이트 - 올바른 매개변수 순서
    update_metadata_accounts_v2(
        cpi_ctx,
        None,               // 새 업데이트 권한
        Some(new_metadata), // 데이터
        None,               // 1차 판매 발생
        None,               // 변경 가능
    )
    .expect("PNFT 메타데이터 업데이트 실패");
}
```

{% /dialect %}
{% /dialect-switcher %}