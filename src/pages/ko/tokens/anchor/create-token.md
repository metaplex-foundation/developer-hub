---
title: Rust와 Anchor로 토큰 생성하기
metaTitle: Anchor로 토큰 생성하기 | Solana 토큰
description: Rust, Anchor 프레임워크, Metaplex Token Metadata를 사용하여 Solana에서 메타데이터가 있는 SPL 토큰을 생성하는 방법을 알아보세요.
created: '01-18-2026'
updated: null
---

이 가이드에서는 **Rust**, **Anchor** 프레임워크, CPI를 통한 **Metaplex Token Metadata** 프로그램을 사용하여 Solana에서 메타데이터가 있는 대체 가능 토큰을 생성하는 방법을 설명합니다. {% .lead %}

{% callout title="만들게 될 것" %}

하나의 Anchor 명령어로 다음을 수행합니다:
- 새로운 SPL 토큰 mint 생성
- 지불자를 위한 연관 토큰 계정 생성
- 이름, 심볼, URI가 포함된 메타데이터 계정 생성
- 지불자에게 초기 토큰 공급량 발행

{% /callout %}

## 요약

**Anchor (Rust)**로 Solana에서 **대체 가능 SPL 토큰**을 생성하고, 초기 공급량을 발행하며, CPI를 통해 **Metaplex Token Metadata**(이름, 심볼, URI)를 첨부합니다.

- 하나의 명령어: **mint + ATA + 메타데이터** 초기화 후 공급량 발행
- 사용 기술: SPL Token + Metaplex Token Metadata CPI
- 테스트 환경: Anchor 0.32.1, Solana Agave 3.1.6
- 대체 가능 토큰 전용; NFT는 Master Edition + `decimals=0` + `supply=1`이 필요

## 범위 밖

Token-2022 확장, 기밀 전송, 권한 해제, 메타데이터 업데이트, 전체 NFT 흐름, 메인넷 배포.

## 빠른 시작

