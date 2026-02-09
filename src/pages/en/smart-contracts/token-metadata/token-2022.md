---
title: SPL Token-2022
metaTitle: SPL Token-2022 | Token Metadata
description: Use Token Metadata with SPL Token-2022 (Token Extensions) on Solana. Supported extensions, creation flow, and differences from the legacy Token Program.
updated: '02-07-2026'
keywords:
  - Token-2022
  - Token Extensions
  - SPL Token 2022
  - non-transferable token
  - metadata extension
about:
  - SPL Token-2022 integration
  - Token Extensions
  - extended token features
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Does Token Metadata work with Token-2022?
    a: Yes. Token Metadata supports SPL Token-2022 mints. You can create NFTs and fungible tokens using Token-2022 with extensions like non-transferable and metadata pointer.
  - q: Which Token-2022 extensions are supported?
    a: Supported extensions include non-transferable, metadata pointer, and others. Some extensions may have restrictions depending on the token standard.
  - q: How do I create a Token-2022 NFT?
    a: Use the same CreateV1 instruction but specify the Token-2022 program as the SPL Token program. The SDK handles the differences automatically.
  - q: What is the benefit of using Token-2022 over the legacy Token Program?
    a: Token-2022 provides built-in extensions like non-transferable tokens (soulbound), transfer fees, and metadata pointers, reducing the need for custom program logic.
---

SPL Token-2022 is the latest token program on the Solana blockchain that can be used to create fungible and non-fungible tokens. It supports the same functionalities and structures of the SPL Token program, but also includes a set of extensions to add new functionalities.

In order to support adding metadata information to Token-2022 mint accounts, a set of Token Metadata instructions have been updated to allow specified the desired token program. For example, Token Metadata can initialize a Token-2022 mint, create metadata and mint tokens using the `Create` and `Mint` instructions and specifying the SPL Token-2022 as the token program to use.

{% totem %}

{% totem-accordion title="Create Metadata" %}

{% code-tabs-imported from="token-metadata/token-2022-create" frameworks="umi,kit,shank" /%}

{% /totem-accordion  %}

{% totem-accordion title="Mint a token" %}

{% code-tabs-imported from="token-metadata/token-2022-mint" frameworks="umi,kit,shank" /%}

{% /totem-accordion  %}

{% totem-prose %}

The token program of a mint account can be determined by checking the `owner` property of the account.

{% /totem-prose %}

{% /totem %}

A similar approach can be used for other instructions, such as `Burn`, `Delegate`, `Lock`, `Print`, `Revoke`, `Transfer`, `Unlock`, `Unverify`, `Update`and `Verify`. These instruction can validate mint and token accounts from SPL Token-2022. The corresponding token program must be used in any instruction requiring a token program (e.g., `Delegate`): if the mint and token account are from Token-2022, then the `Delegate` instruction will validate that the correct token program has been specified.

{% callout %}
By default, `Create` and `Mint` will create SPL Token mint and token accounts if these accounts do not exist. To use Token-2022 accounts, you need to specify SPL Token-2022 as the token program to use.
{% /callout %}

## Supported Extensions

While Token-2022 provides several extensions, the majority of extensions focus on fungible tokens. For example, the `confidential transfer` can be used to hide the amount of tokens transferred. While this is relevant for fungibles, since the amount can vary across different transfers, it is not applicable to non-fungible tokens since their supply is always `1` and decimals is always `0`. Hence, the transfer amount of a non-fungible token will always be `1`.

Token Metadata enforces restrictions on the type of extensions that can be present on mint and token accounts based on the `Token Standard`. For fungible assets (`Fungible` and `FungibleAsset` standards), no restrictions are placed – the only restriction is on the program providing the metadata information. For non-fungible assets (`NonFungible` and `ProgrammableNonFungible` standards), Token Metadata validates which extensions are enabled and restricts the set of extensions that can be used.

### Mint account extensions

These are extensions that can be enabled on mint accounts of SPL Token-2022.

- `confidential transfers`: hides the amount during transfers.

  | Asset   | Fungible | Non-Fungible                                          |
  | ------- | -------- | ----------------------------------------------------- |
  | Allowed | ✅       | ❌                                                    |
  | Details | --       | Not applicable since non-fungibles have supply of `1` |

