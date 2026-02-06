---
title: JavaScript SDK
metaTitle: JavaScript SDK | Metaplex Core
description: Metaplex Core JavaScript SDK 完整参考。涵盖 Umi 设置、创建 Asset、转移、销毁、更新、Collection、插件和数据获取。
updated: '01-31-2026'
keywords:
  - mpl-core JavaScript
  - Core TypeScript SDK
  - Umi framework
  - NFT JavaScript
  - Solana NFT SDK
about:
  - JavaScript SDK
  - Umi integration
  - TypeScript development
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Core JavaScript SDK 是什么？
    a: Core JavaScript SDK（@metaplex-foundation/mpl-core）是用于与 Solana 上的 Metaplex Core NFT 交互的 TypeScript 库。它提供类型安全的函数用于创建、转移、销毁和管理 Asset 和 Collection。
  - q: 使用此 SDK 需要 Umi 吗？
    a: 是的。Core SDK 构建在 Umi 框架之上，该框架处理钱包连接、RPC 通信和交易构建。请同时安装 @metaplex-foundation/mpl-core 和 @metaplex-foundation/umi-bundle-defaults。
  - q: 如何连接浏览器钱包？
    a: 将 @metaplex-foundation/umi-signer-wallet-adapters 包与钱包适配器一起使用，并调用 umi.use(walletAdapterIdentity(wallet))。
  - q: sendAndConfirm 和 send 有什么区别？
    a: sendAndConfirm() 等待交易确认后返回。send() 在广播后立即返回。大多数情况下使用 sendAndConfirm()。
  - q: 如何批量处理多个操作？
    a: 使用 transactionBuilder() 组合指令，但要注意 Solana 的交易大小限制（约 1232 字节）。对于大批量操作，发送多个交易。
  - q: 这个 SDK 可以在 React/Next.js 中使用吗？
    a: 可以。SDK 在浏览器和 Node.js 环境中都能工作。对于 React，将 @solana/wallet-adapter-react 的钱包适配器与 Umi 的钱包适配器身份一起使用。
