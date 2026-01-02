---
title: config
metaTitle: config | Sugar
description: configコマンド。
---

`config`コマンドを使用してCandy Machineの設定を管理できます。デフォルトでは、SugarはCandy Machine設定を読み込むために現在のディレクトリの`config.json`ファイルを探します – 設定ファイル名は、それを必要とするすべてのコマンドで`-c`または`--config`オプションで指定できます。

これらの[指示](/ja/smart-contracts/candy-machine/sugar/configuration)に従って手動でこのファイルを作成するか、config createコマンドを使用できます：

```
sugar config create
```

このコマンドを実行すると、すべての設定オプションに関する情報を収集するための一連のプロンプトで構成されるインタラクティブなプロセスが開始されます。その終了時に、設定ファイルが保存されるか（デフォルトはconfig.json）、その内容が画面に表示されます。カスタムファイル名を指定するには、`-c`オプションを使用します：

```
sugar config create -c my-config.json
```

Candy Machineがデプロイされた後、設定ファイルへの変更は`update`サブコマンドを使用してCandy Machineアカウントに設定する必要があります：

```
sugar config update
```

`-n`オプションを使用してCandy Machine権限（Candy Machineを制御する公開鍵）を更新できます：

```
sugar config update -n <NEW PUBLIC KEY>
```

`set`サブコマンドを使用して、Candy Machineを通じてミントされるアセットのトークン標準を変更することもできます。このコマンドは、`-t`オプションを使用してアセットのタイプを`NFT`または`pNFT`のいずれかに変更することをサポートします。また、ミントされたpNFTのルールセットを指定することもできます。

```
sugar config set -t "pnft" --rule-set <PUBLIC KEY>
```