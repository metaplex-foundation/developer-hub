---
title: 特別なガード命令
metaTitle: 特別なガード命令 | キャンディマシン
description: ガード固有の命令の実行方法を説明します。
---

前のページで見たように、ガードはキャンディマシンのミントプロセスをカスタマイズする強力な方法です。しかし、ガードが独自のカスタム命令を提供することもできることをご存知でしたか？ {% .lead %}

## ルート命令

キャンディガードプログラムには**「ルート」命令**と呼ばれる特別な命令が付属しています。

この命令により、キャンディマシンから**特定のガードを選択**し、そのガードに固有の**カスタム命令を実行**できます。選択されたガードにリクエストをルーティングするため、「ルート」命令と呼んでいます。

この機能により、ガードは独自のプログラムロジックを含むことができるため、さらに強力になります。これにより、ガードは以下のことができます：

- 重い操作について、検証プロセスをミントプロセスから分離する。
- そうでなければカスタムプログラムのデプロイが必要なカスタム機能を提供する。

ルート命令を呼び出すには、どのガードにその命令をルーティングしたいかを指定し、**そのガードが期待するルート設定を提供**する必要があります。それをサポートしていないガードを選択して「ルート」命令を実行しようとすると、トランザクションは失敗することに注意してください。

キャンディガードプログラムで登録されたガードごとに「ルート」命令は1つしかないため、同じガードが提供する複数の機能を区別するためにルート設定で**パス**属性を提供することが一般的です。

例えば、フローズンNFT — ミントが終了してからのみ解凍できる — のサポートを追加するガードは、そのルート命令を使用してトレジャリーエスクローアカウントを初期化し、適切な条件下で誰でもミントされたNFTを解凍できるようにできます。前者には「init」、後者には「thaw」に等しい**パス**属性を使用してこれら2つの機能を区別できます。

それをサポートする各ガードのルート命令とその基本パスの詳細な説明は、[それぞれのページ](/jp/candy-machine/guards)で見つけることができます。

例を提供してルート命令の動作を説明するために少し時間を取りましょう。例えば、[**許可リスト**](/jp/candy-machine/guards/allow-list)ガードは、ミントウォレットが事前設定されたウォレットのリストの一部であることを検証するためにルート命令をサポートしています。

これは[Merkle Trees](https://en.m.wikipedia.org/wiki/Merkle_tree)を使用して行います。つまり、許可されたウォレットの全リストのハッシュを作成し、そのハッシュ — **Merkle Root**として知られる — をガード設定に保存する必要があります。ウォレットが許可リストにあることを証明するには、プログラムがMerkle Rootを計算し、それがガードの設定と一致することを確認できるハッシュのリスト — **Merkle Proof**として知られる — を提供する必要があります。

したがって、許可リストガードは**そのルート命令を使用して指定されたウォレットのMerkle Proofを検証**し、成功した場合、ミント命令の検証証明として機能するブロックチェーン上の小さなPDAアカウントを作成します。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="キャンディガード" theme="blue" /%}
{% node label="所有者: キャンディガードプログラム" theme="dimmed" /%}
{% node label="ガード" theme="mint" z=1 /%}
{% node #allow-list-guard label="許可リスト" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="ミント" theme="pink" /%}
{% node label="キャンディガードプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="アクセス制御" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="ミント" theme="pink" /%}
{% node label="キャンディマシンコアプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="ミントロジック" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 %}
{% node #route label="ルート" theme="pink" /%}
{% node label="キャンディマシンコアプログラム" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Merkle Proof検証" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="許可リストPDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

では、なぜミント命令内でMerkle Proofを直接検証できないのでしょうか？それは単純に、大きな許可リストの場合、Merkle Proofがかなり長くなる可能性があるからです。一定のサイズを超えると、既にかなりの量の命令を含むミントトランザクション内にそれを含めることが不可能になります。検証プロセスをミントプロセスから分離することで、許可リストを必要な大きさにすることが可能になります。

{% dialect-switcher title="ガードのルート命令の呼び出し" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリを使用して、`route`関数を使ってガードのルート命令を呼び出せます。`guard`属性経由でガードの名前を渡し、`routeArgs`属性経由でそのルート設定を渡す必要があります。

ミント前にウォレットのMerkle Proofを検証する許可リストガードを使用した例です。

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from '@metaplex-foundation/mpl-candy-machine'

// 許可リストを準備します。
// リストの最初のウォレットがMetaplexアイデンティティであると仮定しましょう。
const allowList = [
  'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
  '2vjCrmEFiN9CLLhiqy8u1JPh48av8Zpzp3kNkdTtirYG',
  'AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy',
]
const merkleRoot = getMerkleRoot(allowList)

// 許可リストガード付きキャンディマシンを作成します。
await create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot }),
  },
}).sendAndConfirm(umi)

// 今ミントしようとすると、Merkle Proofを検証していないため失敗します。

// ルート命令を使用してMerkle Proofを検証します。
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

APIリファレンス: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## グループ付きルート命令

ガードグループを使用しながらルート命令を呼び出す際、選択したいガードの**グループラベルを指定する**ことが重要です。これは、異なるグループ間で同じタイプの複数のガードを持つ可能性があり、プログラムがルート命令でどれを使用すべきかを知る必要があるからです。

例えば、一つのグループに厳選されたVIPウォレットの**許可リスト**があり、別のグループに抽選の当選者の別の**許可リスト**があったとします。その場合、許可リストガードのMerkle Proofを検証したいと言うだけでは不十分で、どのグループでその検証を実行すべきかも知る必要があります。

{% dialect-switcher title="ルート命令を呼び出す際にグループでフィルタリング" %}
{% dialect title="JavaScript" id="js" %}

グループを使用する際、Umiライブラリの`route`関数は、選択したいグループのラベルに設定する必要がある`Option<string>`タイプの追加の`group`属性を受け入れます。

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";
import { base58PublicKey, some } from "@metaplex-foundation/umi";

// 許可リストを準備します。
const allowListA = [...];
const allowListB = [...];

// 2つの許可リストガード付きキャンディマシンを作成します。
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

// どのグループを選択するかを指定してMerkle Proofを検証します。
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

APIリファレンス: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## まとめ

ルート命令は、ガードが独自のカスタムプログラムロジックを含むことを可能にすることで、さらに強力にします。各ガードの完全な機能セットを確認するために、[利用可能なすべてのガード](/jp/candy-machine/guards)の専用ページをチェックしてください。

キャンディマシンとそのガードの設定について知るべきことをすべて理解したので、ミントについて話すときが来ました。[次のページ](/jp/candy-machine/mint)でお会いしましょう！