---
title: 为 Core Candy Machine 创建铸造资产网站
metaTitle: 为 Core Candy Machine 创建铸造资产网站 | Core Candy Machine
description: 如何创建与 Solana 上 Candy Machine 铸造程序交互的 UI。
keywords:
  - candy machine UI
  - mint website
  - NFT mint page
  - candy machine frontend
  - wallet adapter
  - mint function
  - fetch candy machine
  - candy guard data
  - mint eligibility
  - guard routes
  - Core Candy Machine UI
  - Solana NFT minting
about:
  - Mint UI development
  - Frontend integration
  - Candy Machine interaction
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 是否需要为 Core Candy Machine 构建自己的铸造网站？
    a: 虽然不是必需的，但自定义网站能提供最佳用户体验。您也可以使用 Metaplex CLI 在没有前端的情况下进行铸造。
  - q: 哪个框架最适合构建 Candy Machine 铸造 UI？
    a: 推荐使用 Next.js 以获得与 Umi 和钱包适配器的最佳兼容性。metaplex-nextjs-tailwind-template 提供了一个即用的起始模板。
  - q: 如何检查钱包是否有资格铸造？
    a: 获取 Candy Guard 账户并验证每个活跃守卫的条件是否满足连接的钱包——检查 SOL 余额、代币持有量、铸造限制、开始日期和白名单状态。
  - q: 能否在一个交易中铸造多个 NFT？
    a: 可以。使用 Umi 的交易构建器组合多个 mintV1 指令，但需检查 fitsInOneTransaction() 以避免超出交易大小限制。
---

## 概要

本指南介绍如何为 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 构建前端铸造 UI，涵盖链上数据获取、钱包资格验证、守卫路由执行和铸造交易本身。 {% .lead %}

- 获取 Candy Machine 和 Candy Guard 账户以显示铸造进度、定价和守卫配置
- 根据活跃守卫验证钱包资格（SOL 余额、代币持有量、铸造限制、开始日期、白名单）
- 在铸造前执行所需的守卫路由指令（例如白名单证明）
- 使用正确的 `mintArgs` 构建并发送 `mintV1` 交易

本指南侧重于核心 [Candy Machine](/zh/smart-contracts/core-candy-machine) 功能和交互，而不是提供完整的网站实现。它不会涵盖向网站添加按钮或与钱包适配器集成等方面。相反，它提供了使用 Core Candy Machine 的基本信息。

对于完整的网站实现，包括 UI 元素和钱包集成，您可能需要从 [`metaplex-nextjs-tailwind-template`](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template) 等模板开始。此模板包含钱包适配器等组件的许多设置步骤。

如果您正在寻找通用 Web 开发实践或特定框架使用方面的指导，Visual Studio Code 等工具提供了广泛的文档和社区资源。

## 前提条件

- 已创建的 Candy Machine。在[Core Candy Machine 创建指南](/zh/smart-contracts/core-candy-machine/create)中找到有关如何创建的更多信息。
- 对 Web 开发和您选择的框架有基本了解。我们推荐 Next JS 以便与 [Umi](/zh/dev-tools/umi) 最容易兼容。

## 所需包

无论您选择的模板或实现方式如何，您都需要安装以下包以与 Core Candy Machine 交互：

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## 获取链上 Candy Machine 数据

Candy Machine 和 Candy Guard 账户存储了铸造 UI 显示进度、定价和资格所需的所有信息。铸造 UI 通常希望显示以下数据：

- 已铸造资产的数量
- Candy Machine 中的资产数量
- 铸造开始前的时间
- 资产价格
- 等等

获取不显示给用户但用于后台计算的额外数据也是有意义的。例如，在使用 [Redeemed Amount](/zh/smart-contracts/core-candy-machine/guards/redeemed-amount) 守卫时，您需要获取已兑换的数量以查看用户是否被允许铸造更多。

### 获取 Candy Machine 账户数据

Candy Machine 账户存储了可用和已兑换资产的数量，以及 `mintAuthority`（通常是您的 [Candy Guard](/zh/smart-contracts/core-candy-machine/guards) 的地址）。

要获取 Candy Machine，可以使用如下所示的 `fetchCandyMachine` 函数：

我们将使用 Solana Devnet 端点。

