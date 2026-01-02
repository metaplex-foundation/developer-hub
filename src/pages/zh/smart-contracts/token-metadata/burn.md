---
title: 销毁资产
metaTitle: 销毁资产 | Token Metadata
description: 了解如何在 Token Metadata 上销毁资产
---

资产的所有者可以使用 Token Metadata 程序的 **Burn** 指令来销毁它。这将关闭与资产关联的所有可能账户,并将之前保存在已关闭账户中的各种租金豁免费用转移给所有者。此指令接受以下属性:

- **Authority**:授权销毁的签名者。通常,这是资产的所有者,但请注意,某些委托权限也可以代表所有者销毁资产,如"[委托权限](/zh/smart-contracts/token-metadata/delegates)"页面所述。
- **Token Owner**:资产当前所有者的公钥。
- **Token Standard**:被销毁资产的标准。此指令适用于所有代币标准,以提供统一的资产销毁接口。话虽如此,值得注意的是,非可编程资产可以直接使用 SPL Token 程序的 **Burn** 指令来销毁。

**Burn** 指令关闭的确切账户取决于被销毁资产的代币标准。以下是总结每种代币标准账户的表格:

| 代币标准                       | Mint | Token                    | Metadata | Edition | Token Record | Edition Marker          |
| ------------------------------ | ---- | ------------------------ | -------- | ------- | ------------ | ----------------------- |
| `NonFungible`                  | ❌   | ✅                       | ✅       | ✅      | ❌           | ❌                      |
| `NonFungibleEdition`           | ❌   | ✅                       | ✅       | ✅      | ❌           | ✅ 如果所有打印都被销毁 |
| `Fungible` 和 `FungibleAsset` | ❌   | ✅ 如果所有代币都被销毁 | ❌       | ❌      | ❌           | ❌                      |
| `ProgrammableNonFungible`      | ❌   | ✅                       | ✅       | ✅      | ✅           | ❌                      |

请注意,Mint 账户永远不会被关闭,因为 SPL Token 程序不允许这样做。

以下是如何使用我们的 SDK 在 Token Metadata 上销毁资产。

## NFT 销毁

{% dialect-switcher title="NFT 资产销毁" %}
{% dialect title="JavaScript - Umi" id="js" %}

```ts
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: owner,
  tokenOwner: owner.publicKey,
  tokenStandard: TokenStandard.NonFungible,
  // if your NFT is part of a collection you will also need to pass in the collection metadata address.
  collectionMetadata: findMetadataPda( umi, { mint: collectionMintAddress })
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust MPL SDK - CPI" id="rust-metaplex-cpi" %}

```rust
use mpl_token_metadata::instructions::BurnNftCpiBuilder;

 BurnNftCpiBuilder::new(&metadata_program_id)
    .metadata(&metadata)
    // if your NFT is part of a collection you will need to pass in the collection metadata address.
    .collection_metadata(collection_metadata.as_ref())
    .owner(&owner)
    .mint(&mint)
    .token_account(&token)
    .master_edition_account(&edition)
    .spl_token_program(&spl_token)
    .invoke()?;
```

{% /dialect %}

{% dialect title="Anchor - mpl-token-metadata" id="rs-anchor-mpl-token-metadata" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use mpl_token_metadata::instructions::BurnNftCpiBuilder;

#[derive(Accounts)]
pub struct NftBurnMpl<'info> {
    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut)]
    mint: Account<'info, Mint>,
    #[account(mut)]
    metadata: AccountInfo<'info>,
    #[account(mut)]
    token: AccountInfo<'info>,
    #[account(mut)]
    edition: AccountInfo<'info>,
    collection_metadata: Option<AccountInfo<'info>>,
    spl_token: AccountInfo<'info>,
    metadata_program_id: AccountInfo<'info>,
}

pub fn burn_nft_mpl_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, NftBurnMpl<'info>>,
) -> Result<()> {
    let owner = ctx.accounts.owner.to_account_info();
    let metadata = ctx.accounts.metadata.to_account_info();
    let collection_metadata = ctx.accounts.collection_metadata.as_ref().map(|a| a.to_account_info());
    let mint = ctx.accounts.mint.to_account_info();
    let token = ctx.accounts.token.to_account_info();
    let edition = ctx.accounts.edition.to_account_info();
    let spl_token = ctx.accounts.spl_token.to_account_info();
    let metadata_program_id = ctx.accounts.metadata_program_id.to_account_info();

    BurnNftCpiBuilder::new(&metadata_program_id)
        .metadata(&metadata)
        // if your NFT is part of a collection you will also need to pass in the collection metadata address.
        .collection_metadata(collection_metadata.as_ref())
        .owner(&owner)
        .mint(&mint)
        .token_account(&token)
        .master_edition_account(&edition)
        .spl_token_program(&spl_token)
        .invoke()?;

    Ok(())
}
```
{% /dialect %}

{% dialect title="Anchor - anchor-spl 0.31.0" id="rs-anchor-anchor-spl" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{metadata::BurnNft, token::Mint};


#[derive(Accounts)]
pub struct NftBurn<'info> {
    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut)]
    mint: Account<'info, Mint>,
    #[account(mut)]
    metadata: AccountInfo<'info>,
    #[account(mut)]
    token: AccountInfo<'info>,
    #[account(mut)]
    edition: AccountInfo<'info>,
    spl_token: AccountInfo<'info>,
    metadata_program_id: AccountInfo<'info>,
}

