---
title: Token Metadata 上的 SPL Token-2022
metaTitle: SPL Token-2022 | Token Metadata
description: 了解 SPL Token-2022 如何与 Token Metadata 集成
---

SPL Token-2022 是 Solana 区块链上最新的代币程序，可用于创建同质化和非同质化代币。它支持与 SPL Token 程序相同的功能和结构，但还包括一组扩展以添加新功能。

为了支持向 Token-2022 mint 账户添加元数据信息，一组 Token Metadata 指令已更新以允许指定所需的代币程序。例如，Token Metadata 可以初始化 Token-2022 mint，使用 `Create` 和 `Mint` 指令创建元数据并铸造代币，同时指定 SPL Token-2022 作为要使用的代币程序。

{% totem %}

{% dialect-switcher title="在 Create 和 Mint 上指定代币程序" %}
{% dialect title="JavaScript" id="js" %}

{% totem-accordion title="创建 Metadata" %}

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

{% totem-accordion title="铸造代币" %}

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

{% totem-accordion title="创建 Metadata" %}

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

// 1. client 是对已初始化的 RpcClient 的引用
// 2. 每个账户都由其 pubkey 指定

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

{% totem-accordion title="铸造代币" %}

```rust
use mpl_token_metadata::instructions::MintV1Builder;
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};

// 1. client 是对已初始化的 RpcClient 的引用
// 2. 每个账户都由其 pubkey 指定

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

可以通过检查账户的 `owner` 属性来确定 mint 账户的代币程序。

{% /totem-prose %}

{% /totem %}

类似的方法可用于其他指令，例如 `Burn`、`Delegate`、`Lock`、`Print`、`Revoke`、`Transfer`、`Unlock`、`Unverify`、`Update` 和 `Verify`。这些指令可以验证来自 SPL Token-2022 的 mint 和 token 账户。在任何需要代币程序的指令（例如 `Delegate`）中必须使用相应的代币程序：如果 mint 和 token 账户来自 Token-2022，那么 `Delegate` 指令将验证是否指定了正确的代币程序。

{% callout %}
默认情况下，如果 mint 和 token 账户不存在，`Create` 和 `Mint` 将创建 SPL Token mint 和 token 账户。要使用 Token-2022 账户，您需要指定 SPL Token-2022 作为要使用的代币程序。
{% /callout %}

## 支持的扩展

虽然 Token-2022 提供了多个扩展，但大多数扩展专注于同质化代币。例如，`confidential transfer` 可用于隐藏转移的代币数量。虽然这与同质化代币相关，因为金额在不同转移之间可能变化，但它不适用于非同质化代币，因为它们的供应量始终为 `1`，小数位始终为 `0`。因此，非同质化代币的转移金额始终为 `1`。

Token Metadata 根据 `Token Standard` 对 mint 和 token 账户上可以存在的扩展类型强制执行限制。对于同质化资产（`Fungible` 和 `FungibleAsset` 标准），不设置限制 - 唯一的限制是提供元数据信息的程序。对于非同质化资产（`NonFungible` 和 `ProgrammableNonFungible` 标准），Token Metadata 验证启用了哪些扩展并限制可以使用的扩展集。

### Mint 账户扩展

这些是可以在 SPL Token-2022 的 mint 账户上启用的扩展。

- `confidential transfers`：在转移期间隐藏金额。

  | 资产    | 同质化 | 非同质化                                |
  | ------- | ------ | --------------------------------------- |
  | 允许    | ✅     | ❌                                      |
  | 详情    | --     | 不适用，因为非同质化代币的供应量为 `1`  |

---

- `transfer fees`：允许配置从转移金额中派生的转移费用。

  | 资产    | 同质化 | 非同质化                                |
  | ------- | ------ | --------------------------------------- |
  | 允许    | ✅     | ❌                                      |
  | 详情    | --     | 不适用，因为非同质化代币的供应量为 `1`  |

---

- `closing mint`：当供应量达到 `0` 时允许关闭 mint 账户。

| 资产    | 同质化                                     | 非同质化                                            |
| ------- | ------------------------------------------ | --------------------------------------------------- |
| 允许    | ✅                                         | ❌                                                  |
| 详情    | 必须将 `Metadata` 账户指定为关闭权限       | 创作者可能重新创建相同的 mint 和 metadata 账户组    |

---

- `interest-bearing tokens`：允许更改代币 UI 金额的显示方式。

  | 资产    | 同质化 | 非同质化                                |
  | ------- | ------ | --------------------------------------- |
  | 允许    | ✅     | ❌                                      |
  | 详情    | --     | 不适用，因为非同质化代币的供应量为 `1`  |

---

- `non-transferable tokens`：允许"灵魂绑定"代币，无法转移到任何其他地址。

  | 资产    | 同质化 | 非同质化 |
  | ------- | ------ | -------- |
  | 允许    | ✅     | ✅       |
  | 详情    | --     | --       |

---

- `permanent delegate`：允许为 mint 的任何 token 账户指定永久账户委托。

  | 资产    | 同质化 | 非同质化                    |
  | ------- | ------ | --------------------------- |
  | 允许    | ✅     | ❌                          |
  | 详情    | --     | 这改变了所有权的概念        |

---

- `transfer hook`：允许在转移期间调用第三方程序。

  | 资产    | 同质化 | 非同质化                            |
  | ------- | ------ | ----------------------------------- |
  | 允许    | ✅     | ❌                                  |
  | 详情    | --     | Token Metadata 指定转移的逻辑       |

---

- `metadata pointer`：允许添加描述规范元数据的地址。

  | 资产    | 同质化                           | 非同质化                         |
  | ------- | -------------------------------- | -------------------------------- |
  | 允许    | ✅                               | ✅                               |
  | 详情    | 必须指向 `Metadata` 地址         | 必须指向 `Metadata` 地址         |

---

- `metadata`：允许直接向 mint 账户添加元数据。

  | 资产    | 同质化                                  | 非同质化                                |
  | ------- | --------------------------------------- | --------------------------------------- |
  | 允许    | ❌                                      | ❌                                      |
  | 详情    | 元数据信息由 Token Metadata 添加        | 元数据信息由 Token Metadata 添加        |

---

### Token 账户扩展

这些是可以在 SPL Token-2022 的 token 账户上启用的扩展。

- `memo required`：转移时需要备注。

  | 资产    | 同质化 | 非同质化   |
  | ------- | ------ | ---------- |
  | 允许    | ✅     | ❌         |
  | 详情    | --     | 不适用     |

---

- `immutable ownership`：禁用更改 token 账户所有权的能力。

  | 资产    | 同质化 | 非同质化 |
  | ------- | ------ | -------- |
  | 允许    | ✅     | ✅       |
  | 详情    | --     | --       |

---

- `default account state`：允许配置默认的 token 账户状态。

  | 资产    | 同质化 | 非同质化                            |
  | ------- | ------ | ----------------------------------- |
  | 允许    | ✅     | ❌                                  |
  | 详情    | --     | Token Metadata 验证账户状态         |

---

- `CPI guard`：防止跨程序调用内的某些操作（例如转移）。

  | 资产    | 同质化 | 非同质化                            |
  | ------- | ------ | ----------------------------------- |
  | 允许    | ✅     | ❌                                  |
  | 详情    | --     | Token Metadata 指定转移的逻辑       |

---

{% callout %}
每个扩展的全面概述可以在 SPL Token-2022 程序[文档](https://spl.solana.com/token-2022)中找到。
{% /callout %}

### 默认扩展

当 mint 账户不存在时，`Create` 指令将初始化一个。如果使用的代币程序是 SPL Token-2022，mint 将使用 `closing mint` 和 `metadata pointer` 扩展进行初始化。

关联代币账户 (ATAs) 默认始终使用 `immutable ownership` 扩展进行初始化。
