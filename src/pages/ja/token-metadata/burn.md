---
title: アセットのバーン
metaTitle: アセットのバーン | Token Metadata
description: Token Metadataでアセットをバーンする方法を学習します
---

アセットの所有者は、Token Metadataプログラムの**Burn**命令を使用してアセットをバーンできます。これにより、アセットに関連する可能性のあるすべてのアカウントが閉じられ、閉じられたアカウントで以前保持されていた様々な家賃免除手数料が所有者に転送されます。この命令は以下の属性を受け取ります：

- **Authority**: バーンを承認する署名者。通常、これはアセットの所有者ですが、「[委任された権限](/ja/token-metadata/delegates)」ページで説明されているように、特定の委任された権限も所有者の代わりにアセットをバーンできることに注意してください。
- **Token Owner**: アセットの現在の所有者の公開鍵。
- **Token Standard**: バーンされるアセットの標準。この命令は、アセットをバーンするための統一されたインターフェースを提供するために、すべてのToken Standardで動作します。つまり、プログラマブルでないアセットはSPL TokenプログラムのBurn命令を直接使用してバーンできることに注意する価値があります。

**Burn**命令によって閉じられる正確なアカウントは、バーンされるアセットのToken Standardによって異なります。以下は、各Token Standardのアカウントを要約した表です：

| Token Standard                 | Mint | Token                        | Metadata | Edition | Token Record | Edition Marker                      |
| ------------------------------ | ---- | ---------------------------- | -------- | ------- | ------------ | ----------------------------------- |
| `NonFungible`                  | ❌   | ✅                           | ✅       | ✅      | ❌           | ❌                                  |
| `NonFungibleEdition`           | ❌   | ✅                           | ✅       | ✅      | ❌           | ✅ 全プリントがバーンされた場合      |
| `Fungible` and `FungibleAsset` | ❌   | ✅ 全トークンがバーンされた場合 | ❌       | ❌      | ❌           | ❌                                  |
| `ProgrammableNonFungible`      | ❌   | ✅                           | ✅       | ✅      | ✅           | ❌                                  |

SPL TokenプログラムがMintアカウントの閉じることを許可しないため、Mintアカウントは決して閉じられないことに注意してください。

以下は、Token MetadataでアセットをバーンするためのSDKの使用方法です。

## NFTバーン

{% dialect-switcher title="NFT Asset Burn" %}
{% dialect title="JavaScript - Umi" id="js" %}

```ts
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: owner,
  tokenOwner: owner.publicKey,
  tokenStandard: TokenStandard.NonFungible,
  // NFTがコレクションの一部である場合、コレクションメタデータアドレスも渡す必要があります。
  collectionMetadata: findMetadataPda( umi, { mint: collectionMintAddress })
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust MPL SDK - CPI" id="rust-metaplex-cpi" %}

```rust
use mpl_token_metadata::instructions::BurnNftCpiBuilder;

 BurnNftCpiBuilder::new(&metadata_program_id)
    .metadata(&metadata)
    // NFTがコレクションの一部である場合、コレクションメタデータアドレスを渡す必要があります。
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
        // NFTがコレクションの一部である場合、コレクションメタデータアドレスも渡す必要があります。
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

## pNFTバーン

#### 追加アカウント

`pNFT`では、命令が動作するために追加のアカウントを渡す必要がある場合があります。これらには以下が含まれる場合があります：

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% dialect-switcher title="pNFT Asset Burn" %}
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

// pNFT mint ID
const mintId = publicKey('11111111111111111111111111111111')

// Token AccountでpNFT Assetを取得
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
)

// pNFT Assetがコレクション内にあるかを確認
const collectionMint = unwrapOption(assetWithToken.metadata.collection)

// コレクションがある場合、コレクションメタデータPDAを見つける
const collectionMetadata = collectionMint
  ? findMetadataPda(umi, { mint: collectionMint.key })
  : null

// pNFT Assetをバーン
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
    // アカウント構造体を作成
    let cpi_accounts = BurnNft {
        metadata: ctx.accounts.metadata.clone(),
        owner: ctx.accounts.owner.to_account_info().clone(),
        mint: ctx.accounts.mint.to_account_info().clone(),
        token: ctx.accounts.token.clone(),
        edition: ctx.accounts.edition.clone(),
        spl_token: ctx.accounts.spl_token.clone(),
    };
    
    // CPIコンテキストを作成
    let cpi_ctx = CpiContext::new(
        ctx.accounts.metadata_program_id.clone(),
        cpi_accounts,
    ).with_remaining_accounts(ctx.remaining_accounts.to_vec());
    
    // 存在する場合はコレクションメタデータ公開鍵を取得
    let collection_metadata = ctx.accounts.collection_metadata.as_ref().map(|a| a.key());
    
    // CPIを実行
    burn_nft(cpi_ctx, collection_metadata).expect("Failed to burn PNFT");
}
```
{% /dialect %}
{% /dialect-switcher %}