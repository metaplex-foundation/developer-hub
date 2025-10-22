---
title: キャンディマシン管理
metaTitle: 作成、更新、取得、削除 | キャンディマシン
description: キャンディマシンの管理方法を説明します。
---

[前のページ](/ja/candy-machine/settings)では、キャンディマシンのさまざまな設定について説明しました。今度は、これらの設定を使用してキャンディマシンを作成・更新する方法を見てみましょう。また、既存のキャンディマシンを取得する方法と、その目的を果たした後に削除する方法についても話します。 {% .lead %}

基本的に、キャンディマシンの作成、読み取り、更新、削除のステップを説明します。さあ始めましょう！

## キャンディマシンの作成

前のページで説明した設定を使用して、真新しいキャンディマシンアカウントを作成できます。

SDKはこれをさらに推し進め、すべての新しいキャンディマシンアカウントを、ミントプロセスに影響を与えるすべてのアクティブなガードを追跡する新しいキャンディガードアカウントと関連付けます。このページではキャンディマシンアカウントに焦点を当てますが、キャンディガードアカウントとそれで何ができるかについては[専用ページ](/ja/candy-machine/guards)で詳しく説明します。

キャンディマシンは[コレクションNFTと関連付けられる必要があり](/ja/candy-machine/settings#metaplex-certified-collections)、その更新権限がこの操作を承認する必要があることを覚えておいてください。キャンディマシン用のコレクションNFTをまだ持っていない場合、SDKがそれも支援できます。

{% callout type="note" title="ランダム性" %}

アセットの「ランダム」ミントプロセスは完全に予測不可能ではなく、十分なリソースと悪意のある意図によって影響を受ける可能性があるため、リビール機能には[隠し設定](/ja/candy-machine/settings#hidden-settings)を利用することが推奨される場合があります。

{% /callout %}

{% dialect-switcher title="キャンディマシンの作成" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリを使用して、真新しいコレクションNFTでキャンディマシンを作成する方法は次のとおりです。

```ts
import {
  createNft,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'
import { create } from '@metaplex-foundation/mpl-candy-machine'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'

// コレクションNFTを作成します。
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: umi.identity,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
    collectionDetails: {
    __kind: 'V1',
    size: 0,
  },
}).sendAndConfirm(umi)

// キャンディマシンを作成します。
const candyMachine = generateSigner(umi)
await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  itemsAvailable: 5000,
  creators: [
    {
      address: umi.identity.publicKey,
      verified: true,
      percentageShare: 100,
    },
  ],
  configLineSettings: some({
    prefixName: '',
    nameLength: 32,
    prefixUri: '',
    uriLength: 200,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

上記で述べたように、この操作は作成されたキャンディマシンと新しいキャンディガードアカウントの作成と関連付けも処理します。これは、キャンディガードのないキャンディマシンはあまり有用ではなく、ほとんどの場合それを行いたいからです。それでも、この動作を無効にしたい場合は、代わりに`createCandyMachineV2`メソッドを使用できます。

```tsx
import { createCandyMachineV2 } from '@metaplex-foundation/mpl-candy-machine'

await createCandyMachineV2(umi, {
  // ...
}).sendAndConfirm(umi)
```

これらの例では、必須のパラメーターのみに焦点を当てましたが、この`create`関数で何ができるかを確認するために、以下のAPIリファレンスをチェックしたいかもしれません。

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [createCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyMachineV2.html)。

{% /dialect %}
{% /dialect-switcher %}

## キャンディマシンアカウント

キャンディマシンアカウントを作成したので、その中にどのようなデータが格納されているかを見てみましょう。

まず、アカウントが作成されたときに提供されたすべての設定を格納し、変更を追跡します。これらの設定の詳細については、[前のページ](/ja/candy-machine/settings)を参照してください。

さらに、以下の属性を格納します：

- **引き換え済みアイテム**。これは、キャンディマシンからミントされたNFTの数を追跡します。この数が0から1になるとすぐに、ほとんどの設定は更新不可能になることに注意してください。
- **アカウントバージョン**。この列挙型は、キャンディマシンのアカウントバージョンを追跡するために使用されます。利用可能な機能とアカウントの解釈方法を決定するために使用されます。これは、キャンディマシンプログラム（キャンディマシンコアとキャンディガードプログラムを含む）の第3回目で最新の反復を指す「キャンディマシンV3」と混同しないでください。
- **機能フラグ**。これは、より多くの機能が導入される際の後方・前方互換性でプログラムを支援します。

最後に、キャンディマシンに挿入されたすべてのアイテムと、それらがミントされたかどうかを格納します。これは[**隠し設定**](/ja/candy-machine/settings#hidden-settings)ではアイテムを挿入できないため、[**コンフィグライン設定**](/ja/candy-machine/settings#config-line-settings)を使用するキャンディマシンにのみ適用されます。このセクションには以下の情報が含まれます：

- 読み込まれたアイテムの数。
- 挿入された、または挿入される予定のすべてのアイテムのリスト。アイテムがまだ挿入されていない場合、その位置のアイテムの名前とURIは空です。
- どのアイテムが読み込まれたかを追跡するビットマップ — はいまたはいいえのリスト。このビットマップがすべてはいで満たされると、すべてのアイテムが読み込まれました。
- ランダム順序でミントする際にまだミントされていないすべてのアイテムのリスト。これにより、プログラムは既にミントされたインデックスを選択してやり直すことを心配せずに、ランダムにインデックスを取得できます。

この最後のセクションは意図的にプログラム上で逆シリアル化されませんが、SDKがすべてのデータを人間に優しい形式で解析します。

キャンディマシンアカウントの詳細な情報については、[プログラムのAPIリファレンス](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core#account)をご確認ください。

{% dialect-switcher title="キャンディマシンアカウント内部" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリでキャンディマシンがどのようにモデル化されているかを確認する最良の方法は、[`CandyMachine`アカウントのAPIリファレンス](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyMachine.html)をチェックすることです。`create`関数を使用する際に各キャンディマシンに対して自動的に作成されるため、[`candyGuard`アカウントのAPIリファレンス](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html)もチェックしたいかもしれません。

キャンディマシンの属性の一部を紹介する小さなコード例です。

```tsx
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

candyMachine.publicKey // キャンディマシンアカウントの公開鍵。
candyMachine.mintAuthority // キャンディマシンのミント権限、ほとんどの場合キャンディガードアドレス。
candyMachine.data.itemsAvailable // 利用可能なNFTの総数。
candyMachine.itemsRedeemed // ミントされたNFTの数。
candyMachine.items[0].index // 最初に読み込まれたアイテムのインデックス。
candyMachine.items[0].name // 最初に読み込まれたアイテムの名前（プレフィックス付き）。
candyMachine.items[0].uri // 最初に読み込まれたアイテムのURI（プレフィックス付き）。
candyMachine.items[0].minted // 最初のアイテムがミントされたかどうか。
```

{% /dialect %}
{% /dialect-switcher %}

## キャンディマシンの取得

既存のキャンディマシンを取得するには、そのアドレスを提供するだけで、SDKがアカウントデータの解析を処理します。

{% dialect-switcher title="キャンディマシンの取得" %}
{% dialect title="JavaScript" id="js" %}

アドレスとその関連するキャンディガードアカウント（ある場合）を使用してキャンディマシンを取得する方法です。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, publicKey('...'))
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
```

APIリファレンス: [fetchCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyMachine.html), [fetchCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyGuard.html)。

{% /dialect %}
{% /dialect-switcher %}

## 権限の更新

キャンディマシンが作成されると、キャンディマシンの権限である限り、後でほとんどの設定を更新できます。次のいくつかのセクションでこれらの設定を更新する方法を見ますが、まず、キャンディマシンの**権限**と**ミント権限**を更新する方法を見てみましょう。

- 権限を更新するには、現在の権限を署名者として渡し、新しい権限のアドレスを渡す必要があります。
- ミント権限を更新するには、現在の権限と新しいミント権限の両方を署名者として渡す必要があります。これは、ミント権限が主にキャンディガードをキャンディマシンと関連付けるために使用されるためです。ミント権限を署名者にすることで、他の誰かのキャンディガードを使用することを防ぎます。これは元のキャンディマシンに副作用を生じさせる可能性があるからです。

{% dialect-switcher title="キャンディマシンの権限更新" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリを使用してキャンディマシンの権限を更新する方法です。ほとんどの場合、関連するキャンディガードアカウントの権限も更新したいでしょう。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import {
  setCandyMachineAuthority,
  setCandyGuardAuthority,
} from '@metaplex-foundation/mpl-candy-machine'

const newAuthority = generateSigner(umi)
await setCandyMachineAuthority(umi, {
  candyMachine: candyMachine.publicKey,
  authority: currentAuthority,
  newAuthority: newAuthority.publicKey,
})
  .add(
    setCandyGuardAuthority(umi, {
      candyGuard: candyMachine.mintAuthority,
      authority: currentAuthority,
      newAuthority: newAuthority.publicKey,
    })
  )
  .sendAndConfirm(umi)
```

関連するキャンディガードアカウントを上書きするため、`mintAuthority`を直接更新したいことはおそらくないでしょうが、その方法は次のとおりです。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { setMintAuthority } from '@metaplex-foundation/mpl-candy-machine'

const newMintAuthority = generateSigner(umi)
await setMintAuthority(umi, {
  candyMachine: candyMachine.publicKey,
  authority: currentAuthority,
  mintAuthority: newMintAuthority,
}).sendAndConfirm(umi)
```

APIリファレンス: [setCandyMachineAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCandyMachineAuthority.html), [setCandyGuardAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCandyGuardAuthority.html), [setMintAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setMintAuthority.html)。

{% /dialect %}
{% /dialect-switcher %}

## 共有NFTデータの更新

キャンディマシンのすべてのミントされたNFT間で共有される属性も更新できます。[前のページ](/ja/candy-machine/settings#settings-shared-by-all-nf-ts)で述べたように、これらは：売り手手数料基準点数、シンボル、最大エディション供給量、可変性、クリエイターです。

最初のNFTがミントされると、これらの属性は更新できなくなることに注意してください。

{% dialect-switcher title="キャンディマシンのNFTデータ更新" %}
{% dialect title="JavaScript" id="js" %}

キャンディマシンの共有NFTデータの一部を更新する例です。

```tsx
import { percentAmount } from '@metaplex-foundation/umi'
import {
  updateCandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
await updateCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
  data: {
    ...candyMachine.data,
    symbol: 'NEW',
    sellerFeeBasisPoints: percentAmount(5.5, 2),
    creators: [{ address: newCreator, verified: false, percentageShare: 100 }],
  },
}).sendAndConfirm(umi)
```

APIリファレンス: [updateCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyMachine.html)。

{% /dialect %}
{% /dialect-switcher %}

## トークン標準の更新

「トークン標準の設定」命令を使用して、キャンディマシンのトークン標準とルールセット属性も更新できます。これにより、通常のNFTからプログラム可能NFTに切り替えたり、その逆を行ったりできます。プログラム可能NFTに切り替える際、ミントされたNFTが順守すべきルールセットをオプションで指定または更新できます。

キャンディマシンが古いアカウントバージョンを使用している場合、この命令は通常のNFTとプログラム可能NFTをサポートする最新のアカウントバージョンに自動的にアップグレードすることに注意してください。アップグレード後は、キャンディマシンまたはキャンディガードからミントするために最新の命令を使用する必要があります。

{% dialect-switcher title="キャンディマシンのトークン標準更新" %}
{% dialect title="JavaScript" id="js" %}

Umiを使用してキャンディマシンのトークン標準とルールセットを更新する例です。

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setTokenStandard } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  ruleSet: newRuleSetAccount,
}).sendAndConfirm(umi)
```

キャンディマシンがアカウントバージョン`V1`を使用している場合、レガシーコレクション委譲権限記録アカウントを使用するため、明示的に`collectionAuthorityRecord`アカウントを設定する必要があることに注意してください。

```ts
import { findCollectionAuthorityRecordPda } from '@metaplex-foundation/mpl-token-metadata'
import { findCandyMachineAuthorityPda } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  // ...
  collectionAuthorityRecord: findCollectionAuthorityRecordPda(umi, {
    mint: candyMachine.collectionMint,
    collectionAuthority: findCandyMachineAuthorityPda(umi, {
      candyMachine: candyMachine.publicKey,
    }),
  }),
}).sendAndConfirm(umi)
```

APIリファレンス: [setTokenStandard](https://mpl-candy-machine.typedoc.metaplex.com/functions/setTokenStandard.html)。

{% /dialect %}
{% /dialect-switcher %}

## コレクションの更新

キャンディマシンに関連付けられたコレクションNFTの変更も可能です。コレクションNFTのミントアカウントのアドレスと、この変更を承認するための署名者としての更新権限を提供する必要があります。

ここでも、最初のNFTがミントされると、コレクションは変更できないことに注意してください。

{% dialect-switcher title="キャンディマシンのコレクション更新" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリを使用してキャンディマシンのコレクションNFTを更新するには、以下のように`setCollectionV2`メソッドを使用できます。

```ts
await setCollectionV2(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
  newCollectionMint: newCollectionMint.publicKey,
  newCollectionUpdateAuthority,
}).sendAndConfirm(umi)
```

キャンディマシンがアカウントバージョン`V1`を使用している場合、レガシーコレクション委譲権限記録アカウントを使用するため、明示的に`collectionDelegateRecord`アカウントを設定する必要があることに注意してください。

```ts
import { findCollectionAuthorityRecordPda } from '@metaplex-foundation/mpl-token-metadata'
import { findCandyMachineAuthorityPda } from '@metaplex-foundation/mpl-candy-machine'

