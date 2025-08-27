---
title: hash
metaTitle: hash | Sugar
description: hashコマンド。
---

*hiddenSettings*を使用する場合、ミントが完了してリビールが実行されるときにアセットを検証できるように、設定ファイルでハッシュ値を指定する必要があります。ハッシュ値は、*hiddenSettings*が有効になっているときにdeployコマンドによって自動的に更新されますが、キャッシュファイルを手動で変更するシナリオもあります。

`hash`コマンドは、キャッシュファイルのハッシュを計算し、設定ファイルのハッシュ値を更新します。

```
sugar hash
```

また、`--compare`オプションを使用して、公開されたハッシュ値とキャッシュファイルの値を比較することもできます。キャッシュファイルは`--cache`で手動で指定するか、現在のディレクトリの`cache.json`ファイルがデフォルトになります。

デフォルトの`cache.json`に対して`--compare`を実行：

```
sugar hash --compare 44oZ3goi9ivakeUnbjWbWJpvdgcWCrsi
```

特定のキャッシュファイルに対して`--compare`を実行：

```
sugar hash --compare 44oZ3goi9ivakeUnbjWbWJpvdgcWCrsi --cache my_custom_cache.json
```

{% callout %}

ハッシュ値を更新した後、`update`コマンドを使用して新しい値がオンチェーンになるようにCandy Machineの設定を更新する必要があります。

{% /callout %}