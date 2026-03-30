---
title: Core Candy Machine 防机器人保护最佳实践
metaTitle: 防机器人保护最佳实践 | Core Candy Machine
description: 关于为 Core Candy Machine 铸造实施防机器人保护和安全措施的综合指南，以防止恶意行为者并确保公平分配。
keywords:
  - core candy machine
  - anti-bot protection
  - bot tax guard
  - third-party signer
  - hidden settings
  - placeholder metadata
  - metadata reveal
  - config lines
  - fisher-yates shuffle
  - merkle proof
  - NFT mint security
  - rarity sniping prevention
  - backend mint transaction
  - rate limiting
  - Solana NFT launch
  - fair mint distribution
about:
  - Core Candy Machine anti-bot strategies
  - NFT mint security on Solana
  - Placeholder metadata and reveal patterns
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 如果我的 Candy Machine 已经使用了守卫，为什么还需要占位符元数据？
    a: 守卫保护铸造过程，但所有 Candy Machine 数据在链上是公开可见的。没有占位符，机器人可以预取您的真实元数据 URI，分析稀有特征，并在铸造开始前瞄准特定索引。占位符元数据确保特征信息在揭示之前保持隐藏。
  - q: 隐藏设置和配置行在防机器人保护方面有什么区别？
    a: 隐藏设置按顺序铸造资产（索引 0、1、2...），使铸造顺序可预测。配置行允许您加载带有预随机化排序的占位符元数据，在铸造后揭示映射之上提供额外的不可预测层。
  - q: 机器人能否通过逆向工程我的后端来绕过第三方签名者守卫？
    a: 第三方签名者守卫需要来自仅存在于后端服务器上的私钥的加密签名。即使攻击者逆向工程了前端，没有访问私钥也无法伪造此签名。这就是为什么私钥绝不能在客户端代码中暴露。
  - q: 我应该为项目选择哪种揭示策略？
    a: 选择即时揭示以获得即时用户满意度和较低的支持负担。选择事件揭示以获得全社区的兴奋感和更简单的铸造基础设施。选择用户触发揭示以获得互动参与和用户控制。三种策略通过安全映射提供相同的底层安全保障。
  - q: 验证哈希如何在不揭示映射的情况下证明公平性？
    a: 发布前的验证哈希是每个元数据文件和完整映射的 SHA-256 哈希。在铸造前发布这些哈希证明映射是预先确定的。揭示后，用户可以对收到的元数据进行哈希并与已发布的哈希进行比较，以验证分配未被篡改。
---

## 概述

Core Candy Machine 防机器人保护结合了占位符元数据、使用[第三方签名者守卫](/zh/smart-contracts/core-candy-machine/guards/third-party-signer)的后端控制铸造，以及铸造后揭示过程，以防止稀有度狙击并确保 Solana 上的公平 NFT 分配。 {% .lead %}

- 占位符元数据将真实特征数据隐藏于链上检查，直到揭示阶段
- 使用第三方签名者守卫的后端铸造端点阻止机器人生成自己的铸造交易
- 预生成的加密映射将铸造索引链接到最终元数据，并可在揭示后公开验证
- [Bot tax 守卫](/zh/smart-contracts/core-candy-machine/guards/bot-tax)惩罚失败的铸造尝试，阻止自动化垃圾攻击

## 为什么防机器人保护很重要

机器人保护至关重要，因为未受保护的 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 发布会将元数据、铸造顺序和交易生成暴露给自动化利用。没有适当的保护，机器人可以：

- 在真实用户参与之前铸造大量资产
- 使用可预测的模式狙击稀有物品
- 通过自动请求压垮您的基础设施
- 对真正的社区成员造成不公平的优势

本指南中概述的策略协同工作，创建多层保护，使自动化系统极难操纵您的铸造，同时为合法用户保持流畅的体验。

## 元数据准备和上传策略

#### 创建和上传真实元数据

首先，使用基于交易 ID 的 URI 而不是可预测模式创建完整的集合元数据。

