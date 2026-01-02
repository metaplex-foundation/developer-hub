---
title: 更新资产
metaTitle: 更新资产 | Token Metadata
description: 了解如何在 Token Metadata 上更新资产
---

只要 **Is Mutable** 属性设置为 `true`，资产的更新权限就可以使用 **Update** 指令更新其 **Metadata** 账户。**Update** 指令要求 **Update Authority** 签署交易，并可以更新 **Metadata** 账户的以下属性：

## 可更新字段

请注意，某些委托权限也可以更新资产的 **Metadata** 账户，如"[委托权限](/zh/smart-contracts/token-metadata/delegates)"页面中所述。

以下是 `UpdateV1` 指令中所有可更新的单独字段的说明。

### Data 对象

定义资产的 Name、Symbol、URI、Seller Fee Basis Points 和 Creators 数组的对象。请注意，更新权限只能从 Creators 数组中添加和/或删除未验证的创建者。唯一的例外是如果创建者是更新权限，在这种情况下，添加或删除的创建者可以被验证。

{% dialect-switcher title="Data 对象" %}
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

### Primary Sale Happened

Primary Sale Happened：一个布尔值，指示资产是否已经被销售过。

{% dialect-switcher title="Primary Sale Happened" %}
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

### Is Mutable

一个布尔值，指示资产是否可以再次更新。当将其更改为 false 时，任何未来的更新都将失败。

{% dialect-switcher title="Is Mutable" %}
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

### Collection

此属性使我们能够设置或清除资产的集合。请注意，在设置新集合时，verified 布尔值必须设置为 false，并[使用另一个指令进行验证](/zh/smart-contracts/token-metadata/collections)。

#### 设置集合

{% dialect-switcher title="设置集合" %}
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

#### 清除集合

{% dialect-switcher title="清除集合" %}
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

### New Update Authority

可以通过传入 `newUpdateAuthority` 字段将新的更新权限分配给资产。

{% dialect-switcher title="New Update Authority" %}
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

### Programable RuleSets

此属性使我们能够设置或清除资产的规则集。这仅与[可编程非同质化代币](/zh/smart-contracts/token-metadata/pnfts)相关。

{% dialect-switcher title="Programable RuleSets" %}
{% dialect title="JavaScript" id="js" %}

```ts
ruleSet: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
// 在 Rust anchor-spl SDK 中不可用
```

{% /dialect %}
{% /dialect-switcher %}

以下是如何使用我们的 SDK 在 Token Metadata 上更新资产。

## 作为更新权限进行更新

### NFT 资产

此示例向您展示如何作为资产的更新权限更新 NFT 资产。

{% dialect-switcher title="更新资产" %}
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

如果您想更新 **Metadata** 账户的 **Data** 属性以外的更多内容，只需将这些属性提供给 `updateV1` 方法。

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
    /// CHECK: 由 CPI 处理
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: 由 CPI 处理
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

    // 获取原始元数据值
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
        ..original_metadata // 保持其余元数据不变
    };

    UpdateAsUpdateAuthorityV2CpiBuilder::new(&token_metadata_program)
        .mint(&mint)
        .metadata(&metadata)
        .authority(&ctx.accounts.update_authority)
        .data(new_metadata)
        // 如果需要，将剩余的数据字段/账户添加到 CPI
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
    /// CHECK: 由 CPI 处理
    #[account(mut)]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: 由 CPI 处理
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
        None, // 新更新权限
        Some(new_metadata), // Data
        None, // Primary sale happened
        None, // Is mutable
    ).expect("更新 NFT 元数据失败");
}
```

{% /dialect %}
{% /dialect-switcher %}

### pNFT 资产

此示例向您展示如何作为资产的更新权限更新可编程 NFT (pNFT) 资产。

#### 附加账户

`pNFTs` 可能需要传入附加账户才能使指令工作。这些包括：

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% dialect-switcher title="pNFT 资产更新" %}
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

// pNFT 资产的 Mint ID
const mintId = publicKey('1111111111111111111111111111111')

// 获取 pNFT 资产的 Metadata
const metadata = await fetchMetadataFromSeeds(umi, { mint: mintId })

// 设置 pNFT 资产的新 Data
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}

// 作为更新权限更新 pNFT
const txRes = await updateAsUpdateAuthorityV2(umi, {
  mint: mintId,
  data: data,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  collection: collectionToggle('Clear'),
  // 检查 pNFT 资产是否有授权规则。
  authorizationRules:
    unwrapOptionRecursively(metadata.programmableConfig)?.ruleSet || undefined,
  // Auth rules 程序 ID
  authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
  // 如果授权规则需要，您可能需要设置 authorizationData
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
    /// CHECK: 由 CPI 处理
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: 由 CPI 处理
    pub token_metadata_program: AccountInfo<'info>,
    // 如果需要，在下面添加附加账户
}

pub fn update_nft_mpl_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, NftUpdateMpl<'info>>,
    new_name: Option<String>,
    new_uri: Option<String>,
) -> Result<()> {
    let mint = ctx.accounts.mint.to_account_info();
    let metadata = ctx.accounts.metadata.to_account_info();
    let token_metadata_program = ctx.accounts.token_metadata_program.to_account_info();

    // 获取原始元数据值
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
        ..original_metadata // 保持其余元数据不变
    };

    UpdateAsUpdateAuthorityV2CpiBuilder::new(&token_metadata_program)
        .mint(&mint)
        .metadata(&metadata)
        .authority(&ctx.accounts.update_authority)
        .data(new_metadata)

        // 如果需要，将剩余的数据字段添加到 CPI
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
    /// CHECK: 由 CPI 处理
    #[account(mut)]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: 由 CPI 处理
    pub token_metadata_program: AccountInfo<'info>,
    /// CHECK: 可选的集合元数据
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

    // 创建 CPI 上下文
    let cpi_ctx = CpiContext::new(ctx.accounts.token_metadata_program.clone(), cpi_accounts)
        // 如果使用 Token Authorization Rules，要包含的两个剩余账户是：
        // Token Authorization Rules Program
        // Token Authorization Rules account
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

    // 更新 NFT 的元数据 - 正确的参数顺序
    update_metadata_accounts_v2(
        cpi_ctx,
        None,               // 新更新权限
        Some(new_metadata), // Data
        None,               // Primary sale happened
        None,               // Is mutable
    )
    .expect("更新 PNFT 元数据失败");
}
```

{% /dialect %}
{% /dialect-switcher %}
