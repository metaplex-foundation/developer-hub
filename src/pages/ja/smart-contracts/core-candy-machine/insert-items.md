---
title: アイテムの挿入
metaTitle: アイテムの挿入 | Core Candy Machine
description: Core Candy MachineにCore NFTアセットを読み込む方法。
---

すべてのアイテムの名前とURIが用意できたので、あとはそれらをCore Candy Machineアカウントに挿入するだけです。

これはプロセスの重要な部分であり、Config Line Settingsを使用する場合、**すべてのアイテムが挿入されるまでミントは許可されません**。

挿入された各アイテムの名前とURIは、それぞれConfig Line Settingsの**Name Length**と**URI Length**属性によって制約されることに注意してください。

さらに、トランザクションは特定のサイズに制限されているため、同じトランザクション内で何千ものアイテムを挿入することはできません。トランザクション毎に挿入できるアイテム数は、Config Line Settingsで定義された**Name Length**と**URI Length**属性に依存します。名前とURIが短いほど、より多くのアイテムをトランザクション内に収めることができます。

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

名前やURIプレフィックスを使用する場合、それらの後に来る部分のみを挿入する必要があります。

プレフィックスの使用はName LengthとURI Lengthを大幅に削減できるため、トランザクション毎により多くのアイテムを収めることができることに注意してください。

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

アイテムを挿入する際、これらのアイテムを挿入する位置を指定できます。これにより、任意の順序でアイテムを挿入できるだけでなく、既に挿入されたアイテムを更新することも可能です。

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

## まとめ

これで、アセットをミントする準備が整ったロード済みのCore Candy Machineができました！しかし、まだミントプロセスの要件を作成していません。ミントの価格をどのように設定すればよいでしょうか？購入者が特定のトークンや特定のコレクションからのアセットの保有者であることをどのように確保すればよいでしょうか？ミントの開始日をどのように設定すればよいでしょうか？終了条件についてはどうでしょうか？
