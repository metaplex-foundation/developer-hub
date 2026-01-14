---
title: Metaplex MPL-404混合Solana NextJs Tailwind模板
metaTitle: Metaplex MPL-404混合NextJs Tailwind模板 | Web UI模板
description: 使用Nextjs、Tailwind、Metaplex Umi、Solana WalletAdapter和Zustand的Metaplex MPL-404混合Web UI模板。
created: 2024-12-16
---

Metaplex MPL-404混合UI模板旨在为开发者和用户提供开发起点。该模板预设了`.env`示例文件、功能性UI组件和交易调用，为您在创建混合集合前端UI时提供开发跳板。

{% image src="/images/hybrid-ui-template-image.jpg" alt="MPL-404 Hybrid UI Template Screenshot" classes="m-auto" /%}

## 功能

- Nextjs React框架
- Tailwind
- Shadcn
- Solana WalletAdapter
- Metaplex Umi
- Zustand
- 深色/浅色模式
- Umi辅助函数

此UI模板使用基础Metaplex UI模板创建。更多文档可在以下位置找到

基础模板Github仓库 - [https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template)

## 安装

```shell
git clone https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn.git
```

Github仓库 - [https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn](https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn)


## 设置

### .env文件

将`.env.example`重命名为`.env`

填写以下正确的详细信息。

```
// 托管账户
NEXT_PUBLIC_ESCROW="11111111111111111111111111111111"
NEXT_PUBLIC_COLLECTION="11111111111111111111111111111111"
NEXT_PUBLIC_TOKEN="11111111111111111111111111111111"

// RPC URL
NEXT_PUBLIC_RPC="https://myrpc.com/?api-key="
```


### 图像替换
在src/assets/images/中有两个需要替换的图像：

- collectionImage.jpg
- token.jpg

这两个图像用于节省仅为访问图像uri而获取集合和代币元数据。

### 更改RPC

您可以使用以下任一方法以您喜欢的任何方式为项目配置RPC URL：

- .env
- constants.ts文件
- 直接硬编码到umi中

在此示例中，RPC url硬编码在`src/store/useUmiStore.ts`第`21`行的`umiStore` umi状态中。

```ts
const useUmiStore = create<UmiState>()((set) => ({
  // 在此处添加您自己的RPC
  umi: createUmi('http://api.devnet.solana.com').use(
    signerIdentity(
      createNoopSigner(publicKey('11111111111111111111111111111111'))
    )
  ),
  ...
}))
```
## 其他文档

建议进一步阅读基础模板的文档，以了解此模板构建所使用的辅助函数和功能

Github仓库 - [https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn](https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn)
