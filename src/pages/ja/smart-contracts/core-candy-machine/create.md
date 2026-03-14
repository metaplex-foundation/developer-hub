---
title: Core Candy Machineの作成
metaTitle: Core Candy Machineの作成 | Core Candy Machine
description: Config Line Settings、Hidden Settings、ガードを含む設定可能な設定でSolana上にCore Candy Machineを作成するためのステップバイステップチュートリアル。mpl-core-candy-machine SDKを使用します。
keywords:
  - core candy machine
  - create candy machine
  - mpl-core-candy-machine
  - candy machine settings
  - config line settings
  - hidden settings
  - candy machine guards
  - solana NFT minting
  - metaplex core
  - NFT collection launch
  - candy machine reveal
  - solana NFT distribution
about:
  - Creating and configuring a Core Candy Machine for NFT distribution
  - Core Candy Machine item settings including Config Line and Hidden Settings
  - Applying guards to a Core Candy Machine during creation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
howToSteps:
  - Candy Machine用のアセットとCoreコレクションを準備する
  - Candy Machineサイナー、コレクション、itemsAvailableを指定してcreate命令を呼び出す
  - オプションでConfig Line SettingsまたはHidden Settingsを設定してアセットデータの保存方法を構成する
  - オプションでガードをアタッチしてミントアクセスと支払いを制御する
howToTools:
  - '@metaplex-foundation/mpl-core-candy-machine'
  - '@metaplex-foundation/umi'
faqs:
  - q: Config Line SettingsとHidden Settingsの違いは何ですか？
    a: Config Line Settingsは個別のアセット名とURIをプレフィックス圧縮でオンチェーンに保存し、レントコストを削減します。Hidden Settingsはすべてのバイヤーに同一のプレースホルダーアセットをミントし、後日リビールメカニズムを可能にします。一方のみがCandy Machineで使用可能で、相互に排他的です。
  - q: Core Candy Machineの作成にはどれくらいのコストがかかりますか？
    a: レントコストはアイテム数とストレージモードによって異なります。短いプレフィックスを使用したConfig Line Settingsは、繰り返しの名前とURIプレフィックスを一度だけ保存するため、レントを大幅に削減します。Hidden Settingsは、コレクションサイズに関係なく単一の名前、URI、ハッシュのみを保存するため、最もコストが低くなります。
  - q: Core Candy Machineの作成後にガードを追加できますか？
    a: はい。Candy Guardアカウントを作成し、既存のCore Candy Machineのミント権限としていつでも設定できます。便宜上、作成時にガードを直接渡すこともできます。
  - q: Candy Machineを作成する前に既存のCoreコレクションが必要ですか？
    a: はい。Core Candy Machineは作成時にCoreコレクションアドレスが必要です。Candy Machineがミントされたアセットをコレクションに検証するためのデリゲートとして承認されるよう、コレクション更新権限がトランザクションに署名する必要があります。
  - q: Config Line SettingsでisSequentialをfalseに設定するとどうなりますか？
    a: Candy Machineは順次ではなく擬似ランダムな順序でアセットをミントします。このランダム性は暗号学的に安全ではなく、十分なリソースで影響を受ける可能性があるため、予測不可能性が重要な場合はHidden Settingsの方が望ましい場合があります。
---

## 概要

`create`命令は、Solana上に新しい[Core](/ja/smart-contracts/core) Candy Machineアカウントを初期化し、Coreコレクションにリンクして、アセットの保存と配布方法を定義します。 {% .lead %}

