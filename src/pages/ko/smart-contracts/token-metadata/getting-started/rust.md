---
title: Rust를 사용하여 시작하기
metaTitle: Rust SDK | Token Metadata
description: Token Metadata Rust SDK를 사용하여 NFT를 시작하세요
---

Rust 개발자라면 Token Metadata 프로그램과 상호작용하기 위해 Rust 클라이언트 SDK를 사용할 수도 있습니다. Metaplex는 최소한의 종속성을 가진 경량 크레이트인 전용 Rust 클라이언트 크레이트를 제공합니다.

시작하려면 프로젝트에 `mpl-token-metadata` 종속성을 추가해야 합니다. 프로젝트의 루트 폴더에서 터미널에서:
```
cargo add mpl-token-metadata
```
이렇게 하면 프로젝트의 종속성 목록에 크레이트의 최신 버전이 추가됩니다.

{% callout %}

1.16 이전 버전의 solana-program을 사용하고 있다면, 먼저 프로젝트에 `solana-program` 종속성을 추가한 다음 `mpl-token-metadata`를 추가하세요. 이렇게 하면 `borsh` 크레이트의 사본을 하나만 가지게 됩니다.

{% /callout %}

## 🧱 구조

클라이언트 SDK는 여러 모듈로 나뉩니다:

- `accounts`: 프로그램의 계정을 나타내는 구조체
- `errors`: 프로그램 오류를 나타내는 열거형
- `instructions`: 클라이언트(오프체인)와 프로그램(온체인)에서 명령어 생성을 용이하게 하는 구조체, 그리고 명령어 인수
- `types`: 프로그램에서 사용하는 타입을 나타내는 구조체

탐색을 시작하기 좋은 지점은 Token Metadata와 상호작용하는 명령어를 만드는 데 도움이 되는 `instructions` 모듈입니다. 이들은 유연하고 사용하기 쉽도록 설계되었습니다. 명령어에 추가 타입이 필요한 경우, 이들은 `types` 모듈에서 참조됩니다. Token Metadata 계정의 내용을 역직렬화하려면, `accounts` 모듈에 각 계정을 나타내는 구조체와 내용을 역직렬화하는 도우미 메서드가 있습니다.

## 🏗️ 명령어 빌더

클라이언트 SDK의 주요 기능 중 하나는 명령어 생성을 용이하게 하는 것입니다. 오프체인 또는 온체인 코드를 작성하는지에 따라 두 가지 _유형_의 명령어 빌더가 있으며, 둘 다 이름으로 계정을 전달하고 선택적 위치 계정을 지원합니다.

### 클라이언트 (오프체인)

이들은 오프체인 클라이언트 코드에서 사용하도록 의도되었습니다. 각 명령어는 구조체로 표현되며, 그 필드는 필요한 계정의 `Pubkey`입니다.

{% totem %}
{% totem-prose %}

`CreateV1` 명령어 구조체:

{% /totem-prose %}

```rust
pub struct CreateV1 {
    /// ['metadata', program id, mint id]의 pda 주소를 가진
    /// 할당되지 않은 메타데이터 계정
    pub metadata: Pubkey,

    /// ['metadata', program id, mint, 'edition']의 pda 주소를 가진
    /// 할당되지 않은 에디션 계정
    pub master_edition: Option<Pubkey>,

    /// 토큰 자산의 민트
    pub mint: (Pubkey, bool),

    /// 민트 권한
    pub authority: Pubkey,

    /// 지불자
    pub payer: Pubkey,

    /// 메타데이터 계정의 업데이트 권한
    pub update_authority: (Pubkey, bool),

    /// 시스템 프로그램
    pub system_program: Pubkey,

    /// 명령어 sysvar 계정
    pub sysvar_instructions: Pubkey,

    /// SPL Token 프로그램
    pub spl_token_program: Pubkey,
}
```

{% /totem %}

명령어 계정 필드를 채운 후, `instruction(...)` 메서드를 사용하여 해당 Solana `Instruction`을 생성할 수 있습니다:

{% totem %}
{% totem-prose %}

`CreateV1`용 `Instruction` 생성:

{% /totem-prose %}

