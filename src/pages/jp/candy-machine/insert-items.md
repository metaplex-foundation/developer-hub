---
title: アイテム挿入
metaTitle: アイテム挿入 | キャンディマシン
description: キャンディマシンにアイテムを読み込む方法を説明します。
---

これまでキャンディマシンの作成と設定について学びましたが、その中にNFTにミントできるアイテムを挿入する方法はまだ見ていません。では、このページでそれに取り組みましょう。 {% .lead %}

**アイテム挿入は[コンフィグライン設定](/jp/candy-machine/settings#config-line-settings)を使用するキャンディマシンにのみ適用される**ことを覚えておくことが重要です。これは、[隠し設定](/jp/candy-machine/settings#hidden-settings)を使用するキャンディマシンからミントされたNFTはすべて同じ「隠された」名前とURIを共有するためです。

## JSONメタデータのアップロード

キャンディマシンにアイテムを挿入するには、各アイテムに対して以下の2つのパラメーターが必要です：

- その**名前**: このアイテムからミントされるNFTの名前。コンフィグライン設定で名前プレフィックスが提供された場合、そのプレフィックスの後に続く名前の部分のみを提供する必要があります。
- その**URI**: このアイテムからミントされるNFTのJSONメタデータを指すURI。ここでも、コンフィグライン設定で提供されたURIプレフィックスは除外されます。

アイテムのURIがない場合、まずJSONメタデータを一つずつアップロードする必要があります。これは、AWSや独自のサーバーなどのオフチェーンソリューション、またはArweaveやIPFSなどのオンチェーンソリューションを使用して行えます。

この[Githubリポジトリ](https://github.com/metaplex-foundation/example-candy-machine-assets)でテスト用のサンプルアセットを見つけることができます。

幸いなことに、SDKがこれを支援してくれます。JSONオブジェクトをアップロードし、そのURIを取得できます。

さらに、[Sugar](/jp/candy-machine/sugar)などのツールは、並列アップロード、プロセスのキャッシュ、失敗したアップロードの再試行により、JSONメタデータのアップロードを簡単にします。

{% dialect-switcher title="アイテムのアップロード" %}
{% dialect title="JavaScript" id="js" %}

Umiには、選択したストレージプロバイダーにJSONデータをアップロードするために使用できる`uploader`インターフェースが付属しています。例えば、アップローダーインターフェースのNFT.Storage実装を選択する方法は次のとおりです。

```ts
import { nftStorage } from '@metaplex-foundation/umi-uploader-nft-storage'
umi.use(nftStorageUploader({ token: 'YOUR_API_TOKEN' }))
```

その後、`uploader`インターフェースの`upload`および`uploadJson`メソッドを使用して、アセットとそのJSONメタデータをアップロードできます。

```ts
import { createGenericFileFromBrowserFile } from '@metaplex-foundation/umi'

// アセットをアップロードします。
const file = await createGenericFileFromBrowserFile(event.target.files[0])
const [fileUri] = await umi.uploader.upload([file])

// JSONメタデータをアップロードします。
const uri = await umi.uploader.uploadJson({
  name: 'My NFT #1',
  description: 'My description',
  image: fileUri,
})
```

APIリファレンス: [UploaderInterface](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html), [createGenericFileFromBrowserFile](https://umi.typedoc.metaplex.com/functions/umi.createGenericFileFromBrowserFile.html)。

{% /dialect %}
{% /dialect-switcher %}

## アイテム挿入

すべてのアイテムの名前とURIが揃ったので、あとはそれらをキャンディマシンアカウントに挿入するだけです。

これはプロセスの重要な部分で、コンフィグライン設定を使用する際、**すべてのアイテムが挿入されるまでミントは許可されません**。

挿入された各アイテムの名前とURIは、それぞれコンフィグライン設定の**名前長**と**URI長**属性によって制約されることに注意してください。

さらに、トランザクションは一定のサイズに制限されているため、同じトランザクション内で数千のアイテムを挿入することはできません。トランザクションごとに挿入できるアイテム数は、コンフィグライン設定で定義された**名前長**と**URI長**属性によって異なります。名前とURIが短いほど、トランザクションにより多く収めることができます。

{% dialect-switcher title="コンフィグライン追加" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリを使用する際、`addConfigLines`関数を使用してキャンディマシンにアイテムを挿入できます。追加するコンフィグラインと、それらを挿入するインデックスが必要です。

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

現在読み込まれたアイテムの最後にアイテムを単純に追加するには、以下のようにインデックスとして`candyMachine.itemsLoaded`プロパティを使用できます。

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

APIリファレンス: [addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## プレフィックスを使用したアイテム挿入

名前および/またはURIプレフィックスを使用する際、それらの後に続く部分のみを挿入する必要があります。

プレフィックスを使用すると名前長とURI長を大幅に削減できるため、トランザクションごとにより多くのアイテムを収めるのに役立ちます。

{% dialect-switcher title="指定されたインデックスからのコンフィグライン追加" %}
{% dialect title="JavaScript" id="js" %}

プレフィックスを使用するキャンディマシンにコンフィグラインを追加する際、`addConfigLines`関数を使用して、プレフィックスの後に続く名前とURIの部分のみを提供できます。

例えば、以下のコンフィグライン設定を持つキャンディマシンがあったとします。

```ts
await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 4,
    prefixUri: 'https://example.com/nft',
    uriLength: 9,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

その場合、以下のようにコンフィグラインを挿入できます。

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

APIリファレンス: [addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 既存アイテムの上書き

アイテムを挿入する際、これらのアイテムを挿入する位置を提供できます。これにより、好きな順序でアイテムを挿入できるだけでなく、既に挿入されたアイテムを更新することも可能になります。

{% dialect-switcher title="コンフィグラインの上書き" %}
{% dialect title="JavaScript" id="js" %}

以下の例は、3つのアイテムを挿入し、その後で2番目に挿入されたアイテムを更新する方法を示しています。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My NFT #1', uri: 'https://example.com/nft1.json' },
    { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
    { name: 'My NFT #3', uri: 'https://example.com/nft3.json' },
  ],
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 1,
  configLines: [{ name: 'My NFT #X', uri: 'https://example.com/nftX.json' }],
}).sendAndConfirm(umi)

candyMachine = await fetchCandyMachine(candyMachine.publicKey)
candyMachine.items[0].name // "My NFT #1"
candyMachine.items[1].name // "My NFT #X"
candyMachine.items[2].name // "My NFT #3"
```

APIリファレンス: [addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## まとめ

これで、NFTをミントする準備が整ったキャンディマシンができました！しかし、ミントプロセスの要件はまだ作成していません。ミントの価格を設定するにはどうすればよいでしょうか？購入者が特定のトークンまたは特定のコレクションのNFTの保有者であることを確保するにはどうすればよいでしょうか？ミントの開始日を設定するにはどうすればよいでしょうか？終了条件についてはどうでしょうか？

[次のページ](/jp/candy-machine/guards)では、これらすべてを可能にするキャンディガードについて話します。