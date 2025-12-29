---
title: キャンディマシン設定
metaTitle: 設定 | キャンディマシン
description: キャンディマシン設定について詳細に説明します。
---

このページでは、キャンディマシンで利用可能なすべての設定について詳しく説明します。キャンディマシン自体とそれが生成するNFTに影響を与える設定に焦点を当てます。ガードと呼ばれるミントプロセスに影響を与える設定については後述します。専用のページで扱います。 {% .lead %}

## 権限

Solanaでアカウントを作成する際の最も重要な情報の1つは、それらを管理することが許可されたウォレットで、**権限**として知られています。したがって、新しいキャンディマシンを作成する際、後でそれを更新し、アイテムを挿入し、削除するなどができる権限のアドレスを提供する必要があります。

ミントプロセス専用の追加権限があり、**ミント権限**と呼ばれます。キャンディマシンがキャンディガードなしで作成された場合、この権限はキャンディマシンからミントすることが許可された唯一のウォレットです。他の誰もミントできません。しかし、実際には、このミント権限は、**ガード**として知られる事前設定されたルールセットに基づいてミントプロセスを制御するキャンディガードのアドレスに設定されます。

SDKを使用する際、キャンディマシンは常にデフォルトで関連するキャンディガードと一緒に作成されるため、このミント権限について心配する必要はないことに注意することが重要です。

{% dialect-switcher title="権限の設定" %}
{% dialect title="JavaScript" id="js" %}

新しいキャンディマシンを作成する際、権限はデフォルトでUmiアイデンティティに設定されます。`authority`プロパティに有効な署名者を提供することで、この権限を明示的に設定できます。

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /dialect %}
{% /dialect-switcher %}

## すべてのNFTで共有される設定

キャンディマシン設定の大部分は、そこからミントされるNFTを定義するために使用されます。これは、NFT属性の多くがすべてのミントされたNFTで同じになるためです。したがって、キャンディマシンにアイテムを読み込むたびにこれらの属性を繰り返す必要がなく、キャンディマシン設定で一度設定します。

ミントされたNFT同士を区別できる唯一の属性は、NFTの**名前**とそのJSONメタデータを指す**URI**であることに注意してください。詳細は[アイテム挿入](/ja/smart-contracts/candy-machine/insert-items)をご覧ください。

以下は、すべてのミントされたNFT間で共有される属性のリストです。

- **売り手手数料基準点数**: ミントされたNFTに設定される二次販売ロイヤリティの基準点数。例えば`250`は`2.50%`のロイヤリティを意味します。
- **シンボル**: ミントされたNFTで使用するシンボル — 例："MYPROJECT"。これは最大10文字のテキストで、空のテキストを提供することでオプションにできます。
- **最大エディション供給量**: ミントされたNFTから印刷できるエディションの最大数。ほとんどのユースケースでは、ミントされたNFTが複数回印刷されることを防ぐために、これを`0`に設定したいでしょう。これを`null`に設定することはできず、キャンディマシンでは無制限エディションはサポートされていません。
- **可変性**: ミントされたNFTが可変であるべきかどうか。特別な理由がない限り、これを`true`に設定することをお勧めします。将来NFTを不可変にすることはできますが、不可変なNFTを再び可変にすることは絶対にできません。
- **クリエイター**: ミントされたNFTに設定されるクリエイターのリスト。アドレスとロイヤリティのパーセント単位での取り分が含まれます — つまり`5`は`5%`です。キャンディマシンアドレスは常にすべてのミントされたNFTの最初のクリエイターとして設定され、自動的に検証されることに注意してください。これにより、NFTが信頼できるキャンディマシンからミントされたことを誰でも検証できます。提供された他のすべてのクリエイターはその後に設定され、これらのクリエイターによって手動で検証される必要があります。
- **トークン標準**: ミントされたNFTで使用する[トークン標準](/ja/smart-contracts/token-metadata/token-standard)。現在のところ、2つのトークン標準のみがサポートされています："[NonFungible](/ja/smart-contracts/token-metadata/token-standard#the-non-fungible-standard)"と"[ProgrammableNonFungible](/ja/smart-contracts/token-metadata/token-standard#the-programmable-non-fungible-standard)"。これは_アカウントバージョン_が2以上のキャンディマシンでのみ利用可能です。
- **ルールセット**: キャンディマシンが"ProgrammableNonFungible"トークン標準を使用する場合、すべてのミントされたプログラム可能NFTに割り当てられる明示的なルールセットを提供できます。ルールセットが提供されない場合、コレクションNFTのルールセット（ある場合）を使用することがデフォルトになります。それ以外の場合、プログラム可能NFTはルールセットなしでミントされます。これは_アカウントバージョン_が2以上のキャンディマシンでのみ利用可能です。

