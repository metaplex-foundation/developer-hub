---
title: reveal
metaTitle: reveal | Sugar
description: reveal 命令。
---

使用 *hiddenSettings* 进行铸造和揭示时，可以使用 `reveal` 命令用缓存文件中的值更新所有已铸造的 NFT：

```
sugar reveal
```

它的工作原理是首先检索从 Candy Machine 铸造的所有 NFT，然后通过 NFT 编号将它们与缓存文件中的值匹配，然后更新 NFT 数据。该命令会检查 NFT 的 URI 是否已与缓存文件中的匹配，如果匹配则跳过更新，因此可以重新运行该命令以仅更新新铸造的 NFT 或重试第一次运行时更新失败的 NFT。
