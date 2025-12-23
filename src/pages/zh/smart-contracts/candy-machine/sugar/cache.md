---
title: 缓存文件
metaTitle: 缓存文件 | Sugar
description: Sugar 缓存文件。
---

Sugar 使用缓存文件来跟踪创建的 Candy Machine 和资产。这允许 Sugar 恢复资产上传而无需重新上传所有资产。它还提供有关 Candy Machine 账户的信息，如 collection 和 Candy Machine 创建者。

您通常不需要手动修改缓存文件——这个文件由 Sugar 命令操作。但在某些特定情况下，您可能需要这样做，如上文所述。

{% callout %}

保留您的缓存文件副本，因为它包含所有资产信息和创建的账户地址。

{% /callout %}

## 结构

缓存文件是具有以下结构的 JSON 文档：

```json
{
  "program": {
    "candyMachine": "<PUBLIC KEY>",
    "candyGuard": "<PUBLIC KEY>",
    "candyMachineCreator": "<PUBLIC KEY>",
    "collectionMint": "<PUBLIC KEY>"
  },
  "items": {
    "-1": {
      "name": "My Collection",
      "image_hash": "6500707cb13044b7d133abb5ad68e0af660b154499229af49419c86a251a2b4d",
      "image_link": "https://arweave.net/KplI7R59EE24-mavSgai7WVJmkfvYQKhtTnqxXPlPdE?ext=png",
      "metadata_hash": "2009eda578d1196356abcfdfbba252ec3318fc6ffe42cc764a624b0c791d8471",
      "metadata_link": "https://arweave.net/K75J8IG1HcTYJyr1eC0KksYfpxuFMkPONJMpUNDmCuA",
      "onChain": true
    },
    "0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "https://arweave.net/6DRibEPNjLQKA90v3qa-JsYPPT5a6--VsgKumUnX3_0",
      "onChain": true
    },
    ...
  }
}
```

### `program`

`"program"` 部分包含有关 Candy Machine、Candy Guard 账户以及 Candy Machine 创建者和 collection mint 地址的信息。这些详细信息在 Candy Machine 部署后填充。只有当您在 candy machine 上启用了守卫时，才会出现 Candy Guard 地址。

### `items`

`"items"` 部分包含有关 Candy Machine 资产的信息。此列表在 Sugar 验证您的资产文件夹后创建。此时，所有 `"name"`、`"image_hash"` 和 `"metadata_hash"` 都会添加到缓存文件中。一旦资产上传完成，`"image_link"` 和 `"metadata_link"` 的信息将更新为最终值。最后，一旦 Candy Machine 部署完成，`"onChain"` 值将设置为 `true`。

Sugar `upload` 只会上传没有填充相应 "link" 值的资产——例如，使用包含以下项目的缓存文件运行 `sugar upload`：

```json
"0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "",
      "onChain": false
},
```

只会上传元数据文件，因为图像链接已经存在。

Sugar 存储图像和元数据文件的 "hash"，因此当由于更改相应文件而导致哈希值更改时，运行 `sugar upload` 将上传新文件。此时，`"onChain"` 值将设置为 `false`，更改只有在运行 `sugar deploy` 后才会生效（在链上）。

## "高级" 缓存管理

在大多数情况下，您不需要手动修改缓存文件。但在某些情况下您可能需要这样做。

### 使用相同项目部署新的 Candy Machine

如果您想将 Candy Machine 部署到新地址，重用缓存文件中的相同项目，您只需从缓存文件中删除 `"candyMachine"` 公钥值：

{% totem %}
{% totem-accordion title="示例" %}

```json
{
  "program": {
    "candyMachine": "",
    "candyGuard": "",
    "candyMachineCreator": "6DwuXCUnGEE2NktwQub22Ejt2EQUexGmGADZURN1RF6J",
    "collectionMint": "5TM8a74oX6HgyAtVnKaUaGuwu44hxMhWF5QT5i7PkuZY"
  },
  "items": {
    "-1": {
      "name": "My Collection",
      "image_hash": "6500707cb13044b7d133abb5ad68e0af660b154499229af49419c86a251a2b4d",
      "image_link": "https://arweave.net/KplI7R59EE24-mavSgai7WVJmkfvYQKhtTnqxXPlPdE?ext=png",
      "metadata_hash": "2009eda578d1196356abcfdfbba252ec3318fc6ffe42cc764a624b0c791d8471",
      "metadata_link": "https://arweave.net/K75J8IG1HcTYJyr1eC0KksYfpxuFMkPONJMpUNDmCuA",
      "onChain": true
    },
    "0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "https://arweave.net/6DRibEPNjLQKA90v3qa-JsYPPT5a6--VsgKumUnX3_0",
      "onChain": true
    },
    ...
  }
}
```

{% /totem-accordion %}
{% /totem %}

### 使用预先存在的链接

当您已经有资产链接时，可以手动将信息添加到缓存文件中，以避免 Sugar 再次上传它们。在这种情况下，您应该使用相应的链接完成 `"image_link"` 和 `"metadata_link"`。