##### 可预测 URI 的漏洞

许多项目犯了使用可预测、递增的 URI 作为元数据的错误：

```
https://yourproject.com/metadata/0.json
https://yourproject.com/metadata/1.json
https://yourproject.com/metadata/2.json
```

这种模式允许机器人：
- 在铸造前预取所有元数据
- 识别稀有特征并针对特定索引
- 根据已知的元数据分布计划攻击

##### 解决方案：使用基于交易 ID URI 的上传服务

您可以使用各种上传服务和 SDK，在上传文件时自动生成基于交易 ID 的 URI。这消除了手动生成随机标识符的需要，并确保真正的不可预测性。

**UMI Uploader 示例（包装 Irys/ArDrive Turbo）**
UMI 的内置上传器是 **Irys** 和 **ArDrive Turbo** 等服务的包装器。它自动生成基于交易 ID 的 URI，同时抽象化直接使用这些服务的复杂性。

**使用 UMI Uploader 的示例：**
```typescript
import fs from "fs";
import mime from "mime";
import { createGenericFile } from "@metaplex-foundation/umi";

const umi = // import or create your umi instance.

// Upload files - UMI automatically creates unpredictable transaction IDs
async function uploadFiles(filePaths: string[]): Promise<string[]> {
  const files = filePaths.map((filePath) => {
    const file = fs.readFileSync(filePath);
    const mimeType = mime.getType(filePath);
    return createGenericFile(file, "file", {
      tags: mimeType ? [{ name: "content-type", value: mimeType }] : [],
    });
  });

  const uploadedUris = await umi.uploader.upload(files);

  // Log each uploaded URI with its index for tracking
  uploadedUris.forEach((uri, index) => {
    console.log(`Uploaded file #${index} -> ${uri}`);
  });

  return uploadedUris;
}

// CRITICAL: Store all returned URIs - you'll need them for the reveal mapping!
const uploadedUris = await uploadFiles(allFilePaths);

// Result: Automatically unpredictable URIs that MUST be stored
// uploadedUris[0] = "https://arweave.net/BrG44HdsEhzapvs8bEqzvkq4egwevS3fRE6kLuCyOdCd"
// uploadedUris[1] = "https://arweave.net/9jK3LpM7NqR5xY8vZ2BwC4tE6gH9sF1D3a7Q8eR2nM4K"
// uploadedUris[2] = "https://arweave.net/5tH8GpN3MqL7wV9xB2CeD4yR6kJ1sK3F8gQ7eP5nL9M2"
// ... etc for all your files