{% dialect-switcher title="共有NFT設定の設定" %}
{% dialect title="JavaScript" id="js" %}

上記でリストされた属性のうち、`sellerFeeBasisPoints`、`creators`、`tokenStandard`属性のみが必須です。他の属性には以下のデフォルト値があります：

- `symbol`は空文字列がデフォルト — つまりミントされたNFTはシンボルを使用しません。
- `maxEditionSupply`はゼロがデフォルト — つまりミントされたNFTは印刷可能ではありません。
- `isMutable`は`true`がデフォルトです。

以下のようにこれらの属性を明示的に提供できます。

```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```

{% /dialect %}
{% /dialect-switcher %}

## Metaplex認定コレクション

各キャンディマシンは[Metaplex認定コレクション（MCC）](/ja/smart-contracts/token-metadata/collections)として知られる特別なNFTと関連付けられる必要があります。この**コレクションNFT**により、ミントされたNFTをグループ化し、その情報をオンチェーンで検証できます。

他の誰もがあなたのコレクションNFTを自分のキャンディマシンで使用できないようにするため、キャンディマシンでコレクションを変更するトランザクションには**コレクションの更新権限**の署名が必要です。その結果、キャンディマシンはすべてのミントされたNFTのコレクションを自動的に安全に検証できます。

{% dialect-switcher title="コレクションNFTの設定" %}
{% dialect title="JavaScript" id="js" %}

新しいキャンディマシンを作成する際、またはそのコレクションNFTを更新する際、以下の属性を提供する必要があります：

- `collectionMint`: コレクションNFTのミントアカウントのアドレス。
- `collectionUpdateAuthority`: コレクションNFTの更新権限を署名者として。

以下は例です。

```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// コレクションNFTを作成します。
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
    collectionDetails: {
    __kind: 'V1',
    size: 0,
  },
}).sendAndConfirm(umi)

// 設定でコレクションアドレスとその権限を渡します。
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```

{% /dialect %}
{% /dialect-switcher %}

## アイテム設定

キャンディマシン設定には、その中に読み込まれた、または読み込まれる予定のアイテムに関する情報も含まれます。**利用可能アイテム**属性はそのカテゴリに該当し、キャンディマシンからミントされるNFTの最大数を保存します。

{% dialect-switcher title="アイテム数の設定" %}
{% dialect title="JavaScript" id="js" %}

新しいキャンディマシンを作成する際、`itemsAvailable`属性が必須で、数値または大きな整数用のネイティブ`bigint`である可能性があります。

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /dialect %}
{% /dialect-switcher %}

**利用可能アイテム**属性に加えて、他の2つの属性がキャンディマシンでのアイテムの読み込み方法を定義します。これらの属性のうち正確に1つを選択し、もう一方は空のままにする必要があります。これらの属性は：

- **コンフィグライン設定**。
- **隠し設定**。

キャンディマシンがこれら2つのモードのうち1つを使用して作成されると、他のモードを使用するように更新することはできないことに注意してください。さらに、**コンフィグライン設定**が使用される場合、**利用可能アイテム**属性を更新することはもはや不可能です。

両方についてもう少し詳しく見てみましょう。

{% callout type="note" title="ランダム性" %}

