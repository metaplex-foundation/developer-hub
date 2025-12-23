---
title: 管理拍卖行
metaTitle: 管理拍卖行 | 拍卖行
description: 解释如何管理拍卖行。
---

## 简介

[在上一页](/zh/legacy-documentation/auction-house/settings)中,我们介绍了拍卖行的各种设置。现在,让我们看看如何使用这些设置来创建和更新拍卖行。

我们还将讨论获取拍卖行的不同方法。最后,我们将了解如何从拍卖行费用和金库账户中提取资金。

## 创建拍卖行

可以使用上一页讨论的所有设置创建拍卖行。创建的拍卖行账户称为拍卖行**实例**。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

让我们通过一个使用 Metaplex JS SDK 创建拍卖行的示例。请注意,默认情况下,当前身份用作拍卖行的权限。此外,默认情况下 `SOL` 将被设置为 `treasuryMint`。最后,上一页中讨论的辅助账户将由拍卖行自动生成,但在拍卖行创建时也可以手动设置它们。

```tsx
const auctionHouseSettings = await metaplex
    .auctionHouse()
    .create({
        sellerFeeBasisPoints: 500 // 5% 费用
        authority: metaplex.identity(),
        requireSignOff: true,
        canChangeSalePrice: true,
        hasAuctioneer: true, // 启用拍卖人
        auctioneerAuthority: metaplex.identity(),
    });
```

{% /dialect %}
{% /dialect-switcher %}


## 拍卖行账户

现在我们已经创建了一个拍卖行实例,让我们看看其中存储了什么数据。

首先,它存储我们已经讨论过的所有设置。除了这些设置之外,拍卖行账户还存储一个 `creator` 字段,它指向用于创建拍卖行实例的钱包地址。

最后,拍卖行实例还存储一些 PDA bump,用于派生 PDA 账户的地址。

> 在使用 PDA 构建时,通常将 bump 种子存储在账户数据本身中。这允许开发人员轻松验证 PDA,而无需将 bump 作为指令参数传递。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

可以在 [`AuctionHouse` 模型的 API 参考](https://metaplex-foundation.github.io/js/types/js.AuctionHouse.html)中探索拍卖行账户模型。

以下是一个小代码示例,展示了一些拍卖行属性。

```tsx
const { auctionHouse } = await metaplex.auctionHouse().create({...});

auctionHouse.address;                   // 拍卖行账户的公钥
auctionHouse.auctionHouseFeeAccount;    // 拍卖行费用账户的公钥
auctionHouse.feeWithdrawalDestination;  // 从拍卖行费用账户提取资金的账户的公钥
auctionHouse.treasuryMint;              // 用作拍卖行货币的代币的铸造地址
auctionHouse.authority;                 // 拍卖行权限的公钥
auctionHouse.creator;                   // 用于创建拍卖行实例的账户的公钥
auctionHouse.bump;                      // 拍卖行实例的 `Bump`
auctionHouse.feePayerBump;              // 费用账户的 `Bump`
auctionHouse.treasuryBump;              // 金库账户的 `Bump`
auctionHouse.auctioneerAddress;         // `Auctioneer` 账户的公钥
```

{% /dialect %}
{% /dialect-switcher %}

## 获取拍卖行

创建后,可以获取拍卖行实例。拍卖行可以通过其 PDA 账户地址或其创建者地址和金库铸造地址的组合来唯一标识。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

可以使用两种方式获取拍卖行:

1. **按地址**: 使用拍卖行地址
2. **按创建者和铸造**: 使用 `creator` 地址和金库铸造的组合。请注意,当拍卖行启用拍卖人时,除了创建者和铸造之外,还需要 `auctioneerAuthority`。

```tsx
// 按地址
const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({ address: new PublicKey("Gjwc...thJS") });

// 按创建者和铸造
// 在此示例中,我们假设拍卖行
// 未启用拍卖人
const auctionHouse = await metaplex
    .auctionHouse()
    .findByCreatorAndMint({
        creator: new PublicKey("Gjwc...thJS"),
        treasuryMint: new PublicKey("DUST...23df")
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 更新设置

与 Candy Machine 的情况一样,一旦创建了拍卖行实例,只要您是拍卖行实例的权限,就可以稍后更新其大部分设置。可以更新以下设置: `authority`、`sellerFeeBasisPoints`、`requiresSignOff`、`canChangeSalePrice`、`feeWithdrawalDestination`、`treasuryWithdrawalDestination`、`auctioneerScopes`。

正如我们已经讨论过的,拍卖行的权限是可以更新的设置之一,只要当前权限是签名者并且提到了新权限的地址。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

要更新设置,我们需要完整的模型以便将当前数据与提供的数据进行比较。例如,如果您只想更新 `feeWithdrawalDestination`,则需要发送一个更新数据的指令,同时保持所有其他属性不变。

此外,默认情况下,`feeWithdrawalDestination` 和 `treasuryWithdrawalDestination` 设置为 `metaplex.identity()`,即默认情况下与设置为权限和创建者的同一钱包。

```tsx
import { Keypair } from "@solana/web3.js";

const currentAuthority = Keypair.generate();
const newAuthority = Keypair.generate();
const newFeeWithdrawalDestination = Keypair.generate();
const newTreasuryWithdrawalDestination = Keypair.generate();
const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({...});

const updatedAuctionHouse = await metaplex
    .auctionHouse()
    .update({
        auctionHouse,
        authority: currentAuthority,
        newAuthority: newAuthority.address,
        sellerFeeBasisPoints: 100,
        requiresSignOff: true,
        canChangeSalePrice: true,
        feeWithdrawalDestination: newFeeWithdrawalDestination,
        treasuryWithdrawalDestination: newTreasuryWithdrawalDestination
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 提取资金

我们在上一页讨论了拍卖行的不同辅助账户。这些是**费用账户**和**金库账户**。

可以将这两个账户的资金转移回"目标"钱包。这些提取目标账户可以由拍卖行权限设置。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下是一个转移资金的代码片段。

1. 拍卖行费用钱包到费用提取目标钱包。
2. 将资金从拍卖行金库钱包转移到金库提取目标钱包。

在这两种情况下,都需要指定从中转移资金的拍卖行以及要提取的资金金额。此金额可以是 SOL 或拍卖行用作货币的 SPL 代币。

```tsx
// 从费用账户提取资金
await metaplex
    .auctionHouse()
    .withdrawFromFeeAccount({
        auctionHouse,
        amount: 5
    });

// 从金库账户提取资金
await metaplex
    .auctionHouse()
    .withdrawFromTreasuryAccount({
        auctionHouse,
        amount: 10
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 结论

此时,我们已经介绍了拍卖行设置、拍卖行实例存储的数据以及如何创建和更新这些数据。但是,我们仍然不知道资产如何在拍卖行上交易。我们将在[下一页](/zh/legacy-documentation/auction-house/trading-assets)中讨论这一点。
