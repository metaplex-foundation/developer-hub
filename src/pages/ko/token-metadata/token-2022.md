---
title: Token Metadata의 SPL Token-2022
metaTitle: SPL Token-2022 | Token Metadata
description: SPL Token-2022가 Token Metadata와 통합되는 방법에 대해 알아보세요
---

SPL Token-2022는 Solana 블록체인에서 대체 가능 토큰과 대체 불가능 토큰을 생성하는 데 사용할 수 있는 최신 토큰 프로그램입니다. SPL Token 프로그램과 동일한 기능과 구조를 지원하지만, 새로운 기능을 추가하기 위한 확장 세트도 포함되어 있습니다.

Token-2022 민트 계정에 메타데이터 정보 추가를 지원하기 위해, 원하는 토큰 프로그램을 지정할 수 있도록 Token Metadata 명령어 세트가 업데이트되었습니다. 예를 들어, Token Metadata는 `Create` 및 `Mint` 명령어를 사용하고 SPL Token-2022를 사용할 토큰 프로그램으로 지정하여 Token-2022 민트를 초기화하고, 메타데이터를 생성하고, 토큰을 민팅할 수 있습니다.

{% totem %}

{% dialect-switcher title="Create 및 Mint에서 토큰 프로그램 지정" %}
{% dialect title="JavaScript" id="js" %}

{% totem-accordion title="메타데이터 생성" %}

```ts
import {
  generateSigner,
  percentAmount,
  publicKey,
  PublicKey,
} from '@metaplex-foundation/umi'
import {
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
)

const mint = generateSigner(umi)
await createV1(umi, {
  mint,
  authority,
  name: 'My NFT',
  uri,
  sellerFeeBasisPoints: percentAmount(5.5),
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="토큰 민팅" %}

```ts
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
)

const token = findAssociatedTokenPda(umi, {
  mint: mint.publicKey,
  owner: umi.identity.publicKey,
  tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
})

await mintV1(umi, {
  mint: mint.publicKey,
  token,
  authority,
  amount: 1,
  tokenOwner,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% /dialect %}

{% dialect title="Rust" id="rust" %}

{% totem-accordion title="메타데이터 생성" %}

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
// 2. 모든 계정은 pubkey로 지정됩니다

let client = ...;

let create_ix = CreateV1Builder::new()
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint.pubkey(), true)
    .authority(payer.pubkey())
    .payer(payer.pubkey())
    .update_authority(payer.pubkey(), false)
    .spl_token_program(spl_token_2022::id())
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

{% /totem-accordion  %}

{% totem-accordion title="토큰 민팅" %}