```rust
// 명령어 인수
let args = CreateV1InstructionArgs {
    name: String::from("My pNFT"),
    symbol: String::from("MY"),
    uri: String::from("https://my.pnft"),
    seller_fee_basis_points: 500,
    primary_sale_happened: false,
    is_mutable: true,
    token_standard: TokenStandard::ProgrammableNonFungible,
    collection: None,
    uses: None,
    collection_details: None,
    creators: None,
    rule_set: None,
    decimals: Some(0),
    print_supply: Some(PrintSupply::Zero),
};

// 명령어 계정
let create_ix = CreateV1 {
    metadata,
    master_edition: Some(master_edition),
    mint: (mint_pubkey, true),
    authority: payer_pubkey,
    payer: payer_pubkey,
    update_authority: (payer_pubkey, true),
    system_program: system_program::ID,
    sysvar_instructions: solana_program::sysvar::instructions::ID,
    spl_token_program: spl_token::ID,
};

// 명령어 생성
let create_ix = create_ix.instruction(args);
```

{% /totem %}

이 시점에서 `create_ix`는 트랜잭션에 추가되어 처리를 위해 전송될 준비가 된 `Instruction`입니다.

위의 예제에서 선택적 인수에 값을 제공할 필요가 없더라도 여전히 `None`을 지정해야 한다는 것을 아마 알아차렸을 것입니다. 명령어 생성을 더욱 용이하게 하기 위해 `*Builder` _동반_ 구조체를 사용할 수 있습니다.

{% totem %}
{% totem-prose %}

`CreateV1Builder`를 사용하여 `Instruction` 생성:

{% /totem-prose %}

```rust
let create_ix = CreateV1Builder::new()
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint_pubkey, true)
    .authority(payer_pubkey)
    .payer(payer_pubkey)
    .update_authority(payer_pubkey, true)
    .is_mutable(true)
    .primary_sale_happened(false)
    .name(String::from("My pNFT"))
    .uri(String::from("https://my.pnft"))
    .seller_fee_basis_points(500)
    .token_standard(TokenStandard::ProgrammableNonFungible)
    .print_supply(PrintSupply::Zero)
    .instruction();
```

{% /totem %}

최종 결과는 트랜잭션에 추가되어 처리를 위해 전송되는 동일한 `create_ix` 명령어입니다.

### 크로스 프로그램 호출 (온체인)

Token Metadata와 상호작용해야 하는 프로그램을 작성할 때는 온체인 크로스 프로그램 호출(CPI) 빌더를 사용할 수 있습니다. 이들은 오프체인 빌더와 유사하게 작동하지만, 주요 차이점은 `Pubkey` 대신 `AccountInfo` 참조를 기대한다는 것입니다.

{% totem %}
{% totem-prose %}

`TransferV1Cpi` 명령어 구조체:

{% /totem-prose %}

```rust
pub struct TransferV1Cpi<'a> {
    /// 호출할 프로그램.
    pub __program: &'a AccountInfo<'a>,

    /// 토큰 계정
    pub token: &'a AccountInfo<'a>,

    /// 토큰 계정 소유자
    pub token_owner: &'a AccountInfo<'a>,

    /// 목적지 토큰 계정
    pub destination_token: &'a AccountInfo<'a>,

    /// 목적지 토큰 계정 소유자
    pub destination_owner: &'a AccountInfo<'a>,

    /// 토큰 자산의 민트
    pub mint: &'a AccountInfo<'a>,

    /// 메타데이터 (['metadata', program id, mint id]의 pda)
    pub metadata: &'a AccountInfo<'a>,

    /// 토큰 자산의 에디션
    pub edition: Option<&'a AccountInfo<'a>>,

    /// 소유자 토큰 레코드 계정
    pub token_record: Option<&'a AccountInfo<'a>>,

    /// 목적지 토큰 레코드 계정
    pub destination_token_record: Option<&'a AccountInfo<'a>>,

    /// 전송 권한 (토큰 소유자 또는 위임자)
    pub authority: &'a AccountInfo<'a>,

    /// 지불자
    pub payer: &'a AccountInfo<'a>,

    /// 시스템 프로그램
    pub system_program: &'a AccountInfo<'a>,

    /// 명령어 sysvar 계정
    pub sysvar_instructions: &'a AccountInfo<'a>,

    /// SPL Token 프로그램
    pub spl_token_program: &'a AccountInfo<'a>,

    /// SPL Associated Token Account 프로그램
    pub spl_ata_program: &'a AccountInfo<'a>,

    /// Token Authorization Rules 프로그램
    pub authorization_rules_program: Option<&'a AccountInfo<'a>>,

    /// Token Authorization Rules 계정
    pub authorization_rules: Option<&'a AccountInfo<'a>>,

    /// 명령어의 인수.
    pub __args: TransferV1InstructionArgs,
}
```

{% /totem %}

