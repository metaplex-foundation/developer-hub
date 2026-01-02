---
title: JavaScriptでCoreコレクションを作成する方法
metaTitle: JavaScriptでCoreコレクションを作成する方法 | Core Guides
description: Metaplex CoreのJSパッケージで、Coreコレクションを作成します。
created: '08-21-2024'
updated: '08-21-2024'
---

このガイドでは、`@metaplex-foundation/mpl-core`のJS SDKを使って、Coreコレクションを作成します。

{% callout title="Coreとは？" %}
Coreは単一アカウント設計とプラグインシステムを備え、コストと柔軟性に優れます。
{% /callout %}

{% callout title="コレクションとは？" %}
シリーズ等で資産をまとめる仕組みです。コレクション資産にメタデータとコレクション全体のプラグインを保持します。
{% /callout %}

## 前提
- VS Code等のエディタ
- Node 18+

## 初期設定
単一スクリプトで実装します。

### 初期化
```bash
npm init
```

### 必要パッケージ
Umi/umi-defaults/Core/アップローダ（Irys）を利用します。

```bash
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core @metaplex-foundation/umi-uploader-irys
```

### インポートとラッパー
```ts
// 英語版のコードと同一（Umi初期化・関数ラッパー）
```

## Umiのセットアップ
新規ウォレット/既存ウォレット/Wallet Adapterのいずれでも可。Irysを使ってArweaveへアップロードします。

{% totem %}
{% totem-accordion title="新規ウォレット" %}
```ts
// 英語版のコードと同一
```
{% /totem-accordion %}
{% totem-accordion title="既存ウォレット" %}
```ts
// 英語版のコードと同一
```
{% /totem-accordion %}
{% totem-accordion title="Wallet Adapter" %}
```ts
// 英語版のコードと同一
```
{% /totem-accordion %}
{% /totem %}

## メタデータの作成
画像をArweaveへアップロードし、そのURIを使ってJSONメタデータを作成・アップロードします。

```ts
// 画像の読み込みとupload、metadataのupload（英語版と同一）
```

## コレクションのミント
```ts
// createCollectionでコレクション作成（英語版と同一）
```

## 追加機能
`plugins`にプラグインや外部プラグインを同時追加できます（例: PermanentFreezeDelegate / AppData）。詳細は[プラグイン](/ja/smart-contracts/core/plugins)。

## フルコード
```ts
// 英語版のフルコードと同一（ログ/Explorerリンクは適宜調整）
```

