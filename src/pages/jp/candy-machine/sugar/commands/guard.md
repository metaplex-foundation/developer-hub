---
title: guard
metaTitle: guard | Sugar
description: guardコマンド。
---

`guard`コマンドは、Candy Machineの[ガード](/candy-machine/guards)設定を管理するために使用されます。

Sugar設定ファイルでガード設定を完了したら、以下を使用してCandy Guardを追加できます：

```
sugar guard add
```

この時点で、`mint authority`がCandy Guardになるため、`mint`コマンドは動作しなくなります。

Candy Guardの設定を更新するには、まずSugar設定ファイルで必要な変更を行い、次のコマンドを実行します：

```
sugar guard update
```

Candy Machineガードのオンチェーン設定を印刷するには、以下のコマンドを使用します：

```
sugar guard show
```

Candy Machineからガードを削除するには、以下のコマンドを使用します：

```
sugar guard remove
```

ガードを削除した後、`mint`コマンドを使用してCandy Machineからミントできます。

`remove`コマンドはCandy Guardアカウントをクローズしません。アカウントをクローズしてレント料金を取得するには、以下のコマンドを使用します：

```
sugar guard withdraw
```