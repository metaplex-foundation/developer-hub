---
title: 使用 JavaScript 快速入门
metaTitle: JavaScript SDK | Candy Machine
description: 使用 JavaScript 开始使用 Candy Machine
---

Metaplex 提供了一个可用于与 Candy Machine 交互的 JavaScript 库。得益于 [Umi 框架](https://github.com/metaplex-foundation/umi)，它不附带许多固执己见的依赖项，因此提供了一个可在任何 JavaScript 项目中使用的轻量级库。

要开始使用，您需要[安装 Umi 框架](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md)和 Candy Machine JavaScript 库。

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-candy-machine
```

接下来，您可以创建 `Umi` 实例并安装 `mplCandyMachine` 插件，如下所示。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

// 使用您选择的 RPC 端点。
const umi = createUmi('http://127.0.0.1:8899').use(mplCandyMachine())
```

然后您需要告诉 Umi 使用哪个钱包。这可以是[密钥对](/zh/dev-tools/umi/getting-started#connecting-w-a-secret-key)或 [solana wallet adapter](/zh/dev-tools/umi/getting-started#connecting-w-wallet-adapter)。

就是这样，您现在可以通过使用[库提供的各种函数](https://mpl-candy-machine.typedoc.metaplex.com/)并将 `Umi` 实例传递给它们来与 NFT 进行交互。以下是获取 candy machine 账户及其关联的 candy guard 账户的示例。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachinePublicKey = publicKey('...')
const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
```

🔗 **有用链接：**

- [Umi 框架](https://github.com/metaplex-foundation/umi)
- [GitHub 仓库](https://github.com/metaplex-foundation/mpl-candy-machine)
- [NPM 包](https://www.npmjs.com/package/@metaplex-foundation/mpl-candy-machine)
- [API 参考](https://mpl-candy-machine.typedoc.metaplex.com/)
