---
title: Core Candy Machineへのアイテム挿入
metaTitle: アイテムの挿入 | Core Candy Machine
description: バッチ挿入、プレフィックス最適化、以前にロードしたアイテムの上書きを含む、Core Candy Machineへのconfig lineアイテムの挿入方法を学びます。
keywords:
  - core candy machine
  - insert items
  - config lines
  - addConfigLines
  - candy machine loading
  - NFT minting setup
  - batch insert
  - prefix name
  - prefix URI
  - candy machine items
  - mpl-core-candy-machine
  - Metaplex
  - Solana NFT
about:
  - Core Candy Machine item insertion
  - Config line management for NFT minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Core Candy Machineでトランザクションごとに何個のアイテムを挿入できますか？
    a: トランザクションごとのアイテム数は、Config Line SettingsのName LengthとURI Lengthの値に依存します。Solanaトランザクションにはサイズ制限があるため、短い名前とURIほど多くのアイテムを挿入できます。プレフィックスの使用はこれらの長さを大幅に削減し、1回の呼び出しでより多くのアイテムを挿入できます。
  - q: 既に挿入したアイテムを更新または上書きできますか？
    a: はい。addConfigLines関数はアイテムの書き込み位置を制御するindexパラメータを受け取ります。以前に挿入したアイテムのインデックスを指定すると、そのスロットを新しいデータで上書きできます。これはまだミントされていないアイテムに対して機能します。
  - q: ミントを開始する前にすべてのアイテムを挿入する必要がありますか？
    a: はい。Config Line Settingsを使用する場合、Core Candy Machineはミントトランザクションが許可される前に、すべてのスロット（itemsAvailableまで）にconfig lineが含まれていることを強制します。
  - q: プレフィックスありとなしでアイテムを挿入する違いは何ですか？
    a: プレフィックスなしでは、各アイテムのフル名とURIを保存します。プレフィックスありでは、Core Candy Machineが共有プレフィックスを一度だけ保存し、各アイテムの一意のサフィックスのみを挿入します。これによりオンチェーンストレージが削減され、レントコストが下がり、トランザクションごとにより多くのアイテムを挿入できます。
---

## 概要

`addConfigLines`命令は、名前とURIデータを[Core Candy Machine](/ja/smart-contracts/core-candy-machine)にロードし、各スロットが一意のCore NFTアセットとしてミントできる状態にします。

- `addConfigLines`を使用して指定されたインデックスに1つ以上のconfig lineを挿入
- [Config Line Settings](/ja/smart-contracts/core-candy-machine/create#config-line-settings)プレフィックスでバッチサイズを最適化し、トランザクションごとにより多くのアイテムを挿入
- インデックス位置を指定して以前に挿入したアイテムを上書き
- ミントが許可される前にすべてのアイテムを挿入する必要あり

## Core Candy Machineへのアイテムのロード

`addConfigLines`命令は、名前とURIのペアをオンチェーンアカウントに書き込み、[Core Candy Machine](/ja/smart-contracts/core-candy-machine)がミント時にどのメタデータを割り当てるかを認識できるようにします。各アイテムはマシンの[Config Line Settings](/ja/smart-contracts/core-candy-machine/create#config-line-settings)で定義された**Name Length**と**URI Length**制約に準拠する必要があります。

Solanaトランザクションにはサイズ制限があるため、同じトランザクション内で何千ものアイテムを挿入することはできません。トランザクション毎に挿入できるアイテム数は、各名前とURI文字列の長さに依存します。短い文字列ほどトランザクション毎により多くのアイテムを収めることができます。

{% callout type="note" %}
Config Line Settingsを使用する場合、**すべてのアイテムが挿入されるまでミントは許可されません**。[ガード](/ja/smart-contracts/core-candy-machine/guards)の追加やミントの開始前に、`itemsLoaded`が`itemsAvailable`と等しいことを確認してください。
{% /callout %}

{% callout title="CLI代替手段" type="note" %}
MPLX CLIを使用してアイテムを挿入することもできます。バッチ処理を自動的に処理します：
```bash
mplx cm insert
```
CLIはスマートなロード検出、進捗追跡、最適なバッチサイズ設定を提供します。詳細は[CLIのinsertコマンドドキュメント](/ja/dev-tools/cli/cm/insert)を参照してください。
{% /callout %}

{% dialect-switcher title="Config linesの追加" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリを使用する場合、`addConfigLines`関数を使用してCore Candy Machineにアイテムを挿入できます。追加するconfig linesと、それらを挿入するインデックスが必要です。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My NFT #1', uri: 'https://example.com/nft1.json' },
    { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
  ],
}).sendAndConfirm(umi)
```

現在読み込まれているアイテムの末尾にアイテムを追加するだけの場合、次のように`candyMachine.itemsLoaded`プロパティをインデックスとして使用できます。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: candyMachine.itemsLoaded,
  configLines: [
    { name: 'My NFT #3', uri: 'https://example.com/nft3.json' },
    { name: 'My NFT #4', uri: 'https://example.com/nft4.json' },
    { name: 'My NFT #5', uri: 'https://example.com/nft5.json' },
  ],
}).sendAndConfirm(umi)
```

APIリファレンス: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## プレフィックスを使用したアイテムの挿入

プレフィックスベースの挿入は、共有プレフィックスが既に[Config Line Settings](/ja/smart-contracts/core-candy-machine/create#config-line-settings)に保存されているため、各名前とURIの一意のサフィックスのみを保存します。これにより、アイテムごとのデータサイズが劇的に削減され、各トランザクションに大幅に多くのアイテムを含めることができます。

{% dialect-switcher title="指定されたインデックスからconfig linesを追加" %}
{% dialect title="JavaScript" id="js" %}

プレフィックスを使用するCore Candy Machineにconfig linesを追加する場合、`addConfigLines`関数を使用するときは、名前とURIのプレフィックス後の部分のみを提供すればよいです。

例えば、次のconfig line settingsを持つCore Candy Machineがあるとします。

```ts
await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'My Asset #',
    nameLength: 4,
    prefixUri: 'https://example.com/nft',
    uriLength: 9,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

この場合、次のようにconfig linesを挿入できます。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: candyMachine.itemsLoaded,
  configLines: [
    { name: '1', uri: '1.json' },
    { name: '2', uri: '2.json' },
    { name: '3', uri: '3.json' },
  ],
}).sendAndConfirm(umi)
```

APIリファレンス: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 既存アイテムの上書き

`addConfigLines`命令は、置き換えたいスロットのインデックスを指定することで、以前に挿入したアイテムを上書きできます。これはメタデータのエラー修正やミント開始前のアイテム差し替えに便利です。

{% dialect-switcher title="Config linesの上書き" %}
{% dialect title="JavaScript" id="js" %}

以下の例は、3つのアイテムを挿入し、後で2番目に挿入したアイテムを更新する方法を示しています。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My Asset #1', uri: 'https://example.com/nft1.json' },
    { name: 'My Asset #2', uri: 'https://example.com/nft2.json' },
    { name: 'My Asset #3', uri: 'https://example.com/nft3.json' },
  ],
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 1,
  configLines: [{ name: 'My Asset #X', uri: 'https://example.com/nftX.json' }],
}).sendAndConfirm(umi)

