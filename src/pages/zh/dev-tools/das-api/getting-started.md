---
title: 快速入门
metaTitle: 快速入门 | DAS API
description: Metaplex DAS API 客户端的安装和设置。
---

`@metaplex-foundation/digital-asset-standard-api` 包可用于与 Metaplex DAS API 交互：

DAS API 客户端是一个 Umi 插件，因此您需要将 Umi 与 DAS API 客户端一起安装。

您可以从以下位置安装 umi 和插件。

```js
npm install @metaplex-foundation/umi
npm install @metaplex-foundation/umi-bundle-defaults
npm install @metaplex-foundation/digital-asset-standard-api
```

安装后，您可以将库注册到您的 Umi 实例。

```js
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

const umi = createUmi("exampleDasProvider.com").use(dasApi());
```

该插件可与任何支持 Metaplex DAS API 规范的 RPC 一起使用 – 支持该规范的 RPC 可以在 [RPC 提供商页面](/zh/rpc-providers)找到。

注意：您可能需要联系您的 RPC 提供商在您的端点上"启用"DAS API。

{% callout title="Metaplex Core DAS API" type="note" %}
如果您打算在 [Metaplex Core](/zh/smart-contracts/core) 资产上使用 DAS，您需要安装额外的 `@metaplex-foundation/mpl-core-das` 包：
{% /callout %}

## MPL Core 的 DAS

[MPL Core](/zh/smart-contracts/core) 的 [DAS 扩展](/zh/dev-tools/das-api/core-extension)可以直接返回正确的类型，以便进一步与 MPL SDK 一起使用。它还自动派生资产中从集合继承的插件，并提供 [DAS 到 Core 类型转换的功能](/zh/dev-tools/das-api/core-extension/convert-das-asset-to-core)。

要使用它，首先安装额外的包：

```js
npm install @metaplex-foundation/mpl-core-das
```

然后导入该包

```js
import { das } from '@metaplex-foundation/mpl-core-das';
```

之后，您可以使用如上所述的 Core 特定功能。
