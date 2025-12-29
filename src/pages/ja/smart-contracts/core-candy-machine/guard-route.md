---
title: 特別なガード命令
metaTitle: 特別なガード命令 | Core Candy Machine
description: Core Candy Machineのガード固有の命令を実行する方法を説明します。
---

前のページで見たように、ガードはCandy Machineのミントプロセスをカスタマイズする強力な方法です。しかし、ガードが独自のカスタム命令を提供できることをご存知でしたか？{% .lead %}

## Route命令

Core Candy Guardプログラムには**「Route」命令**と呼ばれる特別な命令が付属しています。

この命令により、Core Candy Machineから**特定のガードを選択**し、そのガードに固有の**カスタム命令を実行**できます。選択されたガードにリクエストをルーティングするため、「Route」命令と呼んでいます。

この機能により、ガードは独自のプログラムロジックを含めることができるため、さらに強力になります。ガードは以下を可能にします：

- 重い操作のために検証プロセスをミントプロセスから分離する。
- カスタムプログラムのデプロイが必要な機能を提供する。

Route命令を呼び出すには、どのガードに命令をルーティングするかを指定し、**そのガードが期待するRoute設定を提供**する必要があります。Route命令をサポートしていないガードを選択してRoute命令を実行しようとすると、トランザクションは失敗することに注意してください。

Candy Guardプログラムで登録されたガードごとに一つの「Route」命令しかあり得ないため、同じガードが提供する複数の機能を区別するために、Route設定で**Path**属性を提供することが一般的です。

例えば、ミントが終了した後にのみ解除できるFrozen NFTのサポートを追加するガードは、Route命令を使用してトレジャリーエスクローアカウントを初期化し、適切な条件の下で誰でもミントされたNFTを解除できるようにすることができます。前者には「init」、後者には「thaw」と等しい**Path**属性を使用してこれら2つの機能を区別できます。

Route命令をサポートする各ガードのRoute命令とその基盤となるパスの詳細な説明は、[それぞれのページ](/ja/smart-contracts/core-candy-machine/guards)で見つけることができます。

例を提供してRoute命令がどのように機能するかを説明してみましょう。[**Allow List**](/ja/smart-contracts/core-candy-machine/guards/allow-list)ガードは、ミントするウォレットが事前設定されたウォレットリストの一部であることを検証するためにRoute命令をサポートしています。

[Merkle Tree](https://en.m.wikipedia.org/wiki/Merkle_tree)を使用してこれを行います。つまり、許可されたウォレットの全リストのハッシュを作成し、そのハッシュ（**Merkle Root**として知られる）をガード設定に保存する必要があります。ウォレットが許可リストに載っていることを証明するには、プログラムがMerkle Rootを計算してガードの設定と一致することを確認できるハッシュのリスト（**Merkle Proof**として知られる）を提供する必要があります。

したがって、Allow Listガードは**指定されたウォレットのMerkle Proofを検証するためにRoute命令を使用**し、成功した場合、ミント命令の検証証明として機能するブロックチェーン上に小さなPDAアカウントを作成します。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Merkle Proofの検証" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

では、なぜミント命令内でMerkle Proofを直接検証できないのでしょうか？それは単に、大きな許可リストの場合、Merkle Proofがかなり長くなる可能性があるためです。特定のサイズ以降、既にかなりの量の命令を含むミントトランザクション内に含めることが不可能になります。検証プロセスをミントプロセスから分離することで、許可リストを必要な大きさにすることが可能になります。

{% dialect-switcher title="ガードのRoute命令の呼び出し" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリを使用してガードのRoute命令を呼び出すために`route`関数を使用できます。`guard`属性を通じてガードの名前を、`routeArgs`属性を通じてそのRoute設定を渡す必要があります。

ミント前にウォレットのMerkle Proofを検証するAllow Listガードを使用した例を示します。

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from '@metaplex-foundation/mpl-core-candy-machine'

// 許可リストを準備します。
// リストの最初のウォレットがMetaplexアイデンティティであると仮定しましょう。
const allowList = [
  'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
  '2vjCrmEFiN9CLLhiqy8u1JPh48av8Zpzp3kNkdTtirYG',
  'AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy',
]
const merkleRoot = getMerkleRoot(allowList)

// Allow Listガード付きCandy Machineを作成します。
await create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot }),
  },
}).sendAndConfirm(umi)

// 今ミントしようとすると、失敗します
// Merkle Proofを検証していないためです。

// Route命令を使用してMerkle Proofを検証します。
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  routeArgs: {
    path: 'proof',
    merkleRoot,
    merkleProof: getMerkleProof(
      allowList,
      'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS'
    ),
  },
}).sendAndConfirm(umi)

// 今ミントしようとすると、成功します。
```

APIリファレンス: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## グループによるRoute命令

ガードグループを使用しながらRoute命令を呼び出す場合、選択したいガードの**グループラベルを指定**することが重要です。これは、異なるグループに同じタイプのガードが複数ある可能性があり、プログラムがRoute命令にどれを使用すべきかを知る必要があるためです。

例えば、一つのグループに厳選されたVIPウォレットの**Allow List**があり、別のグループに抽選の当選者の**Allow List**があるとします。そうすると、Allow ListガードのMerkle Proofを検証したいと言うだけでは不十分で、どのグループに対してその検証を実行すべきかも知る必要があります。

{% dialect-switcher title="Route命令を呼び出す際のグループでのフィルタリング" %}
{% dialect title="JavaScript" id="js" %}

グループを使用する場合、UmiライブラリーShopifyの`route`関数は、選択したいグループのラベルに設定する必要がある`Option<string>`タイプの追加の`group`属性を受け入れます。

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { base58PublicKey, some } from "@metaplex-foundation/umi";

// 許可リストを準備します。
const allowListA = [...];
const allowListB = [...];

// 2つのAllow Listガード付きCandy Machineを作成します。
await create(umi, {
  // ...
  groups: [
    {
      label: "listA",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListA) }),
      },
    },
    {
      label: "listB",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListB) }),
      },
    },
  ],
}).sendAndConfirm(umi);

// 選択するグループを指定してMerkle Proofを検証します。
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  group: some('listA'), // <- 「allowListA」を使用して検証しています。
  routeArgs: {
    path: 'proof',
    merkleRoot: getMerkleRoot(allowListA),
    merkleProof: getMerkleProof(
      allowListA,
      base58PublicKey(umi.identity),
    ),
  },
}).sendAndConfirm(umi);
```

APIリファレンス: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## まとめ

Route命令により、ガードは独自のカスタムプログラムロジックを含むことができるため、さらに強力になります。各ガードの完全な機能セットを確認するために、[利用可能なすべてのガード](/ja/smart-contracts/core-candy-machine/guards)の専用ページをチェックしてください。

Core Candy Machineとそのガードの設定について知るべきことをすべて知ったところで、ミントについて話す時が来ました。[次のページ](/ja/smart-contracts/core-candy-machine/mint)でお会いしましょう！[取得](/ja/smart-contracts/core-candy-machine/fetching-a-candy-machine)についても読みたいかもしれません。