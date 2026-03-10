---
title: Candy Guards
metaTitle: Candy Guards | Core Candy Machine
description: Candy Guardsは、Core Candy Machineにアタッチしてミントプロセスを制限およびカスタマイズするモジュール式のアクセス制御コンポーネントです。ガードの種類、Candy Guardアカウント、利用可能なガード、およびそれらの構成方法について学びます。
keywords:
  - candy guard
  - guard
  - access control
  - sol payment
  - start date
  - mint limit
  - bot tax
  - allow list
  - NFT gate
  - token gate
  - custom guard
  - minting restrictions
  - Core Candy Machine guards
  - Solana NFT mint
  - guard groups
  - freeze payment
about:
  - Candy Guards
  - Access control
  - NFT minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: カスタムCandy Guardを作成できますか？
    a: はい。ガードは別のCandy Guardプログラムに存在するため、誰でもCore Candy Machine Coreプログラムのミント機能に依存しながら、カスタムガードロジックを持つ独自のCandy Guardプログラムをフォークしてデプロイできます。Metaplex SDKではカスタムCandy Guardプログラムを登録して標準APIを使用することもできます。
  - q: 1つのCore Candy Machineで同時にいくつのガードを使用できますか？
    a: 利用可能なガードの任意の組み合わせを同時に有効にできます。ガードは構成可能なので、必要なものだけを有効化します。より複雑なシナリオでは、ガードグループを使用して単一のマシンで複数のガードセットを定義することもできます。
  - q: すべてのガードにミント設定やRoute命令が必要ですか？
    a: いいえ。追加のオンチェーンアカウント（ミント設定）や専用のRoute命令が必要なのは特定のガードのみです。ほとんどのガードは自己完結しています。ミント設定やRoute命令が適用されるかどうかは、各ガードのページを確認してください。
  - q: ミンターがガードチェックに失敗した場合はどうなりますか？
    a: トランザクションは拒否されます。Bot Taxガードが有効な場合、失敗したウォレットはエラーの代わりに設定可能なSOLペナルティが課金され、ボットによる無効なミント試行のスパムを抑止します。
  - q: Core Candy Machineのガードを更新すると、既存のガード設定はすべて置き換えられますか？
    a: はい。ガードの更新はガード設定全体を上書きします。変更するものだけでなく、有効にしたいすべてのガードを再指定する必要があります。
  - q: Candy Guardとガードグループの違いは何ですか？
    a: Candy Guardはガードのデフォルトセットを1つ保持するオンチェーンアカウントです。ガードグループを使用すると、同じCandy Guardアカウント内で複数の名前付きガードセットを定義でき、異なるウォレットやフェーズが異なるルールに従うことができます。
---

## Summary

Candy Guardsは、[Core Candy Machine](/ja/smart-contracts/core-candy-machine)にアタッチしてSolana上の[ミント](/ja/smart-contracts/core-candy-machine/mint)プロセスを制限およびカスタマイズするモジュール式で構成可能なアクセス制御コンポーネントです。 {% .lead %}

- 各ガードは支払い、スケジューリング、ウォレットゲーティングなど単一の責任を処理します。 {% .lead %}
- ガードは別のオンチェーンCore Candy Guardアカウントに定義され、Candy MachineのMint Authorityになります。 {% .lead %}
- デフォルトのCandy Guardプログラムには25以上の組み込みガードが付属しており、SOL/トークン支払い、許可リスト、タイムウィンドウ、ボット保護などをカバーしています。 {% .lead %}
- 独自のCandy Guardプログラムをフォークしてデプロイすることでカスタムガードを作成できます。 {% .lead %}

## Candy Guardとは？

Candy Guardは、[Core Candy Machine](/ja/smart-contracts/core-candy-machine)の[ミント](/ja/smart-contracts/core-candy-machine/mint)プロセス中に単一のアクセス制御ルールを適用するモジュール式のオンチェーンコンポーネントです。各ガードは独立して動作し、他のガードと組み合わせて必要なミント体験を構築できます。

選択できるガードの大きなセットがあり、それぞれを任意に有効化・設定できます。

