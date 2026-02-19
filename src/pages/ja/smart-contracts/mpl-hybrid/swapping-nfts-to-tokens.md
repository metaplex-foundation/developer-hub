---
title: MPL HybridでのNFTからトークンへのスワップ
metaTitle: NFTからトークンへのスワップ | MPL-Hybrid
description: MPL-Hybridプログラムでユーザーが自分のNFTをトークンにスワップできるスワップ機能の書き方を学びましょう。
---

MPL-Hybridプログラムで所有するトークンをエスクローに保持されているNFTにスワップする行為は`capture`と呼ばれます。

## NFTのスワップ

```ts
await releaseV1(umi, {
    // スワップされるアセットの所有者。
    owner: umi.identity,
    // エスクロー設定アドレス。
    escrow: publicKey("11111111111111111111111111111111"),
    // SPLトークンにスワップされるアセット。
    asset: publicKey("22222222222222222222222222222222"),
    // エスクロー設定に割り当てられたコレクション。
    collection: publicKey("33333333333333333333333333333333"),
    // 手数料ウォレットアドレス。
    feeProjectAccount: publicKey("44444444444444444444444444444444"),
    // ウォレットのトークンアカウント。
    token: publicKey("55555555555555555555555555555555"),
  }).sendAndConfirm(umi);
```