```ts
import {
  mplCandyMachine,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// The next two lines are only required if you did not set up umi before
// We will be using Solana Devnet as endpoint
const umi = createUmi("https://api.devnet.solana.com")
            .use(mplCandyMachine());

const candyMachineId = "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9";
const candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
console.log(candyMachine)
```

返回的 Candy Machine 数据如下：

{% dialect-switcher title="JSON Result" %}
{% dialect title="JSON" id="json-cm" %}

{% totem-accordion title="Candy Machine Data" %}
```json
{
    "publicKey": "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9",
    "header": {
        "executable": false,
        "owner": "CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J",
        "lamports": {
            "basisPoints": "91814160",
            "identifier": "SOL",
            "decimals": 9
        },
        "rentEpoch": "18446744073709551616",
        "exists": true
    },
    "discriminator": [
        51,
        173,
        177,
        113,
        25,
        241,
        109,
        189
    ],
    "authority": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
    "mintAuthority": "ACJCHhsWCKw9Euu9nLdyxajqitvmwrXQMRWe2mrmva8u",
    "collectionMint": "GPHD33NBaM8TgvbfgcxrusD6nyfhNLbeyKjxMRLAr9LM",
    "itemsRedeemed": "13",
    "data": {
        "itemsAvailable": "16",
        "maxEditionSupply": "0",
        "isMutable": true,
        "configLineSettings": {
            "__option": "Some",
            "value": {
                "prefixName": "",
                "nameLength": 32,
                "prefixUri": "",
                "uriLength": 200,
                "isSequential": false
            }
        },
        "hiddenSettings": {
            "__option": "None"
        }
    },
    "items": [
        {
            "index": 0,
            "minted": true,
            "name": "0.json",
            "uri": ""
        },
        [...]
    ],
    "itemsLoaded": 16
}
```
{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}

从 UI 角度来看，最重要的字段是 `itemsRedeemed`、`itemsAvailable` 和 `mintAuthority`。在某些情况下，在网站上展示一些 `items` 作为预告图片也可能很有价值。

#### 显示剩余资产数量

使用 Candy Machine 账户中的 `itemsRedeemed` 和 `itemsAvailable` 来显示铸造进度。要显示类似 `已铸造 13 / 16 资产` 的部分，可以使用：

```ts
const mintedString = `${candyMachine.itemsRedeemed} / ${candyMachine.itemsAvailable} Assets minted`
```

如果您想获取剩余可铸造资产数量，如 `3 可用`，您可以运行如下计算：

```ts
const availableString = `${candyMachine.itemsAvailable - candyMachine.itemsRedeemed} available`;
```

### 获取 Candy Guard 账户数据

[Candy Guard](/zh/smart-contracts/core-candy-machine/guards) 账户定义了允许铸造前必须满足的条件，例如 SOL 或代币支付、钱包铸造限制、开始日期和白名单。您可以在 [Candy Guard 页面](/zh/smart-contracts/core-candy-machine/guards)找到有关 Candy Guard 的更多信息。

与 Candy Machine 数据类似，获取守卫账户并非必需。但这样做可以提供更大的灵活性，例如只需更新 Candy Guard 中的 SOL 价格就能自动更新网站上的数字。

如果您想构建一个可用于多个 Candy Machine 的更灵活 UI，获取 Candy Guard 可以让您动态构建铸造功能和检查资格。

以下代码假设之前已获取了 `candyMachine` 账户。也可以硬编码 Candy Guard 的公钥来替代 `candyMachine.mintAuthority`。

```ts
import { safeFetchCandyGuard } from "@metaplex-foundation/mpl-core-candy-machine";

const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
```

{% dialect-switcher title="JSON Result" %}
{% dialect title="JSON" id="json-cg" %}

{% totem-accordion title="Candy Guard Data" %}
{% totem-prose %}
在此对象中，UI 最重要的字段是 `guards` 对象。它包含始终应用的 `default` 守卫。`guards.groups` 包含不同的[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)。
{% /totem-prose %}