- **コア命令**: `@metaplex-foundation/mpl-core-candy-machine`の`create`が新しいCandy Machineアカウントをデプロイ
- **ストレージモード**: プレフィックス圧縮された個別アセットデータ用の[Config Line Settings](#config-line-settingsフィールド)、またはシングルリビールプレースホルダー用の[Hidden Settings](#hidden-settingsフィールド)を選択
- **ガードサポート**: 作成時に[ガード](/ja/smart-contracts/core-candy-machine/guards)をアタッチしてミントアクセス、支払い、スケジューリングを制御
- **前提条件**: Candy Machineを作成する前に[Coreコレクション](/ja/smart-contracts/core/collections#creating-a-collection)が存在する必要がある

**ジャンプ先:** [前提条件](#前提条件) · [Candy Machineの作成](#candy-machineの作成) · [作成引数](#作成引数) · [Config Line Settings](#config-line-settingsフィールド) · [Hidden Settings](#hidden-settingsフィールド) · [ガード付き作成](#ガード付きcore-candy-machineの作成) · [注意事項](#注意事項) · [FAQ](#faq)


## 前提条件

- [アセットの準備](/ja/smart-contracts/core-candy-machine/preparing-assets)
- [Coreコレクションの作成](/ja/smart-contracts/core/collections#creating-a-collection)

Core Candy Machineアセットをコレクション（新規または既存）に作成したい場合は、Core Candy Machineの作成時にCoreコレクションを提供する必要があります。

## Candy Machineの作成

`create`関数は、新しいCore Candy Machineアカウントをデプロイし、[Core](/ja/smart-contracts/core)コレクションに割り当て、ミントに利用可能なアイテム総数を設定します。

{% callout title="CLI代替手段" type="note" %}
MPLX CLIのインタラクティブウィザードを使用してCore Candy Machineを作成することもできます：
```bash
mplx cm create --wizard
```
ステップバイステップのガイダンス、アセット検証、自動デプロイを提供します。詳細は[CLI Candy Machineドキュメント](/ja/dev-tools/cli/cm)を参照してください。
{% /callout %}

{% dialect-switcher title="Core Candy Machineの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
// Candy Machineを作成します。
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner(umi)

const createIx = await create(umi, {
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### 作成引数

`create`関数は、デプロイ時にCore Candy Machineを設定するために以下の引数を受け取ります。

Core Candy Machineの作成に使用される新しく生成されたキーペア/サイナー。

{% dialect-switcher title="CandyMachine作成引数" %}
{% dialect title="JavaScript" id="js" %}

| 名前                      | タイプ                        |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (オプション)   | publicKey                     |
| authority (オプション)      | publicKey                     |
| payer (オプション)          | signer                        |
| collection                | publicKey                     |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [link](#config-line-settingsフィールド) |
| hiddenSettings            | [link](#hidden-settingsフィールド)      |

{% /dialect %}
{% dialect title="Rust" id="rust" %}

| 名前                      | タイプ                        |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (オプション)   | pubkey                        |
| authority (オプション)      | pubkey                        |
| payer (オプション)          | signer                        |
| collection                | pubkey                        |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [link](#config-line-settingsフィールド) |
| hiddenSettings            | [link](#hidden-settingsフィールド)      |

{% /dialect %}
{% /dialect-switcher %}

### authorityPdaフィールド

`authorityPda`は、ミントされたアセットをコレクションに検証するために使用されるPDAです。このフィールドはオプションであり、省略された場合はデフォルトのシードに基づいて自動的に計算されます。

{% dialect-switcher title="Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authorityPda: string
```

{% /dialect %}
{% /dialect-switcher %}

### authorityフィールド

`authority`は、Core Candy Machineの管理権限を持つウォレットまたはパブリックキーで、設定の更新や[ガード](/ja/smart-contracts/core-candy-machine/guards)の管理が可能です。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authority: string
```

{% /dialect %}
{% /dialect-switcher %}

### payerフィールド

`payer`はトランザクションとレント費用を支払うウォレットです。省略された場合、現在のサイナーがデフォルトで使用されます。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
payer: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### collectionフィールド

`collection`は、Candy Machineがアセットをミントする[Coreコレクション](/ja/smart-contracts/core/collections#creating-a-collection)のパブリックキーです。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### collectionUpdateAuthorityフィールド

`collectionUpdateAuthority`はコレクションの更新権限です。Candy Machineが作成されたアセットをコレクションに検証するためのデリゲートを承認できるよう、これは署名者である必要があります。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collectionUpdateAuthority: signer
```

{% /dialect %}
{% /dialect-switcher %}

<!-- ### Seller Fee Basis Points

{% dialect-switcher title="sellerFeeBasisPoints" %}
{% dialect title="JavaScript" id="js" %}

```ts
sellerFeeBasisPoints: number
```

{% /dialect %}
{% /dialect-switcher %}

`sellerFeeBasisPoints`フィールドは、Candy Machineから作成される各アセットに書き込まれるロイヤリティベーシスポイントです。
これは小数点以下2桁に基づく数値として指定されるため、`500`ベーシスポイントは`5%`に等しくなります。

`umi`ライブラリからインポートできる計算用の`percentageAmount`ヘルパーもあります。

{% dialect-switcher title="percentageAmount" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /dialect %}
{% /dialect-switcher %} -->

### itemsAvailableフィールド

`itemsAvailable`フィールドは、Core Candy Machineからミント可能なアセットの総数を指定します。この値は作成時に設定され、Candy Machineアカウントのサイズを決定します。

{% dialect-switcher title="itemsAvailable" %}
{% dialect title="JavaScript" id="js" %}

```ts
itemsAvailable: number
```

{% /dialect %}
{% /dialect-switcher %}

### isMutableフィールド

`isMutable`フィールドは、ミントされたアセットが作成後に更新可能かどうかを決定するブール値です。`false`に設定すると、アセットメタデータはミント時に永久にロックされます。

{% dialect-switcher title="isMutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: boolean
```

{% /dialect %}
{% /dialect-switcher %}

### Config Line Settingsフィールド

Config Line Settingsは、プレフィックス圧縮を使用して個別のアセット名とURIをオンチェーンに保存し、すべてのアセットにフル文字列を保存する場合と比較してCandy Machineのレントコストを大幅に削減します。

{% callout type="note" title="ランダム性" %}

Config Line Settingsと[Hidden Settings](#hidden-settingsフィールド)は相互に排他的です。一度に使用できるのは一つだけです。

アセットの「ランダム」ミントプロセスは完全に予測不可能ではなく、十分なリソースと悪意ある意図によって影響を受ける可能性があるため、リビールメカニズムにはHidden Settingsを利用することが推奨される場合があります。

{% /callout %}

アセットの名前とURIプレフィックスをCore Candy Machineに保存することで、すべてのアセットに同じ名前とURIを保存する必要がないため、保存に必要なデータが大幅に削減されます。

例えば、すべてのアセットが`Example Asset #1`から`Example Asset #1000`まで同じ命名構造を持っている場合、通常は文字列`Example Asset #`を1000回保存する必要があり、15,000バイトを占有します。

名前のプレフィックスをCore Candy Machineに保存し、Core Candy Machineが作成されたインデックス番号を文字列に追加することで、レント費用でこれらの15,000バイトを節約できます。

これはURIプレフィックスにも適用されます。

{% dialect-switcher title="ConfigLineSettingsオブジェクト" %}
{% dialect title="JavaScript" id="js" %}

```ts
ConfigLineSettings = {
    prefixName: string;
    nameLength: number;
    prefixUri: string;
    uriLength: number;
    isSequential: boolean;
}
```

{% /dialect %}
{% /dialect-switcher %}

#### prefixNameフィールド

`prefixName`はアセットの名前プレフィックスを保存し、ミント時にミントされたインデックスを名前の末尾に追加します。

アセットの命名構造が`Example Asset #1`の場合、プレフィックスは`Example Asset #`になります。ミント時にCore Candy Machineは文字列の末尾にインデックスを追加します。

#### nameLengthフィールド

`nameLength`は、名前プレフィックスを除く、挿入される各アイテムの名前の最大長です。

例：
- 1000アイテムを含むCandy Machine
- 各アイテムの名前は`Example Asset #X`（Xは1から始まるアイテムのインデックス）

この場合、19文字を保存する必要があります。"My NFT Project #"で15文字、最高数の"1000"で4文字。`prefixName`を使用する場合、`nameLength`は代わりに4に削減できます。

#### prefixUriフィールド

`prefixUri`は、可変識別IDを除く、メタデータのベースURIです。

アセットのメタデータURIが`https://example.com/metadata/0.json`の場合、ベースメタデータURIは`https://example.com/metadata/`になります。

#### uriLengthフィールド

`uriLength`は、`prefixUri`を除く、URIの最大長です。

例：
- 20文字のベースURI `https://arweave.net/`
- 最大43文字の一意の識別子

プレフィックスなしでは63文字の保存が必要になります。`prefixUri`を使用する場合、`uriLength`は`https://arweave.net/`の20文字分削減され、一意識別子の43文字になります。

#### isSequentialフィールド

`isSequential`フィールドは、アセットが順次ミントされるか擬似ランダムにミントされるかを示します。`false`に設定すると、Candy Machineは擬似ランダムな順序でミントします。[Hidden Settings](#hidden-settingsフィールド)はこのフィールドに関係なく常に順次ミントされます。

#### Config Line Settingsの例

`configLineSettings`を適用してCore Candy Machineを作成する例を示します：

{% dialect-switcher title="configLineSettingsでCore Candy Machineを作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  candyMachine,
  collection: coreCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 5000,
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 15,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 29,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Hidden Settingsフィールド

Hidden Settingsは、Core Candy Machineがすべてのバイヤーに同一のプレースホルダーアセットをミントするよう設定し、後日最終メタデータを割り当てる人気の「リビール」メカニズムを可能にします。Edition Guardと組み合わせることで、[Core](/ja/smart-contracts/core) Editionの印刷もサポートします。

{% callout type="note" %}
[Config Line Settings](#config-line-settingsフィールド)とHidden Settingsは相互に排他的です。Candy Machineを作成する際にどちらか一方を選択する必要があります。
{% /callout %}

{% dialect-switcher title="Hidden Settings" %}
{% dialect title="JavaScript" id="js" %}

```ts
hiddenSettings = {
  name: string,
  uri: string,
  hash: Uint8Array,
}
```

{% /dialect %}
{% /dialect-switcher %}

#### Hidden Settingsのnameフィールド

`name`はHidden Settingsが有効な状態でミントされるすべてのアセットに表示される名前です。Config Line Settingsのプレフィックスと同様に、Hidden SettingsのNameとURIには特別な変数を使用できることに注意してください。これらの変数は：

- `$ID$`: これは0から始まるミントされたアセットのインデックスに置き換えられます。
- `$ID+1$`: これは1から始まるミントされたアセットのインデックスに置き換えられます。

これを使用して、希望するアセットをリビールされたデータに一致させることができるようにする必要があります。

#### Hidden Settingsのuriフィールド

`uri`はHidden Settingsが有効な状態でミントされるすべてのアセットに表示されるメタデータURIです。通常、共有のプレースホルダーJSONファイルを指します。

#### Hidden Settingsのhashフィールド

`hash`はリビールデータの暗号化ハッシュ/チェックサムを保存し、最終的にリビールされたメタデータが元々コミットされた順序と一致することを誰でも検証できるようにします。これにより、ミント後にレアアセットを特定のホルダーに再配置するような改ざんを防止します。

{% dialect-switcher title="リビールデータのハッシュ化" %}
{% dialect title="JavaScript" id="js" %}

```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```

{% /dialect %}
{% /dialect-switcher %}

#### Hidden Settingsによる作成の例

{% dialect-switcher title="Hidden SettingsでCandy Machineを作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import crypto from "crypto";

const candyMachine = generateSigner(umi)

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

const createIx = await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
  sellerFeeBasisPoints: percentAmount(10),
  itemsAvailable: 5000,
  hiddenSettings: {
    name: "Hidden Asset",
    uri: "https://example.com/hidden-asset.json",
    hash,
  }
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## ガード付きCore Candy Machineの作成

`create`関数は`guards`フィールドを受け取り、作成時に[ガード](/ja/smart-contracts/core-candy-machine/guards)ルールを直接アタッチして、誰がミントできるか、いつ、どのようなコストでミントできるかを制御します。

これまでに作成したCore Candy Machineにはガードが有効になっていませんでした。利用可能なすべてのガードがわかったので、いくつかのガードを有効にして新しいCandy Machineを設定する方法を見てみましょう。

具体的な実装は使用するSDKによって異なります（以下を参照）が、基本的な考え方は、必要な設定を提供してガードを有効にすることです。設定されていないガードは無効になります。

{% dialect-switcher title="ガード付きCore Candy Machineの作成" %}
{% dialect title="JavaScript" id="js" %}

<!-- Umiライブラリでガードを有効にするには、`create`関数に`guards`属性を提供し、有効にしたいすべてのガードの設定を渡すだけです。`none()`に設定されているか、提供されていないガードは無効になります。 -->

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const createIx = await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // 他のすべてのガードは無効...
  },
})

await createIx.sendAndConfirm(umi)
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 注意事項

- **Config Line SettingsとHidden Settingsは相互に排他的です。** どちらか一方を選択する必要があります。両方を`create`命令に渡すとエラーが発生します。
- **レントコストはアイテム数とストレージモードに応じてスケールします。** 短いプレフィックスを使用したConfig Line Settingsは、フル名とURIを保存するより安価です。Hidden Settingsは単一の名前、URI、ハッシュのみを保存するため、最も安価なオプションです。
- **コレクション更新権限は署名者である必要があります。** Candy Machineがコレクション上の検証済みデリゲートとして承認されるために、コレクション更新権限が作成トランザクションに署名する必要があります。
- **擬似ランダムミント順序は暗号学的に安全ではありません。** Config Line Settingsで`isSequential`が`false`に設定されている場合、ミント順序はシャッフルされますが、十分なリソースで予測または影響を与えることができます。予測不可能性が重要な場合はリビールメカニズム付きのHidden Settingsを使用してください。
- **このページはCore Candy Machineを扱い、レガシーCandy Machine V3ではありません。** Core Candy Machineは[Core](/ja/smart-contracts/core)アセットをミントします。Metaplex Token Metadata NFTのミントについては、代わりに[Candy Machine V3](/ja/smart-contracts/candy-machine)を参照してください。

## FAQ

### Config Line SettingsとHidden Settingsの違いは何ですか？

[Config Line Settings](#config-line-settingsフィールド)はプレフィックス圧縮を使用して個別のアセット名とURIをオンチェーンに保存し、レントを削減します。[Hidden Settings](#hidden-settingsフィールド)はすべてのバイヤーに同一のプレースホルダーアセットをミントし、後日リビールメカニズムを可能にします。一方のみがCandy Machineで使用可能で、相互に排他的です。

### Core Candy Machineの作成にはどれくらいのコストがかかりますか？

レントコストはアイテム数と選択したストレージモードによって異なります。短いプレフィックスを使用したConfig Line Settingsは、繰り返しのプレフィックスを一度だけ保存するため、レントを大幅に削減します。Hidden Settingsは、Candy Machineが保持するアイテム数に関係なく、単一の名前、URI、SHA-256ハッシュのみを保存するため、最も安価です。

### Core Candy Machineの作成後にガードを追加できますか？

はい。別のCandy Guardアカウントを作成し、既存のCore Candy Machineのミント権限としていつでも設定できます。また、便宜上`create`命令で直接[ガード](/ja/smart-contracts/core-candy-machine/guards)を渡すこともできます。

### Candy Machineを作成する前に既存のCoreコレクションが必要ですか？

はい。`create`命令には[Coreコレクション](/ja/smart-contracts/core/collections#creating-a-collection)アドレスが必要です。コレクション更新権限がトランザクションに署名して、Candy Machineがミントされたアセットをコレクションに追加する検証済みデリゲートとして登録できるようにする必要があります。

### Config Line SettingsでisSequentialをfalseに設定するとどうなりますか？

Candy Machineはインデックス順ではなく擬似ランダムな順序でアセットをミントします。このランダム性は暗号学的に安全ではなく、十分なリソースで影響を与えることができます。予測不可能性が重要な場合は、代わりにリビールメカニズム付きの[Hidden Settings](#hidden-settingsフィールド)を使用してください。
