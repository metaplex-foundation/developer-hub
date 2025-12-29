---
title: Priced Sale
metaTitle: Genesis - Priced Sale
description: 固定価格でユーザーがSOLを預け入れ、事前に決められたレートでトークンを受け取るトークンセール。
---

Priced Saleは、トークンが固定の事前決定価格で販売されるトークンローンチメカニズムです。最終価格が総預金額に依存するLaunch Poolとは異なり、Priced Saleではトークンあたりの正確な価格を事前に設定できます。

仕組み：

1. 特定量のトークンがPriced Saleに割り当てられ、SOLキャップが固定価格を決定します。
2. Priced Saleがオープンしている間、ユーザーは固定レートでトークンを購入するためにSOLを預け入れます。
3. Priced Saleが終了すると、ユーザーは事前に決められた価格で預金額に基づいてトークンを請求します。

## 概要

Priced Saleのライフサイクル：

1. **預金期間** - ユーザーが固定価格で定義されたウィンドウ内にSOLを預け入れ
2. **移行** - 終了ビヘイビアが実行（例：収集したSOLを別のバケットに送信）
3. **請求期間** - ユーザーが預金に基づいてトークンを請求

### 価格計算

トークン価格は、割り当てられたトークンとSOLキャップの比率によって決定されます：

```
price = allocationQuoteTokenCap / baseTokenAllocation
tokens = deposit / price
```

例えば、100 SOLキャップで1,000,000トークンを割り当てる場合：
- 価格 = 100 SOL / 1,000,000トークン = トークンあたり0.0001 SOL
- 10 SOLの預金で100,000トークンを受け取る

{% callout type="note" %}
完全なドキュメント（コード例とすべての設定オプションを含む）については、[English version](/smart-contracts/genesis/priced-sale)を参照してください。
{% /callout %}

## ユースケース

- **アーリーサポーターアクセス**：献身的なコミュニティメンバーがパブリックローンチ前に参加できるようにする
- **ファンディングラウンド**：制御された配布で資金を収集
- **フェアローンチ**：まずすべての預金を集めてから、カスタム基準に基づいてトークンを配布

## Priced Sale vs Launch Pool

| 機能 | Priced Sale | Launch Pool |
|------|-------------|-------------|
| 価格 | 事前に固定 | 総預金額で決定 |
| 預金キャップ | SOLキャップあり | キャップなし |
| 過剰申込 | 不可 | すべての預金を受付 |
| 価格発見 | なし（プリセット） | オーガニック |

一般的なGenesisの概念は[概要](/smart-contracts/genesis)を参照するか、代替のローンチメカニズムである[Launch Pool](/smart-contracts/genesis/launch-pool)をご覧ください。
