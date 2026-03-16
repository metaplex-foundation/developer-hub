---
title: Core Candy MachineガードのRoute命令
metaTitle: Core Candy MachineガードのRoute命令 | Core Candy Machine
description: Route命令により、Core Candy Machineの個々のガードが独自のカスタムオンチェーンロジックを公開でき、ミント前に実行されるプレバリデーションステップなどが可能になります。
keywords:
  - route instruction
  - core candy machine
  - candy guard
  - guard instructions
  - allow list
  - merkle proof
  - merkle tree
  - pre-validation
  - minting guards
  - Solana NFT
  - Metaplex
  - guard groups
  - custom guard logic
  - PDA verification
about:
  - Route instruction
  - Guard instructions
  - Pre-validation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: どのガードがRoute命令をサポートしていますか？
    a: すべてのガードがRoute命令をサポートしているわけではありません。プレバリデーションまたはカスタムオンチェーンロジックを必要とするガードのみがRouteハンドラーを公開します。Allow Listガードが最も一般的な例で、ミント前にMerkle Proofを検証するためにRouteを使用します。Route対応の詳細については、各ガードの専用ドキュメントページを確認してください。
  - q: Route命令をサポートしていないガードに対してRoute命令を呼び出すとどうなりますか？
    a: トランザクションは失敗します。Core Candy Guardプログラムは、Routeハンドラーを実装していないガードに向けられたRoute呼び出しを拒否します。呼び出す前に、ガードがRoute命令をサポートしていることを常に確認してください。
  - q: Allow Listガードがミント中に検証するのではなく、別のRoute命令を使用する理由は何ですか？
    a: 大きな許可リストは、ミント命令のデータと組み合わせるとトランザクションサイズ制限を超える可能性のあるMerkle Proofを生成します。プルーフ検証を専用のRouteトランザクションに分離することで、Allow Listガードはsolanaのトランザクションサイズ制約に達することなく、任意の大きさのリストをサポートできます。
  - q: Route命令を呼び出す際にグループラベルを指定する必要がありますか？
    a: Core Candy Machineがガードグループを使用している場合のみです。同じガードタイプが複数のグループに表示される場合、プログラムはどのガードインスタンスがRoute呼び出しを処理するかを識別するためにグループラベルが必要です。グループなしの場合、グループパラメータは必要ありません。
  - q: Route設定のPath属性とは何ですか？
    a: Path属性は、単一のガードのRoute命令が提供する複数の機能を区別します。例えば、Frozen NFTをサポートするガードは、エスクローアカウントを初期化するためにパス「init」を、ミントされたNFTを解凍するためにパス「thaw」を使用できます。各ガードは独自の有効なパスセットを定義します。
---

## Summary

Route命令は、Core Candy Guardプログラムの特別な命令で、実行を特定の[ガード](/ja/smart-contracts/core-candy-machine/guards)に委譲し、標準の[ミント](/ja/smart-contracts/core-candy-machine/mint)フロー外でガードがカスタムオンチェーンロジックを実行できるようにします。

- 選択されたガードにリクエストをルーティングし、ミントトランザクションとは独立して独自のプログラムロジックを実行できます。
- [Allow Listガード](/ja/smart-contracts/core-candy-machine/guards/allow-list)のMerkle Proof検証などのプレバリデーションワークフローを可能にします。
- 単一のガードのRouteハンドラー内で複数の機能を区別するための**Path**属性をサポートします。
- Core Candy Machineが[ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)を使用している場合、**グループラベル**が必要です。

前のページで見たように、ガードはCandy Machineのミントプロセスをカスタマイズする強力な方法です。しかし、ガードが独自のカスタム命令を提供できることをご存知でしたか？ {% .lead %}

## Route命令

Route命令は、Core Candy Guardプログラムの専用エントリポイントで、特定のガードにリクエストを転送し、そのガードがミントトランザクションとは独立してカスタムオンチェーンロジックを実行できるようにします。

この命令により、Core Candy Machineから**特定のガードを選択**し、そのガードに固有の**カスタム命令を実行**できます。選択されたガードにリクエストをルーティングするため、「Route」命令と呼んでいます。

この機能により、ガードは独自のプログラムロジックを含めることができるため、さらに強力になります。ガードは以下を可能にします：

- 重い操作のために検証プロセスをミントプロセスから分離する。
- カスタムプログラムのデプロイが必要な機能を提供する。

Route命令を呼び出すには、どのガードに命令をルーティングするかを指定し、**そのガードが期待するRoute設定を提供**する必要があります。

{% callout type="warning" %}
Route命令をサポートしていないガードを選択してRoute命令を実行しようとすると、トランザクションは失敗します。呼び出す前に[ガードのドキュメントページ](/ja/smart-contracts/core-candy-machine/guards)でRoute対応を確認してください。
{% /callout %}

Candy Guardプログラムで登録されたガードごとに一つの「Route」命令しかあり得ないため、同じガードが提供する複数の機能を区別するために、Route設定で**Path**属性を提供することが一般的です。

例えば、ミントが終了した後にのみ解除できるFrozen NFTのサポートを追加するガードは、Route命令を使用してトレジャリーエスクローアカウントを初期化し、適切な条件の下で誰でもミントされたNFTを解除できるようにすることができます。前者には「init」、後者には「thaw」と等しい**Path**属性を使用してこれら2つの機能を区別できます。

Route命令をサポートする各ガードのRoute命令とその基盤となるパスの詳細な説明は、[それぞれのページ](/ja/smart-contracts/core-candy-machine/guards)で見つけることができます。

### Allow ListガードのRoute例

