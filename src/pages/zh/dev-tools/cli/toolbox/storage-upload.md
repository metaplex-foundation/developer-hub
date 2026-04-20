---
# Remember to also update the date in src/components/products/guides/index.js
title: 存储上传
metaTitle: 存储上传 | Metaplex CLI
description: 将单个文件或文件目录上传到已配置的存储提供商。
keywords:
  - mplx CLI
  - storage upload
  - Irys
  - Arweave
  - upload file
  - upload directory
about:
  - Metaplex CLI
  - Storage Providers
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 摘要

`mplx toolbox storage upload` 命令将单个文件或整个目录上传到已配置的存储提供商。

- 默认上传一个文件，或使用 `--directory` 上传某个目录下的每个文件。
- 目录上传会生成一个 `uploadCache.json`，将每个文件映射到其 URI。
- 如果余额不足，会自动为存储账户充值。
- 返回所上传内容的 URI 以及 MIME 类型。

## 快速参考

下表总结了该命令的输入、标志和副作用。

| 项目 | 值 |
|------|-------|
| 命令 | `mplx toolbox storage upload <path> [--directory]` |
| 必需参数 | `path` — 文件路径，或配合 `--directory` 使用的目录路径 |
| 可选标志 | `--directory` |
| 目录输出 | 在当前目录写入 `uploadCache.json` |
| 提供商 | 当前激活的存储提供商（例如 Irys） |

## 基本用法

传入文件路径以上传单个文件，或添加 `--directory` 上传目录中的每个文件。

```bash
# Upload a single file
mplx toolbox storage upload <path>

# Upload every file in a directory
mplx toolbox storage upload <directory> --directory
```

## 参数

唯一的位置参数是要上传的路径。

- `path` *(必需)*：文件路径，或在结合 `--directory` 使用时的目录路径。

## 标志

可选标志可切换到目录模式。

- `--directory`：上传指定目录中的每个文件。

## 示例

这些示例展示了单文件上传和目录上传。

```bash
mplx toolbox storage upload ./metadata.json
mplx toolbox storage upload ./assets --directory
```

## 输出

单文件上传会打印生成的 URI。目录上传会报告文件数量和缓存文件路径。

Single file:
```
--------------------------------
    Uploaded <path>
    URI: <uri>
---------------------------------
```

Directory:
```
--------------------------------
    Successfully uploaded <N> files

    Upload cache saved to uploadCache.json
---------------------------------
```

## 注意事项

- 存储通过当前激活的存储提供商进行充值和计费。如果您的存储余额较低，命令将在上传前自动进行充值。
- 使用 [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance) 查看存储余额。
- 使用 [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) 为存储账户充值。