アセットの「ランダム」ミントプロセスは完全に予測不可能ではなく、十分なリソースと悪意のある意図によって影響を受ける可能性があるため、リビール機能には[隠し設定](#hidden-settings)を利用することが推奨される場合があります。

{% /callout %}

### コンフィグライン設定

**コンフィグライン設定**属性により、キャンディマシン内に挿入された、または挿入される予定のアイテムを記述できます。アイテムの**名前**と**URI**の正確な長さを提供し、その長さを減らすためにいくつかの共有プレフィックスを提供することで、キャンディマシンのサイズを最小限に抑えることができます。**コンフィグライン設定**属性は以下のプロパティを含むオブジェクトです：

- **名前プレフィックス**: すべての挿入されたアイテムで共有される名前プレフィックス。このプレフィックスは最大32文字です。
- **名前長**: 名前プレフィックスを除いた各挿入アイテムの名前の最大長。
- **URIプレフィックス**: すべての挿入されたアイテムで共有されるURIプレフィックス。このプレフィックスは最大200文字です。
- **URI長**: URIプレフィックスを除いた各挿入アイテムのURIの最大長。
- **シーケンシャル**: NFTを順次 — `true` — またはランダム順 — `false` — でミントするかを示します。購入者が次にどのNFTがミントされるかを予測することを防ぐために、これを`false`に設定することをお勧めします。SDKは新しいキャンディマシンを作成する際、デフォルトでシーケンシャルが`false`に設定されたコンフィグライン設定を使用することに注意してください。

これらの**名前**と**URI**プロパティをよりよく理解するために、例を見てみましょう。以下の特徴を持つキャンディマシンを作成したいとします：

- `1000`アイテムを含む。
- 各アイテムの名前は「My NFT Project #X」で、XはアイテムのインデックスでIから開始。
- 各アイテムのJSONメタデータはArweaveにアップロードされているため、URIは「https://arweave.net/」で始まり、最大43文字の一意の識別子で終わる。

この例では、プレフィックスなしでは以下のようになります：

- 名前長 = 20。「My NFT Project #」で16文字、最高の数字「1000」で4文字。
- URI長 = 63。「https://arweave.net/」で20文字、一意の識別子で43文字。

1000アイテムを挿入する際、アイテム保存だけで合計83,000文字が必要になります。しかし、プレフィックスを使用すれば、キャンディマシンの作成に必要なスペース、そしてブロックチェーンでの作成コストを大幅に削減できます。

- 名前プレフィックス = 「My NFT Project #」
- 名前長 = 4
- URIプレフィックス = 「https://arweave.net/」
- URI長 = 43

1000アイテムで、アイテム保存に必要な文字数は47,000文字のみになります。

しかし、それだけではありません！名前またはURIプレフィックス内で**2つの特別な変数**を使用して、そのサイズをさらに削減できます。これらの変数は：

- `$ID$`: これは0から始まるアイテムのインデックスに置き換えられます。
- `$ID+1$`: これは1から始まるアイテムのインデックスに置き換えられます。

上記の例では、名前プレフィックスに`$ID+1$`変数を活用できるため、すべてのアイテムで挿入する必要がありません。以下のコンフィグライン設定になります：

- 名前プレフィックス = 「My NFT Project #$ID+1$」
- 名前長 = 0
- URIプレフィックス = 「https://arweave.net/」
- URI長 = 43

そうです、**名前長が0になり**、必要な文字数を43,000文字まで削減しました。

{% dialect-switcher title="コンフィグライン設定の設定" %}
{% dialect title="JavaScript" id="js" %}

Umiを使用する際、`some`と`none`ヘルパー関数を使用して、`configLineSettings`と`hiddenSettings`属性を通じてそれぞれコンフィグライン設定または隠し設定を使用するかをライブラリに伝えることができます。これらの設定のうち1つのみを使用する必要があるため、1つを設定し、もう一方は`none()`に設定する必要があります。

以下は、Umiライブラリを使用して上記の例を設定する方法を示すコードスニペットです。

```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+1$',
    nameLength: 0,
    prefixUri: 'https://arweave.net/',
    uriLength: 43,
    isSequential: false,
  }),
}
```

{% /dialect %}
{% /dialect-switcher %}

### 隠し設定

アイテムを準備するもう一つの方法は、**隠し設定**を使用することです。これはコンフィグライン設定とは全く異なるアプローチで、隠し設定を使用する場合、ミントされたすべてのNFTが同じ名前と同じURIを共有するため、キャンディマシンにアイテムを挿入する必要はありません。なぜ誰かがそうしたいのかと疑問に思うかもしれません。その理由は、ミント後にすべてのNFTを公開する**隠蔽・公開NFTドロップ**を作成するためです。これはどのように機能するのでしょうか？

- 最初に、クリエイターが隠し設定を使用してすべてのミントされたNFTの名前とURIを設定します。URIは通常、公開が間もなく起こることを明確にする「ティーザー」JSONメタデータを指します。
- 次に、購入者がすべてのNFTを同じURIで、つまり同じ「ティーザー」JSONメタデータでミントします。
- 最後に、すべてのNFTがミントされた後、クリエイターがミントされたすべてのNFTのURIを、そのNFTに固有の実際のURIを指すように更新します。

最後のステップの問題は、クリエイターがどの購入者がどのNFTを取得するかを操作できることです。これを避け、購入者がNFTとJSONメタデータ間のマッピングが改ざんされていないことを検証できるようにするため、隠し設定には、NFTインデックスと実際のJSONメタデータをマップするファイルの32文字のハッシュで満たすべき**ハッシュ**プロパティが含まれています。これにより、公開後、クリエイターはそのファイルを公開でき、購入者はそのハッシュが隠し設定で提供されたハッシュと対応することを検証できます。

したがって、隠し設定属性には以下のプロパティがあります：

- **名前**: すべてのミントされたNFTの「隠された」名前。これは最大32文字です。
- **URI**: すべてのミントされたNFTの「隠された」URI。これは最大200文字です。
- **ハッシュ**: NFTインデックスと実際のJSONメタデータをマップするファイルの32文字のハッシュで、購入者が改ざんされていないことを検証できます。

コンフィグライン設定のプレフィックスと同様に、隠し設定の**名前**と**URI**に特別な変数を使用できることに注意してください。思い出させるために、これらの変数は：

- `$ID$`: これは0から始まるミントされたNFTのインデックスに置き換えられます。
- `$ID+1$`: これは1から始まるミントされたNFTのインデックスに置き換えられます。

また、キャンディマシンにアイテムを挿入していないため、隠し設定により非常に大規模なドロップを作成することが可能になることに注意してください。唯一の注意点は、ミント後に各NFTの名前とURIを更新するオフチェーンプロセスが必要なことです。

{% dialect-switcher title="隠し設定の設定" %}
{% dialect title="JavaScript" id="js" %}


ハッシュを計算するために、以下の関数を使用できます：

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

Umiを使用する際、`some`と`none`ヘルパー関数を使用して、`configLineSettings`と`hiddenSettings`属性を通じてそれぞれコンフィグライン設定または隠し設定を使用するかをライブラリに伝えることができます。これらの設定のうち1つのみを使用する必要があるため、1つを設定し、もう一方は`none()`に設定する必要があります。

以下は、Umiライブラリを使用して上記の例を設定する方法を示すコードスニペットです。

```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  configLineSettings: none(),
  hiddenSettings: some({
    name: 'My NFT Project #$ID+1$',
    uri: 'https://example.com/path/to/teaser.json',
    hash: hashOfTheFileThatMapsUris,
  }),
}
```

{% /dialect %}
{% /dialect-switcher %}

## ガードとグループ

はじめにで述べたように、このページは主要なキャンディマシン設定に焦点を当てていますが、ガードを使用してキャンディマシンでさらに多くの設定ができます。

これは説明すべき多くの利用可能なデフォルトガードがある広範な主題であるため、このドキュメントの全セクションを割いています。最適な開始場所は[キャンディガード](/ja/smart-contracts/candy-machine/guards)ページです。

## まとめ

主要なキャンディマシン設定について理解したので、[次のページ](/ja/smart-contracts/candy-machine/manage)では、それらを使用して独自のキャンディマシンを作成・更新する方法を見ていきます。