---
title: 空投 - 如何将 NFT 铸造到其他钱包
metaTitle: 空投 - 从 Candy Machine 铸造到不同钱包 | Candy Machine
description: 开发者指南，介绍如何将 NFT 从 Candy Machine 铸造到不同的钱包地址。适用于空投和类似用例。
---

本指南介绍如何将 NFT 从 Candy Machine 铸造到不同的钱包地址——这是空投、赠品或向多个接收者分发 NFT 的常见需求。

## 前提条件

- 基本了解 Solana 和 NFT
- 有资金用于支付交易费用的钱包

**以下二选一**

- Sugar CLI（v2.0.0 或更高版本）

**或**

- Node.js 16.0 或更高版本
- @metaplex-foundation/mpl-token-metadata
- @metaplex-foundation/mpl-toolbox
- @metaplex-foundation/umi-bundle-defaults
- @metaplex-foundation/mpl-candy-machine

将 NFT 铸造到其他钱包对于空投、赠品或向多个接收者分发 NFT 特别有用。本指南将引导您完成将 NFT 从 Candy Machine 铸造到不同钱包地址的过程。需要注意的是，发起铸造过程的人将承担铸造成本。因此，让接收者自己领取 NFT 通常更具成本效益。

{% callout type="note" title="重要考虑" %}
- 铸造到其他钱包可能会很昂贵。您可能需要考虑使用领取机制，例如使用[允许列表](/zh/smart-contracts/candy-machine/guards/allow-list)或 [NFT Gate](/zh/smart-contracts/candy-machine/guards/nft-gate) 守卫。
- 对于有守卫和没有守卫的 Candy Machine 有不同的工具可用。没有守卫的铸造通常更简单。
{% /callout %}