```json
{
    "publicKey": "ACJCHhsWCKw9Euu9nLdyxajqitvmwrXQMRWe2mrmva8u",
    "header": {
        "executable": false,
        "owner": "CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ",
        "lamports": {
            "basisPoints": "2561280",
            "identifier": "SOL",
            "decimals": 9
        },
        "rentEpoch": "18446744073709551616",
        "exists": true
    },
    "discriminator": [
        44,
        207,
        199,
        184,
        112,
        103,
        34,
        181
    ],
    "base": "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9",
    "bump": 255,
    "authority": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
    "guards": {
        "botTax": {
            "__option": "None"
        },
        "solPayment": {
            "__option": "None"
        },
        "tokenPayment": {
            "__option": "None"
        },
        "startDate": {
            "__option": "None"
        },
        "thirdPartySigner": {
            "__option": "None"
        },
        "tokenGate": {
            "__option": "None"
        },
        "gatekeeper": {
            "__option": "None"
        },
        "endDate": {
            "__option": "None"
        },
        "allowList": {
            "__option": "None"
        },
        "mintLimit": {
            "__option": "None"
        },
        "nftPayment": {
            "__option": "None"
        },
        "redeemedAmount": {
            "__option": "None"
        },
        "addressGate": {
            "__option": "None"
        },
        "nftGate": {
            "__option": "None"
        },
        "nftBurn": {
            "__option": "None"
        },
        "tokenBurn": {
            "__option": "None"
        },
        "freezeSolPayment": {
            "__option": "None"
        },
        "freezeTokenPayment": {
            "__option": "None"
        },
        "programGate": {
            "__option": "None"
        },
        "allocation": {
            "__option": "None"
        },
        "token2022Payment": {
            "__option": "None"
        },
        "solFixedFee": {
            "__option": "None"
        },
        "nftMintLimit": {
            "__option": "None"
        },
        "edition": {
            "__option": "None"
        },
        "assetPayment": {
            "__option": "None"
        },
        "assetBurn": {
            "__option": "None"
        },
        "assetMintLimit": {
            "__option": "None"
        },
        "assetBurnMulti": {
            "__option": "None"
        },
        "assetPaymentMulti": {
            "__option": "None"
        },
        "assetGate": {
            "__option": "None"
        },
        "vanityMint": {
            "__option": "None"
        }
    },
    "groups": [
        {
            "label": "group1",
            "guards": {
                "botTax": {
                    "__option": "Some",
                    "value": {
                        "lamports": {
                            "basisPoints": "10000000",
                            "identifier": "SOL",
                            "decimals": 9
                        },
                        "lastInstruction": false
                    }
                },
                "solPayment": {
                    "__option": "Some",
                    "value": {
                        "lamports": {
                            "basisPoints": "100000000",
                            "identifier": "SOL",
                            "decimals": 9
                        },
                        "destination": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV"
                    }
                },
                "tokenPayment": {
                    "__option": "None"
                },
                "startDate": {
                    "__option": "Some",
                    "value": {
                        "date": "1723996800"
                    }
                },
                "thirdPartySigner": {
                    "__option": "None"
                },
                "tokenGate": {
                    "__option": "None"
                },
                "gatekeeper": {
                    "__option": "None"
                },
                "endDate": {
                    "__option": "Some",
                    "value": {
                        "date": "1729270800"
                    }
                },
                "allowList": {
                    "__option": "None"
                },
                "mintLimit": {
                    "__option": "Some",
                    "value": {
                        "id": 1,
                        "limit": 5
                    }
                },
                "nftPayment": {
                    "__option": "None"
                },
                "redeemedAmount": {
                    "__option": "None"
                },
                "addressGate": {
                    "__option": "None"
                },
                "nftGate": {
                    "__option": "None"
                },
                "nftBurn": {
                    "__option": "None"
                },
                "tokenBurn": {
                    "__option": "None"
                },
                "freezeSolPayment": {
                    "__option": "None"
                },
                "freezeTokenPayment": {
                    "__option": "None"
                },
                "programGate": {
                    "__option": "None"
                },
                "allocation": {
                    "__option": "None"
                },
                "token2022Payment": {
                    "__option": "None"
                },
                "solFixedFee": {
                    "__option": "None"
                },
                "nftMintLimit": {
                    "__option": "None"
                },
                "edition": {
                    "__option": "None"
                },
                "assetPayment": {
                    "__option": "None"
                },
                "assetBurn": {
                    "__option": "None"
                },
                "assetMintLimit": {
                    "__option": "None"
                },
                "assetBurnMulti": {
                    "__option": "None"
                },
                "assetPaymentMulti": {
                    "__option": "None"
                },
                "assetGate": {
                    "__option": "None"
                },
                "vanityMint": {
                    "__option": "None"
                }
            }
        },
    ]
}
```
{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}

