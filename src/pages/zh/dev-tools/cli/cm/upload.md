---
title: "上传资产"
metaTitle: "MPLX CLI - 上传资产命令"
description: "使用 MPLX CLI 将 candy machine 资产上传到去中心化存储。智能缓存、进度跟踪和全面验证。"
---

`mplx cm upload` 命令将资产上传到去中心化存储,并生成包含上传 URI 和元数据的 `asset-cache.json` 文件。此命令提供智能缓存、进度跟踪和全面验证。

## 用法

```bash
# 从当前 candy machine 目录上传资产
mplx cm upload

# 从特定 candy machine 目录上传资产
mplx cm upload <directory>
```

### 目录结构

```text
my-candy-machine/
├── assets/
│   ├── 0.png              # 图像文件 (PNG, JPG)
│   ├── 0.json             # 元数据文件
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png      # 集合图像
│   └── collection.json     # 集合元数据
└── asset-cache.json        # 上传后生成
```

## 上传过程

1. 资产发现: 命令自动扫描 `assets/` 目录并识别图像、元数据和集合文件。
2. 验证阶段: 验证文件的完整性,例如所有图像文件是否都有匹配的元数据文件以及元数据是否为有效的 json。
3. 缓存检查: 为了识别哪些文件已经上传,验证 `asset-cache.json` 文件。
4. 上传: 实际上传完成。
5. 缓存生成: 生成 `asset-cache.json` 文件

## 生成的资产缓存

`asset-cache.json` 文件包含有关上传资产的详细信息。仅建议高级用户手动检查和使用它。

示例:

```json
{
  "candyMachineId": null,
  "collection": null,
  "assetItems": {
    "0": {
      "name": "Asset #0",
      "image": "0.png",
      "imageUri": "https://gateway.irys.xyz/ABC123...",
      "imageType": "image/png",
      "json": "0.json",
      "jsonUri": "https://gateway.irys.xyz/DEF456...",
      "loaded": false
    },
    "1": {
      "name": "Asset #1",
      "image": "1.png",
      "imageUri": "https://gateway.irys.xyz/GHI789...",
      "imageType": "image/png",
      "json": "1.json",
      "jsonUri": "https://gateway.irys.xyz/JKL012...",
      "loaded": false
    }
  }
}
```

## 相关命令

- [`mplx cm create`](/zh/dev-tools/cli/cm/create) - 创建 candy machine(可以自动上传)
- [`mplx cm validate`](/zh/dev-tools/cli/cm/validate) - 验证上传的资产
- [`mplx cm insert`](/zh/dev-tools/cli/cm/insert) - 将上传的资产插入 candy machine
- [`mplx cm fetch`](/zh/dev-tools/cli/cm/fetch) - 查看 candy machine 和资产信息

## 下一步

1. **[验证您的上传](/zh/dev-tools/cli/cm/validate)** 确保一切都正确上传
2. **[创建您的 candy machine](/zh/dev-tools/cli/cm/create)** 使用上传的资产
3. **[插入项目](/zh/dev-tools/cli/cm/insert)** 将资产加载到 candy machine
4. **[监控您的设置](/zh/dev-tools/cli/cm/fetch)** 验证一切正常工作
