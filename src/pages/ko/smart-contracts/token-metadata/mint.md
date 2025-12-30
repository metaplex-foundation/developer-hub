---
title: 자산 민팅
metaTitle: 자산 민팅 | Token Metadata
description: Token Metadata에서 NFT, SFT 및 프로그래머블 NFT(자산)를 민팅하는 방법을 알아보세요
---

[Token Metadata 개요](/ko/smart-contracts/token-metadata)에서 논의했듯이, Solana의 디지털 자산은 토큰을 설명하는 여러 온체인 계정과 오프체인 데이터로 구성됩니다. 이 페이지에서는 이러한 자산을 민팅하는 과정을 살펴보겠습니다. {% .lead %}

## 민팅 과정

대체 가능한, 반-대체 가능한 또는 대체 불가능한 자산을 민팅하고 싶든, 전체적인 과정은 동일합니다:

1. **오프체인 데이터 업로드.** 먼저 오프체인 데이터가 준비되었는지 확인해야 합니다. 이는 자산을 설명하는 JSON 파일이 어딘가에 저장되어 있어야 한다는 의미입니다. 해당 JSON 파일이 **URI**를 통해 접근 가능한 한, 어떻게 또는 어디에 저장되는지는 중요하지 않습니다.
2. **온체인 계정 생성.** 그런 다음 자산의 데이터를 보유할 온체인 계정을 생성해야 합니다. 어떤 정확한 계정이 생성될지는 자산의 **토큰 표준**에 따라 다르지만, 모든 경우에 **메타데이터** 계정이 생성되고 오프체인 데이터의 **URI**를 저장합니다.
3. **토큰 민팅.** 마지막으로 이 모든 계정과 연관된 토큰을 민팅해야 합니다. 대체 불가능한 자산의 경우, 이는 단순히 0에서 1로 민팅하는 것을 의미합니다. 대체 불가능성은 1보다 큰 공급량을 갖는 것을 금지하기 때문입니다. 대체 가능한 또는 반-대체 가능한 자산의 경우, 원하는 만큼 토큰을 민팅할 수 있습니다.

구체적인 코드 예제를 제공하면서 이러한 단계를 더 자세히 살펴보겠습니다.

## 오프체인 데이터 업로드

오프체인 데이터를 업로드하기 위해 어떤 서비스든 사용하거나 단순히 자신의 서버에 저장할 수 있지만, 우리 SDK 중 일부가 이를 도울 수 있다는 점에 주목할 가치가 있습니다. 이들은 선택한 업로더를 선택할 수 있게 해주고 데이터를 업로드하기 위한 통합된 인터페이스를 제공하는 플러그인 시스템을 사용합니다.

{% dialect-switcher title="자산 및 JSON 데이터 업로드" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const [imageUri] = await umi.uploader.upload([imageFile])
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  // ...
})
```

{% totem-accordion title="업로더 선택" %}

Umi를 사용하여 선택한 업로더를 선택하려면, 업로더에서 제공하는 플러그인을 설치하기만 하면 됩니다.

예를 들어, Arweave 네트워크와 상호 작용하기 위한 irysUploader 플러그인을 설치하는 방법은 다음과 같습니다:

```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

umi.use(irysUploader())
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

이제 **URI**가 있으므로 다음 단계로 넘어갈 수 있습니다.

{% callout %}
다음 단계들은 계정을 생성하고 토큰을 민팅하는 방법을 두 단계로 보여줍니다. [페이지 하단](#create-helpers)에는 이러한 단계를 결합하여 다양한 토큰 유형을 더 쉽게 만들 수 있는 헬퍼에 대한 **코드 예제**가 있습니다.
{% /callout %}

## Mint 및 Metadata 계정 생성

선택한 토큰 표준에 필요한 모든 온체인 계정을 생성하려면, 단순히 **Create V1** 명령어를 사용할 수 있습니다. 이는 요청된 토큰 표준에 적응하여 그에 따라 올바른 계정을 생성합니다.

예를 들어, `NonFungible` 자산은 `Metadata` 계정과 `MasterEdition` 계정을 생성하는 반면, `Fungible` 자산은 `Metadata` 계정만 생성합니다.

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node label="Freeze Authority = Edition" /%}
{% /node %}
{% node parent="mint-1" y="-20" x="-10" label="NonFungible (에디션 및 pNFT 포함)" theme="transparent" /%}

