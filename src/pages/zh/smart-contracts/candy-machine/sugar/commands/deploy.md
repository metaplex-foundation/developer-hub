---
title: deploy
metaTitle: deploy | Sugar
description: deploy 命令。
---

一旦所有资产上传完成并成功创建缓存文件，您就可以将项目部署到 Solana：

```
sugar deploy
```

deploy 命令将把缓存文件的信息写入链上的 Candy Machine 账户。这将有效地创建 Candy Machine 并显示其链上 ID（公钥）——使用此 ID 可以通过[浏览器](https://explorer.solana.com)查询其链上信息。如果您没有使用默认名称，可以使用 `-c` 选项指定配置文件路径（默认 `config.json`），使用 `--cache` 选项指定缓存文件名（默认 `cache.json`）。