pub fn burn_nft_instruction(ctx: Context<NftBurn>) {

        let owner = ctx.accounts.owner.to_account_info();
        let metadata = ctx.accounts.metadata.to_account_info();
        let mint = ctx.accounts.mint.to_account_info();
        let token = ctx.accounts.token.to_account_info();
        let edition = ctx.accounts.edition.to_account_info();
        let spl_token = ctx.accounts.spl_token.to_account_info();
        let metadata_program_id = ctx.accounts.metadata_program_id.to_account_info();

        CpiContext::new(
            metadata_program_id,
            BurnNft {
                metadata,
                owner,
                mint,
                token,
                edition,
                spl_token,
            },
        );

}
```

{% /dialect %}
{% /dialect-switcher %}

## pNFT 销毁

#### 附加账户

`pNFT` 可能需要传入附加账户才能使指令正常工作。这些可能包括:

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% dialect-switcher title="pNFT 资产销毁" %}
{% dialect title="JavaScript - Umi" id="js-umi" %}

```ts
import {
  burnV1,
  fetchDigitalAssetWithAssociatedToken,
  findMetadataPda,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'
import { publicKey, unwrapOption } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

// The pNFT mint ID
const mintId = publicKey('11111111111111111111111111111111')

// Fetch the pNFT Asset with the Token Account
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
)

// Determine if the pNFT Asset is in a collection
const collectionMint = unwrapOption(assetWithToken.metadata.collection)

// If there's a collection find the collection metadata PDAs
const collectionMetadata = collectionMint
  ? findMetadataPda(umi, { mint: collectionMint.key })
  : null

// Burn the pNFT Asset
const res = await burnV1(umi, {
  mint: mintId,
  collectionMetadata: collectionMetadata || undefined,
  token: assetWithToken.token.publicKey,
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
console.log('Transaction Signature: ' + signature)
```

{% /dialect %}

{% dialect title="Rust MPL SDK - CPI" id="rust-metaplex-cpi" %}

```rust
use mpl_token_metadata::instructions::BurnNftCpiBuilder;

BurnNftCpiBuilder::new(metadata_program_id.account_info())
        .metadata(metadata.account_info())
        .collection_metadata(Some(collection_metadata.account_info()))
        .owner(owner.account_info())
        .mint(mint.account_info())
        .token_account(token.account_info())
        .master_edition_account(edition.account_info())
        .spl_token_program(spl_token.account_info())
        .invoke()?;
```

{% /dialect %}

{% dialect title="Anchor - mpl-token-metadata" id="rs-anchor-mpl-token-metadata" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use mpl_token_metadata::instructions::BurnV1CpiBuilder;

#[derive(Accounts)]
pub struct PnftBurnMpl<'info> {
    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut)]
    mint: Account<'info, Mint>,
    #[account(mut)]
    metadata: AccountInfo<'info>,
    #[account(mut)]
    token: AccountInfo<'info>,
    #[account(mut)]
    master_edition: AccountInfo<'info>,
    #[account(mut)]
    token_record: AccountInfo<'info>,
    collection_metadata: Option<AccountInfo<'info>>,
    spl_token: AccountInfo<'info>,
    metadata_program_id: AccountInfo<'info>,
}

pub fn burn_pnft_mpl_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, PnftBurnMpl<'info>>,
) -> Result<()> {
let owner = ctx.accounts.owner.to_account_info();
let metadata = ctx.accounts.metadata.to_account_info();
let mint = ctx.accounts.mint.to_account_info();
let token = ctx.accounts.token.to_account_info();
let master_edition = ctx.accounts.master_edition.to_account_info();
let collection_metadata = ctx
    .accounts
    .collection_metadata
    .as_ref()
    .map(|a| a.to_account_info());
let spl_token = ctx.accounts.spl_token.to_account_info();
let token_record = ctx.accounts.token_record.to_account_info();
let metadata_program_id = ctx.accounts.metadata_program_id.to_account_info();

BurnV1CpiBuilder::new(&metadata_program_id)
    .metadata(&metadata)
    .collection_metadata(collection_metadata.as_ref())
    .authority(&owner)
    .mint(&mint)
    .token(&token)
    .spl_token_program(&spl_token)
    .token_record(Some(&token_record))
    .master_edition(Some(&master_edition))
    .invoke()?;

Ok(())
}
```

{% /dialect %}

{% dialect title="Anchor - anchor-spl 0.31.0" id="rs-anchor-anchor-spl" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{metadata::{BurnNft, burn_nft}, token::Mint};

#[derive(Accounts)]
pub struct PnftBurn<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub token: AccountInfo<'info>,
    #[account(mut)]
    pub edition: AccountInfo<'info>,
    pub spl_token: AccountInfo<'info>,
    pub metadata_program_id: AccountInfo<'info>,
    /// CHECK: Optional collection metadata
    #[account(mut)]
    pub collection_metadata: Option<AccountInfo<'info>>,
}

pub fn burn_pnft_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, PnftBurn<'info>>,
) {
    // Create the accounts struct
    let cpi_accounts = BurnNft {
        metadata: ctx.accounts.metadata.clone(),
        owner: ctx.accounts.owner.to_account_info().clone(),
        mint: ctx.accounts.mint.to_account_info().clone(),
        token: ctx.accounts.token.clone(),
        edition: ctx.accounts.edition.clone(),
        spl_token: ctx.accounts.spl_token.clone(),
    };

    // Create CPI context
    let cpi_ctx = CpiContext::new(
        ctx.accounts.metadata_program_id.clone(),
        cpi_accounts,
    ).with_remaining_accounts(ctx.remaining_accounts.to_vec());

    // Get collection metadata pubkey if it exists
    let collection_metadata = ctx.accounts.collection_metadata.as_ref().map(|a| a.key());

    // Execute the CPI
    burn_nft(cpi_ctx, collection_metadata).expect("Failed to burn PNFT");
}
```
{% /dialect %}
{% /dialect-switcher %}
