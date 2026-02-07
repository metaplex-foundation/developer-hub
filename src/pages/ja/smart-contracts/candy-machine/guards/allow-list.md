---
title: Allowlist Guard
metaTitle: Allowlist | Candy Machine
description: "ウォレットアドレスリストを使用して、誰がミントできるかを決定します。"
---

## 概要

**Allow List**ガードは、事前定義されたウォレットリストに対してミントウォレットを検証します。ミントウォレットがこのリストの一部でない場合、ミントは失敗します。

このガードの設定で大きなウォレットリストを提供することは、ブロックチェーン上で大量のストレージを必要とし、それらすべてを挿入するのに複数のトランザクションが必要になる可能性があります。そのため、Allow Listガードは[**Merkle Trees**](https://en.m.wikipedia.org/wiki/Merkle_tree)を使用して、ミントウォレットが事前設定されたウォレットリストの一部であることを検証します。

これは、すべての葉が2つずつハッシュ化され、**Merkle Root**として知られる最終ハッシュに到達するまでのハッシュのバイナリツリーを作成することによって機能します。これは、任意の葉が変更されると、最終的なMerkle Rootが破損することを意味します。

{% diagram %}
{% node #hash-7 label="Hash 7" theme="brown" /%}
{% node #merkle-root label="Merkle Root" theme="transparent" parent="hash-7" x="-90" y="8" /%}
{% node #hash-5 label="Hash 5" parent="hash-7" y="100" x="-200" theme="orange" /%}
{% node #hash-6 label="Hash 6" parent="hash-7" y="100" x="200" theme="orange" /%}

{% node #leaves label="Leaves" parent="hash-5" y="105" x="-170" theme="transparent" /%}
{% node #hash-1 label="Hash 1" parent="hash-5" y="100" x="-100" theme="orange" /%}
{% node #hash-2 label="Hash 2" parent="hash-5" y="100" x="100" theme="orange" /%}
{% node #hash-3 label="Hash 3" parent="hash-6" y="100" x="-100" theme="orange" /%}
{% node #hash-4 label="Hash 4" parent="hash-6" y="100" x="100" theme="orange" /%}

{% node #data label="Data" parent="hash-1" y="105" x="-80" theme="transparent" /%}
{% node #Ur1C label="Ur1C...bWSG" parent="hash-1" y="100" x="-23" /%}
{% node #sXCd label="sXCd...edkn" parent="hash-2" y="100" x="-20" /%}
{% node #RbJs label="RbJs...Ek7u" parent="hash-3" y="100" x="-17" /%}
{% node #rwAv label="rwAv...u1ud" parent="hash-4" y="100" x="-16" /%}

{% edge from="hash-5" to="hash-7" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-6" to="hash-7" fromPosition="top" toPosition="bottom" /%}

{% edge from="hash-1" to="hash-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-2" to="hash-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-3" to="hash-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-4" to="hash-6" fromPosition="top" toPosition="bottom" /%}

{% edge from="Ur1C" to="hash-1" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="sXCd" to="hash-2" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="RbJs" to="hash-3" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="rwAv" to="hash-4" fromPosition="top" toPosition="bottom" path="straight" /%}

{% /diagram %}

葉がツリーの一部であることを検証するには、ツリーを上ってMerkle Rootを再計算できる中間ハッシュのリストが必要です。この中間ハッシュのリストを**Merkle Proof**と呼びます。計算されたMerkle Rootが保存されたMerkle Rootと一致する場合、その葉がツリーの一部であり、したがって元のリストの一部であることが確実になります。

{% diagram %}
{% node #hash-7 label="Hash 7" theme="brown" /%}
{% node #merkle-root label="Merkle Root" theme="transparent" parent="hash-7" x="-90" y="8" /%}
{% node #hash-5 label="Hash 5" parent="hash-7" y="100" x="-200" theme="mint" /%}
{% node #hash-6 label="Hash 6" parent="hash-7" y="100" x="200" theme="blue" /%}

{% node #legend-merkle-proof label="Merkle Proof =" theme="transparent" parent="hash-7" x="200" y="10" /%}
{% node #legend-hash-4 label="Hash 4" parent="legend-merkle-proof" x="100" y="-7" theme="mint" /%}
{% node #plus label="+" parent="legend-hash-4" theme="transparent" x="81" y="8" /%}
{% node #legend-hash-5 label="Hash 5" parent="legend-hash-4" x="100" theme="mint" /%}

{% node #leaves label="Leaves" parent="hash-5" y="105" x="-170" theme="transparent" /%}
{% node #hash-1 label="Hash 1" parent="hash-5" y="100" x="-100" theme="orange" /%}
{% node #hash-2 label="Hash 2" parent="hash-5" y="100" x="100" theme="orange" /%}
{% node #hash-3 label="Hash 3" parent="hash-6" y="100" x="-100" theme="blue" /%}
{% node #hash-4 label="Hash 4" parent="hash-6" y="100" x="100" theme="mint" /%}

{% node #data label="Data" parent="hash-1" y="105" x="-80" theme="transparent" /%}
{% node #Ur1C label="Ur1C...bWSG" parent="hash-1" y="100" x="-23" /%}
{% node #sXCd label="sXCd...edkn" parent="hash-2" y="100" x="-20" /%}
{% node #RbJs label="RbJs...Ek7u" parent="hash-3" y="100" x="-17" theme="blue" /%}
{% node #rwAv label="rwAv...u1ud" parent="hash-4" y="100" x="-16" /%}

{% edge from="hash-5" to="hash-7" fromPosition="top" toPosition="bottom" theme="mint" /%}
{% edge from="hash-6" to="hash-7" fromPosition="top" toPosition="bottom" theme="blue" /%}

{% edge from="hash-1" to="hash-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-2" to="hash-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="hash-3" to="hash-6" fromPosition="top" toPosition="bottom" theme="blue" /%}
{% edge from="hash-4" to="hash-6" fromPosition="top" toPosition="bottom" theme="mint" /%}

{% edge from="Ur1C" to="hash-1" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="sXCd" to="hash-2" fromPosition="top" toPosition="bottom" path="straight" /%}
{% edge from="RbJs" to="hash-3" fromPosition="top" toPosition="bottom" path="straight" theme="blue" /%}
{% edge from="rwAv" to="hash-4" fromPosition="top" toPosition="bottom" path="straight" /%}

{% /diagram %}

したがって、Allow Listガードの設定には、許可されたウォレットの事前設定リストの真実の源として機能するMerkle Rootが必要です。ウォレットが許可リストに含まれていることを証明するには、プログラムがMerkle Rootを再計算し、ガードの設定と一致することを確認できる有効なMerkle Proofを提供する必要があります。

私たちのSDKは、指定されたウォレットリストのMerkle RootとMerkle Proofを簡単に作成できるヘルパーを提供していることに注意してください。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1 /%}
{% node #allowList label="AllowList" /%}
{% node #guardMerkleRoot label="- Merkle Root" /%}
{% node label="..." /%}
{% /node %}

{% node parent="allowList" x="250" y="10" %}
{% node #merkleRoot theme="slate" %}
Merkle Root {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="merkleRoot" x="170" %}
{% node #merkleProof theme="slate" %}
Merkle Proof {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="merkleRoot" y="100" x="-12" %}
{% node #walletList  %}
List of wallets

allowed to mint
{%/node %}
{% /node %}
{% edge from="merkleProof" to="walletList" arrow="none" fromPosition="bottom" toPosition="top" arrow="start" /%}
{% edge from="merkleRoot" to="walletList" arrow="none" fromPosition="bottom" toPosition="top" arrow="start" /%}

{% node parent="merkleProof" y="100" %}
{% node #payer label="Payer" theme="indigo" /%}
{% node theme="dimmed"%}
Owner: Any Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="merkleProof" to="payer" arrow="none" fromPosition="bottom" toPosition="top" arrow="start" path="straight" /%}

{% node parent="candy-machine" x="740" %}
  {% node #route-validation theme="pink" %}
    Route from the

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="route-validation" y="-20" x="100" theme="transparent" %}
  Verify Merkle Proof
{% /node %}

{% node parent="route-validation" #allowList-pda y="130" x="32" %}
{% node theme="slate" %}
Allowlist PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="allowList-pda" #mint-candy-guard y="90" x="-31" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="110" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="110" x="70" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="guardMerkleRoot" to="merkleRoot" arrow="start" path="straight" /%}
{% edge from="merkleRoot" to="route-validation" arrow="none" fromPosition="top" dashed=true /%}
{% edge from="merkleProof" to="route-validation" arrow="none" fromPosition="top" dashed=true  %}
if the payer's Merkle Proof does not match

the guard's Merkle Root validation will fail
{% /edge %}
{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="route-validation" to="allowList-pda" path="straight" /%}
{% edge from="allowList-pda" to="mint-candy-guard" path="straight" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Allow Listガードには以下の設定が含まれます：

- **Merkle Root**: 許可リストを表すMerkle Treeの Root。

{% dialect-switcher title="Allowlistガードを使用してCandy Machineを設定する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Merkle Treesの管理を支援するために、Umiライブラリは`getMerkleRoot`と`getMerkleProof`という2つのヘルパーメソッドを提供しており、次のように使用できます。

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

const merkleRoot = getMerkleRoot(allowList);
const validMerkleProof = getMerkleProof(
  allowList,
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB"
);
const invalidMerkleProof = getMerkleProof(allowList, "invalid-address");
```

許可リストのMerkle Rootを計算したら、それを使用してCandy MachineにAllow Listガードを設定できます。

```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
  },
});
```

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [AllowList](https://mpl-candy-machine.typedoc.metaplex.com/types/AllowList.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Sugarにはmerkle rootを管理する機能は含まれていません。sugarで許可リストを使用する場合、事前に計算する必要があります（例：前述のJavaScript関数や[sol-tools](https://sol-tools.tonyboyle.io/cmv3/allow-list)を使用）。その後、次のようにmerkle rootハッシュをconfigに追加します：

```json
"allowList" : {
    "merkleRoot": "<HASH>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Allow Listガードには以下のミント設定が含まれます：

- **Merkle Root**: 許可リストを表すMerkle Treeの Root。

ミントできるようになる前に、**Merkle Proofを提供してミントウォレットを検証する必要があります**。詳細については、下記の[Merkle Proofを検証する](#validate-a-merkle-proof)を参照してください。

また、SDK の助けなしで命令を構築する予定の場合、ミント命令の残りのアカウントにAllow List Proof PDAを追加する必要があります。詳細については、[Candy GuardのプログラムドキュメントAtion](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#allowlist)を参照してください。

{% dialect-switcher title="Allow Listガードでミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`mintArgs`引数を使用してAllow Listガードのミント設定を渡すことができます。

```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

mintV2(umi, {
  // ...
  mintArgs: {
    allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
  },
});
```

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [AllowListMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/AllowListMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

Allow Listルート命令は以下の機能をサポートします。

### Merkle Proofの検証

_パス: `proof`_

Merkle Proofをミント命令に直接渡すのではなく、ミントウォレットはAllow Listガードのルート命令を使用して[事前検証](/ja/smart-contracts/candy-machine/mint#minting-with-pre-validation)を実行する必要があります。

このルート命令は、提供されたMerkle ProofからMerkle Rootを計算し、有効である場合、ミントウォレットが許可リストの一部であることの証明として機能する新しいPDAアカウントを作成します。したがって、ミント時には、Allow ListガードはこのPDAアカウントの存在のみをチェックして、ウォレットへのミントを承認または拒否します。

では、なぜミント命令内でMerkle Proofを直接検証できないのでしょうか？それは単に、大きな許可リストの場合、Merkle Proofがかなり長くなってしまう可能性があるからです。特定のサイズを超えると、既にかなりの量の命令を含むミントトランザクションにそれを含めることが不可能になります。検証プロセスをミントプロセスから分離することで、許可リストを必要な大きさにすることが可能になります。

このルート命令のパスは以下の引数を受け取ります：

- **Path** = `proof`: ルート命令で実行するパスを選択します。
- **Merkle Root**: 許可リストを表すMerkle Treeの Root。
- **Merkle Proof**: Merkle Rootを計算し、ガードの設定に保存されているMerkle Rootと一致することを検証するために使用される中間ハッシュのリスト。
- **Minter** (オプション): 支払者と同じでない場合のSignerとしてのミンターアカウント。提供された場合、このアカウントは証明が有効になるために許可リストの一部である必要があります。

{% dialect-switcher title="ウォレットを事前検証する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`routeArgs`引数を使用してAllow Listガードの"Proof"ルート設定を渡すことができます。

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

await route(umi, {
  // ...
  guard: "allowList",
  routeArgs: {
    path: "proof",
    merkleRoot: getMerkleRoot(allowList),
    merkleProof: getMerkleProof(allowList, publicKey(umi.identity)),
  },
}).sendAndConfirm(umi);
```

`umi.identity`ウォレットは、Candy Machineからミントできるようになりました。

APIリファレンス: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [AllowListRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/AllowListRouteArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_Sugarは"Proof" Routeの呼び出しには使用できません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