{% node parent="mint-1" x="220" #metadata-1-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-1-pda" x="140" %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = NonFungible" /%}
{% /node %}

{% node parent="mint-1" x="220" y="100" #master-edition-pda label="PDA" theme="crimson" /%}
{% node parent="master-edition-pda" x="140" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}
{% node parent="master-edition" y="80" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node parent="mint-1" y="260" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals = 0" /%}
{% /node %}
{% node parent="mint-2" y="-20" x="-10" label="FungibleAsset" theme="transparent" /%}

{% node parent="mint-2" x="220" #metadata-2-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-2-pda" x="140" %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = FungibleAsset" /%}
{% /node %}

{% node parent="mint-2" y="120" %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals > 0" /%}
{% /node %}
{% node parent="mint-3" y="-20" x="-10" label="Fungible" theme="transparent" /%}

{% node parent="mint-3" x="220" #metadata-3-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-3-pda" x="140" %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = Fungible" /%}
{% /node %}

{% edge from="mint-1" to="metadata-1-pda" path="straight" /%}
{% edge from="metadata-1-pda" to="metadata-1" path="straight" /%}
{% edge from="mint-1" to="master-edition-pda" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" label="OR" /%}

{% edge from="mint-2" to="metadata-2-pda" path="straight" /%}
{% edge from="metadata-2-pda" to="metadata-2" path="straight" /%}
{% edge from="mint-3" to="metadata-3-pda" path="straight" /%}
{% edge from="metadata-3-pda" to="metadata-3" path="straight" /%}
{% /diagram %}

또한 제공된 **Mint** 계정이 존재하지 않으면 우리를 위해 생성됩니다. 이런 방식으로 메타데이터를 추가하기 전에 토큰을 준비하기 위해 기본 Token 프로그램을 호출할 필요가 없습니다.

이 명령어는 다양한 매개변수를 받으며 우리의 SDK는 매번 모든 것을 채울 필요가 없도록 기본값을 제공하기 위해 최선을 다합니다. 그렇긴 하지만, 관심이 있을 수 있는 매개변수 목록은 다음과 같습니다:

- **Mint**: 자산의 Mint 계정. 존재하지 않으면 초기화될 것이므로 서명자로 제공되어야 합니다. 일반적으로 이 목적을 위해 새로운 키페어를 생성합니다.
- **Authority**: Mint 계정의 권한. 이는 Mint 계정에서 토큰을 민팅할 수 있도록 허용된 계정입니다. SDK에서 지원하는 경우 "Identity" 지갑(즉, 연결된 지갑)으로 기본 설정됩니다.
- **Name**, **URI**, **Seller Fee Basis Points**, **Creators** 등: **Metadata** 계정에 저장할 자산의 데이터.
- **Token Standard**: 자산의 토큰 표준.

{% callout %}
`createV1`는 Mint 계정을 초기화하고 Metadata 계정을 생성할 수 있는 헬퍼 함수입니다. mint가 이미 존재하는 경우 메타데이터 계정만 생성합니다. [`createMetadataAccountV3`](https://mpl-token-metadata-js-docs.vercel.app/functions/createMetadataAccountV3.html) 사용 방법을 찾고 있다면 대신 이 함수를 사용해야 합니다.
{% /callout %}

{% dialect-switcher title="온체인 계정 생성" %}
{% dialect title="JavaScript - Umi" id="js-umi" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import {
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createV1(umi, {
  mint,
  authority,
  name: 'My NFT',
  uri,
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust Script" id="rust-script" %}
{% totem %}

```rust
use mpl_token_metadata::{
    instructions::CreateV1Builder,
    types::{PrintSupply, TokenStandard},
};
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};

// 1. client는 초기화된 RpcClient에 대한 참조입니다
// 2. 모든 계정은 그들의 공개키로 지정됩니다

let client = ...;

let create_ix = CreateV1Builder::new()
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint.pubkey(), true)
    .authority(payer.pubkey())
    .payer(payer.pubkey())
    .update_authority(payer.pubkey(), false)
    .name(String::from("My NFT"))
    .uri(uri)
    .seller_fee_basis_points(550)
    .token_standard(TokenStandard::NonFungible)
    .print_supply(PrintSupply::Zero)
    .instruction();

let message = Message::new(
    &[create_ix],
    Some(&payer.pubkey()),
);

let blockhash = client.get_latest_blockhash()?;
let mut tx = Transaction::new(&[mint, payer], message, blockhash);
client.send_and_confirm_transaction(&tx)?;
```

{% totem-prose %}

`mint` 계정을 설정할 때, 계정이 서명자인지 여부를 나타내는 `bool` 플래그를 지정해야 한다는 점에 주목하세요 – `mint` 계정이 존재하지 않는 경우 서명자여야 합니다.

{% /totem-prose %}

{% /totem %}

{% /dialect %}

{% dialect title="Rust MPL SDK - CPI" id="rust-cpi" %}

```rust
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::CreateV1CpiBuilder,
    types::{PrintSupply, TokenStandard},
};

// 1. 모든 계정은 그들의 AccountInfo에 대한 참조로 지정됩니다

let create_cpi = CreateV1CpiBuilder::new(token_metadata_program_info)
    .metadata(metadata_info)
    .mint(mint_info, true)
    .authority(payer_info)
    .payer(payer_info)
    .update_authority(update_authority_info, false)
    .master_edition(Some(master_edition_info))
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .token_standard(TokenStandard::NonFungible)
    .name(String::from("My NFT"))
    .uri(uri)
    .seller_fee_basis_points(550)
    .token_standard(TokenStandard::NonFungible)
    .print_supply(PrintSupply::Zero);

create_cpi.invoke();
```

{% /dialect %}
{% /dialect-switcher %}

## 토큰 민팅

자산에 대한 모든 온체인 계정이 생성되면, 그에 대한 토큰을 민팅할 수 있습니다. 자산이 대체 불가능한 경우 단순히 그 하나뿐인 토큰을 민팅하고, 그렇지 않으면 원하는 만큼 토큰을 민팅할 수 있습니다. 대체 불가능한 자산은 고유한 토큰이 민팅되어야만 유효하므로 해당 토큰 표준에 필수적인 단계라는 점에 주목하세요.

이를 달성하기 위해 Token Metadata 프로그램의 **Mint V1** 명령어를 사용할 수 있습니다. 다음 매개변수가 필요합니다:

- **Mint**: 자산의 Mint 계정 주소.
- **Authority**: 이 명령어를 승인할 수 있는 권한. 대체 불가능한 자산의 경우, 이는 **Metadata** 계정의 업데이트 권한이고, 그렇지 않으면 Mint 계정의 **Mint Authority**를 참조합니다.
- **Token Owner**: 토큰을 받을 지갑의 주소.
- **Amount**: 민팅할 토큰의 수. 대체 불가능한 자산의 경우, 이는 1만 가능합니다.
- **Token Standard**: 자산의 토큰 표준(**JavaScript SDK에 필요**). 프로그램은 이 인수를 필요로 하지 않지만 우리의 SDK는 다른 대부분의 매개변수에 대해 적절한 기본값을 제공할 수 있도록 필요로 합니다.

{% dialect-switcher title="토큰 민팅" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

await mintV1(umi, {
  mint: mint.publicKey,
  authority,
  amount: 1,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
{% totem %}

```rust
use mpl_token_metadata::instructions::MintV1Builder;
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};

// 1. client는 초기화된 RpcClient에 대한 참조입니다
// 2. 모든 계정은 그들의 공개키로 지정됩니다

let client = ...;

let mint_ix = MintV1Builder::new()
    .token(token)
    .token_owner(Some(token_owner))
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint)
    .authority(update_authority)
    .payer(payer)
    .amount(1)
    .instruction();

let message = Message::new(
    &[mint_ix],
    Some(&payer.pubkey()),
);

let blockhash = client.get_latest_blockhash()?;
let mut tx = Transaction::new(&[update_authority, payer], message, blockhash);
client.send_and_confirm_transaction(&tx)?;
```

{% totem-prose %}

`NonFungible`을 민팅하는 데 필요하므로 `master_edition`을 설정하고 있습니다; `token` 계정이 존재하지 않고 하나가 초기화될 경우 `token_owner`가 필요합니다.

{% /totem-prose %}

{% /totem %}
{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
use mpl_token_metadata::instructions::MintV1CpiBuilder;

// 1. 모든 계정은 그들의 AccountInfo에 대한 참조로 지정됩니다

let mint_cpi = MintV1CpiBuilder::new(token_metadata_program_info)
    .token(token_info)
    .token_owner(Some(token_owner_info))
    .metadata(metadata_info)
    .master_edition(Some(master_edition_info))
    .mint(mint_info)
    .payer(payer_info)
    .authority(update_authority_info)
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .spl_ata_program(spl_ata_program_info)
    .amount(1);

mint_cpi.invoke();
```

{% /dialect %}
{% /dialect-switcher %}

## 생성 헬퍼

디지털 자산 생성이 Token Metadata의 중요한 부분이므로, 우리의 SDK는 프로세스를 더 쉽게 만들기 위한 헬퍼 메서드를 제공합니다. 즉, 이러한 헬퍼 메서드는 생성하려는 토큰 표준에 따라 **Create V1**과 **Mint V1** 명령어를 다양한 방식으로 결합합니다.

{% dialect-switcher title="생성 헬퍼" %}
{% dialect title="JavaScript" id="js" %}

{% totem-accordion title="NonFungible 생성" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  // 직접 컬렉션에 추가하고 싶다면 선택적. 나중에 검증이 필요.
  // collection: some({ key: collectionMint.publicKey, verified: false }),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Fungible 생성" %}

```ts
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { createFungible } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungible(umi, {
  mint,
  name: 'My Fungible',
  uri: 'https://example.com/my-fungible.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(7), // 0 소수점의 경우 some(0) 사용
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="FungibleAsset 생성" %}

```ts
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { createFungibleAsset } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungibleAsset(umi, {
  mint,
  name: 'My Fungible Asset',
  uri: 'https://example.com/my-fungible-asset.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(7) // 0 소수점의 경우 some(0) 사용
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="ProgrammableNonFungible 생성" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createProgrammableNft(umi, {
  mint,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  // 직접 컬렉션에 추가하고 싶다면 선택적. 나중에 검증이 필요.
  // collection: some({ key: collectionMint.publicKey, verified: false }),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% /dialect %}

{% dialect title="Rust" id="rust" %}
<!-- 이 버전의 문서에서는 Rust 헬퍼 예제가 제공되지 않습니다 -->
{% /dialect %}
{% /dialect-switcher %}