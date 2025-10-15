---
title: 허용 목록 가드
metaTitle: 허용 목록 가드 | 코어 캔디 머신
description: "코어 캔디 머신의 '허용 목록' 가드를 사용하면 코어 캔디 머신에서 민팅할 수 있는 미리 정의된 지갑 목록을 설정할 수 있습니다"
---

## 개요

**허용 목록** 가드는 미리 정의된 지갑 목록에 대해 민팅 지갑을 검증합니다. 민팅 지갑이 이 목록에 포함되지 않으면 민팅이 실패합니다.

이 가드의 설정에 큰 지갑 목록을 제공하면 블록체인에 많은 저장 공간이 필요하고 모두 삽입하려면 하나 이상의 트랜잭션이 필요할 수 있습니다. 따라서 허용 목록 가드는 [**머클 트리**](https://en.m.wikipedia.org/wiki/Merkle_tree)를 사용하여 민팅 지갑이 사전 구성된 지갑 목록에 포함되어 있는지 확인합니다.

이는 모든 잎이 **머클 루트**라고 알려진 최종 해시에 도달할 때까지 두 개씩 자신을 해시하는 해시의 이진 트리를 생성함으로써 작동합니다. 즉, 어떤 잎이라도 변경되면 최종 머클 루트가 손상됩니다.

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

잎이 트리의 일부인지 확인하려면 트리를 올라가서 머클 루트를 다시 계산할 수 있게 해주는 모든 중간 해시의 목록만 있으면 됩니다. 이 중간 해시 목록을 **머클 증명**이라고 합니다. 계산된 머클 루트가 저장된 머클 루트와 일치하면, 잎이 트리의 일부이므로 원본 목록의 일부라고 확신할 수 있습니다.

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

따라서 허용 목록 가드의 설정에는 허용된 지갑의 사전 구성된 목록에 대한 신뢰할 수 있는 소스 역할을 하는 머클 루트가 필요합니다. 지갑이 허용 목록에 있다는 것을 증명하려면 프로그램이 머클 루트를 다시 계산하고 가드 설정과 일치하는지 확인할 수 있게 해주는 유효한 머클 증명을 제공해야 합니다.

우리의 SDK는 주어진 지갑 목록에 대해 머클 루트와 머클 증명을 쉽게 생성할 수 있는 헬퍼를 제공합니다.

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
  Asset
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

## 가드 설정

허용 목록 가드에는 다음 설정이 포함됩니다:

- **Merkle Root**: 허용 목록을 나타내는 머클 트리의 루트입니다.

{% dialect-switcher title="허용 목록 가드를 사용하여 캔디 머신 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

머클 트리를 관리하는 데 도움이 되도록 Umi 라이브러리는 다음과 같이 사용할 수 있는 `getMerkleRoot`와 `getMerkleProof`라는 두 개의 헬퍼 메소드를 제공합니다.

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";

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

허용 목록의 머클 루트를 계산한 후에는 이를 사용하여 캔디 머신에 허용 목록 가드를 설정할 수 있습니다.

```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-core-candy-machine";

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

API 참조: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [AllowList](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllowList.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Sugar는 머클 루트를 생성하고 관리하는 함수를 포함하지 않습니다. Sugar와 함께 허용 목록을 사용할 때는 앞서 설명한 JavaScript 함수나 [sol-tools](https://sol-tools.tonyboyle.io/cmv3/allow-list)로 미리 계산한 다음 다음과 같이 머클 루트 해시를 설정에 추가해야 합니다:

```json
"allowList" : {
    "merkleRoot": "<HASH>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

허용 목록 가드에는 다음 민트 설정이 포함됩니다:

- **Merkle Root**: 허용 목록을 나타내는 머클 트리의 루트입니다.

민팅하기 전에 **머클 증명을 제공하여 민팅 지갑을 검증해야 합니다**. 자세한 내용은 아래의 [머클 증명 검증](#머클-증명-검증)을 참조하세요.

또한 SDK의 도움 없이 지시사항을 구성할 계획이라면 민트 지시사항의 나머지 계정에 허용 목록 증명 PDA를 추가해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#allowlist)를 참조하세요.

{% dialect-switcher title="허용 목록 가드로 민팅" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 허용 목록 가드의 민트 설정을 전달할 수 있습니다.

```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-core-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

mintV1(umi, {
  // ...
  mintArgs: {
    allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
  },
});
```

API 참조: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [AllowListMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllowListMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_가드가 할당되는 즉시 sugar를 사용하여 민팅할 수 없습니다 - 따라서 특정 민트 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 라우트 지시사항

허용 목록 라우트 지시사항은 다음 기능을 지원합니다.

### 머클 증명 검증

_Path: `proof`_

머클 증명을 민트 지시사항에 직접 전달하는 대신, 민팅 지갑은 허용 목록 가드의 라우트 지시사항을 사용하여 [사전 검증](/core-candy-machine/mint#minting-with-pre-validation)을 수행해야 합니다.

이 라우트 지시사항은 제공된 머클 증명에서 머클 루트를 계산하고, 유효하면 민팅 지갑이 허용 목록에 포함되어 있다는 증명 역할을 하는 새로운 PDA 계정을 생성합니다. 따라서 민팅할 때 허용 목록 가드는 이 PDA 계정의 존재만 확인하면 지갑에 민팅을 승인하거나 거부할 수 있습니다.

그렇다면 민트 지시사항 내에서 직접 머클 증명을 검증할 수 없는 이유는 무엇일까요? 큰 허용 목록의 경우 머클 증명이 꽤 길어질 수 있기 때문입니다. 특정 크기가 넘어가면 이미 상당한 양의 지시사항이 포함된 민트 트랜잭션에 이를 포함하는 것이 불가능해집니다. 검증 프로세스를 민팅 프로세스에서 분리함으로써 허용 목록을 필요한 만큼 크게 만들 수 있습니다.

라우트 지시사항의 이 경로는 다음 인수를 받습니다:

- **Path** = `proof`: 라우트 지시사항에서 실행할 경로를 선택합니다.
- **Merkle Root**: 허용 목록을 나타내는 머클 트리의 루트입니다.
- **Merkle Proof**: 머클 루트를 계산하고 가드 설정에 저장된 머클 루트와 일치하는지 확인하는 데 사용해야 하는 중간 해시 목록입니다.
- **Minter** (선택사항): 지불자와 다른 경우 서명자로서의 민터 계정입니다. 제공될 때 이 계정은 증명이 유효하려면 허용 목록에 포함되어야 합니다.

{% dialect-switcher title="지갑 사전 검증" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `routeArgs` 인수를 사용하여 허용 목록 가드의 "증명" 라우트 설정을 전달할 수 있습니다.

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";
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

이제 `umi.identity` 지갑은 캔디 머신에서 민팅할 수 있습니다.

API 참조: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [AllowListRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllowListRouteArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_Sugar는 "증명" 라우트를 호출하는 데 사용할 수 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 허용 목록 계정
`Allowlist` 가드를 사용할 때 라우트 지시사항이 실행된 후 `AllowListProof` 계정이 생성됩니다. 이를 가져올 수 있으면 사용자가 허용 목록에 있고 라우트가 이미 실행되었다는 의미입니다. 검증 목적으로 다음과 같이 가져올 수 있습니다:

```js
import {
  safeFetchAllowListProofFromSeeds,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allowlist = [
  "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy"
];

const allowListProof = await safeFetchAllowListProofFromSeeds(umi, {
  candyMachine: candyMachine.publicKey,
  // 또는 candyMachine: publicKey("Address") CM 주소와 함께
  candyGuard: candyMachine.mintAuthority,
  // 또는 candyGuard: publicKey("Address") candyGuard 주소와 함께
  merkleRoot: getMerkleRoot(allowlist),
  user: umi.identity.publicKey,
  // 또는 "민팅" 계정의 publicKey
});
```