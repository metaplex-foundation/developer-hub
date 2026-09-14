---
title: Mobile SDKs
metaTitle: Mobile SDKs - Android and iOS | Metaplex
description: Community Android and iOS SDKs for reading Metaplex NFT data. Both SDKs are deprecated and no longer maintained.
created: '07-29-2026'
updated: '07-29-2026'
---

The Metaplex Mobile SDKs are community libraries for reading NFT data from Metaplex programs on Android and iOS. Both SDKs are deprecated and no longer maintained. {% .lead %}

## Available SDKs

Two platform SDKs were published, each covering read operations for Token Metadata, Auction House, and Candy Machine accounts:

- [Android SDK](/dev-tools/mobile-sdks/android) — Kotlin library for Android applications
- [iOS SDK](/dev-tools/mobile-sdks/ios) — Swift library for iOS applications

## Notes

- Both SDKs are deprecated; they predate [Core](/smart-contracts/core) and read only legacy Token Metadata data
- For current mobile or client development, use the [UMI](/dev-tools/umi) JavaScript framework or query the [DAS API](/dev-tools/das-api) directly over HTTP
