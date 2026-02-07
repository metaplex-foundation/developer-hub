---
title: freeze
metaTitle: freeze | Sugar
description: freezeコマンド。
---

Candy Machineでfreeze guardが有効になっている場合、`freeze`コマンドを使用してその異なる段階を管理できます。

デフォルトガードまたは個別グループでfreeze guardを有効にした後、ミントを開始する前に初期化する必要があります。freeze guardを初期化するには、`initialize`サブコマンドを使用します：

```
sugar freeze initialize --period <SECONDS>
```

ここで`--period`はミントされたアセットがフリーズされる秒単位の間隔を決定します。この期間後、所有者はアセットを解凍できます。

freeze Guardが`default`グループにない場合は、`--label <LABEL>`も追加する必要があります。

{% callout %}

freezeの初期化は一度だけ行えます。初期化後は期間を更新することはできません。

{% /callout %}

アセットを解凍するには、`thaw`サブコマンドを使用できます：

```
sugar freeze thaw <NFT MINT>
```

`--all`オプションを使用して同じCandy MachineからのすべてのNFTを解凍することもできます：

```
sugar freeze thaw --all
```

すべてのNFTが解凍されると、資金をロック解除できます：

```
sugar freeze unlock-funds
```