[Allow Listガード](/ja/smart-contracts/core-candy-machine/guards/allow-list)は、Route命令を使用する最も一般的なガードで、ミントを許可する前にミントするウォレットが事前設定されたウォレットリストの一部であることを検証します。

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

## ガードグループでのRoute命令

Route命令は、Core Candy Machineが[ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)を使用している場合にグループラベルを必要とします。同じガードタイプが複数のグループに表示される可能性があり、プログラムはどのインスタンスをターゲットにするかを知る必要があるためです。

例えば、一つのグループに厳選されたVIPウォレットの**Allow List**があり、別のグループに抽選の当選者の**Allow List**があるとします。そうすると、Allow ListガードのMerkle Proofを検証したいと言うだけでは不十分で、どのグループに対してその検証を実行すべきかも知る必要があります。

{% dialect-switcher title="Route命令を呼び出す際のグループでのフィルタリング" %}
{% dialect title="JavaScript" id="js" %}

グループを使用する場合、Umiライブラリの`route`関数は、選択したいグループのラベルに設定する必要がある`Option<string>`タイプの追加の`group`属性を受け入れます。

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

## Notes

- すべての[ガード](/ja/smart-contracts/core-candy-machine/guards)がRoute命令をサポートしているわけではありません。プレバリデーションを必要とするか、追加のオンチェーン機能を公開するガードのみがRouteハンドラーを実装しています。
- Route命令をサポートしていないガードに対してRoute命令を呼び出すと、トランザクションが失敗します。
- [ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)を使用している場合、プログラムがどのガードインスタンスがRoute呼び出しを処理するかを識別するために、`group`ラベルが必要です。
- 各ガードはRoute命令を1つしか持てませんが、**Path**属性により単一のRouteハンドラーが複数の異なる機能を公開できます。
- Route命令は[ミント](/ja/smart-contracts/core-candy-machine/mint)トランザクションとは別です。Route命令が作成するオンチェーン状態（Allow List PDAなど）は永続化され、ミント中にチェックされます。

## FAQ

### どのガードがRoute命令をサポートしていますか？

すべてのガードがRoute命令をサポートしているわけではありません。プレバリデーションまたはカスタムオンチェーンロジックを必要とするガードのみがRouteハンドラーを公開します。[Allow Listガード](/ja/smart-contracts/core-candy-machine/guards/allow-list)が最も一般的な例で、[ミント](/ja/smart-contracts/core-candy-machine/mint)前にMerkle Proofを検証するためにRouteを使用します。Route対応の詳細については、各ガードの[専用ドキュメントページ](/ja/smart-contracts/core-candy-machine/guards)を確認してください。

### Route命令をサポートしていないガードに対してRoute命令を呼び出すとどうなりますか？

トランザクションは失敗します。Core Candy Guardプログラムは、Routeハンドラーを実装していない[ガード](/ja/smart-contracts/core-candy-machine/guards)に向けられたRoute呼び出しを拒否します。呼び出す前に、ガードがRoute命令をサポートしていることを常に確認してください。

### Allow Listガードがミント中に検証するのではなく、別のRoute命令を使用する理由は何ですか？

大きな許可リストは、[ミント](/ja/smart-contracts/core-candy-machine/mint)命令のデータと組み合わせるとトランザクションサイズ制限を超える可能性のあるMerkle Proofを生成します。プルーフ検証を専用のRouteトランザクションに分離することで、[Allow Listガード](/ja/smart-contracts/core-candy-machine/guards/allow-list)はSolanaのトランザクションサイズ制約に達することなく、任意の大きさのリストをサポートできます。

### Route命令を呼び出す際にグループラベルを指定する必要がありますか？

Core Candy Machineが[ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)を使用している場合のみです。同じガードタイプが複数のグループに表示される場合、プログラムはどのガードインスタンスがRoute呼び出しを処理するかを識別するためにグループラベルが必要です。グループなしの場合、グループパラメータは必要ありません。

### Route設定のPath属性とは何ですか？

Path属性は、単一のガードのRoute命令が提供する複数の機能を区別します。例えば、Frozen NFTをサポートするガードは、エスクローアカウントを初期化するためにパス「init」を、ミントされたNFTを解凍するためにパス「thaw」を使用できます。各ガードは独自の有効なパスセットを定義します。

## Glossary

| Term | Definition |
|------|------------|
| Route Instruction | Core Candy Guardプログラムの特別な命令で、実行を特定のガードに委譲し、ミントトランザクション外でカスタムオンチェーンロジックを実行できるようにします。 |
| Merkle Tree | 各リーフノードがデータのハッシュであり、各非リーフノードがその子のハッシュであるハッシュベースのデータ構造。大規模なデータセットにおけるメンバーシップを効率的に検証するために使用されます。 |
| Merkle Proof | Merkleツリー全体を公開することなく、特定の要素がMerkleツリーに属することを検証できる順序付けられたハッシュのリスト。 |
| Merkle Root | データセット全体を表すMerkleツリーの単一のトップレベルハッシュ。オンチェーン比較のためにAllow Listガード設定に保存されます。 |
| Path | 単一のガードのRouteハンドラーが公開する複数の機能を区別するRoute設定の属性（例：「init」と「thaw」）。 |
| Allow List PDA | Allow ListガードのRoute命令によって作成されるプログラム派生アカウントで、ウォレットがMerkle Proofの検証に成功したことを記録し、後続のミントトランザクションの証明として機能します。 |
| Guard Groups | 異なるオーディエンスに対して異なるミント条件を可能にするCore Candy Machine上の名前付きガードセットで、Route命令を呼び出す際にグループラベルが必要です。 |

