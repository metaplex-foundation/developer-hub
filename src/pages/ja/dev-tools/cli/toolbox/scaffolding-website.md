---
# Remember to also update the date in src/components/products/guides/index.js
title: ウェブサイトのスキャフォールディング
metaTitle: ウェブサイトのスキャフォールディング | Metaplex CLI
description: Metaplexのウェブサイトテンプレートをクローンして、新しいフロントエンドプロジェクトを開始します。
keywords:
  - mplx CLI
  - website template
  - scaffolding
  - Next.js
  - Tailwind
  - shadcn
about:
  - Metaplex CLI
  - Website Scaffolding
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 概要

`mplx toolbox template website`コマンドは、Metaplexが管理するウェブサイトテンプレートを現在のディレクトリにクローンします。

- Metaplexフロー向けに配線されたNext.js + Tailwindのフロントエンドをブートストラップします。
- テンプレートが指定されない場合、インタラクティブなピッカーを起動します。
- 位置引数ではなく`--template`フラグでテンプレートを選択します。
- `PATH`に`git`が存在する必要があります。

## クイックリファレンス

以下の表は、コマンドのフラグ、前提条件、および副作用をまとめたものです。

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox template website [--template <key>]` |
| オプションフラグ | `--template <key>` |
| インタラクティブ | はい — `--template`を省略するとピッカーが表示されます |
| 必要条件 | `PATH`に`git`があること |
| 副作用 | 現在の作業ディレクトリにクローンします |

## 利用可能なテンプレート

利用可能なテンプレートキーは、Metaplexが管理するリポジトリにマッピングされます。

| テンプレート | 説明 |
|----------|-------------|
| `standard - nextjs-tailwind` | Next.js + Tailwindスターター。 |
| `standard - nextjs-tailwind-shadcn` | Next.js + Tailwind + shadcn/uiスターター。 |
| `404 - nextjs-tailwind-shadcn` | MPL Hybrid 404 UIスターター（Next.js + Tailwind + shadcn/ui）。 |

## 基本的な使用法

フラグなしでコマンドを実行してインタラクティブに選択するか、`--template`を渡して直接クローンします。

```bash
# インタラクティブなテンプレートピッカーを起動
mplx toolbox template website

# 特定のテンプレートをクローン
mplx toolbox template website --template "<template-key>"
```

## フラグ

唯一のオプションフラグは、テンプレートを選択します。

- `--template <key>` *(オプション)*: テンプレートキー。省略された場合、インタラクティブなピッカーが表示されます。

## 例

これらの例は、インタラクティブピッカーと直接クローンの両方を示しています。

```bash
mplx toolbox template website
mplx toolbox template website --template "standard - nextjs-tailwind"
```

## 注意事項

- テンプレートは`git clone`によって現在の作業ディレクトリにクローンされます。
- `git`がインストールされ、`PATH`上で利用可能であることを確認してください。
- オンチェーンプログラムテンプレートについては、[`toolbox template program`](/dev-tools/cli/toolbox/scaffolding-program)を使用してください。
