---
title: JavaScript（Web2流儀）でCoreステーキング
metaTitle: JavaScriptでCoreステーキング | Core Guides
description: FreezeDelegateとAttributeプラグインを活用し、バックエンド（TypeScript）だけでステーキング体験を構築します。
---

このガイドでは、TypeScriptのバックエンドのみで、コレクション向けのステーキングを構築する方法を示します。Attribute/FreezeDelegateプラグインを使い、ステーク時間の追跡と凍結/解凍を実装します（スマートコントラクト不要）。

## 仕組み
バックエンドに資産キーペアの権限を保持し、属性更新を署名します。必要要素:
- アセット
- （任意だが本例では利用）コレクション
- FreezeDelegateプラグイン
- Attributeプラグイン

### Freeze Delegate
オーナー管理型で、委任者が凍結/解凍できます。凍結中は取り消せません。軽量で、`frozen: bool`の切り替えのみ。詳細は[Freeze Delegate](/core/plugins/freeze-delegate)。

### Attribute
権限管理型で、オンチェーン属性（key/value）を保持します。詳細は[Attribute](/core/plugins/attribute)。

### ロジック
本例では2命令のみ:
- Stake: FreezeDelegateを付与して凍結、Attributeに`staked`（ミリ秒）・`stakedTime`（累計）を設定/更新
- Unstake: `staked`を0へ、`stakedTime`へ経過時間を加算。解凍後にFreezeDelegateを削除

## 実装

### 依存とインポート
```ts
// 英語版の依存・インポート例と同一
```

### Umi/SDKの初期化
```ts
// Devnet接続とキーペア設定（英語版と同一）
```

### アセット作成とコレクション追加
```ts
// コレクション/アセット作成（英語版の例と同一）
```

### ステーキング
`fetchAsset`で属性を取得し、なければAttributesプラグインを追加。`staked`/`stakedTime`を初期化または更新し、最後にFreezeDelegateを付与して凍結します。

```ts
// 英語版のステーキング関数の完全例を踏襲
```

### アンステーキング
属性の`staked`が0でないことを確認し、経過時間を加算して`staked`を0へ。`frozen: false`に更新後、FreezeDelegateを削除します。

```ts
// 英語版のアンステーキング関数の完全例を踏襲
```