後にこのドキュメントで[利用可能なすべてのガード](#利用可能なガード)について触れますが、ここではそれを説明するためのいくつかの例を見てみましょう。

- **Start Date**ガードが有効化されると、事前設定された日付より前はミントが禁止されます。指定された日付後のミントを禁止する**End Date**ガードもあります。
- **Sol Payment**ガードが有効化されると、ミントするウォレットは設定された宛先ウォレットに設定された金額を支払う必要があります。特定のコレクションのトークンやNFTで支払うための類似のガードが存在します。
- **Token Gate**と**NFT Gate**ガードは、それぞれ特定のトークンホルダーとNFTホルダーにミントを制限します。
- **Allow List**ガードは、ウォレットが事前定義されたウォレットリストの一部である場合のみミントを許可します。ミント用のゲストリストのようなものです。

ご覧のとおり、各ガードは一つの責任のみを担当し、それが構成可能にします。言い換えると、完璧なCandy Machineを作成するために必要なガードを選択できます。

## Core Candy Guardアカウント

Core Candy Guardアカウントは、指定された[Core Candy Machine](/ja/smart-contracts/core-candy-machine)のすべての有効化されたガードとその設定を保存するオンチェーンアカウントです。各Core Candy Machineアカウントは通常、保護層を追加する独自のCore Candy Guardアカウントに関連付けられる必要があります。

これは、Core Candy Guardアカウントを作成し、それをCore Candy Machineアカウントの**Mint Authority**にすることで機能します。そうすることで、メインのCore Candy Machineプログラムから直接ミントすることはもはや不可能になります。代わりに、すべてのガードが正常に解決された場合、Core Candy Machineプログラムに委譲してミントプロセスを完了するCore Candy Guardプログラムを通じてミントする必要があります。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-1 %}

Mint Authority = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
有効化されたガードに \
準拠する限り誰でもミント \
できます。
{% /node %}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}
{% node parent="mint-2" x=215 y=-18 theme="transparent" %}
Aliceのみが \
ミントできます。
{% /node %}