명령어 구조체는 세 가지 다른 정보가 필요합니다: (1) CPI할 프로그램 – `__program` 필드; (2) `AccountInfo`에 대한 참조로 표현되는 가변 계정 목록; (3) 명령어 인수 – `__args` 필드. 구조체 생성을 단순화하기 위해 `new(...)` 팩토리 메서드가 있습니다. 프로그램, 명령어 계정 및 인수 필드를 채운 후, `invoke()` 또는 `invoke_signed(...)` 메서드를 사용하여 CPI를 수행할 수 있습니다.

{% totem %}
{% totem-prose %}

`TransferV1Cpi` 명령어 호출:

{% /totem-prose %}

```rust
// 명령어 생성
let cpi_transfer = TransferV1Cpi::new(
    metadata_program_info,
    TransferV1CpiAccounts {
        token: owner_token_info,
        token_owner: owner_info,
        destination_token: destination_token_info,
        destination_owner: destination_info,
        mint: mint_info,
        metadata: metadata_info,
        authority: vault_info,
        payer: payer_info,
        system_program: system_program_info,
        sysvar_instructions: sysvar_instructions_info,
        spl_token_program: spl_token_program_info,
        spl_ata_program: spl_ata_program_info,
        edition: edition_info,
        token_record: None,
        destination_token_record: None,
        authorization_rules: None,
        authorization_rules_program: None,
    },
    TransferV1InstructionArgs {
        amount,
        authorization_data: None,
    },
);

// CPI 수행
cpi_transfer.invoke_signed(&[&signer_seeds])
```

{% /totem %}

값을 전달하지 않는 모든 선택적 계정/인수에 대해 여전히 `None`으로 설정해야 한다는 것을 (다시) 아마 알아차렸을 것입니다. 오프체인 명령어와 유사하게, CPI 명령어에는 _동반_ `*Builder` 구조체가 있습니다.

{% totem %}
{% totem-prose %}

`TransferV1CpiBuilder`를 사용하여 `TransferV1Cpi` 명령어 호출:

{% /totem-prose %}

```rust
// 명령어 생성
let cpi_transfer = TransferV1CpiBuilder::new(metadata_program_info)
    .token(owner_token_info)
    .token_owner(owner_info)
    .destination_token(destination_token_info)
    .destination_owner(destination_info)
    .mint(mint_info)
    .metadata(metadata_info)
    .edition(edition_info)
    .authority(vault_info)
    .payer(payer_info)
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .spl_ata_program(spl_ata_program_info)
    .amount(amount);

// CPI 수행
cpi_transfer.invoke_signed(&[&signer_seeds])
```

{% /totem %}

## 🔎 PDA 도우미

SDK의 또 다른 유용한 도우미 세트는 PDA 조회입니다. PDA를 나타내는 계정 유형(예: `Metadata`)은 PDA `Pubkey`를 찾기/생성하는 연관 함수를 가지고 있습니다.

{% totem %}
{% totem-prose %}

`find_pda` 및 `create_pda` 도우미 메서드의 구현:

{% /totem-prose %}

```rust
impl Metadata {
    pub fn find_pda(mint: Pubkey) -> (Pubkey, u8) {
        Pubkey::find_program_address(
            &[
                "metadata".as_bytes(),
                crate::MPL_TOKEN_METADATA_ID.as_ref(),
                mint.as_ref(),
            ],
            &crate::MPL_TOKEN_METADATA_ID,
        )
    }

    pub fn create_pda(
        mint: Pubkey,
        bump: u8,
    ) -> Result<Pubkey, PubkeyError> {
        Pubkey::create_program_address(
            &[
                "metadata".as_bytes(),
                crate::MPL_TOKEN_METADATA_ID.as_ref(),
                mint.as_ref(),
                &[bump],
            ],
            &crate::MPL_TOKEN_METADATA_ID,
        )
    }
}
```

{% totem-prose %}

`find_pda` 메서드는 일반적으로 오프체인 클라이언트에서 사용됩니다:

```rust
let (metadata_pubkey, _) = Metadata::find_pda(mint);
```
{% /totem-prose %}
{% totem-prose %}

`create_pda` 메서드는 `find_pda`에 비해 컴퓨트 유닛을 절약할 수 있으므로 온체인에서 사용하는 것을 권장하지만, PDA 파생을 생성하는 데 사용된 `bump`를 저장해야 합니다:

```rust
let metadata_pubkey = Metadata::create_pda(mint, bump)?;
```

{% /totem-prose %}
{% /totem %}

## 🔗 유용한 링크

- [GitHub 저장소](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/clients/rust)
- [크레이트 페이지](https://crates.io/crates/mpl-token-metadata)
- [API 참조](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/index.html)