// STORE THESE SECURELY - you cannot regenerate them!
// These URIs are from the underlying service (Irys/ArDrive Turbo) via UMI
fs.writeFileSync("./uploaded-uris.json", JSON.stringify(uploadedUris, null, 2));
await securelyStoreUris(uploadedUris);
```

**其他可探索的上传服务：**
- **Irys**：用于 Arweave 上传的直接 SDK，带有交易 ID
- **ArDrive**：基于 Arweave 的存储，内置交易 ID 生成
- **IPFS**：Pinata、Infura 或 Web3.Storage 等服务
- **AWS S3**：带有自定义交易 ID 生成
- **自定义解决方案**：使用随机 ID 生成构建自己的上传服务

{% callout %}
**有关 UMI uploader 功能的更多详细信息，请参阅 [UMI 存储文档](/zh/dev-tools/umi/storage)。**
{% /callout %}

#### 创建占位符元数据

创建一个单一的占位符元数据文件，最初将用于所有铸造：

```json
{
  "name": "Mystery Asset",
  "description": "This asset will be revealed after mint completion. Each asset is unique and will be unveiled with its true traits and rarity soon!",
  "image": "https://yourproject.com/images/mystery-box.png",
  "attributes": [
    {
      "trait_type": "Status",
      "value": "Unrevealed"
    },
    {
      "trait_type": "Collection",
      "value": "Your Project Name"
    }
  ]
}
```

将其上传到单个可预测的 URI（您可以使用任何上传服务）：
```
https://yourproject.com/metadata/placeholder.json
```

**任何上传解决方案的关键要求：**
- **基于交易 ID 的 URI**：确保不可预测的、非顺序的标识符
- **永久存储**：使用提供不可变存储的服务（Arweave、IPFS 等）
- **URI 存储**：始终按顺序存储返回的 URI 以进行揭示映射
- **批量能力**：支持高效上传多个文件

{% callout type="warning" %}
**关键存储要求：** 上传您的揭示元数据时，您必须按照它们与元数据文件对应的确切顺序存储所有返回的 URI。这些 URI 无法重新生成，对揭示映射过程至关重要。没有它们，您无法揭示您的资产！
{% /callout %}

## 安全映射生成

#### 创建随机化映射

在设置 Candy Machine 之前，生成安全映射，该映射将确定哪个铸造索引对应于哪个最终元数据。这是确保公平分配的关键步骤。

```typescript
// Generate secure mapping BEFORE creating your Candy Machine
function generateSecureMapping(totalSupply: number): number[] {
  // Create array of indices [0, 1, 2, ..., totalSupply-1]
  const indices = Array.from({ length: totalSupply }, (_, i) => i);

  // Use cryptographically secure shuffle (Fisher-Yates)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2**32) * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

// Example: For a 4000 NFT collection
const secureMapping = generateSecureMapping(4000);
// Result: [2847, 91, 3756, 128, 2904, 567, ...]
// This means:
// - Mint index 0 will reveal as metadata index 2847
// - Mint index 1 will reveal as metadata index 91
// - Mint index 2 will reveal as metadata index 3756
// etc.

// Store this mapping securely - it's your reveal key!
await storeMapping(secureMapping);
```

#### 映射安全要求

- **在铸造发布前生成** - 这之后无法更改
- **在揭示时间之前保持映射完全保密**
- **使用加密存储**（数据库加密、环境变量）
- **实施严格的访问控制**以检索映射
- **在多个位置创建安全备份**
- **记录所有访问**以供审计目的

{% callout type="warning" %}
**关键**：映射必须在铸造发布前生成并保护。如果此映射泄露或丢失，您的整个揭示过程将受到影响。
{% /callout %}

## 透明验证设置

#### 发布前哈希生成

在发布前，生成验证哈希以证明映射的公平性而不揭示它：

```typescript
// Generate verification hashes BEFORE mint launch
async function generateVerificationHashes(
  mapping: number[],
  metadataFiles: string[],
  uploadedUris: string[]
): Promise<{masterHash: string, metadataHashes: string[]}> {

  // 1. Hash each individual metadata file
  const metadataHashes = metadataFiles.map(metadata =>
    crypto.createHash('sha256').update(metadata).digest('hex')
  );

  // 2. Extract transaction IDs from uploaded URIs
  const transactionIds = uploadedUris.map(uri => {
    // Extract transaction ID from URI (e.g., https://arweave.net/[ID])
    return uri.split('/').pop();
  });

  // 3. Create verification data structure
  const verificationData = mapping.map((finalIndex, mintIndex) => ({
    mintIndex,
    finalIndex,
    transactionId: transactionIds[finalIndex],
    metadataUri: uploadedUris[finalIndex],
    metadataHash: metadataHashes[finalIndex],
  }));

  // 4. Generate master hash of entire mapping
  const masterHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(verificationData))
    .digest('hex');

  return { masterHash, metadataHashes };
}

