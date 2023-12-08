---
title: SPL Token-2022 on Token Metadata
metaTitle: Token Metadata - SPL Token-2022
description: Learn about how SPL Token-2022 is integrated with Token Metadata
---

SPL Token-2022 is the latest token program on the Solana blokchain that can be used to create fungible and non-fungible tokens. It supports the same functionalities and structures of the SPL Token program, but also includes a set of extensions to add new functionalities.

In order to support adding metadata information to Token-2022 mint accounts, a set of Token Metadata instructions have been updated to allow specified the desired token program. For example, Token Metadata can initialize a Token-2022 mint, create metadata and mint tokens using the `Create` and `Mint` instructions and specifying the SPL Token-2022 as the token program to use.

{% dialect-switcher title="Specifying token program on Create and Mint" %}
{% dialect title="JavaScript" id="js" %}

{% totem-accordion title="Create Metadata" %}

```ts
import {
  generateSigner,
  percentAmount,
  publicKey,
  PublicKey
} from '@metaplex-foundation/umi'
import {
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);

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

{% totem-accordion title="Mint a token" %}

```ts
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);

await mintV1(umi, {
  mint: mint.publicKey,
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

{% totem-accordion title="Create Metadata" %}

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

// 1. client is a reference to the initialized RpcClient
// 2. every account is specified by their pubkey

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

{% totem-accordion title="Mint a token" %}

```rust
use mpl_token_metadata::instructions::MintV1Builder;
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};

// 1. client is a reference to the initialized RpcClient
// 2. every account is specified by their pubkey

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

A similar approach can be used for other instructions, such as `Burn`, `Delegate`, `Lock`, `Print`, `Revoke`, `Transfer`, `Unlock`, `Unverify`, `Update`and `Verify`. These instruction can validate mint and token accounts from SPL Token-2022. The corresponding token program must be used in any instruction requiring a token program (e.g., `Delegate`): if the mint and token account are from Token-2022, then the `Delegate` instruction will validate that the correct token program has been specified.

{% callout %}
By default, `Create` and `Mint` will create SPL Token mint and token accounts if these accounts do not exist. To use Token-2022 accounts, you need to specify SPL Token-2022 as the token program to use.
{% /callout %}

## Supported Extensions

While Token-2022 provides several extensions, the majority of extensions focus on fungible tokens. For example, the `confidential transfer` can be used to hide the amount of tokens transferred. While this is relevant for fungibles, since the amount can vary across different transfers, it is not applicable to non-fungible tokens since their supply is always `1` and decimals is always `0`. Hence, the transfer amount of a non-fungible token will always be `1`.

Token Metadata enforces restrictions on the type of extensions that can be present on mint and token accounts based on the `Token Standard`. For `Fungible` and `FungibleAsset` standards, no restrictions are placed. For `NonFungible` and `ProgrammableNonFungible` standards, Token Metadata validates which extensions are enabled and restricts the set of extensions that can be used.

### Mint account extensions

- `confidential transfers`: hides the transfer amount during transfers.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ❌             |
  | Details        | -        | Not applicable since non-fungibles have supply of `1` |

- `transfer fees`: allow to configure a transfer fee derived from the amount being transferred.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ❌             |
  | Details        | -        | Not applicable since non-fungibles have supply of `1` |

- `closing mint`: allows closing mint accounts when supply reaches `0`.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ❌             |
  | Details        | Must specify the `Metadata` account as the close authority | Potential for a creator to recreate the same group of mint and metadata accounts |

- `interest-bearing tokens`: allows to change how the UI amount of tokens are represented.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ❌             |
  | Details        | -        | Not applicable since non-fungibles have supply of `1` |

- `non-transferable tokens`: allows for "soul-bound" tokens that cannot be moved to any other address.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ✅             |
  | Details        | -        | -             |

- `permanent delegate`: allows to specify a permanent account delegate for any token account of a mint.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ❌             |
  | Details        | -        | This changes the concept of ownership |

- `transfer hook`: allows call into third-party programs during transfer.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ❌             |
  | Details        | -        | Token Metadata specifies the logic for transfer |

- `metadata pointer`: allows adding an address that describes the canonical metadata.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ✅             |
  | Details        | Must point to the `Metadata` address | Must point to the `Metadata` address |

- `metadata`: allow adding metadata directly to mint accounts.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ❌       | ❌             |
  | Details        | Metadata information is added by Token Metadata | Metadata information is added by Token Metadata |

### Token account extensions

- `memo required`: requires memo on transfers.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ❌             |
  | Details        | -        | Not applicable |

- `immutable ownership`: disables the ability to change the ownership of token accounts.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ✅             |
  | Details        | -        | -             |

- `default account state`: allows to configure default token account states.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ❌             |
  | Details        | -        | Token Metadata validates the account state |

- `CPI guard`: prevent certain actions (e.g., transfer) inside cross-program invocations.

  | Token Standard | Fungible | Non Funginble |
  | -------------- | :------: |:------------: |
  | Allowed        | ✅       | ❌             |
  | Details        | -        | Token Metadata specifies the logic for transfer |

{% callout %}
A comprehensibe overview of each extension can be found on SPL Token-2022 program [documentation](https://spl.solana.com/token-2022).
{% /callout %}

### Default extensions

When a mint account does not exist, the `Create` instruction will initialize one. If the token program being used is SPL Token-2022, the mint will be initialized with both `closing mint` and `metadata pointer` extensions.

Associated Token Accounts (ATAs) by default are always initialized with the `immutable ownership` extension.