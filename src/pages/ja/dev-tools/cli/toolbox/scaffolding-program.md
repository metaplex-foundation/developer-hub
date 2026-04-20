---
# Remember to also update the date in src/components/products/guides/index.js
title: プログラムのスキャフォールディング
metaTitle: プログラムのスキャフォールディング | Metaplex CLI
description: Metaplexのプログラムテンプレートをクローンして、新しいオンチェーンプログラムプロジェクトを開始します。
keywords:
  - mplx CLI
  - program template
  - scaffolding
  - Solana program
  - Shank
about:
  - Metaplex CLI
  - Program Scaffolding
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 概要

`mplx toolbox template program`コマンドは、Metaplexが管理するプログラムテンプレートを現在のディレクトリにクローンします。

- Metaplexの規約があらかじめ設定された新しいSolanaプログラムプロジェクトをブートストラップします。
- テンプレートキーが指定されない場合、インタラクティブなピッカーを起動します。
- `PATH`に`git`が存在する必要があります。
- フロントエンドテンプレートについては[`toolbox template website`](/dev-tools/cli/toolbox/scaffolding-website)を参照してください。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox template program [template]` |
| オプション引数 | `template` — 次のいずれか: `shank` |
| インタラクティブ | はい — 引数を省略するとピッカーが表示されます |
| 必要条件 | `PATH`に`git`があること |
| 副作用 | 現在の作業ディレクトリにクローンします |

## 利用可能なテンプレート

利用可能なテンプレートキーは、Metaplexが管理するリポジトリにマッピングされます。

| テンプレート | 説明 |
|----------|-------------|
| `shank` | Shankを使用してIDLを生成するSolanaプログラムテンプレート2.0。 |

## 基本的な使用法

引数なしでコマンドを実行してインタラクティブに選択するか、テンプレートキーを渡して直接クローンします。

```bash
# インタラクティブなテンプレートピッカーを起動
mplx toolbox template program

# 特定のテンプレートをクローン
mplx toolbox template program <template>
```

## 引数

唯一のオプションの位置引数は、テンプレートを選択します。

- `template` *(オプション)*: テンプレートキー。省略された場合、インタラクティブなピッカーが表示されます。

## 例

これらの例は、インタラクティブピッカーと直接クローンの両方を示しています。

```bash
mplx toolbox template program
mplx toolbox template program shank
```

## 注意事項

- テンプレートは`git clone`によって現在の作業ディレクトリにクローンされます。
- `git`がインストールされ、`PATH`上で利用可能であることを確認してください。
- ウェブサイト/フロントエンドテンプレートについては、[`toolbox template website`](/dev-tools/cli/toolbox/scaffolding-website)を使用してください。
