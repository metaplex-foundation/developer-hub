---
title: 接口实现
metaTitle: 接口实现 | Umi
description: 公共接口实现概述
---
本页旨在列出 [Umi 定义的接口](interfaces)页面的所有可用实现。

## 捆绑包

| 描述 | 维护者 | 链接 |
| --- | --- | --- |
| Umi 的默认捆绑包 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-bundle-defaults) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-bundle-defaults) |
| Umi 的测试捆绑包 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-bundle-tests) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-bundle-tests) |

## 签名者

| 描述 | 维护者 | 链接 |
| --- | --- | --- |
| 内部签名者插件 | Metaplex | [签名者文档](/zh/dev-tools/umi/public-keys-and-signers#签名者) |
| 使用 Solana 的 Wallet Adapters | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-signer-wallet-adapters) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-signer-wallet-adapters) |
| 从消息签名派生新签名者 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-signer-derived) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-signer-derived) |

## Eddsa 接口

| 描述 | 维护者 | 链接 |
| --- | --- | --- |
| 使用 Solana 的 web3.js | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-eddsa-web3js) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-eddsa-web3js) |

## RPC 接口

| 描述 | 维护者 | 链接 |
| --- | --- | --- |
| 使用 Solana 的 web3.js | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-rpc-web3js) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-rpc-web3js) |
| 一个 RPC 装饰器，将 `getAccounts` 请求分块为给定大小的批次，并并行运行它们以向最终用户抽象 API 限制。 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-rpc-chunk-get-accounts) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-rpc-chunk-get-accounts) |

## 交易工厂接口

| 描述 | 维护者 | 链接 |
| --- | --- | --- |
| 使用 Solana 的 web3.js | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-transaction-factory-web3js) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-transaction-factory-web3js) |

## 上传器接口

| 描述 | 维护者 | 链接 |
| --- | --- | --- |
| 使用 AWS | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-aws) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-aws) |
| 使用 Irys.xyz | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-irys) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-irys) |
| 使用本地缓存模拟上传和下载 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-storage-mock) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-storage-mock) |
| 使用 4EVERLAND | 4EVERLAND | [GitHub](https://github.com/4everland/umi-uploader-4everland) / [NPM](https://www.npmjs.com/package/@4everland/umi-uploader-4everland) |
| 使用 Bundlr.network（已弃用 - 使用 `umi-uploader-irys`） | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-uploader-bundlr) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-uploader-bundlr) |

## 下载器接口

| 描述 | 维护者 | 链接 |
| --- | --- | --- |
| 使用 Http 接口 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-downloader-http) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-downloader-http) |
| 使用本地缓存模拟上传和下载 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-storage-mock) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-storage-mock) |

## Http 接口

| 描述 | 维护者 | 链接 |
| --- | --- | --- |
| 通过 `node-fetch` 库使用 fetch API | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-http-fetch) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-http-fetch) |

## 程序仓库接口

| 描述 | 维护者 | 链接 |
| --- | --- | --- |
| 无额外依赖的默认实现 | Metaplex | [GitHub](https://github.com/metaplex-foundation/umi/tree/main/packages/umi-program-repository) / [NPM](https://www.npmjs.com/package/@metaplex-foundation/umi-program-repository) |