本指南描述了两种方法：
1. 使用 [Sugar CLI](#使用-sugar-cli) 铸造。无需编码！
2. 使用 [Javascript](#使用-typescript-和-metaplex-foundationmpl-candy-machine) 铸造

## 使用 Sugar CLI
Sugar CLI 提供了两个主要命令用于将 NFT 铸造到其他钱包：
1. `sugar mint` 铸造到*一个*特定钱包
2. `sugar airdrop` 铸造到*多个*钱包

通过 sugar 允许铸造的前提是您的 Candy Machine 创建时**没有附加守卫**。要使用 sugar 创建 Candy Machine，您可以按照[此](https://developers.metaplex.com/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine)指南的第一步进行操作。如果您的 Candy Machine 已附加守卫，可以使用 `sugar guard remove` 移除它们。

### 使用 `sugar mint` 铸造到单个接收者
要将 NFT 铸造到单个接收者钱包，使用带有以下参数的 `sugar mint` 命令：

- `--receiver <WALLET>`：指定接收者的钱包地址
- `--number <NUMBER>`：（可选）指定要铸造到该钱包的 NFT 数量

**示例**：

要将 3 个 NFT 铸造到钱包 `Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV`，可以调用：

```sh
sugar mint --receiver Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV -n 3 --candy-machine 11111111111111111111111111111111
```

### 使用 `sugar airdrop` 铸造到多个接收者

要在单个命令中将 NFT 铸造到多个钱包，可以使用 `sugar airdrop`。它需要一个包含地址和每个钱包应接收的 NFT 数量的文件。例如，可以通过快照特定集合中 NFT 的所有者并将其钱包和持有的 NFT 添加到以下格式的文件中来创建此类文件：

```json
{
  "11111111111111111111111111111111": 3,
  "22222222222222222222222222222222": 1
}
```

默认情况下，sugar 期望此文件名为 `airdrop_list.json`，但如果您希望使用不同文件名的文件，可以使用 `--airdrop-list` 传入文件名。

**示例**：
要执行此空投，可以使用以下命令
```sh
sugar airdrop --candy-machine 11111111111111111111111111111111
```

## 使用 Typescript 和 `@metaplex-foundation/mpl-candy-machine`

本节展示了 Javascript 中铸造函数的代码片段。两个示例都包含完整的代码片段，其中创建了 Candy Machine，然后将单个 NFT 铸造到特定钱包。要实现完整的空投脚本，需要围绕铸造函数实现循环和错误处理。

使用 Typescript 铸造到其他钱包时，根据您的 Candy Machine 是否使用守卫，有两种主要方法：

### 无守卫铸造
对于没有守卫的 Candy Machine，使用 `mintFromCandyMachineV2`。此函数允许您直接将接收者指定为 `nftOwner`。

```js
const candyMachineAccount = await fetchCandyMachine(umi, publicKey("CM Address"));

const recipient = publicKey('Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV')
const nftMint = generateSigner(umi)
const mintTx = await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient }))
  .add(
    mintFromCandyMachineV2(umi, {
      candyMachine: candyMachine.publicKey,
      mintAuthority: umi.identity,
      nftOwner: recipient,
      nftMint,
      collectionMint: candyMachineAccount.collectionMint,
      collectionUpdateAuthority: candyMachineAccount.authority,
    })
  )
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' },
  })
```

{% totem %}
{% totem-accordion title="完整代码示例" %}
```js
import {
  addConfigLines,
  createCandyMachineV2,
  fetchCandyMachine,
  mintFromCandyMachineV2,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi-serializers";
import {
  createMintWithAssociatedToken,
  setComputeUnitLimit,
} from "@metaplex-foundation/mpl-toolbox";

/**
 * 此脚本演示如何创建没有守卫的基本 Candy Machine
 * 并将 NFT 铸造到接收者钱包。
 */

// 配置
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "https://api.devnet.solana.com";

(async () => {
  try {
    // --- 设置 ---

    // 初始化与 Solana 的连接
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // 创建并为测试钱包充值
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("正在用 devnet SOL 为测试钱包充值...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- 创建 Collection NFT ---

    const collectionMint = generateSigner(umi);
    console.log("正在创建 collection NFT...");
    console.log("Collection 地址:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
      collectionDetails: {
        __kind: 'V1',
        size: 0,
      },
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("Collection 已创建:", base58.deserialize(createNftTx.signature)[0]);

    // --- 创建 Candy Machine ---

    console.log("正在创建基本 Candy Machine...");
    const candyMachine = generateSigner(umi);

    const createCandyMachineV2Tx = await (
      await createCandyMachineV2(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 2,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          {
            address: umi.identity.publicKey,
            verified: false,
            percentageShare: 100,
          },
        ],
        configLineSettings: some({
          prefixName: "My NFT #",
          nameLength: 3,
          prefixUri: "https://example.com/",
          uriLength: 29,
          isSequential: false,
        }),
      })
    )
      .add(
        addConfigLines(umi, {
          candyMachine: candyMachine.publicKey,
          index: 0,
          configLines: [
            { name: "1", uri: "https://example.com/nft1.json" },
            { name: "2", uri: "https://example.com/nft2.json" },
          ],
        })
      )
      .sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

    console.log("Candy Machine 已创建:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- 铸造 NFT ---

    console.log("正在将 NFT 铸造给接收者...");

    // 获取最新的 Candy Machine 状态
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // 创建铸造交易
    const nftMint = generateSigner(umi);
    const mintTx = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient })
      )
      .add(
        mintFromCandyMachineV2(umi, {
          candyMachine: candyMachine.publicKey,
          mintAuthority: umi.identity,
          nftOwner: recipient,
          nftMint,
          collectionMint: candyMachineAccount.collectionMint,
          collectionUpdateAuthority: candyMachineAccount.authority,
        })
      )
      .sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

    console.log("NFT 铸造成功！");
    console.log("铸造交易:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("执行失败:", error);
  }
})();

```
{% /totem-accordion  %}
{% /totem %}

### 有守卫铸造
对于有守卫的 Candy Machine，可以使用 `mintV2`。在这种情况下，您需要首先使用 `createMintWithAssociatedToken` 为接收者创建代币账户和关联代币账户。这允许接收者在不必签署交易的情况下接收 NFT。

```js
const candyMachineAccount = await fetchCandyMachine(umi, publicKey("CM Address"));

const recipient = publicKey('Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV')
const nftMint = generateSigner(umi)
const mintTx = await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachineAccount.publicKey,
      nftMint,
      token: findAssociatedTokenPda(umi, {
        mint: nftMint.publicKey,
        owner: recipient,
      }),
      collectionMint: candyMachineAccount.collectionMint,
      collectionUpdateAuthority: candyMachineAccount.authority,
      tokenStandard: TokenStandard.NonFungible,
      mintArgs: {
        mintLimit: some({ // 需要 mintArgs 的守卫必须在此处指定
          id: 1,
        }),
      },
    })
  )
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' },
  })
```

{% totem %}
{% totem-accordion title="完整代码示例" %}
```js
import {
  addConfigLines,
  create,
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi-serializers";
import {
  createMintWithAssociatedToken,
  findAssociatedTokenPda,
  setComputeUnitLimit,
} from "@metaplex-foundation/mpl-toolbox";

/**
 * 此脚本演示如何创建带有铸造限制守卫的 Candy Machine
 * 并将 NFT 铸造到接收者钱包。
 */

// 配置
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "ENDPOINT";

(async () => {
  try {
    // --- 设置 ---

    // 初始化与 Solana 的连接
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // 创建并为测试钱包充值
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("正在用 devnet SOL 为测试钱包充值...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- 创建 Collection NFT ---

    const collectionMint = generateSigner(umi);
    console.log("正在创建 collection NFT...");
    console.log("Collection 地址:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
      collectionDetails: {
        __kind: 'V1',
        size: 0,
      },
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("Collection 已创建:", base58.deserialize(createNftTx.signature)[0]);

    // --- 创建 Candy Machine ---

    console.log("正在创建带有铸造限制守卫的 Candy Machine...");
    const candyMachine = generateSigner(umi);

    const createCandyMachineV2Tx = await (
      await create(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 2,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          {
            address: umi.identity.publicKey,
            verified: false,
            percentageShare: 100,
          },
        ],
        guards: {
          mintLimit: some({
            id: 1,
            limit: 2,
          }),
        },
        configLineSettings: some({
          prefixName: "My NFT #",
          nameLength: 3,
          prefixUri: "https://example.com/",
          uriLength: 29,
          isSequential: false,
        }),
      })
    )
      .add(
        addConfigLines(umi, {
          candyMachine: candyMachine.publicKey,
          index: 0,
          configLines: [
            { name: "1", uri: "https://example.com/nft1.json" },
            { name: "2", uri: "https://example.com/nft2.json" },
          ],
        })
      )
      .sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

    console.log("Candy Machine 已创建:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- 铸造 NFT ---

    console.log("正在将 NFT 铸造给接收者...");

    // 获取最新的 Candy Machine 状态
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // 创建铸造交易
    const nftMint = generateSigner(umi);
    const mintTx = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient })
      )
      .add(
        mintV2(umi, {
          candyMachine: candyMachineAccount.publicKey,
          nftMint,
          token: findAssociatedTokenPda(umi, {
            mint: nftMint.publicKey,
            owner: recipient,
          }),
          collectionMint: candyMachineAccount.collectionMint,
          collectionUpdateAuthority: candyMachineAccount.authority,
          tokenStandard: TokenStandard.NonFungible,
          mintArgs: {
            mintLimit: some({
              id: 1,
            }),
          },
        })
      )
      .sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

    console.log("NFT 铸造成功！");
    console.log("铸造交易:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("执行失败:", error);
  }
})();
```
{% /totem-accordion %}
{% /totem %}
