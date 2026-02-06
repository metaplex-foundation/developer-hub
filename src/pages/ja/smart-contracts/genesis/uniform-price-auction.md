---
title: Uniform Price Auction
metaTitle: Genesis - Uniform Price Auction | トークンオークション | Metaplex
description: 均一な clearing price によるトークンローンチのための時間ベースのオークションメカニズム。大口参加者向けの競争入札。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - uniform price auction
  - token auction
  - clearing price
  - price discovery
  - sealed bid
  - competitive bidding
about:
  - Auction mechanics
  - Price discovery
  - Competitive bidding
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Uniform Price Auction とは何ですか？
    a: すべての落札者が個々の入札額に関係なく同じ clearing price を支払うオークションです。clearing price は最低落札価格となります。
  - q: clearing price はどのように決定されますか？
    a: 入札は価格順にランク付けされます。clearing price は、入札総数量が利用可能なトークン数に等しくなるポイントで設定され、すべての落札者がこの均一価格を支払います。
  - q: 入札を非公開にできますか？
    a: はい。Uniform Price Auction は設定に応じて公開入札と非公開（sealed）入札の両方をサポートしています。
  - q: Uniform Price Auction はいつ使うべきですか？
    a: 入金ベースのローンチよりも構造化されたオークション形式を好む大口参加者（ホエール、ファンド）との価格発見に使用してください。
---

**Uniform Price Auction** はトークンローンチのための競争入札を可能にします。すべての落札者は同じ clearing price（最低落札価格）を支払い、構造化されたトークン配布における公正な価格発見を実現します。 {% .lead %}

{% callout title="学べること" %}
この概要では以下を説明します：

- Uniform Price Auction の仕組み
- オークションと他のローンチメカニズムの使い分け
- 主要概念：入札、clearing price、割り当て
{% /callout %}

## 概要

Uniform Price Auction はオークションウィンドウ中に入札を収集し、単一の clearing price でトークンを割り当てます。

- ユーザーは希望する価格でトークン数量を入札します
- 入札は価格順にランク付けされ、最高入札者にトークンが割り当てられます
- すべての落札者が同じ clearing price（最低落札価格）を支払います
- 公開入札または sealed（非公開）入札をサポート

## 対象外

固定価格販売（[Presale](/smart-contracts/genesis/presale) を参照）、比例配分（[Launch Pool](/smart-contracts/genesis/launch-pool) を参照）、およびオークション後の流動性セットアップは本ガイドの対象外です。

## ユースケース

| ユースケース | 説明 |
|----------|-------------|
| **価格発見** | 競争入札を通じて市場にトークンの公正価格を決定させる |
| **ホエール/ファンドの参加** | 構造化されたオークション形式は大口の機関投資家に適している |
| **アクセス制御** | 要件に応じてゲート付きまたはゲートなしに設定可能 |

## 仕組み

1. **オークション開始** - ユーザーが数量と価格を指定して入札を提出する
2. **入札期間** - 入札が蓄積される（公開または sealed）
3. **オークション終了** - 入札が価格の高い順にランク付けされる
4. **Clearing Price の決定** - 入札総数量が利用可能なトークン数に等しくなる価格
5. **割り当て** - 落札者がトークンを受け取り、全員が clearing price を支払う

### Clearing Price の例

```
Available tokens: 1,000,000
Bids received:
  - Bidder A: 500,000 tokens @ 0.001 SOL
  - Bidder B: 300,000 tokens @ 0.0008 SOL
  - Bidder C: 400,000 tokens @ 0.0006 SOL

Ranking (highest price first):
  1. Bidder A: 500,000 @ 0.001 SOL    (running total: 500,000)
  2. Bidder B: 300,000 @ 0.0008 SOL   (running total: 800,000)
  3. Bidder C: 400,000 @ 0.0006 SOL   (running total: 1,200,000)

Clearing price: 0.0006 SOL (Bidder C's price fills the auction)
Bidder C receives partial fill: 200,000 tokens
All winners pay 0.0006 SOL per token
```

## 比較

| 機能 | Launch Pool | Presale | Uniform Price Auction |
|---------|-------------|---------|----------------------|
| 価格 | 終了時に発見 | 事前に固定 | Clearing price |
| 配布方式 | 比例配分 | 先着順 | 最高入札者 |
| ユーザーのアクション | 入金 | 入金 | 入札（価格 + 数量） |
| 最適な用途 | 公平な配布 | 予測可能な結果 | 大口参加者 |

## 注意事項

- Uniform Price Auction は機関投資家の関心がある大規模なトークンローンチに適しています
- clearing price メカニズムにより、すべての落札者が同じ条件を得ることが保証されます
- sealed 入札により、他の入札者の入札に基づく駆け引きを防止できます

{% callout type="note" %}
Uniform Price Auction の詳細なセットアップドキュメントは近日公開予定です。現時点では、代替のローンチメカニズムとして [Launch Pool](/smart-contracts/genesis/launch-pool) または [Presale](/smart-contracts/genesis/presale) を参照してください。
{% /callout %}

## FAQ

### Uniform Price Auction とは何ですか？

すべての落札者が個々の入札額に関係なく同じ clearing price を支払うオークションです。clearing price は最低落札価格となります。

### clearing price はどのように決定されますか？

入札は価格の高い順にランク付けされます。clearing price は、入札総数量が利用可能なトークン数に等しくなるポイントで設定され、すべての落札者がこの均一価格を支払います。

### 入札を非公開にできますか？

はい。Uniform Price Auction は設定に応じて公開入札と非公開（sealed）入札の両方をサポートしています。

### Uniform Price Auction はいつ使うべきですか？

入金ベースのローンチよりも構造化されたオークション形式を好む大口参加者（ホエール、ファンド）との価格発見に使用してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Uniform Price Auction** | すべての落札者が同じ clearing price を支払うオークション |
| **Clearing Price** | 最低落札価格。すべての落札者がこの価格を支払う |
| **Bid（入札）** | トークン数量とトークンあたりの価格を指定するユーザーの提示 |
| **Sealed Bid** | 他の参加者には見えない非公開の入札 |
| **Partial Fill** | 供給量の制限により入札が部分的にのみ満たされること |
| **Price Discovery** | 入札を通じて市場価値を決定するプロセス |

## 次のステップ

- [Launch Pool](/smart-contracts/genesis/launch-pool) - 価格発見を伴う比例配分
- [Presale](/smart-contracts/genesis/presale) - 固定価格トークン販売
- [Genesis Overview](/smart-contracts/genesis) - 基本概念とアーキテクチャ