**바로가기:** [프로그램](#the-program) · [테스트 클라이언트](#the-client) · [일반적인 오류](#common-errors)

1. `anchor init anchor-spl-token`
2. `Cargo.toml`에 `metadata` 기능이 포함된 `anchor-spl` 추가
3. 로컬넷용으로 `Anchor.toml`에서 Token Metadata 프로그램 클론
4. 프로그램 코드를 붙여넣고 `anchor test` 실행

## 사전 요구사항

- **Rust** 설치 ([rustup.rs](https://rustup.rs))
- **Solana CLI** 설치 ([docs.solana.com](https://docs.solana.com/cli/install-solana-cli-tools))
- **Anchor CLI** 설치 (`cargo install --git https://github.com/coral-xyz/anchor anchor-cli`)
- 테스트 실행을 위한 **Node.js** 및 **Yarn**
- 트랜잭션 수수료를 위한 SOL이 있는 Solana 지갑

## 테스트된 구성

이 가이드는 다음 버전으로 테스트되었습니다:

| 도구 | 버전 |
|------|---------|
| Anchor CLI | 0.32.1 |
| Solana CLI | 3.1.6 (Agave) |
| Rust | 1.92.0 |
| Node.js | 22.15.1 |
| Yarn | 1.22.x |

## 초기 설정

새로운 Anchor 프로젝트를 초기화하는 것으로 시작합니다:

```bash
anchor init anchor-spl-token
cd anchor-spl-token
```

### Cargo.toml 설정

`programs/anchor-spl-token/Cargo.toml`을 업데이트합니다:

```toml {% title="programs/anchor-spl-token/Cargo.toml" showLineNumbers=true highlightLines="22,24-26" %}
[package]
name = "anchor-spl-token"
version = "0.1.0"
description = "Created with Anchor"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "anchor_spl_token"

[lints.rust]
unexpected_cfgs = { level = "warn", check-cfg = [
    'cfg(feature, values("custom-heap", "custom-panic", "anchor-debug"))'
] }

[features]
default = []
cpi = ["no-entrypoint"]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]

[dependencies]
anchor-lang = "0.32.1"
anchor-spl = { version = "0.32.1", features = ["token", "metadata", "associated_token"] }
```

{% callout title="중요" %}

`idl-build` 기능에 `anchor-spl/idl-build`을 **반드시** 포함해야 합니다. 그렇지 않으면 `no function or associated item named 'create_type' found for struct 'anchor_spl::token::Mint'`과 같은 오류가 발생합니다.

{% /callout %}

### Anchor.toml 설정

로컬 테스트를 위해 Token Metadata 프로그램을 클론하도록 `Anchor.toml`을 업데이트합니다:

```toml {% title="Anchor.toml" showLineNumbers=true highlightLines="23,25-26" %}
[toolchain]
package_manager = "yarn"

[features]
resolution = true
skip-lint = false

[programs.localnet]
anchor_spl_token = "YOUR_PROGRAM_ID_HERE"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"

[test.validator]
url = "https://api.mainnet-beta.solana.com"
bind_address = "127.0.0.1"

[[test.validator.clone]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
```

{% callout %}

- Agave 3.x 밸리데이터에서는 `bind_address = "127.0.0.1"`이 필요합니다 (0.0.0.0은 패닉을 유발합니다)
- `[[test.validator.clone]]` 섹션은 메인넷에서 Metaplex Token Metadata 프로그램을 클론합니다

{% /callout %}

### package.json 설정

```json {% title="package.json" showLineNumbers=true %}
{
  "license": "ISC",
  "scripts": {
    "lint:fix": "prettier */*.js \"*/**/*{.js,.ts}\" -w",
    "lint": "prettier */*.js \"*/**/*{.js,.ts}\" --check"
  },
  "dependencies": {
    "@coral-xyz/anchor": "^0.32.1",
    "@metaplex-foundation/mpl-token-metadata": "^3.4.0",
    "@solana/spl-token": "^0.4.9"
  },
  "devDependencies": {
    "chai": "^4.3.4",
    "mocha": "^9.0.3",
    "ts-mocha": "^10.0.0",
    "@types/bn.js": "^5.1.0",
    "@types/chai": "^4.3.0",
    "@types/mocha": "^9.0.0",
    "typescript": "^5.7.3",
    "prettier": "^2.6.2"
  }
}
```

## 프로그램

### Import와 템플릿

여기서는 모든 import를 정의하고 `programs/anchor-spl-token/src/lib.rs`에서 Account 구조체와 명령어의 템플릿을 생성합니다:

```rust {% title="programs/anchor-spl-token/src/lib.rs" showLineNumbers=true highlightLines="1-10" %}
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

declare_id!("YOUR_PROGRAM_ID_HERE");

#[program]
pub mod anchor_spl_token {
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
        amount: u64,
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateToken<'info> {

}
```

### Account 구조체 생성

`CreateToken` 구조체는 명령어에 필요한 모든 계정을 정의하고 필요한 제약 조건을 적용합니다:

```rust {% title="programs/anchor-spl-token/src/lib.rs" showLineNumbers=true highlightLines="2,6-14,16-22,26-34" %}
#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The mint account to be created
    #[account(
        init,
        payer = payer,
        mint::decimals = decimals,
        mint::authority = payer.key(),
        mint::freeze_authority = payer.key(),
    )]
    pub mint: Account<'info, Mint>,

    /// The associated token account to receive minted tokens
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// The metadata account to be created
    /// CHECK: Validated by seeds constraint to be the correct PDA
    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key().as_ref(),
            mint.key().as_ref(),
        ],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
```

**계정 유형:**
- `#[instruction(...)]` 속성은 계정 제약 조건에서 명령어 인수(예: `decimals`)를 사용할 수 있게 합니다
- `mint`는 Anchor의 `init` 제약 조건과 `mint::decimals = decimals`를 사용하여 지정된 소수점 자릿수로 토큰 mint를 생성합니다
- `token_account`는 `associated_token::` 헬퍼를 사용하여 연관 토큰 계정으로 초기화됩니다
- `metadata_account`는 `seeds::program`을 사용하여 PDA가 Token Metadata 프로그램에 속하는지 검증합니다

### 명령어 생성

`create_token` 함수는 CPI를 통해 메타데이터 계정을 생성하고 초기 토큰 공급량을 발행합니다:

```rust {% title="programs/anchor-spl-token/src/lib.rs" showLineNumbers=true highlightLines="14-40,43-54" %}
pub fn create_token(
    ctx: Context<CreateToken>,
    name: String,
    symbol: String,
    uri: String,
    decimals: u8,
    amount: u64,
) -> Result<()> {
    msg!("Creating token mint...");
    msg!("Mint: {}", ctx.accounts.mint.key());
    msg!("Creating metadata account...");
    msg!("Metadata account address: {}", ctx.accounts.metadata_account.key());

    // Cross Program Invocation (CPI) to token metadata program
    create_metadata_accounts_v3(
        CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.payer.to_account_info(),
                update_authority: ctx.accounts.payer.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        DataV2 {
            name,
            symbol,
            uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        },
        true,  // is_mutable
        true,  // update_authority_is_signer
        None,  // collection_details
    )?;

    // Mint tokens to the payer's associated token account
    msg!("Minting {} tokens to {}", amount, ctx.accounts.token_account.key());

    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        amount,
    )?;

    msg!("Token created and {} tokens minted successfully.", amount);
    Ok(())
}
```

이 함수는 두 개의 Cross-Program Invocation을 수행합니다:
1. `create_metadata_accounts_v3` (14-40행) - 이름, 심볼, URI로 메타데이터 계정을 생성하고 초기화합니다
2. `mint_to` (43-54행) - 지정된 수량을 지불자의 토큰 계정에 발행합니다

## 테스트 클라이언트

테스트 전에 프로그램을 빌드합니다:

```bash
anchor build
```

프로그램 ID를 가져와서 `lib.rs`와 `Anchor.toml` 모두에 업데이트합니다:

```bash
solana address -k target/deploy/anchor_spl_token-keypair.json
```

그런 다음 다시 빌드하고 배포합니다:

```bash
anchor build
anchor deploy
```

### 테스트 작성

`tests/anchor-spl-token.ts`에 테스트 파일을 생성합니다:

```typescript {% title="tests/anchor-spl-token.ts" showLineNumbers=true highlightLines="17-27,39-53" %}
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorSplToken } from "../target/types/anchor_spl_token";
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { BN } from "bn.js";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

describe("anchor-spl-token", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorSplToken as Program<AnchorSplToken>;
  const payer = provider.wallet;

  it("Creates a token with metadata and mints initial supply", async () => {
    const mintKeypair = Keypair.generate();

    const tokenName = "My Token";
    const tokenSymbol = "MYTKN";
    const tokenUri = "https://example.com/token-metadata.json";
    const tokenDecimals = 9;
    const mintAmount = new BN(1_000_000).mul(new BN(10).pow(new BN(tokenDecimals)));

    // Derive the metadata account PDA
    const [metadataAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Derive the associated token account
    const tokenAccount = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      payer.publicKey
    );

    console.log("Mint address:", mintKeypair.publicKey.toBase58());
    console.log("Metadata address:", metadataAccount.toBase58());
    console.log("Token account:", tokenAccount.toBase58());

    const tx = await program.methods
      .createToken(tokenName, tokenSymbol, tokenUri, tokenDecimals, mintAmount)
      .accountsPartial({
        payer: payer.publicKey,
        mint: mintKeypair.publicKey,
        tokenAccount: tokenAccount,
        metadataAccount: metadataAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();

    console.log("Transaction signature:", tx);
    console.log("Token created and minted successfully!");
  });
});
```

**주요 사항:**
- 메타데이터 계정 PDA는 시드 `["metadata", TOKEN_METADATA_PROGRAM_ID, mint_pubkey]`를 사용하여 파생됩니다 (29-36행)
- 연관 토큰 계정은 `getAssociatedTokenAddressSync`를 사용하여 파생됩니다 (39-42행)
- mint 키페어는 초기화되므로 서명자로 전달해야 합니다
- 계정을 지정하려면 `accountsPartial`을 사용합니다 (Anchor 0.32+ 구문)
- 큰 숫자(소수점이 포함된 토큰 수량)에는 `BN`을 사용합니다
- `tokenDecimals`는 명령어에 전달되어 발행량 계산에 사용됩니다

### 테스트 실행

```bash
yarn install
anchor test
```

예상 출력:

```
  anchor-spl-token
Mint address: GpPyH2FuMcS5PcrKWtrmEkBmW8h8gSwUaxNCQkFXwifV
Metadata address: 6jskfrDAmH9d67iL37CLNBK7Hf6FRwNZbq34q4vGucDq
Token account: J3KCxCfmnK9RJ3onmiUsfBDjvKyuVsAXgWvuypsaFQ2i
Transaction signature: 36v63t5cCsXYM8ny4pgahh...
Token created and minted successfully!
    ✔ Creates a token with metadata and mints initial supply (243ms)

  1 passing (245ms)
```

## 메타데이터 JSON 형식

`uri` 필드는 토큰의 오프체인 메타데이터가 포함된 JSON 파일을 가리켜야 합니다:

```json {% title="token-metadata.json" %}
{
  "name": "My Token",
  "symbol": "MYTKN",
  "description": "A description of my token",
  "image": "https://example.com/token-image.png"
}
```

이 JSON 파일을 Arweave 또는 IPFS와 같은 영구 스토리지 솔루션에 호스팅하세요.

## 일반적인 오류

### `no function or associated item named 'create_type' found`

Cargo.toml의 `idl-build` 기능에 `"anchor-spl/idl-build"`을 추가하세요:

```toml
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
```

### `Program account is not executable`

Anchor.toml에서 Token Metadata 프로그램을 클론하세요:

```toml
[[test.validator.clone]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
```

### `UnspecifiedIpAddr(0.0.0.0)` / 밸리데이터 패닉

Anchor.toml의 `[test.validator]`에 `bind_address = "127.0.0.1"`을 추가하세요.

## 참고 사항

- `amount` 파라미터는 **기본 단위**(소수점 포함)입니다. 소수점 9자리로 100만 토큰의 경우, `1_000_000 * 10^9`를 전달합니다.
- 이 예제에서는 **mint 권한**과 **동결 권한**을 지불자에게 유지합니다. 프로덕션 토큰은 보통 초기 발행 후 이러한 권한을 해제하거나 이전합니다.
- 메타데이터 계정은 **변경 가능**(`is_mutable = true`)합니다. 불변 메타데이터를 원하면 `false`로 설정하세요.

## 다음 단계

- **Devnet에 배포:** Anchor.toml에서 `cluster = "devnet"`으로 변경하고 `anchor deploy` 실행
- **NFT 생성:** 대체 불가능 토큰의 경우 `decimals = 0`과 `supply = 1`로 설정
- **토큰 확장 기능 추가:** 전송 수수료, 이자 발생 토큰 등에 대해 [SPL Token 2022](https://spl.solana.com/token-2022) 탐색
- **Token Metadata에 대해 더 알아보기:** [Token Metadata 문서](/smart-contracts/token-metadata) 참조

## 빠른 참조

### 주요 프로그램 ID

| 프로그램 | 주소 |
|---------|---------|
| Token Program | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |
| Associated Token Program | `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL` |
| Token Metadata Program | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |
| System Program | `11111111111111111111111111111111` |

### 메타데이터 PDA 시드

{% dialect-switcher title="메타데이터 PDA 파생" %}
{% dialect title="TypeScript" id="ts" %}

```typescript {% showLineNumbers=true %}
const [metadataAccount] = PublicKey.findProgramAddressSync(
  [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
  TOKEN_METADATA_PROGRAM_ID
);
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust {% showLineNumbers=true %}
seeds = [b"metadata", token_metadata_program.key().as_ref(), mint.key().as_ref()]
```

{% /dialect %}
{% /dialect-switcher %}

### 최소 의존성

```toml {% title="Cargo.toml" %}
anchor-lang = "0.32.1"
anchor-spl = { version = "0.32.1", features = ["token", "metadata", "associated_token"] }
```

## FAQ

{% callout title="용어" %}
- **대체 가능 토큰:** `decimals >= 0`, 무제한 공급 가능
- **NFT:** `decimals = 0`, `supply = 1`, Master Edition 계정 필요
- **Token Metadata:** 대체 가능 토큰과 NFT 모두에 사용되는 Metaplex 프로그램
- **SPL:** Solana Program Library, 표준 토큰 인터페이스
{% /callout %}

### SPL 토큰이란 무엇인가요?

SPL 토큰은 Ethereum의 ERC-20 토큰에 해당하는 Solana의 토큰입니다. SPL은 Solana Program Library의 약자입니다. SPL 토큰은 통화, 거버넌스 토큰, 스테이블코인 또는 Solana의 기타 대체 가능 자산을 나타낼 수 있는 대체 가능 토큰입니다.

### 토큰 mint와 토큰 계정의 차이점은 무엇인가요?

- **Token Mint:** 토큰을 생성하는 팩토리입니다. 토큰의 속성(소수점, 공급량, 권한)을 정의합니다. 토큰 유형당 하나의 mint가 있습니다.
- **Token Account:** 토큰을 보유하는 지갑입니다. 각 사용자는 보유하려는 각 토큰 유형에 대해 자체 토큰 계정이 필요합니다.

### Associated Token Account (ATA)란 무엇인가요?

Associated Token Account는 주어진 지갑과 mint에 대해 결정론적으로 파생된 토큰 계정입니다. 임의의 토큰 계정을 생성하는 대신, ATA는 표준 파생을 사용하여 누구나 모든 지갑의 토큰 계정 주소를 계산할 수 있습니다. 이것이 토큰 계정을 처리하는 권장 방법입니다.

### Metaplex Token Metadata란 무엇인가요?

Metaplex Token Metadata는 SPL 토큰에 메타데이터(이름, 심볼, 이미지 URI)를 첨부하는 프로그램입니다. 이것이 없으면 토큰은 단순한 익명 mint일 뿐입니다. 메타데이터는 mint와 연관된 Program Derived Address (PDA)에 저장됩니다.

### 로컬 테스트를 위해 Token Metadata 프로그램을 클론하는 이유는 무엇인가요?

로컬 Solana 테스트 밸리데이터는 깨끗한 상태로 시작하며 핵심 Solana 프로그램 외에는 어떤 프로그램도 포함하지 않습니다. Metaplex Token Metadata는 메인넷에 배포된 별도의 프로그램이므로, 로컬에서 사용하려면 클론해야 합니다.

### 이 코드로 NFT를 만들 수 있나요?

네, 다음과 같은 수정이 필요합니다:
- `mint::decimals = 0`으로 설정 (NFT는 분할 불가능)
- 정확히 1개의 토큰만 발행
- 발행 후 mint 권한 제거 (더 이상 생성할 수 없도록)
- Master Edition 계정 추가 (Metaplex NFT 표준용)

### Solana에서 토큰을 생성하는 데 비용이 얼마나 드나요?

토큰 생성에는 세 개의 계정에 대한 렌트가 필요합니다:
- Mint 계정: ~0.00145 SOL
- Token 계정: ~0.00203 SOL
- Metadata 계정: ~0.01 SOL

총합: 약 0.015-0.02 SOL (렌트 가격에 따라 변동).

### Anchor와 네이티브 Solana Rust의 차이점은 무엇인가요?

Anchor는 다음과 같이 Solana 개발을 간소화하는 프레임워크입니다:
- 계정 직렬화/역직렬화 자동 생성
- 매크로를 통한 선언적 계정 검증 제공
- TypeScript 클라이언트 자동 생성
- PDA 및 CPI와 같은 일반적인 패턴 처리

네이티브 Solana Rust는 이러한 모든 사항을 수동으로 처리해야 합니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **SPL Token** | Solana Program Library 토큰 표준, ERC-20에 해당 |
| **Mint** | 토큰을 정의하고 새로운 공급량을 생성할 수 있는 계정 |
| **Token Account** | 특정 토큰의 잔액을 보유하는 계정 |
| **ATA** | Associated Token Account - 지갑에 대한 결정론적 토큰 계정 |
| **PDA** | Program Derived Address - 시드에서 파생된 프로그램 소유 주소 |
| **CPI** | Cross-Program Invocation - 하나의 Solana 프로그램에서 다른 프로그램을 호출하는 것 |
| **Anchor** | Solana 프로그램을 구축하기 위한 Rust 프레임워크 |
| **Metaplex** | Solana에서 NFT 및 토큰 메타데이터를 위한 프로토콜 |
| **IDL** | Interface Definition Language - 프로그램의 인터페이스를 설명 |
| **Rent** | Solana에서 계정을 유지하는 데 필요한 SOL |
