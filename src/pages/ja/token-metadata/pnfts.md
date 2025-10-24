---
title: プログラマブルNFT（pNFT）
metaTitle: プログラマブルNFT（pNFT）| Token Metadata
description: Token MetadataのプログラマブルNFT（pNFT）について詳しく学習します
---

[概要ページ](/ja/token-metadata#pnfts)で述べられているように、プログラマブルNFT（pNFT）は、作成者が特定の操作にカスタムルールを定義し、サードパーティの権限により細かく委任できる新しいアセット標準です。 {% .lead %}

## Token Metadataのバイパスの廃止

Token MetadataプログラムはSPL Tokenプログラムの上に構築されているため、任意の所有者またはspl-token委任がSPL Tokenプログラムと直接やり取りし、転送やバーンなどの重要な操作でToken Metadataプログラムをバイパスできます。これはプログラム間の優れた構成可能性パターンを作成しますが、Token Metadataプログラムが作成者の代わりにルールを強制できないことも意味します。

これが問題となる良い例は、Token Metadataがセカンダリセールのロイヤルティを強制できないことです。ロイヤルティの割合が**Metadata**アカウントに保存されていても、転送を実行するユーザーまたはプログラムがそれを尊重するかどうかを決定するのは彼ら次第です。これについて、およびpNFTがこの問題をどのように解決するかについては、[以下のセクション](#use-case-royalty-enforcement)で詳しく説明します。

プログラマブルNFTは、**作成者がアセットの認証層をカスタマイズできる**柔軟な方法でこの問題を解決するために導入されました。

プログラマブルNFTは以下のように動作します：

- **pNFTのTokenアカウントは、pNFTが委任されているかどうかに関係なく、SPL Tokenプログラムで常にフリーズされています**。これにより、誰もSPL Tokenプログラムと直接やり取りしてToken Metadataプログラムをバイパスできないことが保証されます。
- pNFTのTokenアカウントで操作が実行されるたびに、Token Metadataプログラムは**アカウントを解凍し、操作を実行し、再度アカウントをフリーズします**。これはすべて同じ命令で**アトミック**に発生します。このようにして、SPL Tokenプログラムで実行可能なすべての操作はpNFTでも利用できますが、常にToken Metadataプログラムを通じて実行されます。
- [Token委任](/ja/token-metadata/delegates#token-delegates)がpNFTに設定されると、情報は**Token Record**アカウントに保存されます。pNFTはSPL Tokenプログラムで常にフリーズされているため、pNFTが実際にロックされているかどうかを追跡するのはToken Recordアカウントの責任です。
- pNFTに影響を与えるすべての単一操作がToken Metadataプログラムを通過する必要があるため、これらの操作に認証ルールを強制できるボトルネックが作成されました。これらのルールは、**Token Auth Rules**プログラムによって管理される**Rule Set**アカウントで定義されます。

本質的に、これによりpNFTは以下の能力を持ちます：

1. より細かい委任を持つ。
2. あらゆる操作にルールを強制する。

これら2つの能力についてより詳しく見てみましょう。

## より細かい委任

すべてのpNFT操作がToken Metadataプログラムを通過する必要があるため、spl-token委任の上に新しい委任システムを作成できます。これはより細かく、pNFT所有者がサードパーティに委任したい操作を選択できるようにします。

この新しい委任システムの情報は、pNFTのMintアカウントとTokenアカウントの両方から派生する特別な**Token Record** PDAに保存されます。新しい委任権限がpNFTに割り当てられると、Token MetadataプログラムはTokenアカウントとToken Recordアカウントの両方でその情報を同期します。

これらの委任については、[委任された権限ページの「Token委任」セクション](/ja/token-metadata/delegates#token-delegates)でより詳しく説明します。

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node #token-wrapper x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% /node %}

{% node #mint-wrapper x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint" x="0" y="120" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = TokenRecord" /%}
{% node label="Bump" /%}
{% node label="State" /%}
{% node label="Rule Set Revision" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Delegate Role" /%}
{% node label="Locked Transfer" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="token-wrapper" to="token-record-pda" /%}
{% edge from="mint-wrapper" to="token-record-pda" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

## 追加アカウント

pNFTはほとんどの操作で追加のアカウントを必要とし、これらには`tokenRecord`、`authorizationRules`、`authorizationRulesProgram`が含まれます。

### Token Record

`tokenRecord`アカウントは、`delegates`やその`lock`状態などのトークンとその状態に関する詳細を保持する責任があります。

`tokenRecord`アカウントにアクセスする方法がいくつかあり、それはmetadata、token account、token recordを含む必要なすべてのアカウントを返す`fetchDigitalAssetWithAssociatedToken`を使用するか、`findTokenRecordPda`関数を使用してmint IDとtoken accountアドレスでtoken record PDAアドレスを生成する方法です。

#### アセットとトークン

`fetchDigitalAssetWithAssociatedToken`関数を使用してすべてのアカウントを取得できます。これはpNFT metadataアカウント、token account、token recordアカウントなどのデータを返します。

```ts
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
    // Umiインスタンス
    umi,
    // Mint ID
    publicKey("11111111111111111111111111111111"),
    // 所有者
    publicKey("22222222222222222222222222222222")
);
```

#### Token Record PDA

代替として、`findTokenRecordPda`関数を使用してtoken record PDAを生成できます：

```ts
import { findTokenRecordPda } from '@metaplex-foundation/mpl-token-metadata'

const tokenRecord = findTokenRecordPda(umi, {
    mint: publicKey("11111111111111111111111111111111"),
    token: tokenAccountPublicKey,
})
```

## pNFTの作成

プログラマブルNFTを作成するには、`tokenStandard`を`ProgrammableNonFungible`に設定します：

{% dialect-switcher title="Create a pNFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { 
    generateSigner,
    percentAmount 
} from '@metaplex-foundation/umi'
import { 
    createV1,
    TokenStandard 
} from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createV1(umi, {
  mint,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-pnft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 使用例：ロイヤルティの強制

pNFTの主要な使用例の1つは、セカンダリセールでのロイヤルティの強制です。pNFTでは、すべての転送がToken Metadataプログラムを通過する必要があるため、作成者はロイヤルティ支払いを強制するルールを設定できます：

```ts
// ロイヤルティを強制するルールセットを持つpNFTを作成
await createV1(umi, {
  mint,
  name: 'Royalty Enforced NFT',
  uri: 'https://example.com/royalty-nft.json',
  sellerFeeBasisPoints: percentAmount(10), // 10%ロイヤルティ
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  ruleSet: royaltyRuleSet, // ロイヤルティを強制するルールセット
}).sendAndConfirm(umi)
```

これにより、pNFTが転送されるたびに、ロイヤルティが適切に支払われることが保証されます。