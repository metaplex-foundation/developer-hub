---
title: Token Entangler
metaTitle: Token Entangler | Developer Hub
description: Metaplexによる非推奨のToken Entanglerプログラムに関するドキュメンテーション。
---

# 概要

{% callout type="warning" %}

このプログラムは非推奨としてマークされており、Metaplex Foundationチームによって積極的にメンテナンスされていないことにご注意ください。新機能、セキュリティ修正、および後方互換性は保証されません。注意してご使用ください。

{% /callout %}

## はじめに

MetaplexのToken Entanglerプログラムは量子力学から直接引き出されたものです！2つのNFTを絡ませて、一度に1つだけが野生に存在できるようにすることができます(そして、常に絡まれたNFTと交換できます)。これは、ラグされたNFTをすべて新しい非ラグセットに置き換えることで、プロジェクトを**「デラグ」**するのに役立つ可能性があります。これがToken Entanglerが作成された理由でもあります：Degen Ape Academyの誤ったミントの後、Exiled Apesコミュニティを支援するためです。バックストーリーの詳細については、Exiled Apesのウェブサイトでご覧いただけます。

プログラムの背後にある考え方は、破損したメタデータを持つ最初にミントされたNFTを、適切なメタデータを含む新しいNFTにスワップできるというものでした。デラグプロジェクトやより創造的なユースケースにも使用できます。

これらのスワップは、いつでも前後に可能です。現在エスクローにないNFTが別のウォレットに販売された場合でも、新しいウォレットは再びスワップバックできます。

## 機会

Token Entanglerプログラムは非常にシンプルです。NFT Aを受け取り、トークンエンタングラー作成時にNFT Aにすでに割り当てられているNFT Bを返します。それにもかかわらず、あなたにとって興味深い可能性のある機会がいくつかあります：

- **前後にスワップ**: ユーザーがNFT AをNFT Bにスワップした場合、常にそのスワップを元に戻すことができます。
- **スワップ手数料**: トークンがスワップされるたびに支払われるか、NFTペアごとに一度だけ支払われるスワップ手数料を導入できます。
- **SPLトークン手数料**: スワップ手数料は、SPLトークンまたはSOLで支払うことができます。

## 仕組み

ユーザー向けのプロセスは簡単です。Token EntanglerにNFT Aを支払い(設定されている場合はSOLまたはSPLトークン)、絡まれたミントBを受け取ります：

![Image showing the general Token Entangler process. It shows a Wallet and the Token Entangler Program as a box. The boxes are connected with two arrows. One from Wallet to Entangler with annotation "NFT A + SOL" and another one from Entangler to Wallet with annotation "NFT B"](https://github.com/metaplex-foundation/docs/blob/main/static/assets/programs/token-entangler/Token-Entangler-Overview-Process.png?raw=true)

これは、ユーザー向けのプロセスのみを示す非常に縮小された図です。この画像には表示されていない追加のアカウントなどがあります。

## 独自のものを作成しましょう！

一般的な観点から見た最初から最後までの流れは次のようになります：

1. 新しいトークンをミントする
2. 古いNFTと新しいNFTを絡ませる
3. 顧客向けのウェブサイトをホストする。[サンプルUI実装](https://github.com/metaplex-foundation/token-entangler-ui)があります
4. ユーザーにNFTをスワップしてもらいましょう！

## さらなる情報

Token Entanglerプログラムに関する一般的な情報は、ドキュメンテーションでご覧いただけます：

- Getting Started
- Accounts
- Instructions
- CLI
- FAQ
- Changelog

Token Entanglerを使用する場合、例えば次のものを使用できます

- [JS CLI](https://github.com/metaplex-foundation/deprecated-clis/blob/main/src/token-entangler-cli.ts)
- [Token Entangler UI](https://github.com/metaplex-foundation/token-entangler-ui)

Token Entanglerコードを調べたい場合は、[GitHubリポジトリ](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/token-entangler/)もぜひチェックしてください。
