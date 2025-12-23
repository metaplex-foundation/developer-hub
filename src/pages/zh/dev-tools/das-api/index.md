---
title: DAS API
metaTitle: 概述 | DAS API
description: 用于访问 Metaplex 数字资产标准的 DAS API 客户端。
---

Metaplex 数字资产标准（DAS）API 代表了一个用于与 Solana 上数字资产交互的统一接口，支持所有三种 Metaplex 标准：Core、Token Metadata 和压缩（Bubblegum）资产。这允许轻松访问和过滤资产数据。这对以下情况特别有用：
- Core 资产，其中插件可以自动派生并包含集合的插件数据。
- 压缩 NFT，其中详细的账户数据不存储在链上，而是存储在由 RPC 提供商管理的数据存储中。
- 使用更少的调用获取数据，因为链下元数据也通过该标准进行索引。

API 定义了一组 RPC 实现的方法，以提供资产数据。在大多数情况下，数据使用 Metaplex 数字资产 RPC 基础设施进行索引。

## Core 扩展
除了通用 DAS SDK 之外，还为 [MPL Core](/zh/smart-contracts/core) 创建了一个扩展，可以直接返回正确的类型以便进一步与 MPL Core SDK 一起使用。它还自动派生资产中从集合继承的插件，并提供 [DAS 到 Core 类型转换](/zh/dev-tools/das-api/core-extension/convert-das-asset-to-core)的功能。

{% quick-links %}

{% quick-link title="快速入门" icon="InboxArrowDown" href="/zh/dev-tools/das-api/getting-started" description="选择您喜欢的语言或库，开始使用基础程序。" /%}

{% quick-link title="方法" icon="CodeBracketSquare" href="/zh/dev-tools/das-api/methods" description="用于获取数据的 DAS API 方法。" /%}

{% quick-link title="MPL Core 扩展" icon="CodeBracketSquare" href="/zh/dev-tools/das-api/core-extension" description="轻松获取和解析 MPL Core 资产" /%}

{% /quick-links %}