const { masterHash, metadataHashes } = await generateVerificationHashes(
  secureMapping,
  allMetadataFiles,
  uploadedUris
);
```

#### 发布验证数据

**在铸造开始前**，公开发布此验证数据：

```json
{
  "projectName": "Your Project",
  "totalSupply": 4000,
  "masterMappingHash": "a7b9c3d2e8f4g5h6i1j0k9l8m7n6o5p4q3r2s1t0u9v8w7x6y5z4",
  "metadataHashes": [
    "b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6",
    "c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7",
    // ... all 4000 metadata hashes
  ],
  "publishedAt": "2024-01-15T10:00:00Z",
  "verificationInstructions": "After reveal, verify your metadata hash matches the published hash for your revealed index"
}
```

在以下平台发布：
- 您的网站
- IPFS 以进行永久存储
- 社交媒体以保证透明度
- Discord/社区频道

## 使用占位符的配置行设置

#### 为什么 Candy Machine 数据是公开可见的

{% callout type="warning" %}
**关键安全洞察：** 所有 Candy Machine 数据在区块链上都是公开可查看的。任何人都可以查询您的 Candy Machine 并查看您加载到其中的所有元数据 URI。这就是为什么使用占位符元数据对安全至关重要。
{% /callout %}

当您将物品加载到 Candy Machine 中时：
- **所有元数据 URI 立即对任何查询链上数据的人可见**
- **机器人可以立即抓取**您的所有真实元数据（如果直接加载）
- **特征分析变得微不足道**
- **稀有度狙击**在铸造开始前就变得可能

这种公开可见性正是占位符策略对保护至关重要的原因。

#### 配置行与隐藏设置

有两种方式将物品加载到 Candy Machine 中，选择正确的方式会影响您的安全性：

**隐藏设置：**
- 按顺序铸造：索引 0，然后 1，然后 2 等。
- 用户获得可预测的占位符铸造顺序
- 虽然映射仍然可以随机化最终揭示，但铸造顺序本身是可预测的

**配置行（推荐）：**
- 更好的用户体验，具有不可预测的占位符铸造索引结果

#### 使用占位符元数据的配置行

将您的 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 配置为在初始铸造阶段使用占位符元数据，可选择预随机化顺序：

```typescript
// Option 1: Simple placeholder approach
const items = Array.from({ length: 4000 }, (_, index) => ({
  name: `Mystery Asset #${index + 1}`,
  uri: "https://yourproject.com/placeholder.json"
}));

// Option 2: Pre-randomized placeholder order for additional unpredictability
function createRandomizedPlaceholders(totalSupply: number): ConfigLine[] {
  const indices = Array.from({ length: totalSupply }, (_, i) => i);

  // Shuffle the indices for random mint order
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices.map((randomIndex, position) => ({
    name: `Mystery Asset #${position + 1}`,
    uri: "https://yourproject.com/placeholder.json"
  }));
}

const randomizedItems = createRandomizedPlaceholders(4000);

