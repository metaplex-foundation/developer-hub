---
title: 移动SDK
metaTitle: 移动SDK - Android与iOS | Metaplex
description: 用于读取Metaplex NFT数据的社区Android和iOS SDK。两个SDK均已弃用，不再维护。
created: '07-29-2026'
updated: '07-29-2026'
---

Metaplex移动SDK是用于在Android和iOS上读取Metaplex程序NFT数据的社区库。两个SDK均已弃用，不再维护。 {% .lead %}

## 可用的SDK

曾发布过两个平台SDK，覆盖Token Metadata、Auction House和Candy Machine账户的读取操作:

- [Android SDK](/dev-tools/mobile-sdks/android) — 面向Android应用的Kotlin库
- [iOS SDK](/dev-tools/mobile-sdks/ios) — 面向iOS应用的Swift库

## 注意事项

- 两个SDK均已弃用。它们早于[Core](/smart-contracts/core)，仅能读取旧版Token Metadata数据
- 当前的移动端或客户端开发请使用[UMI](/dev-tools/umi) JavaScript框架，或通过HTTP直接查询[DAS API](/dev-tools/das-api)
