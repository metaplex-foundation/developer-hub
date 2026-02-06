---
title: 防机器人保护最佳实践
metaTitle: 防机器人保护最佳实践 | Core Candy Machine
description: 关于为 Core Candy Machine 铸造实施防机器人保护和安全措施的综合指南，以防止恶意行为者并确保公平分配。
---

保护您的 Core Candy Machine 发布免受机器人和恶意行为者的影响，对于确保向社区公平分配至关重要。本指南涵盖了成功项目用于维护铸造完整性的经过验证的策略和实施模式，同时为合法用户提供透明度。{% .lead %}

## 为什么防机器人保护很重要

没有适当的保护，机器人可以：

- 在真实用户参与之前铸造大量资产
- 使用可预测的模式狙击稀有物品
- 通过自动请求压垮您的基础设施
- 对真正的社区成员造成不公平的优势

本指南中概述的策略协同工作，创建多层保护，使自动化系统极难操纵您的铸造，同时为合法用户保持流畅的体验。

## 元数据准备和上传策略

#### 创建和上传真实元数据

首先，使用基于交易 ID 的 URI 而不是可预测模式创建完整的集合元数据。

##### 可预测 URI 的问题

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

##### 解决方案：具有基于交易 ID 的 URI 的上传服务

您可以使用各种上传服务和 SDK，在上传文件时自动生成基于交易 ID 的 URI。这消除了手动生成随机标识符的需要，并确保真正的不可预测性。

**UMI Uploader 示例（包装 Irys/ArDrive Turbo）**
UMI 的内置上传器是 **Irys** 和 **ArDrive Turbo** 等服务的包装器。它自动生成基于交易 ID 的 URI，同时抽象化直接使用这些服务的复杂性。

**使用 UMI Uploader 的示例：**

```typescript
import fs from "fs";
import mime from "mime";
import { createGenericFile } from "@metaplex-foundation/umi";

const umi = // 导入或创建您的 umi 实例。

// 上传文件 - UMI 自动创建不可预测的交易 ID
async function uploadFiles(filePaths: string[]): Promise<string[]> {
  const files = filePaths.map((filePath) => {
    const file = fs.readFileSync(filePath);
    const mimeType = mime.getType(filePath);
    return createGenericFile(file, "file", {
      tags: mimeType ? [{ name: "content-type", value: mimeType }] : [],
    });
  });

  const uploadedUris = await umi.uploader.upload(files);

  // 记录每个上传的 URI 及其索引以便跟踪
  uploadedUris.forEach((uri, index) => {
    console.log(`已上传文件 #${index} -> ${uri}`);
  });

  return uploadedUris;
}

// 关键：存储所有返回的 URI - 您将需要它们进行揭示映射！
const uploadedUris = await uploadFiles(allFilePaths);

// 结果：必须存储的自动不可预测 URI
// uploadedUris[0] = "https://arweave.net/BrG44HdsEhzapvs8bEqzvkq4egwevS3fRE6kLuCyOdCd"
// uploadedUris[1] = "https://arweave.net/9jK3LpM7NqR5xY8vZ2BwC4tE6gH9sF1D3a7Q8eR2nM4K"
// uploadedUris[2] = "https://arweave.net/5tH8GpN3MqL7wV9xB2CeD4yR6kJ1sK3F8gQ7eP5nL9M2"
// ... 您所有文件的其余部分

