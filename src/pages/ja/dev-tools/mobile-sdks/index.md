---
title: モバイルSDK
metaTitle: モバイルSDK - AndroidとiOS | Metaplex
description: Metaplex NFTデータを読み取るためのコミュニティ製Android・iOS SDK。両SDKとも非推奨で、メンテナンスは終了しています。
created: '07-29-2026'
updated: '07-29-2026'
---

Metaplexモバイル SDKは、AndroidおよびiOS上でMetaplexプログラムのNFTデータを読み取るためのコミュニティライブラリです。両SDKとも非推奨で、メンテナンスは終了しています。 {% .lead %}

## 利用可能なSDK

Token Metadata、Auction House、Candy Machineアカウントの読み取り操作をカバーする2つのプラットフォームSDKが公開されていました:

- [Android SDK](/dev-tools/mobile-sdks/android) — Androidアプリケーション向けKotlinライブラリ
- [iOS SDK](/dev-tools/mobile-sdks/ios) — iOSアプリケーション向けSwiftライブラリ

## 注意事項

- 両SDKとも非推奨です。[Core](/smart-contracts/core)より前のもので、レガシーなToken Metadataデータのみを読み取ります
- 現在のモバイル・クライアント開発には、[UMI](/dev-tools/umi) JavaScriptフレームワークを使用するか、[DAS API](/dev-tools/das-api)をHTTPで直接クエリしてください