await setCollectionV2(umi, {
  // ...
  collectionDelegateRecord: findCollectionAuthorityRecordPda(umi, {
    mint: candyMachine.collectionMint,
    collectionAuthority: findCandyMachineAuthorityPda(umi, {
      candyMachine: candyMachine.publicKey,
    }),
  }),
}).sendAndConfirm(umi)
```

APIリファレンス: [setCollectionV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCollectionV2.html)。

{% /dialect %}
{% /dialect-switcher %}

## アイテム設定の更新

キャンディマシンのアイテム設定も更新できますが、いくつかの制限があります。

- **コンフィグライン設定**と**隠し設定**を交換するようなアイテム設定の更新はできません。ただし、モードを交換していない場合、これらの設定内のプロパティは更新できます。
- **コンフィグライン設定**を使用する場合：
  - **利用可能アイテム**属性は更新できません。
  - **名前長**と**URI長**プロパティは、プログラムが更新中にキャンディマシンアカウントのサイズを変更しないため、より小さい値にのみ更新できます。
- 最初のNFTがミントされると、これらの設定は更新できなくなります。

{% dialect-switcher title="キャンディマシンのアイテム設定更新" %}
{% dialect title="JavaScript" id="js" %}

以下の例は、Umiライブラリを使用してキャンディマシンのコンフィグライン設定を更新する方法を示しています。隠し設定と利用可能アイテム属性（隠し設定を使用する場合）でも同じことができます。

```ts
import {
  updateCandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
await updateCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
  data: {
    ...candyMachine.data,
    hiddenSettings: none(),
    configLineSettings: some({
      type: 'configLines',
      prefixName: 'My New NFT #$ID+1$',
      nameLength: 0,
      prefixUri: 'https://arweave.net/',
      uriLength: 43,
      isSequential: true,
    }),
  },
}).sendAndConfirm(umi)
```

APIリファレンス: [updateCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyMachine.html)。

{% /dialect %}
{% /dialect-switcher %}

## キャンディマシンの削除

キャンディマシンが完全にミントされると、その目的を果たし、安全に処分できます。これにより、作成者はキャンディマシンアカウントのストレージコストを取り戻し、オプションでキャンディガードアカウントも取り戻すことができます。

{% dialect-switcher title="キャンディマシンの削除" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリを使用してキャンディマシンアカウントおよび/またはその関連するキャンディガードアカウントを削除できます。

```ts
import {
  deleteCandyMachine,
  deleteCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

await deleteCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
}).sendAndConfirm(umi)

await deleteCandyGuard(umi, {
  candyGuard: candyMachine.mintAuthority,
}).sendAndConfirm(umi)
```

APIリファレンス: [deleteCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/deleteCandyMachine.html), [deleteCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/deleteCandyGuard.html)。

{% /dialect %}
{% /dialect-switcher %}

## まとめ

キャンディマシンの作成、読み取り、更新、削除ができるようになりましたが、まだアイテムを読み込む方法を知りません。[次のページ](/ja/candy-machine/insert-items)でこれに取り組みましょう！