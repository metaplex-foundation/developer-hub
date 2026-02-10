---
title: 使用 Turbo 创建确定性元数据
metaTitle: 使用 Turbo 创建确定性元数据 | 通用指南
description: 了解如何利用 Turbo SDK 创建确定性元数据，用于基于 Arweave 的上传。
# remember to update dates also in /components/guides/index.js
created: '10-19-2024'
updated: '10-19-2024'
---

要利用 MPL-Hybrid 程序中的元数据随机化功能，链外元数据 URI 需要遵循一致的增量结构。为了实现这一点，我们将使用 Arweave 的[路径清单](https://cookbook.arweave.dev/concepts/manifests.html)功能和 Turbo SDK。**本指南将演示如何设置！**

{% callout title="什么是 Turbo" %}

Turbo 是一种超高吞吐量的 Permaweb 服务，可简化向 Arweave 和从 Arweave 传输数据的资金、索引和传输。它提供图形和编程界面，用于使用信用卡或借记卡的法币支付选项以及 ETH、SOL 和 AR 等加密货币。

{% /callout %}

## 先决条件

### 所需包

{% packagesUsed packages=[ "@ardrive/turbo-sdk" ] type="npm" /%}

安装本指南所需的包。

```js
npm i @ardrive/turbo-sdk
```

### 元数据文件夹

在此示例中，我们将向您展示如何以确定性方式上传元数据。为此，您需要在开始之前准备好所有资产。

要生成元数据，您可以使用[这些方法之一](/zh/smart-contracts/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine#image-and-metadata-generators)并按照从 0 开始的增量命名约定保存元数据，如下所示：

```
metadata/
├─ 0.json
├─ 1.json
├─ 2.json
├─ ...
```

**注意**：创建元数据时，请确保遵循正确的 [NFT JSON 架构](/zh/smart-contracts/token-metadata/token-standard#the-non-fungible-standard)！

## 设置 Turbo

由于 Turbo 兼容多个代币和链，我们需要将 Turbo 实例配置为在本指南中使用 Solana 作为代币。我们通过调用 `TurboFactory.authenticated()` 方法并传入 Solana 特定的配置选项来实现这一点。

```javascript
import { TurboFactory } from '@ardrive/turbo-sdk';

// Import here the keypair.json file that you're going
// to use to pay for the upload
import secretKey from "/path/to/your/keypair.json";

const turbo = TurboFactory.authenticated({
  privateKey: bs58.encode(Uint8Array.from(secretKey)),
  token: 'solana',
  gatewayUrl: `https://api.devnet.solana.com`,
  paymentServiceConfig: { url: "https://payment.ardrive.dev" },
  uploadServiceConfig: { url: "https://upload.ardrive.dev" },
});
```

**注意**：在此示例中，我们明确提供 `gatewayUrl`、`paymentServiceConfig` 和 `uploadServiceConfig`，因为我们想要配置环境以在 devnet 上工作。对于主网使用，您可以将这些字段留空，Turbo 将默认为主网端点。

## 上传元数据

Turbo 使用 `TurboAuthenticatedClient.uploadFolder()` 函数简化了上传整个元数据文件夹的过程。此函数默认支持清单，通过 `metadataUploadResponse.manifestResponse?.id` 返回清单 ID，可用于元数据创建和托管设置。

为了简化流程，本指南提供了一个名为 `uploadMetadata()` 的辅助函数来处理整个工作流程。

```javascript
const metadataUploadResponse = await uploadMetadata(turbo);
```

**`uploadMetadata()` 辅助函数的步骤**

1. 通过调用 `calculateRequiredLamportsForUpload()` 确定上传需要多少 lamports，该函数计算 Winc（Turbo 的代币）中的上传成本，并使用 `TurboAuthenticatedClient.getWincForToken()` 将其转换为 lamports。

2. 如果钱包缺少足够的 Winc，该函数使用 `TurboAuthenticatedClient.topUpWithTokens()` 通过将 lamports 转换为 Winc 来充值所需数量。

3. 一旦钱包有足够的 Winc，使用 `TurboAuthenticatedClient.uploadFolder()` 上传元数据文件夹，这将返回元数据的清单 ID。

### 计算所需的 Lamports

```javascript
const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
  turbo,
  calculateFolderSize(metadataFolderPath)
);
```

我们首先计算文件夹的总大小（以字节为单位）。以下函数递归遍历文件夹结构以汇总所有文件的大小：

```javascript
function calculateFolderSize(folderPath: string): number {
  return fs.readdirSync(folderPath).reduce((totalSize, item) => {
    const fullPath = path.join(folderPath, item);

    const stats = fs.statSync(fullPath);

    return stats.isFile()
        ? totalSize + stats.size
        : totalSize + calculateFolderSize(fullPath);
  }, 0);
}
```

确定文件夹大小后，下一步是计算上传需要多少 lamports。这是使用 `calculateRequiredLamportsForUpload()` 函数完成的，该函数确定 Winc 成本并将其转换为 lamports：

```javascript
async function calculateRequiredLamportsForUpload(turbo: TurboAuthenticatedClient, fileSize: number): Promise<number> {
    /// If the file size is less than 105 KiB, then we don't need to pay for it
    if (fileSize < 107_520) { return 0; }

    /// Check how many winc does it cost to upload the file
    const uploadPrice = new BigNumber((await turbo.getUploadCosts({ bytes: [fileSize]}))[0].winc);

    /// Check the current Winc balance
    const currentBalance = new BigNumber((await turbo.getBalance()).winc);

    /// Calculate how much Winc is required to upload the file
    const requiredWinc = uploadPrice.isGreaterThan(currentBalance)
        ? uploadPrice.minus(currentBalance)
        : new BigNumber(0); // If balance is enough, no Winc is required

    /// If the required Winc is 0, we already have enough to upload the file
    if (requiredWinc.isEqualTo(0)) { return 0; }

    /// Calculate how much Winc 1 SOL is worth (1 SOL = 1_000_000_000 Lamports)
    const wincForOneSol = new BigNumber((await turbo.getWincForToken({ tokenAmount: 1_000_000_000 })).winc);

    /// Calculate how much SOL is required to upload the file (return in SOL)
    const requiredSol = requiredWinc.dividedBy(wincForOneSol).toNumber();

    /// Return the amount of SOL required in Lamports
    return Math.floor(requiredSol * 1_000_000_000)
}
```

### 充值钱包并上传元数据

要充值钱包，我们使用 `TurboAuthenticatedClient.topUpWithTokens()` 方法，指定在上一步中计算的 lamports 数量。此数量将转换为 Winc（Turbo 的代币），这是上传过程所需的。

**注意**：充值过程是有条件的。如果我们在钱包中已经有足够的 Winc，`calculateRequiredLamportsForUpload()` 函数将返回 0，并且不需要充值。

```javascript
// Top up wallet if required
await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});
```

在确保钱包有足够的 Winc 后，我们可以继续上传图像文件夹。这是使用 `TurboAuthenticatedClient.uploadFolder()` 方法完成的。上传将返回一个清单 ID，允许访问上传的文件，格式如下：`https://arweave.net/${manifestID}/${nameOfTheFile.extension}`。

