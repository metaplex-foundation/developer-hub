---
title: はじめに
metaTitle: はじめに | Amman
description: Metaplex Ammanローカルバリデータツールキットのインストールとセットアップ。
---

## 前提条件

Ammanを実行する前に、システムにいくつかのものをインストールする必要があります。

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solanalabs.com/cli/install)
- [NodeJs](https://nodejs.org/en/download)

## インストール

新しいプロジェクトを開始したり、既存のプロジェクトを開いたら、パッケージマネージャーを介してAmmanをインストールできます。

```js
npm i @metaplex-foundation/amman
```

## スクリプトに追加（オプション）

使いやすさのために、package.jsonスクリプトにAmmanの実行を追加することをお勧めします。

{% dialect-switcher title="package.json" %}
{% dialect title="JavaScript" id="js" %}

```js
"scripts": {
    ...
    "amman:start": "npx amman start"
  },
```

{% /dialect %}
{% /dialect-switcher %}
