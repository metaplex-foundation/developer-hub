---
title: airdrop
metaTitle: airdrop | Sugar
description: Sugarで(p)NFTをエアドロップするコマンド。
---

## 使用方法

`airdrop`コマンドは、コマンドラインからCandy MachineからNFTをウォレットのリストにミントします。

デフォルトでは`airdrop_list.json`と呼ばれるファイルが必要で、これにはウォレットの公開鍵と各ウォレットが受け取るNFTの数が含まれます。以下の例では`address1`は2つのNFTを受け取り、`address2`は7つを受け取ります。ファイルは以下の形式である必要があります：

```json
{
"address1": 2,
"address2": 7
}
```

完了後、エアドロップの結果と可能な問題を含む`airdrop_results.json`ファイルが作成されます。

{% callout %}

ガードが有効になっている場合、airdropコマンドを使用することはできません。

{% /callout %}

デフォルトの`cache.json`と`airdrop_list.json`を使用する場合、以下のコマンドでエアドロップを開始できます：

```
sugar airdrop
```

それ以外の場合は、`--airdrop-list`でairdrop_listファイルを指定してください：

```
sugar airdrop --airdrop-list <AIRDROP_LIST>
```

デフォルトでは、sugarはデフォルトのキャッシュファイル`cache.json`を使用します。`--cache`でキャッシュファイル名をオーバーライドすることもできます：

```
sugar mint --cache <CACHE>
```

`--candy-machine`で特定のCandy Machineを使用するようsugarに指示することもできます：

```
sugar mint --candy-machine <CANDY_MACHINE>
```

## コマンドの再実行

一部の場合、ブロックハッシュが見つからないなどのRPC/ネットワーク関連の理由でミントが失敗することがあります。エアドロップの結果は`airdrop_results.json`に保存されます。コマンドを再実行すると、エアドロップリストとエアドロップ結果が比較されます。

注意：タイムアウトが発生する前にトランザクションが確認できなかった場合があることがあります。そのような場合は、エクスプローラーなどでNFTがミントされたかどうかを確認する必要があります。