**注意**：在上传期间为每个文件设置正确的 [MIME 类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)很重要。如果 MIME 类型设置不正确，通过 URI 访问时文件可能无法正确显示。

```javascript
// Upload image folder
const metadataUploadResponse = await turbo.uploadFolder({
    folderPath: metadataFolderPath,
    dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
});
```

## 完整代码示例

以下是您可以复制和粘贴以便轻松使用的完整代码示例

{% totem %}

{% totem-accordion title="完整代码示例" %}

```javascript
import {
    TurboFactory,
    TurboAuthenticatedClient,
    lamportToTokenAmount,
    TurboUploadFolderResponse
} from '@ardrive/turbo-sdk';

import bs58 from 'bs58';
import path from 'path';
import fs from 'fs';
import BigNumber from 'bignumber.js';

import secretKey from "/path/to/your/keypair.json";

const imageFolderPath = path.join(__dirname, './assets');
const metadataFolderPath = path.join(__dirname, './metadata');

(async () => {
    try {
        /// Step 1: Setup Turbo
        const turbo = TurboFactory.authenticated({
            privateKey: bs58.encode(Uint8Array.from(secretKey)),
            token: 'solana',
            gatewayUrl: `https://api.devnet.solana.com`,
            paymentServiceConfig: { url: "https://payment.ardrive.dev" },
            uploadServiceConfig: { url: "https://upload.ardrive.dev" },
        });

        /// Step 2: Upload Metadata
        const metadataUploadResponse = await uploadMetadata(turbo);
    } catch (error) {
        console.error("Error during execution:", error);
    }
})();

async function uploadMetadata(turbo: TurboAuthenticatedClient): Promise<TurboUploadFolderResponse> {
    // Calculate and upload metadata folder
    const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
        turbo,
        calculateFolderSize(metadataFolderPath)
    );

    // Top up wallet if required
    await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});

    // Upload metadata folder
    const metadataUploadResponse = await turbo.uploadFolder({
        folderPath: metadataFolderPath,
        dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
    });

    console.log('Metadata Manifest ID:', metadataUploadResponse.manifestResponse?.id);
    return metadataUploadResponse;
}

function calculateFolderSize(folderPath: string): number {
  return fs.readdirSync(folderPath).reduce((totalSize, item) => {
    const fullPath = path.join(folderPath, item);

    const stats = fs.statSync(fullPath);

    return stats.isFile()
        ? totalSize + stats.size
        : totalSize + calculateFolderSize(fullPath);
  }, 0);
}

async function calculateRequiredLamportsForUpload(turbo: TurboAuthenticatedClient, fileSize: number): Promise<number> {
    /// If the file size is less than 105 KiB, then we don't need to pay for it
    if (fileSize < 107_520) { return 0; }

    /// Check how many winc does it cost to upload the file
    const uploadPrice = new BigNumber((await turbo.getUploadCosts({ bytes: [fileSize]}))[0].winc);

    /// Check the current Winc balance
    const currentBalance = new BigNumber((await turbo.getBalance()).winc);

    /// Calculate how much Winc is required to upload the file
    const requiredWinc = uploadPrice.isGreaterThan(currentBalance)
        ? uploadPrice.minus(currentBalance)
        : new BigNumber(0); // If balance is enough, no Winc is required

    /// If the required Winc is 0, we already have enough to upload the file
    if (requiredWinc.isEqualTo(0)) { return 0; }

    /// Calculate how much Winc 1 SOL is worth (1 SOL = 1_000_000_000 Lamports)
    const wincForOneSol = new BigNumber((await turbo.getWincForToken({ tokenAmount: 1_000_000_000 })).winc);

    /// Calculate how much SOL is required to upload the file (return in SOL)
    const requiredSol = requiredWinc.dividedBy(wincForOneSol).toNumber();

    /// Return the amount of SOL required in Lamports
    return Math.floor(requiredSol * 1_000_000_000)
}
```

{% /totem %}

{% /totem-accordion %}
