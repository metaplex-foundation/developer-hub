---
title: 자산 소각
metaTitle: 자산 소각 | Token Metadata
description: Token Metadata에서 자산을 소각하는 방법을 알아보세요
---

자산의 소유자는 Token Metadata 프로그램의 **Burn** 명령어를 사용하여 자산을 소각할 수 있습니다. 이는 자산과 연관된 모든 가능한 계정을 닫고 닫힌 계정에 이전에 보유된 다양한 임대료 면제 수수료를 소유자에게 이전합니다. 이 명령어는 다음 속성을 받습니다:

- **Authority**: 소각을 승인하는 서명자. 일반적으로 이는 자산의 소유자이지만 "[위임된 권한](/ko/smart-contracts/token-metadata/delegates)" 페이지에서 논의된 바와 같이 특정 위임된 권한도 소유자를 대신하여 자산을 소각할 수 있다는 점에 주목하세요.
- **Token Owner**: 자산의 현재 소유자의 공개 키.
- **Token Standard**: 소각되는 자산의 표준. 이 명령어는 자산 소각을 위한 통합된 인터페이스를 제공하기 위해 모든 토큰 표준에서 작동합니다. 하지만 프로그래머블이 아닌 자산은 SPL Token 프로그램의 **Burn** 명령어를 직접 사용하여 소각할 수 있다는 점에 주목할 가치가 있습니다.

**Burn** 명령어에 의해 닫히는 정확한 계정들은 소각되는 자산의 토큰 표준에 따라 달라집니다. 다음은 각 토큰 표준에 대한 계정을 요약한 표입니다:

| Token Standard                 | Mint | Token                      | Metadata | Edition | Token Record | Edition Marker                    |
| ------------------------------ | ---- | -------------------------- | -------- | ------- | ------------ | --------------------------------- |
| `NonFungible`                  | ❌   | ✅                         | ✅       | ✅      | ❌           | ❌                                |
| `NonFungibleEdition`           | ❌   | ✅                         | ✅       | ✅      | ❌           | ✅ 모든 인쇄본이 소각된 경우        |
| `Fungible` 및 `FungibleAsset`  | ❌   | ✅ 모든 토큰이 소각된 경우    | ❌       | ❌      | ❌           | ❌                                |
| `ProgrammableNonFungible`      | ❌   | ✅                         | ✅       | ✅      | ✅           | ❌                                |

SPL Token 프로그램이 이를 허용하지 않기 때문에 Mint 계정은 절대 닫히지 않는다는 점에 주목하세요.

다음은 Token Metadata에서 자산을 소각하기 위해 우리의 SDK를 사용하는 방법입니다.

## NFT 소각

{% dialect-switcher title="NFT 자산 소각" %}
{% dialect title="JavaScript - Umi" id="js" %}

```ts
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: owner,
  tokenOwner: owner.publicKey,
  tokenStandard: TokenStandard.NonFungible,
  // NFT가 컬렉션의 일부인 경우 컬렉션 메타데이터 주소도 전달해야 합니다.
  collectionMetadata: findMetadataPda( umi, { mint: collectionMintAddress })
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust MPL SDK - CPI" id="rust-metaplex-cpi" %}

```rust
use mpl_token_metadata::instructions::BurnNftCpiBuilder;

 BurnNftCpiBuilder::new(&metadata_program_id)
    .metadata(&metadata)
    // NFT가 컬렉션의 일부인 경우 컬렉션 메타데이터 주소를 전달해야 합니다.
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
        // NFT가 컬렉션의 일부인 경우 컬렉션 메타데이터 주소도 전달해야 합니다.
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

## pNFT 소각

#### 추가 계정

`pNFT`는 명령어가 작동하기 위해 추가 계정들이 전달되어야 할 수 있습니다. 여기에는 다음이 포함될 수 있습니다:

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% dialect-switcher title="pNFT 자산 소각" %}
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

// pNFT 민트 ID
const mintId = publicKey('11111111111111111111111111111111')

// 토큰 계정과 함께 pNFT 자산 가져오기
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
)

// pNFT 자산이 컬렉션에 있는지 확인
const collectionMint = unwrapOption(assetWithToken.metadata.collection)

// 컬렉션이 있는 경우 컬렉션 메타데이터 PDA 찾기
const collectionMetadata = collectionMint
  ? findMetadataPda(umi, { mint: collectionMint.key })
  : null

// pNFT 자산 소각
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
    /// CHECK: 선택적 컬렉션 메타데이터
    #[account(mut)]
    pub collection_metadata: Option<AccountInfo<'info>>,
}

pub fn burn_pnft_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, PnftBurn<'info>>,
) {
    // 계정 구조체 생성
    let cpi_accounts = BurnNft {
        metadata: ctx.accounts.metadata.clone(),
        owner: ctx.accounts.owner.to_account_info().clone(),
        mint: ctx.accounts.mint.to_account_info().clone(),
        token: ctx.accounts.token.clone(),
        edition: ctx.accounts.edition.clone(),
        spl_token: ctx.accounts.spl_token.clone(),
    };

    // CPI 컨텍스트 생성
    let cpi_ctx = CpiContext::new(
        ctx.accounts.metadata_program_id.clone(),
        cpi_accounts,
    ).with_remaining_accounts(ctx.remaining_accounts.to_vec());

    // 컬렉션 메타데이터 공개키 가져오기 (존재하는 경우)
    let collection_metadata = ctx.accounts.collection_metadata.as_ref().map(|a| a.key());

    // CPI 실행
    burn_nft(cpi_ctx, collection_metadata).expect("Failed to burn PNFT");
}
```
{% /dialect %}
{% /dialect-switcher %}