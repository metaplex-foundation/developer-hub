---
title: withdraw
metaTitle: withdraw | Sugar
description: withdrawコマンド。
---

Candy Machineからのミントが完了したら、オンチェーンに保存されたデータのレント料金に使用された資金を回収することができます。以下を実行して引き出しを開始できます：

```
sugar withdraw --candy-machine <CANDY MACHINE ID>
```

ここで`<CANDY MACHINE ID>`はCandy Machine ID（公開鍵） — `deploy`コマンドによって与えられるIDです。

現在のキーペアに関連付けられたすべてのCandy Machineから資金を引き出すことも可能です：

```
sugar withdraw
```

または、現在のキーペアからすべてのCandy Machineとその関連資金をリストすることもできます：

```
sugar withdraw --list
```

{% callout %}

ライブのCandy Machineのレントを引き出すべきではありません。アカウントを空にするとCandy Machineが動作しなくなります。

{% /callout %}
