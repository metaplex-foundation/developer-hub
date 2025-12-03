---
title: update
metaTitle: update | Sugar
description: updateコマンド。
---

`update`コマンドは、Candy Machineの現在の設定を変更するために使用されます。ほとんどの設定は、このコマンドで更新できますが、以下は例外です：

- Candy Machine内のアイテム数は、`hiddenSettings`が使用されている場合にのみ更新できます；
- `hiddenSettings`の使用への切り替えは、アイテム数が0の場合にのみ可能です。切り替え後、アイテム数を更新できるようになります。


設定を更新するには、config.json（または同等）ファイルを変更して実行します：

```
sugar update
```

`--config`と`--cache`オプションでカスタム設定とキャッシュファイルを指定することもできます：

```
sugar update -c <CONFIG> --cache <CACHE>
```

{% callout %}

間違った値を設定すると即座にその機能に影響するため、ライブのCandy Machineを更新する際は注意が必要です。

{% /callout %}