// Insert placeholder items into your Candy Machine
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: randomizedItems,
}).sendAndConfirm(umi);
```

**占位符元数据结构：**
```json
{
  "name": "Mystery Asset",
  "description": "This asset will be revealed after mint completion. Each asset is unique and will be unveiled with its true traits and rarity soon!",
  "image": "https://yourproject.com/images/mystery-box.png",
  "attributes": [
    {
      "trait_type": "Status",
      "value": "Unrevealed"
    },
    {
      "trait_type": "Collection",
      "value": "Your Project Name"
    }
  ]
}
```

#### 占位符元数据对防机器人保护的好处

1. **完全元数据隐私**：真实元数据 URI 永远不会出现在 Candy Machine 中
2. **机器人保护**：机器人无法在揭示前分析特征
3. **公平分配**：甚至铸造顺序也可以随机化
4. **公开可验证性**：占位符元数据表明项目是合法的
5. **社区兴奋感**：神秘感带来期待

{% callout %}
**注意：** 占位符应该有吸引力且专业以建立信任，但不得包含任何关于最终特征、稀有度或真实资产的任何识别特征的信息。
{% /callout %}

## 后端控制的铸造交易

#### 第三方签名者策略

永远不要允许前端客户端生成自己的铸造交易。相反，实施一个后端服务，使用强制守卫创建并部分签署所有铸造交易。

#### 后端服务的平台推荐

**Next.js（推荐用于大多数项目）：**
Next.js 是创建 NFT 铸造网站最受欢迎的平台，因为它在单个框架中提供前端和后端功能。内置的 API 路由使实现安全铸造端点变得非常容易。

```typescript
// pages/api/mint.ts or app/api/mint/route.ts
// Built-in backend - no separate server needed!
```

**其他平台选项：**

- **AWS Lambda**：无服务器函数，非常适合处理铸造高峰而无需基础设施管理
- **Vercel Functions**：与 Next.js 部署无缝集成
- **Netlify Functions**：适合小型项目的简单无服务器选项
- **Railway/Render**：全栈托管，易于部署
- **Express.js on VPS**：传统服务器方法，提供最大控制
- **Cloudflare Workers**：边缘计算，全球低延迟铸造

**为什么 Next.js 最适合铸造网站：**
- **集成后端**：内置 API 路由，无需单独的服务器
- **轻松部署**：一键部署到 Vercel、Netlify 等
- **React 前端**：非常适合钱包连接和铸造 UI
- **大型社区**：丰富的 NFT 项目示例和资源
- **性能**：内置优化，快速加载铸造页面

##### 安全所需的守卫

始终在后端生成的交易中包含这些守卫：

**1. 第三方签名者守卫**：确保只有您的后端可以授权铸造
```typescript
const guards = {
  thirdPartySigner: {
    signerKey: backendSignerWallet.publicKey,
  },
  botTax: {
    lamports: sol(0.01), // Tax for failed attempts
    lastInstruction: true,
  },
  solPayment: {
    lamports: sol(0.1), // Mint price
    destination: treasuryWallet.publicKey,
  },
};
```

**2. 机器人税守卫**：通过对失败交易收费来阻止垃圾尝试

##### 后端铸造端点实现

**Next.js API 路由示例：**
```typescript
// pages/api/mint.ts (Pages Router) or app/api/mint/route.ts (App Router)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Validate user (rate limiting, captcha, etc.)
    const { userWallet } = req.body;

    // 2. Generate mint transaction with required guards.
    // You may need to supply additional guard args from the front end.
    const mintTransaction = await mintV1(umi, {
      candyMachine: candyMachine.publicKey,
      asset: generateSigner(umi),
      minter: createNoopSigner(userWallet),
      mintArgs: {
        thirdPartySigner: {
          signer: backendSigner,
        },
      },
    }).buildWithLatestBlockhash(umi);;

    // 3. Partially sign with backend signer
    const signedTransaction = await backendSigner.signTransaction(mintTransaction);

    // 4. Return transaction for user to sign on front end
    res.json({
      transaction: base64.encode(signedTransaction.serialize()),
      asset: mintTransaction.asset.publicKey.toString(),
    });

  } catch (error) {
    res.status(500).json({ error: 'Mint failed' });
  }
}
```

**替代方案：Express.js/AWS Lambda 示例：**
```typescript
// Traditional Express or serverless function
app.post('/api/mint', async (req, res) => {
  try {
    // 1. Validate user (rate limiting, captcha, etc.)
    const { userWallet, captchaToken } = req.body;

    // 2. Generate mint transaction with required guards
    const mintTransaction = await mintV1(umi, {
      candyMachine: candyMachine.publicKey,
      asset: generateSigner(umi),
      minter: createNoopSigner(userWallet),
      mintArgs: {
        thirdPartySigner: {
          signer: backendSigner,
        },
      },
    }).buildWithLatestBlockhash(umi);

    // 3. Partially sign with backend signer
    const signedTransaction = await backendSigner.signTransaction(mintTransaction);

    // 4. Return transaction for user to complete
    res.json({
      transaction: base64.encode(signedTransaction.serialize()),
      asset: mintTransaction.asset.publicKey.toString(),
    });

  } catch (error) {
    res.status(500).json({ error: 'Mint failed' });
  }
});
```

#### 按平台的部署考虑

**Next.js 部署：**
- **Vercel**：零配置部署，非常适合 Next.js
- **Netlify**：优秀的替代方案，使用同样简单
- **Railway**：包含数据库的全栈托管

**无服务器部署：**
- **AWS Lambda**：使用 Serverless Framework 或 AWS CDK
- **Cloudflare Workers**：全球边缘部署
- **Vercel Functions**：随 Next.js 部署自动启用

**传统服务器：**
- **Railway/Render**：简单的容器部署
- **DigitalOcean/Linode**：带 Docker 的 VPS
- **AWS EC2**：完全控制但需要更多设置

{% callout type="warning" %}
**关键安全说明：** 一旦交易被签署，就无法修改。第三方签名者守卫确保没有人可以在您的后端控制之外生成有效的铸造交易。
{% /callout %}

## 铸造后元数据揭示过程

#### 揭示策略概述

铸造完成后，实施揭示机制，使用安全映射将每个资产的元数据从占位符更新为最终元数据。处理揭示过程有三种主要策略：

##### 策略 1：即时揭示

通过即时揭示，每个 NFT 在铸造交易完成后立即更新为其最终元数据。这为用户提供即时满足感，但需要更复杂的后端基础设施。

**过程：**
1. 用户铸造资产（获得占位符元数据）
2. 后端立即在安全映射中查找铸造索引
3. 后端使用存储的上传列表中的最终元数据 URI 更新资产
4. 用户立即收到揭示的资产

**优点：**
- 即时用户满足感
- 无需等待揭示
- 更简单的用户体验

**缺点：**
- 更复杂的后端实现
- 需要针对失败揭示的稳健错误处理

##### 策略 2：事件揭示（项目控制）

通过事件揭示，所有资产在铸造后保持为占位符，项目在预定时间一次性揭示所有 NFT。这创造了全社区的揭示活动，无需用户交互。

**过程：**
1. 用户铸造资产（获得占位符元数据）
2. 资产保持为占位符直到项目揭示活动
3. 项目后端在预定时间使用安全映射处理所有资产
4. 所有资产同时更新为最终元数据

**优点：**
- 更简单的铸造过程
- 创造全社区的揭示兴奋感
- 可安排在最佳时间（如社区活动期间）
- 无需用户交互

**缺点：**
- 用户必须等待揭示
- 需要单独的揭示基础设施
- 需要管理揭示期望

##### 策略 3：用户触发揭示

通过用户触发揭示，用户可以通过交互式 UI 揭示自己的 NFT。每个用户控制其资产何时被揭示，但揭示仍使用安全映射。

**过程：**
1. 用户铸造资产（获得占位符元数据）
2. 资产保持为占位符直到用户选择揭示
3. 用户访问揭示网站并为其特定资产触发揭示
4. 后端在安全映射中查找资产的铸造索引
5. 资产更新为最终元数据

**优点：**
- 用户控制自己的揭示时间
- 创造互动社区参与
- 可以在给予用户选择的同时建立期待
- 较低的即时交易成本

**缺点：**
- 更复杂的 UI/UX 实现
- 需要用户操作来完成揭示
- 如果用户不参与，可能会有不完整的揭示

##### 选择揭示策略

**选择即时揭示，如果：**
- 您想要即时用户满足感
- 您的后端可以处理复杂性
- 您想避免与揭示相关的支持问题

**选择事件揭示，如果：**
- 您想创造全社区的揭示兴奋感
- 您偏好更简单的铸造基础设施
- 您想控制揭示时间
- 您想在社区活动期间安排揭示

**选择用户触发揭示，如果：**
- 您想给予用户控制揭示时间的权力
- 您想创造互动社区参与
- 您有构建揭示 UI/UX 的资源
- 您想在给予用户选择的同时建立期待

三种策略提供相同的安全保障——关键区别在于用户体验、实现复杂度和社区参与方式。

##### 实现参考

有关实际资产更新实现，请参阅 [Core 资产更新文档](/zh/smart-contracts/core/update)，该文档涵盖如何使用 UMI 更新资产元数据、名称和 URI。

揭示过程使用您的安全映射来确定每个铸造资产对应的最终元数据 URI，然后使用 Core 的更新功能更新资产。

##### 揭示后验证

揭示完成后，发布完整映射以允许您的社区验证过程的公平性：

```typescript
// Publish the complete mapping after reveal
const fullMappingData = {
  projectName: "Your Project",
  totalSupply: 4000,
  revealDate: "2024-01-20T15:30:00Z",
  mapping: secureMapping.map((finalIndex, mintIndex) => ({
    mintIndex,
    finalIndex,
    transactionId: uploadedUris[finalIndex].split('/').pop(),
    metadataUri: uploadedUris[finalIndex]
  })),
  masterHash: masterHash, // From pre-launch verification
  verificationInstructions: "Use the verification function below to check your asset"
};