// 安全存储这些 - 您无法重新生成它们！
// 这些 URI 来自通过 UMI 的底层服务（Irys/ArDrive Turbo）
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
  "name": "神秘资产",
  "description": "此资产将在铸造完成后揭示。每个资产都是独特的，很快将揭示其真实特征和稀有度！",
  "image": "https://yourproject.com/images/mystery-box.png",
  "attributes": [
    {
      "trait_type": "状态",
      "value": "未揭示"
    },
    {
      "trait_type": "集合",
      "value": "您的项目名称"
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
// 在创建 Candy Machine 之前生成安全映射
function generateSecureMapping(totalSupply: number): number[] {
  // 创建索引数组 [0, 1, 2, ..., totalSupply-1]
  const indices = Array.from({ length: totalSupply }, (_, i) => i);

  // 使用密码学安全的洗牌（Fisher-Yates）
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2**32) * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

// 示例：对于 4000 NFT 集合
const secureMapping = generateSecureMapping(4000);
// 结果：[2847, 91, 3756, 128, 2904, 567, ...]
// 这意味着：
// - 铸造索引 0 将揭示为元数据索引 2847
// - 铸造索引 1 将揭示为元数据索引 91
// - 铸造索引 2 将揭示为元数据索引 3756
// 等等。

// 安全存储此映射 - 它是您的揭示密钥！
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

## 后端控制的铸造交易

#### 第三方签名者策略

永远不要允许前端客户端生成自己的铸造交易。相反，实施一个后端服务，使用强制守卫创建并部分签署所有铸造交易。

##### 安全所需的守卫

始终在后端生成的交易中包含这些守卫：

**1. 第三方签名者守卫**：确保只有您的后端可以授权铸造

```typescript
const guards = {
  thirdPartySigner: {
    signerKey: backendSignerWallet.publicKey,
  },
  botTax: {
    lamports: sol(0.01), // 失败尝试的税费
    lastInstruction: true,
  },
  solPayment: {
    lamports: sol(0.1), // 铸造价格
    destination: treasuryWallet.publicKey,
  },
};
```

**2. 机器人税守卫**：通过对失败交易收费来阻止垃圾邮件尝试

##### 后端铸造端点实现

**Next.js API 路由示例：**

```typescript
// pages/api/mint.ts（Pages Router）或 app/api/mint/route.ts（App Router）
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    // 1. 验证用户（速率限制、验证码等）
    const { userWallet } = req.body;

    // 2. 生成带有所需守卫的铸造交易。
    // 您可能需要从前端提供额外的守卫参数。
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

    // 3. 使用后端签名者部分签名
    const signedTransaction = await backendSigner.signTransaction(mintTransaction);

    // 4. 返回交易供用户在前端签名
    res.json({
      transaction: base64.encode(signedTransaction.serialize()),
      asset: mintTransaction.asset.publicKey.toString(),
    });

  } catch (error) {
    res.status(500).json({ error: '铸造失败' });
  }
}
```

{% callout type="warning" %}
**关键安全说明：** 一旦交易被签署，就无法修改。第三方签名者守卫确保没有人可以在您的后端控制之外生成有效的铸造交易。
{% /callout %}

## 铸造后元数据更新（揭示）

#### 揭示过程

铸造完成后，实施揭示机制，使用安全映射将每个资产的元数据从占位符更新为最终元数据。处理揭示过程有三种主要策略：

##### 策略 1：即时揭示

通过即时揭示，每个 NFT 在铸造交易完成后立即更新为其最终元数据。这为用户提供即时满足感，但需要更复杂的后端基础设施。

##### 策略 2：事件揭示（项目控制）

通过事件揭示，所有资产在铸造后保持为占位符，项目在预定时间一次性揭示所有 NFT。这创造了全社区的揭示活动，无需用户交互。

##### 策略 3：用户触发揭示

通过用户触发揭示，用户可以通过交互式 UI 揭示自己的 NFT。每个用户控制其资产何时被揭示，但揭示仍使用安全映射。

## 总结

以下是完整的防机器人保护工作流程顺序：

1. **📁 元数据准备**：创建真实元数据文件并通过您选择的服务上传以获取交易 ID URI + 创建占位符元数据
2. **🎯 映射生成**：生成将铸造索引连接到最终元数据索引的安全随机映射
3. **🔒 验证设置**：创建并发布证明公平性而不揭示映射的哈希
4. **⚙️ Candy Machine 设置**：在配置行中使用占位符元数据进行部署
5. **🛡️ 后端保护**：通过后端控制所有铸造，使用强制第三方签名者和机器人税守卫
6. **🎭 揭示过程**：使用安全映射将所有资产从占位符更新为真实元数据
7. **✅ 社区验证**：发布完整映射并提供工具供用户验证其资产

## 结论

实施全面的防机器人保护需要在铸造基础设施的多个层面进行仔细的规划和执行。本指南中概述的时间顺序方法确保每个步骤都建立在前一个步骤之上，创建一个强大的防御系统。

**关键成功因素：**

- **准备就是一切**：在发布前生成映射和验证哈希
- **后端控制至关重要**：永远不要让客户端生成自己的铸造交易
- **透明度建立信任**：在铸造前发布验证数据，在揭示后发布完整映射
- **彻底测试**：在主网发布前在开发网验证整个流程

通过遵循这种结构化方法，您创建了多层保护，使自动化系统极难操纵您的铸造，同时为合法社区成员保持完全的透明度和公平性。

请记住，坚定的攻击者将始终寻找弱点，因此了解新的攻击向量并不断改进您的防御对于长期成功至关重要。
