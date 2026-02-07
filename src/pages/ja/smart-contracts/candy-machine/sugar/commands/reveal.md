---
title: reveal
metaTitle: reveal | Sugar
description: revealコマンド。
---

*hiddenSettings*を使用してミントとリビールを行う場合、`reveal`コマンドを使用して、ミントされたすべてのNFTをキャッシュファイルの値で更新できます：

```
sugar reveal
```

これは、まずCandy MachineからミントされたすべてのNFTを取得し、次にNFT番号でキャッシュファイルの値と照合してNFTデータを更新することで機能します。このコマンドは、NFTのURIがキャッシュファイルのものと既に一致するかどうかをチェックし、一致する場合は更新をスキップするため、新しくミントされたNFTのみを更新したり、最初の実行で更新に失敗したものを再試行するためにコマンドを再実行できます。
