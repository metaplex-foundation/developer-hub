---
title: "插入项目"
metaTitle: "MPLX CLI - 插入项目命令"
description: "使用 MPLX CLI 将上传的资产插入您的 MPL Core Candy Machine。"
---

`mplx cm insert` 命令将缓存文件中的上传资产插入链上 candy machine,使其可用于铸造。它具有智能加载检测、高效的批处理和详细的交易跟踪。

## 用法

```bash
# 从当前 candy machine 目录插入项目
mplx cm insert

# 从特定 candy machine 目录插入项目
mplx cm insert <directory>
```

## 要求

在运行插入命令之前,请确保您具有:

1. **资产缓存**: 带有上传 URI 的有效 `asset-cache.json`
2. **Candy Machine**: 在缓存中创建的带有 ID 的 candy machine
3. **钱包余额**: 足够的 SOL 用于交易费用
4. **网络访问**: 稳定的 Solana 网络连接

### 前置条件

```bash
# 1. 必须创建 candy machine
mplx cm create

# 2. 上传资产
mplx cm upload

# 3. 然后插入项目
mplx cm insert
```

## 相关命令

- [`mplx cm upload`](/zh/dev-tools/cli/cm/upload) - 上传资产(插入前必需)
- [`mplx cm create`](/zh/dev-tools/cli/cm/create) - 创建 candy machine(插入前必需)
- [`mplx cm validate`](/zh/dev-tools/cli/cm/validate) - 验证缓存和上传
- [`mplx cm fetch`](/zh/dev-tools/cli/cm/fetch) - 验证插入状态

## 下一步

1. **[验证插入](/zh/dev-tools/cli/cm/fetch)** 确认所有项目都已加载
2. **[测试铸造](/zh/smart-contracts/core-candy-machine/mint)** 确保 candy machine 正常工作
3. **[监控性能](/zh/dev-tools/cli/cm/validate)** 检查问题
4. **[计划您的启动](/zh/smart-contracts/core-candy-machine/guides)** 使用适当的守卫