// Publish to IPFS, your website, and community channels
await publishMapping(fullMappingData);
```

**社区验证函数：**
```typescript
// Verification function users can run to verify their assets
function verifyAssetMapping(
  mintIndex: number,
  finalIndex: number,
  receivedMetadata: string,
  publishedHashes: string[]
): boolean {
  // 1. Hash the received metadata
  const metadataHash = crypto
    .createHash('sha256')
    .update(receivedMetadata)
    .digest('hex');

  // 2. Check against published hash
  const expectedHash = publishedHashes[finalIndex];

  // 3. Verify the mapping is correct
  return metadataHash === expectedHash;
}

// Usage example for users
const isValid = verifyAssetMapping(
  0, // Their mint index
  2847, // The revealed final index
  theirMetadataJson, // The metadata they received
  publishedMetadataHashes // The hashes published pre-mint
);

console.log(`Asset verification: ${isValid ? 'VALID' : 'INVALID'}`);
```

## 额外安全考虑

#### 速率限制和监控

```typescript
// Implement rate limiting per wallet
const mintAttempts = new Map<string, number>();

function checkRateLimit(wallet: string): boolean {
  const attempts = mintAttempts.get(wallet) || 0;
  return attempts < MAX_ATTEMPTS_PER_HOUR;
}