### 获取守卫相关的附加账户

某些守卫在单独的链上账户中存储每个钱包或每个组的状态。获取这些账户可以让您在尝试铸造之前检查资格。例如，如果您计划验证钱包的铸造资格并使用 `mintLimit` 守卫，则需要获取 `mintCounter` 账户。该账户记录了特定钱包在该守卫下已铸造了多少 NFT。

#### `MintLimit` 账户
当 [`MintLimit`](/zh/smart-contracts/core-candy-machine/guards/mint-limit) 守卫处于活跃状态时，建议获取用户钱包的 `MintCounter` 账户。这可以让您检查用户是否已达到铸造限制或是否仍有资格铸造更多物品。

以下代码演示了如何获取 `MintCounter`。请注意，此示例假设您已获取了 Candy Machine 和 Candy Guard 数据：

```ts
import { safeFetchMintCounterFromSeeds } from "@metaplex-foundation/mpl-core-candy-machine";

const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
  id: 1, // The mintLimit id you set in your guard config
  user: umi.identity.publicKey,
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```

#### `NftMintLimit` 账户
与 `MintLimit` 守卫类似，获取 [`NftMintLimit`](/zh/smart-contracts/core-candy-machine/guards/nft-mint-limit) 守卫的 `NftMintCounter` 账户来验证资格也是有意义的。

以下代码演示了如何获取 `NftMintCounter` 账户。请注意，此示例假设您已获取了 Candy Machine 和 Candy Guard 数据：

```ts
import {
  findNftMintCounterPda,
  fetchNftMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findNftMintCounterPda(umi, {
  id: 1, // The nftMintLimit id you set in your guard config
  mint: asset.publicKey, // The address of the nft your user owns
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
});

const nftMintCounter = fetchNftMintCounter(umi, pda)
```

#### `AssetMintLimit` 账户
与 `NftMintCounter` 守卫类似，获取 [`AssetMintLimit`](/zh/smart-contracts/core-candy-machine/guards/asset-mint-limit) 守卫的 `AssetMintCounter` 账户来验证资格也是有意义的。

以下代码演示了如何获取 `AssetMintCounter` 账户。请注意，此示例假设您已获取了 Candy Machine 数据：

```ts
import {
  findAssetMintCounterPda,
  fetchAssetMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findAssetMintCounterPda(umi, {
  id: 1, // The assetMintLimit id you set in your guard config
  asset: asset.publicKey, // The address of the core nft your user owns
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
});

const assetMintCounter = fetchAssetMintCounter(umi, pda);
```

#### `Allocation` 账户
对于 `Allocation` 守卫，获取 `AllocationTracker` 账户来验证是否可以从给定组铸造更多 NFT 是有意义的。

以下代码演示了如何获取 `AllocationTracker` 账户。请注意，此示例假设您已获取了 Candy Machine 数据：

```ts
import {
  safeFetchAllocationTrackerFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allocationTracker = await safeFetchAllocationTrackerFromSeeds(umi, {
  id: 1, // The allocation id you set in your guard config
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```

#### `Allowlist` 账户
在实施 Allowlist 守卫时，事先执行 `route` 指令至关重要。此指令为每个钱包和 Candy Machine 组合生成唯一账户，有效地将钱包标记为有权铸造。

从 UI 角度来看，查询此账户很有用。这可以让您确定是否需要执行 `route` 指令，或者用户是否可以直接进行铸造指令。

以下代码演示了如何获取此账户。它假设您已获取了 Candy Machine 数据。但是，如果您愿意，也可以硬编码 `candyGuard` 和 `candyMachine` 公钥。

```ts
import {
  safeFetchAllowListProofFromSeeds,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allowlist = [
  "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy"
];

const allowListProof = await safeFetchAllowListProofFromSeeds(umi, {
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
  merkleRoot: getMerkleRoot(allowlist),
  user: umi.identity.publicKey,
});
```

### 获取钱包数据以验证资格

钱包账户数据——SOL 余额、代币持有量和拥有的 NFT——用于在尝试铸造前客户端验证守卫条件。根据您使用的守卫，您可能需要知道钱包中有多少 SOL 以及钱包拥有哪些代币和 NFT。

