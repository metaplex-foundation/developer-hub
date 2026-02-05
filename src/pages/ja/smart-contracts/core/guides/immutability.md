---
title: MPL Coreでの不変性
metaTitle: MPL Coreでの不変性 | Coreガイド
description: このガイドでは、MPL Coreのさまざまな不変性レイヤーについて説明します
updated: '01-31-2026'
keywords:
  - immutable NFT
  - immutability
  - lock metadata
  - permanent NFT
about:
  - Immutability options
  - Metadata protection
  - Plugin immutability
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---
## 不変性とは？
デジタルアセットの一般的な文脈において、不変性はしばしばトークンやNFTのメタデータを指して使用されます。過去には、購入したアセットが将来変更されないことを確認するため、コミュニティからこれが求められていました。MPL Coreが提供する追加機能により、追加の不変性機能を加えることが意味を持つ場合があります。このガイドでは、これらのさまざまなオプションとそれらをプロジェクトのニーズに合わせてデジタルアセットの不変性を調整する方法についての情報を提供することを目的としています。
以下の違いを理解するためには、一般的なMPL Core[プラグイン機能](/smart-contracts/core/plugins)に精通していることが役立つかもしれません。
## MPL Coreの不変性オプション
- **不変メタデータ**: [immutableMetadata](/smart-contracts/core/plugins/immutableMetadata)プラグインは、Assetまたはコレクション全体の名前とURIを変更不可にできます。
- **新しいプラグインの追加を禁止**: Coreは、[addBlocker](/smart-contracts/core/plugins/addBlocker)プラグインを使用して、クリエイターがアセットに追加のプラグインを追加することを禁止できます。このプラグインがないと、update authorityはロイヤリティプラグインのようなAuthority Managedプラグインを追加できます。
- **プラグインレベルの不変性**: 一部のプラグインは、オーナーやupdate authorityとは異なるauthorityを設定できます。このauthorityを削除すると、その特定のプラグインは変更できなくなります。これは、例えばクリエイターがアセットオーナーに対してロイヤリティが将来変更されないことを保証したい場合に便利です。authorityの削除は、プラグインの作成時または更新時に行えます。
- **完全な不変性**: アセットまたはコレクションのupdate authorityを削除すると、authorityベースのアクションはトリガーできなくなります。これには、メタデータの変更やauthorityベースのプラグインの追加が含まれます。完全な不変性を目指す場合、[一般的なauthority](/smart-contracts/core/update#making-a-core-asset-data-immutable)に加えて、プラグインのauthorityも削除されていることを確認する必要があります。