// Monitor for suspicious patterns
function detectSuspiciousActivity(requests: MintRequest[]): boolean {
  // Check for identical timing patterns
  // Detect rapid-fire requests from multiple wallets
  // Flag requests with identical metadata
  return false; // Implement your detection logic
}
```

#### 基础设施保护

- **使用 CDN 保护**您的元数据端点
- **实施验证码**用于所有铸造请求（hCaptcha、reCAPTCHA）
- **设置 DDoS 保护**在您的后端服务上
- **监控交易模式**以发现异常活动
- **准备备份基础设施**应对高流量事件
- **使用环境变量**存储所有敏感密钥和端点
- **实施正确的 CORS**策略用于您的 API 端点

#### 特定平台安全提示

**Next.js 安全：**
```typescript
// Implement rate limiting with express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

// Use middleware for API routes
export default limiter(handler);
```

**无服务器安全：**
- **AWS Lambda**：使用 IAM 角色，而不是硬编码凭证
- **Vercel**：使用环境变量和边缘配置
- **Cloudflare Workers**：利用 KV 存储进行速率限制

{% callout type="warning" %}
**记住**：没有任何单一安全措施是万无一失的。所有这些策略的组合创建了对自动化利用的稳健防御，同时为您的社区维护公平的体验。
{% /callout %}

## 完整防机器人保护工作流程

以下是完整的防机器人保护工作流程顺序：

1. **元数据准备**：创建真实元数据文件并通过您选择的服务上传以获取交易 ID URI + 创建占位符元数据
2. **映射生成**：生成将铸造索引连接到最终元数据索引的安全随机映射
3. **验证设置**：创建并发布证明公平性而不揭示映射的哈希
4. **Candy Machine 设置**：在配置行中使用占位符元数据进行部署
5. **后端保护**：通过后端控制所有铸造，使用强制第三方签名者和机器人税守卫
6. **揭示过程**：使用安全映射将所有资产从占位符更新为真实元数据
7. **社区验证**：发布完整映射并提供工具供用户验证其资产

## 注意事项

- 所有 Candy Machine 账户数据在链上都是公开可读的；如果要防止稀有度狙击，切勿将真实元数据 URI 直接加载到配置行中。
- 第三方签名者私钥必须仅存储在后端服务器上，且绝不能暴露给客户端代码。
- 在铸造发布前生成安全映射和验证哈希；这些值无法追溯更改。
- 在部署到主网之前，在 devnet 上测试整个流程（占位符铸造、映射、揭示、验证）。
- 仅靠速率限制是不够的；将其与验证码、第三方签名者和机器人税守卫结合使用以实现分层防御。
- 坚定的攻击者将持续寻找弱点；了解新的攻击向量并相应更新您的防御。

## FAQ

### 如果我的 Candy Machine 已经使用了守卫，为什么还需要占位符元数据？

守卫保护铸造过程，但所有 Candy Machine 数据在链上是公开可见的。没有占位符，机器人可以预取您的真实元数据 URI，分析稀有特征，并在铸造开始前瞄准特定索引。占位符元数据确保特征信息在揭示之前保持隐藏。

### 隐藏设置和配置行在防机器人保护方面有什么区别？

[隐藏设置](/zh/smart-contracts/core-candy-machine/create#hidden-settings-field)按顺序铸造资产（索引 0、1、2...），使铸造顺序可预测。[配置行](/zh/smart-contracts/core-candy-machine/insert-items)允许您加载带有预随机化排序的占位符元数据，在铸造后揭示映射之上提供额外的不可预测层。

### 机器人能否通过逆向工程我的后端来绕过第三方签名者守卫？

[第三方签名者守卫](/zh/smart-contracts/core-candy-machine/guards/third-party-signer)需要来自仅存在于后端服务器上的私钥的加密签名。即使攻击者逆向工程了前端，没有访问私钥也无法伪造此签名。这就是为什么私钥绝不能在客户端代码中暴露。

### 我应该为项目选择哪种揭示策略？

选择即时揭示以获得即时用户满意度和较低的支持负担。选择事件揭示以获得全社区的兴奋感和更简单的铸造基础设施。选择用户触发揭示以获得互动参与和用户控制。三种策略通过安全映射提供相同的底层安全保障。

### 验证哈希如何在不揭示映射的情况下证明公平性？

发布前的验证哈希是每个元数据文件和完整映射的 SHA-256 哈希。在铸造前发布这些哈希证明映射是预先确定的。揭示后，用户可以对收到的元数据进行哈希并与已发布的哈希进行比较，以验证分配未被篡改。

## 术语表

| 术语 | 定义 |
|------|------|
| Third-Party Signer（第三方签名者） | 一个 Candy Machine 守卫，要求来自指定后端密钥对的加密签名才能使铸造交易有效。 |
| Bot Tax（机器人税） | 一个 Candy Machine 守卫，对铸造交易未通过守卫验证的钱包收取可配置的 SOL 罚金，阻止自动化垃圾攻击。 |
| Hidden Settings（隐藏设置） | 一种 Candy Machine 配置模式，所有铸造资产共享相同的名称和 URI，铸造按顺序索引进行。 |
| Placeholder Metadata（占位符元数据） | 加载到 Candy Machine 中的临时、不揭示内容的元数据（如 "Mystery Asset"），使真实特征数据在铸造后揭示之前保持隐藏。 |
| Merkle Proof（默克尔证明） | 从 Merkle 树派生的加密证明，验证钱包在允许列表中的包含，而不在链上暴露完整列表。 |
| Config Lines（配置行） | Candy Machine 中存储每个物品名称和元数据 URI 的链上数据条目；任何查询账户的人都可以公开读取。 |
| Reveal（揭示） | 使用预生成的安全映射将每个资产的占位符元数据更新为最终元数据 URI 的铸造后过程。 |
| Fisher-Yates Shuffle | 一种加密无偏算法，用于随机排列数组，此处用于生成安全的铸造到元数据映射。 |