获取 SOL 余额可以使用内置的 `getAccount` umi 函数：
```ts
const account = await umi.rpc.getAccount(umi.identity.publicKey);
const solBalance = account.lamports;
```

如果您使用的守卫需要代币或 NFT，您可能也需要获取这些信息。我们推荐使用 [DAS API](/zh/dev-tools/das-api/methods/get-assets-by-owner) 来实现。DAS 是由您的 RPC 提供商维护的代币索引。使用它可以一次调用获取所有所需信息。在 UI 中，您可以使用返回的对象来验证连接的钱包是否拥有所需的代币或 NFT。

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

// When defining the umi instance somewhere before you can already
// add `.use(dasApi());` so there is no need to define umi again.
const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await umi.rpc.getAssetsByOwner({
    umi.identity.publicKey
});

```

## 验证铸造资格

每个活跃守卫定义了连接钱包在铸造指令成功前必须满足的条件。获取所有所需数据后，您可以验证连接的钱包是否被允许铸造。

需要注意的是，当组附加到 Candy Machine 时，`default` 守卫在所有创建的组中普遍适用。此外，启用组后，从 `default` 组铸造的能力将被禁用，您必须使用创建的组进行铸造。

因此，如果没有定义组，您需要检查 `default` 组的所有铸造条件是否满足。如果定义了组，则需要验证 `default` 守卫和当前铸造组守卫的组合。

假设一个附加了 `startDate`、`SolPayment` 和 `mintLimit` 守卫且未使用组的 Candy Machine，在允许用户调用铸造功能之前应进行以下验证。假设 `candyGuard` 已提前获取，且要铸造一个 Core NFT 资产。

1. 验证 `startDate` 是否已过。请注意，我们这里没有使用用户的设备时间，而是获取当前 Solana 内部区块时间，因为这是 Candy Machine 在铸造验证时使用的时间：
```ts
import { unwrapOption } from '@metaplex-foundation/umi';

let allowed = true;

// fetch the current slot and read the blocktime
const slot = await umi.rpc.getSlot();
let solanaTime = await umi.rpc.getBlockTime(slot);

// Check if a `default` startDate guard is attached
const startDate = unwrapOption(candyGuard.guards.startDate);
if (startDate) {
  // validate the startTime is in the future
  if (solanaTime < startDate) {
        console.info(`StartDate not reached!`);
        allowed = false;
  }
}
```

2. 检查钱包是否有足够的 SOL 支付铸造费用。请注意，这里未包含交易费用，并假设 `SolBalance` 已如上所述获取：
```ts
import { unwrapOption } from '@metaplex-foundation/umi';

const solPayment = unwrapOption(candyGuard.guards.solPayment);
if (solPayment){
  if (solPayment.lamports.basisPoints > solBalance){
    console.info(`Not enough SOL!`);
    allowed = false;
  }
}
```

3. 确保 `mintLimit` 尚未达到：
```ts
import { unwrapOption } from '@metaplex-foundation/umi';
import {
  safeFetchMintCounterFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const mintLimit = unwrapOption(candyGuard.guards.mintLimit);
if (mintLimit){
      const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
      id: mintLimit.id,
      user: umi.identity.publicKey,
      candyMachine: candyMachine.publicKey,
      candyGuard: candyMachine.mintAuthority,
    });

    // mintCounter PDA exists (not the first mint)
    if (mintCounter && mintLimit.limit >= mintCounter.count
    ) {
      allowed = false;
    }
}
```

当钱包没有资格铸造时，禁用铸造按钮并向用户显示不符合资格的原因是很有帮助的。例如显示 `SOL 不足！` 消息。

## 守卫路由

某些守卫需要在铸造指令成功之前执行 `route` 指令。这些指令创建存储数据或提供钱包铸造资格证明的账户。这些指令的执行频率因守卫类型而异。

{% callout type="note" title="本节目标受众" %}
如果您没有使用 `Allocation`、`FreezeSolPayment`、`FreezeTokenPayment` 或 `Allowlist` 守卫，可以安全地跳过本节。
{% /callout %}

某些守卫的路由只需为整个 Candy Machine 执行一次。对于这些守卫，不需要在 UI 中包含函数，可以通过脚本预先运行一次：
- [Allocation](/zh/smart-contracts/core-candy-machine/guards/allocation)
- [FreezeSolPayment](/zh/smart-contracts/core-candy-machine/guards/freeze-sol-payment)
- [FreezeTokenPayment](/zh/smart-contracts/core-candy-machine/guards/freeze-token-payment)

其他守卫需要为每个钱包单独执行路由。在这些情况下，路由指令应在铸造交易之前运行：
- [Allowlist](/zh/smart-contracts/core-candy-machine/guards/allow-list)

关于如何实施守卫路由的示例，以 **Allowlist** 守卫为例。假设 `allowListProof` 已如前所述获取，`allowlist` 代表一个合格钱包地址数组。以下代码演示了如何在您的实现中处理此场景。

```ts
import {
  getMerkleRoot,
  getMerkleProof,
  route
} from "@metaplex-foundation/mpl-core-candy-machine";
import {
  publicKey,
} from "@metaplex-foundation/umi";

