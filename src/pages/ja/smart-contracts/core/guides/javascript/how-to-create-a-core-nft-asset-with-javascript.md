---
title: JavaScriptでCore NFTアセットを作成する方法
metaTitle: JavaScriptでCore NFTアセットを作成する方法 | Core Guides
description: Metaplex CoreのJSパッケージで、Core NFTアセットを作成します。
created: '06-16-2024'
updated: '06-18-2024'
---

このガイドでは、`@metaplex-foundation/mpl-core`のJS SDKを使って、Core NFTアセットを作成します。

{% callout title="Coreとは？" %}
Coreは単一アカウント設計とプラグインシステムを備え、コストと柔軟性に優れます。
{% /callout %}

{% callout title="Assetとは？" %}
Core NFT資産は、関連口座（ATAなど）に依存せず、ウォレットと「mint」に相当する関係をアセット自体に保持します。
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
```bash
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core @metaplex-foundation/umi-uploader-irys
```

### インポートとラッパー
```ts
// 英語版のコードと同一（Umi初期化・関数ラッパー）
```

## Umiのセットアップ
新規ウォレット/既存ウォレット/Wallet Adapterいずれでも可。IrysでArweaveにアップロードします。

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

## アセットのメタデータ作成
画像をアップロードし、そのURIでJSONメタデータを作成・アップロードします。

```ts
// 画像/メタデータのupload（英語版と同一）
```

## Core NFTアセットのミント
```ts
// createでアセット作成（英語版と同一）
```

## 追加機能
`plugins`でプラグイン/外部プラグインを同時追加可能（例: PermanentFreezeDelegate / AppData）。詳細は[プラグイン](/ja/smart-contracts/core/plugins)。

## フルコード
```ts
// 英語版のフルコードと同一（ログ/Explorerリンクは適宜調整）
```