---

- `transfer fees`: allow to configure a transfer fee derived from the amount being transferred.

  | Asset   | Fungible | Non-Fungible                                          |
  | ------- | -------- | ----------------------------------------------------- |
  | Allowed | ✅       | ❌                                                    |
  | Details | --       | Not applicable since non-fungibles have supply of `1` |

---

- `closing mint`: allows closing mint accounts when supply reaches `0`.

| Asset   | Fungible                                                   | Non-Fungible                                                                     |
| ------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Allowed | ✅                                                         | ❌                                                                               |
| Details | Must specify the `Metadata` account as the close authority | Potential for a creator to recreate the same group of mint and metadata accounts |

---

- `interest-bearing tokens`: allows to change how the UI amount of tokens are represented.

  | Asset   | Fungible | Non-Fungible                                          |
  | ------- | -------- | ----------------------------------------------------- |
  | Allowed | ✅       | ❌                                                    |
  | Details | --       | Not applicable since non-fungibles have supply of `1` |

---

- `non-transferable tokens`: allows for "soul-bound" tokens that cannot be moved to any other address.

  | Asset   | Fungible | Non-Fungible |
  | ------- | -------- | ------------ |
  | Allowed | ✅       | ✅           |
  | Details | --       | --           |

---

- `permanent delegate`: allows to specify a permanent account delegate for any token account of a mint.

  | Asset   | Fungible | Non-Fungible                          |
  | ------- | -------- | ------------------------------------- |
  | Allowed | ✅       | ❌                                    |
  | Details | --       | This changes the concept of ownership |

---

- `transfer hook`: allows call into third-party programs during transfer.

  | Asset   | Fungible | Non-Fungible                                    |
  | ------- | -------- | ----------------------------------------------- |
  | Allowed | ✅       | ❌                                              |
  | Details | --       | Token Metadata specifies the logic for transfer |

---

- `metadata pointer`: allows adding an address that describes the canonical metadata.

  | Asset   | Fungible                             | Non-Fungible                         |
  | ------- | ------------------------------------ | ------------------------------------ |
  | Allowed | ✅                                   | ✅                                   |
  | Details | Must point to the `Metadata` address | Must point to the `Metadata` address |

---

- `metadata`: allow adding metadata directly to mint accounts.

  | Asset   | Fungible                                        | Non-Fungible                                    |
  | ------- | ----------------------------------------------- | ----------------------------------------------- |
  | Allowed | ❌                                              | ❌                                              |
  | Details | Metadata information is added by Token Metadata | Metadata information is added by Token Metadata |

---

### Token account extensions

These are extensions that can be enabled on token accounts of SPL Token-2022.

- `memo required`: requires memo on transfers.

  | Asset   | Fungible | Non-Fungible   |
  | ------- | -------- | -------------- |
  | Allowed | ✅       | ❌             |
  | Details | --       | Not applicable |

---

- `immutable ownership`: disables the ability to change the ownership of token accounts.

  | Asset   | Fungible | Non-Fungible |
  | ------- | -------- | ------------ |
  | Allowed | ✅       | ✅           |
  | Details | --       | --           |

---

- `default account state`: allows to configure default token account states.

  | Asset   | Fungible | Non-Fungible                               |
  | ------- | -------- | ------------------------------------------ |
  | Allowed | ✅       | ❌                                         |
  | Details | --       | Token Metadata validates the account state |

---

- `CPI guard`: prevent certain actions (e.g., transfer) inside cross-program invocations.

  | Asset   | Fungible | Non-Fungible                                    |
  | ------- | -------- | ----------------------------------------------- |
  | Allowed | ✅       | ❌                                              |
  | Details | --       | Token Metadata specifies the logic for transfer |

---

{% callout %}
A comprehensibe overview of each extension can be found on SPL Token-2022 program [documentation](https://spl.solana.com/token-2022).
{% /callout %}

### Default extensions

When a mint account does not exist, the `Create` instruction will initialize one. If the token program being used is SPL Token-2022, the mint will be initialized with both `closing mint` and `metadata pointer` extensions.

Associated Token Accounts (ATAs) by default are always initialized with the `immutable ownership` extension.