{% node #nft parent="mint-2" x=78 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-2 %}

Mint Authority = Alice {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="mint-authority-1" fromPosition="left" toPosition="left" arrow=false dashed=true /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-2" theme="pink" path="straight" /%}

{% /diagram %}

Core Candy MachineとCore Candy Guardアカウントが連携して動作するため、SDKはそれらを一つのエンティティとして扱うことに注意してください。SDKでCore Candy Machineを作成すると、デフォルトで関連するCore Candy Guardアカウントも作成されます。Core Candy Machineを更新する場合も同様で、同時にガードを更新することができます。このページで具体例を見ていきます。

## ガードが別のプログラムを使用する理由

ガードは専用のCandy Guardプログラムに存在し、Core Candy Machine Coreプログラムとは分離されているため、アクセス制御ロジックがミントロジックから完全に分離されます。ガードがメインのCore Candy Machineプログラムに存在しない理由は、アクセス制御ロジックをNFTをミントするというメインのCore Candy Machineの責任から分離するためです。

これにより、ガードはモジュラーであるだけでなく拡張可能になります。誰でも独自のCore Candy Guardプログラムを作成・デプロイしてカスタムガードを作成でき、残りすべてについてはCore Candy Machine Coreプログラムに依存できます。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=300 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=180 %}
{% node #mint-1b label="Mint" theme="pink" /%}
{% node label="Custom Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1b" x=-80 y=-22 label="異なるアクセス制御" theme="transparent" /%}

{% node parent="mint-1" x=70 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=110 y=-20 label="同じミントロジック" theme="transparent" /%}

{% node #nft parent="mint-2" x=77 y=100 label="NFT" /%}

{% node parent="mint-1b" x=250 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-2" y=80 x=0 %}
{% node #candy-guard-2 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Custom Core Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node %}
My Custom Guard {% .font-semibold %}
{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="candy-guard-2" to="candy-machine-2" fromPosition="right" toPosition="right" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-1b" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-1b" theme="pink" /%}
{% edge from="candy-guard-2" to="mint-1b" theme="pink" /%}

{% /diagram %}

SDKは独自のCore Candy Guardプログラムとそのカスタムガードを登録する方法も提供しているため、フレンドリーなAPIを活用して、ガードを他の人と簡単に共有できることに注意してください。

## 利用可能なガード

デフォルトのCore Candy Guardプログラムには、支払い、スケジューリング、ゲーティング、ボット保護をカバーする25以上の組み込みガードが付属しています。以下のリストでは、各ガードの短い説明と、より高度な読み物のための専用ページへのリンクを提供します。

- [**Address Gate**](/ja/smart-contracts/core-candy-machine/guards/address-gate): ミントを単一のアドレスに制限します。
- [**Allocation**](/ja/smart-contracts/core-candy-machine/guards/allocation): 各ガードグループがミントできるNFTの数に制限を指定できます。
- [**Allow List**](/ja/smart-contracts/core-candy-machine/guards/allow-list): ウォレットアドレスリストを使用して、誰がミントを許可されるかを決定します。
- [**Asset Burn Multi**](/ja/smart-contracts/core-candy-machine/guards/asset-burn-multi): 指定されたコレクションのホルダーにミントを制限し、1つ以上のcoreアセットのバーンを要求します。
- [**Asset Burn**](/ja/smart-contracts/core-candy-machine/guards/asset-burn): 指定されたコレクションのホルダーにミントを制限し、単一のcoreアセットのバーンを要求します。
- [**Asset Gate**](/ja/smart-contracts/core-candy-machine/guards/asset-gate): 指定されたコレクションのホルダーにミントを制限します。
- [**Asset Mint Limit**](/ja/smart-contracts/core-candy-machine/guards/asset-mint-limit): 指定されたコレクションのホルダーにミントを制限し、提供されたCore Assetに対して実行できるミント数を制限します。
- [**Asset Payment Multi**](/ja/smart-contracts/core-candy-machine/guards/asset-payment-multi): 指定されたコレクションの複数のCore Assetをミントの価格として設定します。
- [**Asset Payment**](/ja/smart-contracts/core-candy-machine/guards/asset-payment): 指定されたコレクションのCore Assetをミントの価格として設定します。
- [**Bot Tax**](/ja/smart-contracts/core-candy-machine/guards/bot-tax): 無効なトランザクションに課金する設定可能な税金。
- [**Edition**](/ja/smart-contracts/core-candy-machine/guards/edition): ミントされたCore AssetにEdition Pluginを追加します。詳細については[Print Editions](/ja/smart-contracts/core/guides/print-editions)ガイドを参照してください。
- [**End Date**](/ja/smart-contracts/core-candy-machine/guards/end-date): ミントを終了する日付を決定します。
- [**Freeze Sol Payment**](/ja/smart-contracts/core-candy-machine/guards/freeze-sol-payment): 凍結期間付きでSOLでミントの価格を設定します。
- [**Freeze Token Payment**](/ja/smart-contracts/core-candy-machine/guards/freeze-token-payment): 凍結期間付きでトークン量でミントの価格を設定します。
- [**Gatekeeper**](/ja/smart-contracts/core-candy-machine/guards/gatekeeper): Gatekeeper Networkを通じてミントを制限します（例：Captcha統合）。
- [**Mint Limit**](/ja/smart-contracts/core-candy-machine/guards/mint-limit): ウォレット毎のミント数の制限を指定します。
- [**Nft Burn**](/ja/smart-contracts/core-candy-machine/guards/nft-burn): 指定されたコレクションのホルダーにミントを制限し、NFTのバーンを要求します。
- [**Nft Gate**](/ja/smart-contracts/core-candy-machine/guards/nft-gate): 指定されたコレクションのホルダーにミントを制限します。
- [**Nft Payment**](/ja/smart-contracts/core-candy-machine/guards/nft-payment): 指定されたコレクションのNFTをミントの価格として設定します。
- [**Program Gate**](/ja/smart-contracts/core-candy-machine/guards/program-gate): ミントトランザクションに含めることができるプログラムを制限します。
- [**Redeemed Amount**](/ja/smart-contracts/core-candy-machine/guards/redeemed-amount): ミントされた総量に基づいてミントの終了を決定します。
- [**Sol Fixed fee**](/ja/smart-contracts/core-candy-machine/guards/sol-fixed-fee): 固定価格でSOLでミントの価格を設定します。[Sol Payment](/ja/smart-contracts/core-candy-machine/guards/sol-payment)ガードと類似。
- [**Sol Payment**](/ja/smart-contracts/core-candy-machine/guards/sol-payment): SOLでミントの価格を設定します。
- [**Start Date**](/ja/smart-contracts/core-candy-machine/guards/start-date): ミントの開始日を決定します。
- [**Third Party Signer**](/ja/smart-contracts/core-candy-machine/guards/third-party-signer): トランザクションに追加の署名者を要求します。
- [**Token Burn**](/ja/smart-contracts/core-candy-machine/guards/token-burn): 指定されたトークンのホルダーにミントを制限し、トークンのバーンを要求します。
- [**Token Gate**](/ja/smart-contracts/core-candy-machine/guards/token-gate): 指定されたトークンのホルダーにミントを制限します。
- [**Token Payment**](/ja/smart-contracts/core-candy-machine/guards/token-payment): トークン量でミントの価格を設定します。
- [**Token22 Payment**](/ja/smart-contracts/core-candy-machine/guards/token2022-payment): token22（トークン拡張）量でミントの価格を設定します。
- [**Vanity Mint**](/ja/smart-contracts/core-candy-machine/guards/vanity-mint): 新しいミントアドレスが特定のパターンに一致することを期待してミントを制限します。

## Notes

- ガードは完全に構成可能です。単一のCore Candy Machineで組み込みガードの任意の組み合わせを有効にして、必要なミント体験を作成できます。
- カスタムガードの作成には、独自のCandy Guardプログラムのフォークとデプロイが必要です。[Core](/ja/smart-contracts/core) Candy Machine Coreプログラム自体を変更する必要はありません。
- Core Candy Machineのガードを更新すると、ガード設定全体が上書きされます。変更するものだけでなく、有効にしたいすべてのガードを常に再指定してください。
- [Allow List](/ja/smart-contracts/core-candy-machine/guards/allow-list)などの一部のガードでは、前提条件を検証するためにミント前に[Route命令](/ja/smart-contracts/core-candy-machine/guard-route)を呼び出す必要があります。
- [ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)を使用して、ガードを複数の名前付きセットに整理し、異なるミントフェーズやウォレットティアに対して異なるルールを有効にできます。

## FAQ

### カスタムCandy Guardを作成できますか？

はい。ガードは別のCandy Guardプログラムに存在するため、誰でもCore Candy Machine Coreプログラムのミント機能に依存しながら、カスタムガードロジックを持つ独自のCandy Guardプログラムをフォークしてデプロイできます。Metaplex SDKではカスタムCandy Guardプログラムを登録して標準APIを使用することもできます。

### 1つのCore Candy Machineで同時にいくつのガードを使用できますか？

利用可能なガードの任意の組み合わせを同時に有効にできます。ガードは構成可能なので、必要なものだけを有効化します。より複雑なシナリオでは、[ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)を使用して単一のマシンで複数のガードセットを定義することもできます。

### すべてのガードにミント設定やRoute命令が必要ですか？

いいえ。追加のオンチェーンアカウント（ミント設定）や専用の[Route命令](/ja/smart-contracts/core-candy-machine/guard-route)が必要なのは特定のガードのみです。ほとんどのガードは自己完結しています。ミント設定やRoute命令が適用されるかどうかは、各ガードのページを確認してください。

### ミンターがガードチェックに失敗した場合はどうなりますか？

トランザクションは拒否されます。[Bot Tax](/ja/smart-contracts/core-candy-machine/guards/bot-tax)ガードが有効な場合、失敗したウォレットはエラーの代わりに設定可能なSOLペナルティが課金され、ボットによる無効なミント試行のスパムを抑止します。

### Core Candy Machineのガードを更新すると、既存のガード設定はすべて置き換えられますか？

はい。ガードの更新はガード設定全体を上書きします。変更するものだけでなく、有効にしたいすべてのガードを再指定する必要があります。

### Candy Guardとガードグループの違いは何ですか？

Candy Guardはガードのデフォルトセットを1つ保持するオンチェーンアカウントです。[ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)を使用すると、同じCandy Guardアカウント内で複数の名前付きガードセットを定義でき、異なるウォレットやフェーズが異なるルールに従うことができます。

## Glossary

| Term | Definition |
|------|------------|
| Guard | ミント中に単一のアクセス制御ルールを適用するモジュール式のオンチェーンコンポーネント。 |
| Candy Guard | Core Candy Machineのすべての有効化されたガードの完全なセットを保存するオンチェーンアカウント。 |
| Candy Guard Program | Candy Guardアカウントを所有し、Core Candy Machine Coreプログラムに委譲する前にすべてのガード条件を評価するSolanaプログラム。 |
| Mint Authority | Core Candy Machineでミントを呼び出す権限を持つ公開鍵。ガードがアクティブな場合、Candy Guardアカウントに設定されます。 |
| Sol Payment | ミントするウォレットに指定された量のSOLを宛先ウォレットに支払うことを要求するガード。 |
| Bot Tax | 失敗したミントトランザクションに設定可能なSOLペナルティを課金してボットを抑止するガード。 |
| Allow List | 事前定義されたMerkleツリーベースのリストに存在するウォレットにミントを制限するガード。 |
| Guard Groups | 異なるミントフェーズやウォレットティアに対して異なるルールを有効にする、単一のCandy Guardアカウント内の名前付きガードセット。 |
| Route Instruction | 一部のガードが前提条件を検証または設定するためにミント前に呼び出す必要がある専用の命令。[Guard Route](/ja/smart-contracts/core-candy-machine/guard-route)を参照。 |
| Mint Settings | 特定のガードがミントプロセス中に作成または要求する追加のオンチェーンアカウントデータ。 |

