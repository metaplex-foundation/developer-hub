---
title: 快速开始
metaTitle: 快速开始 | Fusion
description: 如何使用Metaplex Fusion。
---

## 什么是Fusion？

Fusion是Metaplex对可组合NFT的解决方案。Fusion本身是多个Metaplex程序的组合，使项目方、艺术家或收藏家能够创建完全动态的NFT。在合约层面，Fusion由Trifle驱动，管理NFT的链上跟踪和基于规则的融合/拆解操作。

## 设置步骤

### 创建父NFT

Fusion的结构是单个NFT（Fusion父级）拥有其所组合的所有属性。Fusion父级将动态重新渲染其元数据和图像，以反映其链上Trifle账户中跟踪的所有属性代币的分层。为了实现元数据的无缝重组，使用确定性格式创建静态URI。

`https://shdw-drive.genesysgo.net/<METAPLEX_BUCKET>/<TRIFLE_ADDRESS>`

动态元数据和图像托管在GenesysGo的Shadow Drive技术上，以利用其去中心化数据托管和可更新存储格式。此静态URI允许后端更新所有数据，而无需实际更新NFT的元数据账户，该账户只允许更新权限持有者进行更新。这使Fusion用户无需共享任何私钥即可拥有动态元数据。下面概述了Fusion父级创建的示例：

```tsx
const findTriflePda = async (mint: PublicKey, authority: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('trifle'), mint.toBuffer(), authority.toBuffer()],
    new PublicKey(PROGRAM_ADDRESS)
  )
}

const METAPLEX_BUCKET = 'Jf27xwhv6bH1aaPYtvJxvHvKRHoDe3DyQVqe4CJyxsP'
let nftMint = Keypair.generate()
let trifleAddress = await findTriflePda(nftMint.publicKey, updateAuthority)
let result
result = await metaplex!.nfts().create({
  uri:
    'https://shdw-drive.genesysgo.net/' +
    METAPLEX_BUCKET +
    '/' +
    trifleAddress[0].toString() +
    '.json',
  name: 'Fusion NFT',
  sellerFeeBasisPoints: 0,
  useNewMint: nftMint,
})
```

### 编写渲染模式

Fusion利用约束模型账户的`schema`字段来确定渲染属性的层级顺序。

```json
{
  "type": "layering",
  "layers": ["base", "neck", "mouth", "nose"],
  "defaults": {
    "metadata": "https://shdw-drive.genesysgo.net/G6yhKwkApJr1YCCmrusFibbsvrXZa4Q3GRThSHFiRJQW/default.json"
  }
}
```

`type`：定义此模式表示的类型，从而决定后端服务器应如何渲染Fusion父级的图像。
`layers`：Trifle账户上的槽位名称数组。数组的顺序定义了层级应该以什么顺序渲染。不要求使用所有层级，允许存在不可见属性。
`defaults`：组合Fusion父级元数据时用作基准的默认元数据。通过这种方式可以在元数据中包含`external_url`等元数据字段。

### 设置Trifle

最后，应根据[这些指令](/zh/smart-contracts/fusion/getting-started)设置约束模型和Trifle账户。

完成上述步骤后，Fusion父级应在每次`transfer_in`或`transfer_out`操作后重新渲染。