// assuming you fetched the AllowListProof as described above
if (allowListProof === null) {
  route(umi, {
    guard: "allowList",
    candyMachine: candyMachine.publicKey,
    candyGuard: candyMachine.mintAuthority,
    group: "default", // Add your guard label here
    routeArgs: {
      path: "proof",
      merkleRoot: getMerkleRoot(allowlist),
      merkleProof: getMerkleProof(allowlist, publicKey(umi.identity)),
    },
  })
}
```

## 构建铸造功能

铸造功能将资格验证、守卫路由执行和带有正确 `mintArgs` 的 `mintV1` 指令组合在一起。建议为所有附加的守卫实施资格检查。请记住，如果附加了任何组，`default` 守卫将应用于所有其他组，同时禁用 `default` 组。

完成这些检查后，如果需要，运行路由指令后可以构建铸造交易。根据守卫，可能需要传入 `mintArgs`。这些是通过传入正确的账户和数据来帮助构建铸造交易的参数。例如，`mintLimit` 守卫需要 `mintCounter` 账户。[Umi](/zh/dev-tools/umi) SDK 抽象了这些细节，但仍需要一些信息来正确构建交易。

假设再次是附加了 `startDate`、`SolPayment` 和 `mintLimit` 守卫的 Candy Machine，让我们看看如何构建 `mintArgs`。

```ts
import { some, unwrapOption } from '@metaplex-foundation/umi';
import {
  DefaultGuardSetMintArgs
} from "@metaplex-foundation/mpl-core-candy-machine";

let mintArgs: Partial<DefaultGuardSetMintArgs> = {};

// add solPayment mintArgs
const solPayment = unwrapOption(candyGuard.guards.solPayment)
if (solPayment) {
  mintArgs.solPayment = some({
    destination: solPayment.destination,
  });
}

// add mintLimit mintArgs
const mintLimit = unwrapOption(candyGuard.guards.mintLimit)
if (mintLimit) {
  mintArgs.mintLimit = some({ id: mintLimit.id });
}
```

并非所有守卫都需要传入额外的 `mintArgs`。这就是 `startDate` 没有出现在上述代码中的原因。要了解您使用的守卫是否需要传入 `mintArgs`，建议查看 [Developer Hub](/zh/smart-contracts/core-candy-machine) 守卫页面。如果描述中包含"Mint Settings"，则需要为该守卫传入 `mintArgs`。

现在 `mintArgs` 已构建，让我们看看如何调用铸造功能本身。以下代码假设 `candyMachine` 和 `candyGuard` 已如上所述获取。技术上，`candyMachine`、`collection`、`candyGuard` 的公钥和所有 `mintArgs` 也可以手动传入，无需获取。

```ts
// Generate the NFT address
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} minted!`)
```

## 高级铸造技术

除了基本的单次铸造流程外，Core Candy Machine 还支持将多次铸造批量放入一个交易中，以及使用守卫组来实施分层铸造策略。

### 在一个交易中铸造多个 NFT

为了提高效率，您可能希望允许用户在单个交易中铸造多个 NFT。以下是实现方法：

