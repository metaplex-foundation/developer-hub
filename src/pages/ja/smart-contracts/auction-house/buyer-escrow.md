---
title: バイヤーエスクローアカウントの管理
metaTitle: バイヤーエスクローアカウントの管理 | Auction House
description: "バイヤーエスクローアカウントの管理方法を説明します。"
---
## はじめに

前のページでは、資産の入札とリスティングの作成方法、および販売の実行方法について説明しました。販売の実行について話したとき、**バイヤーエスクローアカウント**について簡単に触れました。このアカウントの用途は何で、なぜこれについて話す必要があるのでしょうか？

このアカウントは、入札者の資金(SOLまたはSPLトークン)を一時的に保持するエスクローとして機能するプログラム派生アドレス(PDA)です。これらの資金は入札価格と等しく、販売が成立するまでこのPDAに保存されます。販売が実行されると、Auction Houseはこれらの資金をバイヤーエスクローアカウントPDAから販売者のウォレットに転送します。

では、質問です：これらの資金は入札が行われたときに自動的に入札者のウォレットからバイヤーエスクローアカウントに転送されるのでしょうか？

答えはノーです。これが、バイヤーエスクローアカウントとその資金の管理について話す必要がある理由です。これらの資金はAuction House権限によって管理されます。権限がこのアカウントをどのように管理するかを見てみましょう。

## 残高の取得

前のセクションの議論に追加すると、販売が成立するために、バイヤーエスクローアカウントに十分な資金があることを確認するのはAuction Houseの責任です。

そのためには、まずAuction Houseは、バイヤーエスクローアカウントに現在どれだけの資金があるかを知る必要があります。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下は、特定のAuction Houseのバイヤーエスクローアカウントの残高を取得するコードスニペットです。

```tsx
import { Keypair } from "@solana/web3.js";

const buyerBalance = await metaplex
    .auctionHouse()
    .getBuyerBalance({
        auctionHouse,
        buyerAddress: Keypair.generate() // バイヤーのアドレス
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 資金の入金

この時点で、Auction Houseは、ユーザーに対応するバイヤーエスクローアカウントに現在どれだけの資金があるかを知っています。

このユーザーが資産に入札した場合、Auction Houseは、資金が不足している場合、ユーザーのウォレットからバイヤーエスクローアカウントに資金を転送することを決定できます。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Auction Houseのバイヤーのウォレットからバイヤーエスクローアカウントに資金を転送する方法を見てみましょう。

```tsx
import { Keypair } from "@solana/web3.js";

const depositResponse = await metaplex
    .auctionHouse()
    .depositToBuyerAccount({
        auctionHouse,              // エスクローバイヤーが資金を入金するAuction House。
                                   // `AuctionHouse`モデルのサブセットのみが必要ですが、
                                   // 資金の入金方法を知るために、
                                   // その設定に関する十分な情報が必要です。
        buyer: metaplex.identity() // 資金を入金するバイヤー。これはSignerを期待します
        amount: 10                 // 入金する資金の額。これは
                                   // SOLまたはAuction Houseが通貨として
                                   // 使用するSPLトークンのいずれかです。
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 資金の引き出し

Auction Houseは、ユーザーが資金を返却したい場合や入札をキャンセルした場合に、バイヤーエスクローウォレットからバイヤーのウォレットに資金を引き出すこともできる必要があります。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

特定のAuction Houseのバイヤーエスクローウォレットからバイヤーのウォレットに資金を引き出す方法を見てみましょう。

```tsx
import { Keypair } from "@solana/web3.js";

const withdrawResponse = await metaplex
    .auctionHouse()
    .withdrawFromBuyerAccount({
        auctionHouse,              // エスクローバイヤーが資金を引き出すAuction House
        buyer: metaplex.identity() // 資金を引き出すバイヤー
        amount: 10                 // 引き出す資金の額。これは
                                   // SOLまたはAuction Houseが通貨として
                                   // 使用するSPLトークンのいずれかです。
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 結論

バイヤーエスクローアカウントの資金を管理する方法についても説明したので、独自のマーケットプレイスを完全に立ち上げて制御するのに非常に近づいています。

現在欠けている重要な情報の1つ：マーケットプレイスはリスティング、入札、販売をどのように追跡するのでしょうか？Auction Houseプログラムには、これを行うための何かが用意されています。それが[レシート](receipts)です。