candyMachine = await fetchCandyMachine(candyMachine.publicKey)
candyMachine.items[0].name // "My Asset #1"
candyMachine.items[1].name // "My Asset #X"
candyMachine.items[2].name // "My Asset #3"
```

APIリファレンス: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## アイテム挿入後の次のステップ

すべてのアイテムがロードされたら（`itemsLoaded`が`itemsAvailable`と等しい）、Core Candy Machineはミント設定の準備が整います。次のステップは、誰がミントできるか、ミントの開始時期、必要な支払い、その他ローンチに必要なアクセス条件を制御する[ガード](/ja/smart-contracts/core-candy-machine/guards)を設定することです。

## 注意事項

- **トランザクションサイズ制限**: Solanaトランザクションは1232バイトに制限されています。トランザクションごとに挿入できるconfig line数は、Config Line SettingsのName LengthとURI Lengthの合計値に直接依存します。
- **Name LengthとURI Lengthの制約**: 各挿入アイテムの名前（プレフィックスを除く）は`nameLength`値を超えてはならず、各URI（プレフィックスを除く）は作成時に定義された`uriLength`値を超えてはなりません。これらの制限を超えるとトランザクションが失敗します。
- **ミント前にすべてのアイテムをロードする必要があります**: Core Candy Machineプログラムは、すべてのスロット（インデックス0から`itemsAvailable - 1`まで）にconfig lineが投入されるまでミント命令を拒否します。
- **プレフィックスはストレージコストを削減します**: `prefixName`と`prefixUri`を使用すると、共有文字列部分がすべてのアイテムで繰り返されるのではなくオンチェーンに一度だけ保存されるため、Candy Machineアカウントのレントコストが下がります。
- **上書きはミント前のみ**: まだミントされていないconfig lineは上書きできます。アイテムがミントされると、そのオンチェーンデータは確定されます。

## FAQ

### Core Candy Machineでトランザクションごとに何個のアイテムを挿入できますか？

トランザクションごとのアイテム数は、[Config Line Settings](/ja/smart-contracts/core-candy-machine/create#config-line-settings)の**Name Length**と**URI Length**の値に依存します。Solanaトランザクションのサイズ制限は1232バイトのため、短い名前とURIほど多くのアイテムをトランザクション毎に挿入できます。プレフィックスの使用はこれらの長さを大幅に削減し、1回の呼び出しでより多くのアイテムを挿入できます。

### 既に挿入したアイテムを更新または上書きできますか？

はい。`addConfigLines`関数はアイテムの書き込み位置を制御する`index`パラメータを受け取ります。以前に挿入したアイテムのインデックスを指定すると、そのスロットを新しいデータで上書きできます。これはまだミントされていないアイテムに対して機能します。

### ミントを開始する前にすべてのアイテムを挿入する必要がありますか？

はい。Config Line Settingsを使用する場合、Core Candy Machineはミントトランザクションが許可される前に、すべてのスロット（`itemsAvailable`まで）にconfig lineが含まれていることを強制します。

### プレフィックスありとなしでアイテムを挿入する違いは何ですか？

プレフィックスなしでは、各アイテムのフル名とURIを保存します。プレフィックスありでは、Core Candy Machineが共有プレフィックスを一度だけ保存し、各アイテムの一意のサフィックスのみを挿入します。これによりオンチェーンストレージが削減され、レントコストが下がり、トランザクションごとにより多くのアイテムを挿入できます。

