---
title: 使用JavaScript开始
metaTitle: JavaScript SDK | Inscription
description: 使用JavaScript开始使用Inscription
---

Metaplex提供了一个可用于与Metaplex Inscriptions交互的JavaScript库。得益于[Umi框架](https://github.com/metaplex-foundation/umi)，它不包含许多固执己见的依赖项，因此提供了一个可在任何JavaScript项目中使用的轻量级库。

要开始，您需要[安装Umi框架](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md)和Inscriptions JavaScript库。

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-inscription
```

接下来，您可以像这样创建`Umi`实例并安装`mplInscription`插件。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplInscription } from '@metaplex-foundation/mpl-inscription'

// 使用您选择的RPC端点。
const umi = createUmi('http://127.0.0.1:8899').use(mplInscription())
```

然后您需要告诉Umi使用哪个钱包。这可以是[密钥对](/zh/dev-tools/umi/getting-started#使用密钥连接)或[solana钱包适配器](/zh/dev-tools/umi/getting-started#使用钱包适配器连接)。

就是这样，您现在可以通过使用[库提供的各种函数](https://mpl-inscription.typedoc.metaplex.com/)并将您的`Umi`实例传递给它们来与Inscriptions交互。以下是如何铸造一个带有小JSON文件附加的简单inscription，获取inscription的数据并打印inscription排名的示例。

```ts
// 步骤1：铸造NFT或pNFT
// 参见 https://metaplex.com/docs/zh/smart-contracts/token-metadata/mint

// 步骤2：铭刻JSON

const inscriptionAccount = await findMintInscriptionPda(umi, {
  mint: mint.publicKey,
})
const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount[0],
})

await initializeFromMint(umi, {
  mintAccount: mint.publicKey,
})
  .add(
    writeData(umi, {
      inscriptionAccount,
      inscriptionMetadataAccount,
      value: Buffer.from(
        JSON.stringify(metadata) // 要铭刻的NFT的JSON
      ),
      associatedTag: null,
      offset: 0,
    })
  )
  .sendAndConfirm(umi, {confirm: {commitment: 'finalized'}})

const inscriptionMetadata = await fetchInscriptionMetadata(
  umi,
  inscriptionMetadataAccount
)
console.log(
  'Inscription编号: ',
  inscriptionMetadata.inscriptionRank.toString()
)
```

🔗 **有用链接：**

- [Umi框架](https://github.com/metaplex-foundation/umi)
- [GitHub仓库](https://github.com/metaplex-foundation/mpl-inscription)
- [NPM包](https://www.npmjs.com/package/@metaplex-foundation/mpl-inscription)
- [API参考](https://mpl-inscription.typedoc.metaplex.com/)