```rust
use mpl_token_metadata::instructions::MintV1Builder;
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};

// 1. client는 초기화된 RpcClient에 대한 참조입니다
// 2. 모든 계정은 pubkey로 지정됩니다

let client = ...;

let mint_ix = MintV1Builder::new()
    .token(token)
    .token_owner(Some(token_owner))
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint)
    .authority(update_authority)
    .payer(payer)
    .spl_token_program(spl_token_2022::id())
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

{% /totem-accordion  %}

{% /dialect %}

{% /dialect-switcher %}
{% totem-prose %}

민트 계정의 토큰 프로그램은 계정의 `owner` 속성을 확인하여 결정할 수 있습니다.

{% /totem-prose %}

{% /totem %}

`Burn`, `Delegate`, `Lock`, `Print`, `Revoke`, `Transfer`, `Unlock`, `Unverify`, `Update`, `Verify`와 같은 다른 명령어에도 유사한 접근 방식을 사용할 수 있습니다. 이러한 명령어는 SPL Token-2022의 민트 및 토큰 계정을 검증할 수 있습니다. 토큰 프로그램이 필요한 모든 명령어(예: `Delegate`)에서는 해당 토큰 프로그램을 사용해야 합니다: 민트와 토큰 계정이 Token-2022에서 온 것이라면, `Delegate` 명령어는 올바른 토큰 프로그램이 지정되었는지 검증할 것입니다.

{% callout %}
기본적으로, `Create`와 `Mint`는 이러한 계정이 존재하지 않으면 SPL Token 민트와 토큰 계정을 생성합니다. Token-2022 계정을 사용하려면, 사용할 토큰 프로그램으로 SPL Token-2022를 지정해야 합니다.
{% /callout %}

## 지원되는 확장

Token-2022는 여러 확장을 제공하지만, 대부분의 확장은 대체 가능 토큰에 초점을 맞춥니다. 예를 들어, `confidential transfer`는 전송된 토큰 양을 숨기는 데 사용할 수 있습니다. 이는 다양한 전송에서 양이 다를 수 있으므로 대체 가능 토큰에는 관련이 있지만, 공급량이 항상 `1`이고 소수점이 항상 `0`인 대체 불가능 토큰에는 적용되지 않습니다. 따라서 대체 불가능 토큰의 전송 양은 항상 `1`이 됩니다.

Token Metadata는 `Token Standard`를 기반으로 민트 및 토큰 계정에 존재할 수 있는 확장 유형에 대한 제한을 시행합니다. 대체 가능 자산(`Fungible` 및 `FungibleAsset` 표준)의 경우 제한이 없습니다 – 유일한 제한은 메타데이터 정보를 제공하는 프로그램에 대한 것입니다. 대체 불가능 자산(`NonFungible` 및 `ProgrammableNonFungible` 표준)의 경우, Token Metadata는 어떤 확장이 활성화되었는지 검증하고 사용할 수 있는 확장 세트를 제한합니다.

### 민트 계정 확장

다음은 SPL Token-2022의 민트 계정에서 활성화할 수 있는 확장들입니다.

- `confidential transfers`: 전송 중 양을 숨깁니다.

  | 자산     | 대체 가능 | 대체 불가능                                               |
  | ------- | -------- | ----------------------------------------------------- |
  | 허용됨   | ✅       | ❌                                                    |
  | 세부사항 | --       | 대체 불가능 토큰은 공급량이 `1`이므로 적용되지 않음 |

---

- `transfer fees`: 전송되는 양에서 파생된 전송 수수료를 구성할 수 있게 합니다.

  | 자산     | 대체 가능 | 대체 불가능                                               |
  | ------- | -------- | ----------------------------------------------------- |
  | 허용됨   | ✅       | ❌                                                    |
  | 세부사항 | --       | 대체 불가능 토큰은 공급량이 `1`이므로 적용되지 않음 |

---

- `closing mint`: 공급량이 `0`에 도달했을 때 민트 계정을 닫을 수 있게 합니다.

| 자산     | 대체 가능                                                   | 대체 불가능                                                                     |
| ------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 허용됨   | ✅                                                         | ❌                                                                               |
| 세부사항 | 닫기 권한으로 `Metadata` 계정을 지정해야 함 | 크리에이터가 동일한 민트 및 메타데이터 계정 그룹을 다시 생성할 가능성 |

---

- `interest-bearing tokens`: 토큰의 UI 양이 표현되는 방법을 변경할 수 있게 합니다.

  | 자산     | 대체 가능 | 대체 불가능                                               |
  | ------- | -------- | ----------------------------------------------------- |
  | 허용됨   | ✅       | ❌                                                    |
  | 세부사항 | --       | 대체 불가능 토큰은 공급량이 `1`이므로 적용되지 않음 |

---

- `non-transferable tokens`: 다른 주소로 이동할 수 없는 "영혼에 바인딩된" 토큰을 허용합니다.

  | 자산     | 대체 가능 | 대체 불가능 |
  | ------- | -------- | ------------ |
  | 허용됨   | ✅       | ✅           |
  | 세부사항 | --       | --           |

---

- `permanent delegate`: 민트의 모든 토큰 계정에 대한 영구 계정 위임자를 지정할 수 있게 합니다.

  | 자산     | 대체 가능 | 대체 불가능                          |
  | ------- | -------- | ------------------------------------- |
  | 허용됨   | ✅       | ❌                                    |
  | 세부사항 | --       | 이는 소유권 개념을 변경합니다 |

---

- `transfer hook`: 전송 중에 서드파티 프로그램을 호출할 수 있게 합니다.

  | 자산     | 대체 가능 | 대체 불가능                                    |
  | ------- | -------- | ----------------------------------------------- |
  | 허용됨   | ✅       | ❌                                              |
  | 세부사항 | --       | Token Metadata가 전송 로직을 지정합니다 |

---

- `metadata pointer`: 표준 메타데이터를 설명하는 주소를 추가할 수 있게 합니다.

  | 자산     | 대체 가능                             | 대체 불가능                         |
  | ------- | ------------------------------------ | ------------------------------------ |
  | 허용됨   | ✅                                   | ✅                                   |
  | 세부사항 | `Metadata` 주소를 가리켜야 함 | `Metadata` 주소를 가리켜야 함 |

---

- `metadata`: 민트 계정에 직접 메타데이터를 추가할 수 있게 합니다.

  | 자산     | 대체 가능                                        | 대체 불가능                                    |
  | ------- | ----------------------------------------------- | ----------------------------------------------- |
  | 허용됨   | ❌                                              | ❌                                              |
  | 세부사항 | 메타데이터 정보는 Token Metadata에 의해 추가됩니다 | 메타데이터 정보는 Token Metadata에 의해 추가됩니다 |

---

### 토큰 계정 확장

다음은 SPL Token-2022의 토큰 계정에서 활성화할 수 있는 확장들입니다.

- `memo required`: 전송 시 메모를 요구합니다.

  | 자산     | 대체 가능 | 대체 불가능   |
  | ------- | -------- | -------------- |
  | 허용됨   | ✅       | ❌             |
  | 세부사항 | --       | 적용되지 않음 |

---

- `immutable ownership`: 토큰 계정의 소유권을 변경하는 기능을 비활성화합니다.

  | 자산     | 대체 가능 | 대체 불가능 |
  | ------- | -------- | ------------ |
  | 허용됨   | ✅       | ✅           |
  | 세부사항 | --       | --           |

---

- `default account state`: 기본 토큰 계정 상태를 구성할 수 있게 합니다.

  | 자산     | 대체 가능 | 대체 불가능                               |
  | ------- | -------- | ------------------------------------------ |
  | 허용됨   | ✅       | ❌                                         |
  | 세부사항 | --       | Token Metadata가 계정 상태를 검증합니다 |

---

- `CPI guard`: 크로스 프로그램 호출 내에서 특정 작업(예: 전송)을 방지합니다.

  | 자산     | 대체 가능 | 대체 불가능                                    |
  | ------- | -------- | ----------------------------------------------- |
  | 허용됨   | ✅       | ❌                                              |
  | 세부사항 | --       | Token Metadata가 전송 로직을 지정합니다 |

---

{% callout %}
각 확장에 대한 포괄적인 개요는 SPL Token-2022 프로그램 [문서](https://spl.solana.com/token-2022)에서 찾을 수 있습니다.
{% /callout %}

### 기본 확장

민트 계정이 존재하지 않을 때, `Create` 명령어가 하나를 초기화합니다. 사용되는 토큰 프로그램이 SPL Token-2022인 경우, 민트는 `closing mint`와 `metadata pointer` 확장 모두로 초기화됩니다.

연관 토큰 계정(ATA)은 기본적으로 항상 `immutable ownership` 확장으로 초기화됩니다.