---
**Metaplex Core JavaScript SDK**（`@metaplex-foundation/mpl-core`）提供完整的 TypeScript/JavaScript 接口，用于与 Solana 上的 Core Asset 和 Collection 交互。它构建在 [Umi 框架](/dev-tools/umi) 之上，为所有 Core 操作提供类型安全的方法。 {% .lead %}
{% callout title="您将学到" %}
本 SDK 参考涵盖：
- 使用 Core 插件设置 Umi
- 创建、转移、销毁和更新 Asset
- 管理 Collection 和收藏级操作
- 添加、更新和删除插件
- 使用 DAS 获取 Asset 和 Collection
- 错误处理和常见模式
{% /callout %}
## 摘要
**Core JavaScript SDK** 是从 JavaScript/TypeScript 应用程序与 Metaplex Core 交互的推荐方式。它将 Core 程序指令封装在类型安全的 API 中。
- 安装：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
- 需要 Umi 框架进行钱包/RPC 管理
- 所有函数返回交易构建器以便灵活执行
- 支持浏览器和 Node.js 环境
## 范围外
Rust SDK 用法（参见 [Rust SDK](/zh/smart-contracts/core/sdk/rust)）、Token Metadata 操作、Candy Machine 集成和底层 Solana 交易构造。
## 快速开始
**跳转至：** [设置](#umi-设置) · [创建](#创建-asset) · [转移](#转移-asset) · [销毁](#销毁-asset) · [更新](#更新-asset) · [Collection](#collection) · [插件](#插件) · [获取](#获取-asset) · [错误](#常见错误) · [FAQ](#faq)
1. 安装依赖：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi-bundle-defaults`
2. 使用 `mplCore()` 插件创建 Umi 实例
3. 生成或加载用于交易的 signer
4. 调用 SDK 函数并确认交易
## 前提条件
- **Node.js 18+** 或支持 ES 模块的现代浏览器
- 配置了 RPC 和 signer 的 **Umi 框架**
- 用于交易费用的 **SOL**（每个 Asset 约 0.003 SOL）
{% quick-links %}
{% quick-link title="API 参考" target="_blank" icon="JavaScript" href="https://mpl-core.typedoc.metaplex.com/" description="SDK 的完整 TypeDoc API 文档。" /%}
{% quick-link title="NPM 包" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core" description="npmjs.com 上的包和版本历史。" /%}
{% /quick-links %}
## 安装
安装 Core SDK 和 Umi 框架：
```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi-bundle-defaults
```
对于元数据上传，添加上传器插件：
```bash {% title="Terminal" %}
npm install @metaplex-foundation/umi-uploader-irys
```
## Umi 设置
使用 Core 插件创建和配置 Umi 实例：
```ts {% title="setup-umi.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
// 使用 RPC 端点创建 Umi
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(yourKeypair))
  .use(irysUploader()) // 可选：用于元数据上传
```
{% totem %}
{% totem-accordion title="从文件加载 Keypair" %}
```ts {% title="load-keypair.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { readFileSync } from 'fs'
const secretKey = JSON.parse(
  readFileSync('/path/to/keypair.json', 'utf-8')
)
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(keypair))
```
{% /totem-accordion %}
{% totem-accordion title="浏览器钱包适配器" %}
```ts {% title="browser-wallet.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(walletAdapterIdentity(wallet)) // 来自 @solana/wallet-adapter-react
```
{% /totem-accordion %}
{% /totem %}
## Asset
### 创建 Asset
使用 `create()` 铸造新的 Core Asset：
{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}
### 转移 Asset
使用 `transfer()` 将 Asset 发送到另一个钱包：
{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}
### 销毁 Asset
使用 `burn()` 永久销毁 Asset 并回收租金：
{% code-tabs-imported from="core/burn-asset" frameworks="umi" /%}
### 更新 Asset
使用 `update()` 修改 Asset 元数据：
{% code-tabs-imported from="core/update-asset" frameworks="umi" /%}
## Collection
### 创建 Collection
使用 `createCollection()` 创建 Collection 账户：
{% code-tabs-imported from="core/create-collection" frameworks="umi" /%}
### 在 Collection 中创建 Asset
将 `collection` 参数传递给 `create()`：
{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}
## 插件
插件为 Asset 和 Collection 添加行为。可以在创建时或之后添加。
### 创建时添加插件
{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}
### 向现有 Asset 添加插件
{% code-tabs-imported from="core/add-plugin" frameworks="umi" /%}
### 常见插件类型
| 插件 | 类型字符串 | 用途 |
|--------|-------------|---------|
| Royalties | `'Royalties'` | 创作者版税强制 |
| Freeze Delegate | `'FreezeDelegate'` | 允许冻结/解冻 |
| Burn Delegate | `'BurnDelegate'` | 允许委托人销毁 |
| Transfer Delegate | `'TransferDelegate'` | 允许委托人转移 |
| Update Delegate | `'UpdateDelegate'` | 允许元数据更新 |
| Attributes | `'Attributes'` | 链上键/值数据 |
| Permanent Freeze | `'PermanentFreezeDelegate'` | 永久冻结状态 |
| Permanent Transfer | `'PermanentTransferDelegate'` | 永久转移委托 |
| Permanent Burn | `'PermanentBurnDelegate'` | 永久销毁委托 |
详细的插件文档请参阅[插件概述](/zh/smart-contracts/core/plugins)。
## 获取 Asset
### 获取单个 Asset
{% code-tabs-imported from="core/fetch-asset" frameworks="umi" /%}
### 按所有者获取 Asset（DAS）
使用 DAS API 查询索引的 Asset：
```ts {% title="fetch-by-owner.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
// 向 Umi 添加 DAS 插件
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(dasApi())
const owner = publicKey('OwnerAddressHere...')
const assets = await umi.rpc.getAssetsByOwner({
  owner,
  limit: 100,
})
console.log('拥有的 Asset 数量:', assets.items.length)
```
### 按 Collection 获取 Asset（DAS）
```ts {% title="fetch-by-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
const collectionAddress = publicKey('CollectionAddressHere...')
const assets = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: collectionAddress,
  limit: 100,
})
console.log('Collection 中的 Asset 数量:', assets.items.length)
```
## 上传元数据
使用 Umi 的上传器插件存储元数据 JSON：
```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(keypairIdentity(yourKeypair))
  .use(irysUploader())
// 首先上传图像
const imageFile = await fs.promises.readFile('image.png')
const [imageUri] = await umi.uploader.upload([imageFile])
// 上传元数据 JSON
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'An awesome NFT',
  image: imageUri,
  attributes: [
    { trait_type: 'Background', value: 'Blue' },
    { trait_type: 'Rarity', value: 'Rare' },
  ],
})
console.log('元数据 URI:', uri)
```
## 交易模式
### 发送并确认
标准模式等待确认：
```ts {% title="send-confirm.ts" %}
const result = await create(umi, { asset, name, uri }).sendAndConfirm(umi)
console.log('签名:', result.signature)
```
### 自定义确认选项
```ts {% title="custom-confirm.ts" %}
const result = await create(umi, { asset, name, uri }).sendAndConfirm(umi, {
  confirm: { commitment: 'finalized' },
})
```
### 构建交易但不发送
```ts {% title="build-only.ts" %}
const tx = create(umi, { asset, name, uri })
const builtTx = await tx.buildAndSign(umi)
// 稍后发送: await umi.rpc.sendTransaction(builtTx)
```
### 组合多个指令
```ts {% title="combine-instructions.ts" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
const tx = transactionBuilder()
  .add(create(umi, { asset: asset1, name: 'NFT 1', uri: uri1 }))
  .add(create(umi, { asset: asset2, name: 'NFT 2', uri: uri2 }))
await tx.sendAndConfirm(umi)
```
## 常见错误
### `Account does not exist`
Asset 或 collection 地址不存在。验证地址是否正确：
```ts
const asset = await fetchAsset(umi, assetAddress).catch(() => null)
if (!asset) {
  console.log('Asset 未找到')
}
```
### `Invalid authority`
您没有权限执行此操作。检查：
- 您是否拥有该 Asset（用于转移、销毁）
- 您是否是 update authority（用于更新）
- 您是否具有所需的委托权限
### `Insufficient funds`
您的钱包需要更多 SOL。使用以下命令充值：
```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```
### `Asset already exists`
Asset keypair 已被使用。生成新的 signer：
```ts
const assetSigner = generateSigner(umi) // 必须是唯一的
```
### `Plugin not found`
此 Asset 上不存在该插件。检查已安装的插件：
```ts
const asset = await fetchAsset(umi, assetAddress)
console.log('插件:', Object.keys(asset))
```
## 注意事项
- 始终为新 Asset 使用新的 keypair - 永远不要重用 keypair
- `create()` 中的 `asset` 参数必须是 signer，而不仅仅是公钥
- Collection 级插件会覆盖相同类型的 Asset 级插件
- 创建后立即获取 Asset 时使用 `commitment: 'finalized'`
- 交易构建器是不可变的 - 每个方法返回新的构建器
## 快速参考
### 最小依赖
```json {% title="package.json" %}
{
  "dependencies": {
    "@metaplex-foundation/mpl-core": "^1.0.0",
    "@metaplex-foundation/umi": "^0.9.0",
    "@metaplex-foundation/umi-bundle-defaults": "^0.9.0"
  }
}
```
### 核心函数
| 函数 | 用途 |
|----------|---------|
| `create()` | 创建新 Asset |
| `createCollection()` | 创建新 Collection |
| `transfer()` | 转移 Asset 所有权 |
| `burn()` | 销毁 Asset |
| `update()` | 更新 Asset 元数据 |
| `updateCollection()` | 更新 Collection 元数据 |
| `addPlugin()` | 向 Asset 添加插件 |
| `addCollectionPlugin()` | 向 Collection 添加插件 |
| `updatePlugin()` | 更新现有插件 |
| `removePlugin()` | 从 Asset 移除插件 |
| `fetchAsset()` | 按地址获取 Asset |
| `fetchCollection()` | 按地址获取 Collection |
### 程序 ID
| 网络 | 地址 |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
## FAQ
### Core JavaScript SDK 是什么？
Core JavaScript SDK（`@metaplex-foundation/mpl-core`）是用于与 Solana 上的 Metaplex Core NFT 交互的 TypeScript 库。它提供类型安全的函数用于创建、转移、销毁和管理 Asset 和 Collection。
### 使用此 SDK 需要 Umi 吗？
是的。Core SDK 构建在 Umi 框架之上，该框架处理钱包连接、RPC 通信和交易构建。请同时安装 `@metaplex-foundation/mpl-core` 和 `@metaplex-foundation/umi-bundle-defaults`。
### 如何连接浏览器钱包？
将 `@metaplex-foundation/umi-signer-wallet-adapters` 包与钱包适配器一起使用：
```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
umi.use(walletAdapterIdentity(wallet))
```
### sendAndConfirm 和 send 有什么区别？
`sendAndConfirm()` 等待交易确认后返回。`send()` 在广播后立即返回。为确保交易成功，大多数情况下使用 `sendAndConfirm()`。
### 如何批量处理多个操作？
使用 `transactionBuilder()` 组合指令，但要注意 Solana 的交易大小限制（约 1232 字节）。对于大批量操作，发送多个交易。
### 这个 SDK 可以在 React/Next.js 中使用吗？
可以。SDK 在浏览器和 Node.js 环境中都能工作。对于 React，将 `@solana/wallet-adapter-react` 的钱包适配器与 Umi 的钱包适配器身份一起使用。
### 如何处理错误？
将 SDK 调用包装在 try/catch 块中。SDK 抛出包含程序错误代码的类型化错误：
```ts
try {
  await transfer(umi, { asset, newOwner }).sendAndConfirm(umi)
} catch (error) {
  console.error('转移失败:', error.message)
}
```
### 在哪里可以找到完整的 API 文档？
完整的函数签名和类型请参阅 [TypeDoc API 参考](https://mpl-core.typedoc.metaplex.com/)。
## 术语表
| 术语 | 定义 |
|------|------------|
| **Umi** | Metaplex 用于构建具有钱包和 RPC 管理的 Solana 应用程序的框架 |
| **Asset** | 代表 NFT 的 Core 链上账户，包含所有权、元数据和插件 |
| **Collection** | 将相关 Asset 分组并可应用收藏级插件的 Core 账户 |
| **Signer** | 可以签署交易的密钥对（创建新账户时需要） |
| **Plugin** | 为 Asset 或 Collection 添加行为的模块化扩展 |
| **URI** | 指向包含名称、图像和属性的 JSON 文件的链下元数据 URL |
| **DAS** | Digital Asset Standard - 用于从 RPC 提供商查询索引 NFT 数据的 API |
| **Transaction Builder** | 在发送前构建交易的不可变对象 |
| **Identity** | 在 Umi 中配置为交易签名者的钱包/密钥对 |
| **Commitment** | Solana 确认级别（processed、confirmed、finalized） |