根据具体设置，通过组合 [Transaction Builders](/zh/dev-tools/umi/transactions#transaction-builders) 允许在一个交易中铸造多个 NFT 会很有用。

```ts
let builder = transactionBuilder()
  .add(mintV1(...))
  .add(mintV1(...))
```

如果您在交易中添加太多 `mintV1` 指令，您将收到 `Transaction too large` 错误。函数 [`builder.fitsInOneTransaction(umi)`](/zh/dev-tools/umi/transactions#transaction-builders) 允许在发送前检查，以便在需要时拆分交易。如果需要拆分，建议使用 [`signAllTransactions`](/zh/dev-tools/umi/transactions#building-and-signing-transactions)，这样在钱包适配器中只需批准一个弹窗。

### 守卫组

[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)允许您在单个 Candy Machine 上定义具有不同配置的多组守卫。它们在以下场景中特别有用：

1. 分层铸造：为 VIP、提前访问和公开销售设置不同的组。
2. 多种支付选项：为 SOL 支付、SPL 代币支付等设置不同的组。
3. 基于时间的铸造：为不同的开始和结束日期设置不同的组。
4. 基于白名单的铸造：为白名单用户和公开销售设置不同的组。

要在 UI 中实施守卫组，有两种主要方法：

1. 多按钮方法：
   为每个组创建单独的按钮，让用户选择首选的铸造选项。

2. 自动组选择：
   实施一个函数，根据用户的资格和当前条件确定最佳组。

无论您选择哪种场景或方法，以下是如何调整 `mintV1` 指令以使用您的特定组。关键修改是包含指定所需标签的 `group` 参数。

```ts
// Generate the NFT address
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
  group: "group1",
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} minted!`)
```

## 注意事项

- **客户端验证仅供参考。** 本指南中描述的资格检查在浏览器中运行，不能替代链上守卫验证。Candy Machine 程序在铸造交易期间执行自己的守卫检查；失败的守卫将导致交易回滚，无论客户端逻辑如何。
- **可能需要增加计算单元。** 根据活跃守卫的数量和复杂性，默认计算单元限制可能不够。当交易因计算超限错误失败时，使用 `setComputeUnitLimit` 来提高预算。
- **守卫组禁用仅默认铸造。** 当一个或多个守卫组附加到 Candy Machine 时，`default` 组不能再单独用于铸造。您必须在 `mintV1` 调用中指定 `group` 标签，`default` 守卫和所选组的守卫都将被强制执行。

## 后续步骤

现在您已经掌握了在前端与 Candy Machine 交互的基础知识，您可能需要考虑以下步骤来进一步增强和分发您的项目：

1. 托管：将前端部署到托管平台，使其可供用户访问。开发者中流行的选项包括：
   - Vercel
   - Cloudflare Pages
   - Netlify
   - GitHub Pages

2. 测试：在各种设备和浏览器上彻底测试您的 UI，以确保流畅的用户体验。

3. 优化：针对性能微调您的前端，特别是如果您预期在铸造活动期间有高流量。

8. 监控：设置监控工具来跟踪您的 Candy Machine UI 状态，并快速解决可能出现的任何问题。

通过关注这些领域，您将为使用 Core Candy Machine 成功发布和维护 NFT 铸造项目做好充分准备。

## 常见问题

{% faq %}
{% faqitem title="是否需要为 Core Candy Machine 构建自己的铸造网站？" %}
虽然不是必需的，但自定义网站能提供最佳用户体验。您也可以使用 Metaplex CLI 在没有前端的情况下进行铸造。
{% /faqitem %}

{% faqitem title="哪个框架最适合构建 Candy Machine 铸造 UI？" %}
推荐使用 Next.js 以获得与 Umi 和钱包适配器的最佳兼容性。[`metaplex-nextjs-tailwind-template`](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template) 提供了一个即用的起始模板。
{% /faqitem %}

{% faqitem title="如何检查钱包是否有资格铸造？" %}
获取 Candy Guard 账户并验证每个活跃守卫的条件是否满足连接的钱包——检查 SOL 余额、代币持有量、铸造限制、开始日期和白名单状态。
{% /faqitem %}

{% faqitem title="能否在一个交易中铸造多个 NFT？" %}
可以。使用 Umi 的交易构建器组合多个 `mintV1` 指令，但需检查 `fitsInOneTransaction()` 以避免超出交易大小限制。
{% /faqitem %}
{% /faq %}

*由 Metaplex Foundation 维护。最后验证于 2026 年 3 月。适用于 `@metaplex-foundation/mpl-core-candy-machine`。*
