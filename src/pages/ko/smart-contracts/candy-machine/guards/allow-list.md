---
title: Allow List 가드
metaTitle: Allow List | Candy Machine
description: "지갑 주소 목록을 사용하여 누가 민팅할 수 있는지 결정합니다."
---

## 개요

**Allow List** 가드는 민팅 지갑을 미리 정의된 지갑 목록과 대조하여 검증합니다. 민팅 지갑이 이 목록에 포함되지 않으면 민팅이 실패합니다.

이 가드의 설정에 큰 지갑 목록을 제공하는 것은 블록체인에 많은 저장 공간이 필요하고 모든 것을 삽입하는 데 하나 이상의 트랜잭션이 필요할 것입니다. 따라서 Allow List 가드는 [**Merkle Trees**](https://en.m.wikipedia.org/wiki/Merkle_tree)를 사용하여 민팅 지갑이 미리 구성된 지갑 목록의 일부임을 확인합니다.

이는 모든 잎이 두 개씩 자기 자신을 해시하여 **Merkle Root**라고 알려진 최종 해시에 도달할 때까지의 해시 이진 트리를 생성하는 방식으로 작동합니다. 즉, 어떤 잎이라도 변경되면 최종 Merkle Root가 손상됩니다.

{% diagram %}
{% node #hash-7 label="Hash 7" theme="brown" /%}
{% node #merkle-root label="Merkle Root" theme="transparent" parent="hash-7" x="-90" y="8" /%}
{% node #hash-5 label="Hash 5" parent="hash-7" y="100" x="-200" theme="orange" /%}
{% node #hash-6 label="Hash 6" parent="hash-7" y="100" x="200" theme="orange" /%}

{% node #leaves label="잎" parent="hash-5" y="105" x="-170" theme="transparent" /%}
{% node #hash-1 label="Hash 1" parent="hash-5" y="100" x="-100" theme="orange" /%}
{% node #hash-2 label="Hash 2" parent="hash-5" y="100" x="100" theme="orange" /%}
{% node #hash-3 label="Hash 3" parent="hash-6" y="100" x="-100" theme="orange" /%}
{% node #hash-4 label="Hash 4" parent="hash-6" y="100" x="100" theme="orange" /%}

{% node #data label="데이터" parent="hash-1" y="105" x="-80" theme="transparent" /%}
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

잎이 트리의 일부임을 확인하기 위해서는 트리를 올라가서 Merkle Root를 다시 계산할 수 있게 해주는 모든 중간 해시의 목록만 있으면 됩니다. 이 중간 해시 목록을 **Merkle Proof**라고 부릅니다. 계산된 Merkle Root가 저장된 Merkle Root와 일치하면, 잎이 트리의 일부이며 따라서 원래 목록의 일부임을 확신할 수 있습니다.

{% diagram %}
{% node #hash-7 label="Hash 7" theme="brown" /%}
{% node #merkle-root label="Merkle Root" theme="transparent" parent="hash-7" x="-90" y="8" /%}
{% node #hash-5 label="Hash 5" parent="hash-7" y="100" x="-200" theme="mint" /%}
{% node #hash-6 label="Hash 6" parent="hash-7" y="100" x="200" theme="blue" /%}

{% node #legend-merkle-proof label="Merkle Proof =" theme="transparent" parent="hash-7" x="200" y="10" /%}
{% node #legend-hash-4 label="Hash 4" parent="legend-merkle-proof" x="100" y="-7" theme="mint" /%}
{% node #plus label="+" parent="legend-hash-4" theme="transparent" x="81" y="8" /%}
{% node #legend-hash-5 label="Hash 5" parent="legend-hash-4" x="100" theme="mint" /%}


{% node #leaves label="잎" parent="hash-5" y="105" x="-170" theme="transparent" /%}
{% node #hash-1 label="Hash 1" parent="hash-5" y="100" x="-100" theme="orange" /%}
{% node #hash-2 label="Hash 2" parent="hash-5" y="100" x="100" theme="orange" /%}
{% node #hash-3 label="Hash 3" parent="hash-6" y="100" x="-100" theme="blue" /%}
{% node #hash-4 label="Hash 4" parent="hash-6" y="100" x="100" theme="mint" /%}

{% node #data label="데이터" parent="hash-1" y="105" x="-80" theme="transparent" /%}
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

따라서 Allow List 가드의 설정에는 미리 구성된 허용 지갑 목록의 진실의 원천 역할을 하는 Merkle Root가 필요합니다. 지갑이 허용 목록에 있음을 증명하려면 프로그램이 Merkle Root를 다시 계산하고 가드의 설정과 일치하는지 확인할 수 있는 유효한 Merkle Proof를 제공해야 합니다.

저희 SDK는 주어진 지갑 목록에 대해 Merkle Root와 Merkle Proof를 쉽게 생성할 수 있는 도우미를 제공한다는 점을 참고하세요.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
소유자: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
소유자: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="가드" theme="mint" z=1 /%}
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
민팅이 허용된

지갑 목록
{%/node %}
{% /node %}
{% edge from="merkleProof" to="walletList" arrow="none" fromPosition="bottom" toPosition="top" arrow="start" /%}
{% edge from="merkleRoot" to="walletList" arrow="none" fromPosition="bottom" toPosition="top" arrow="start" /%}


{% node parent="merkleProof" y="100" %}
{% node #payer label="지불자" theme="indigo" /%}
{% node theme="dimmed"%}
소유자: Any Program {% .whitespace-nowrap %}
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
  Merkle Proof 검증
{% /node %}

{% node parent="route-validation" #allowList-pda y="130" x="32" %}
{% node theme="slate" %}
Allowlist PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="allowList-pda" #mint-candy-guard y="90" x="-31" %}
  {% node theme="pink" %}
    민팅 from

    _Candy Guard Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  접근 제어
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="110" x="-8" %}
  {% node theme="pink" %}
    민팅 from 
    
    _Candy Machine Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  민팅 로직
{% /node %}

{% node #nft parent="mint-candy-machine" y="110" x="70" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="guardMerkleRoot" to="merkleRoot" arrow="start" path="straight" /%}
{% edge from="merkleRoot" to="route-validation" arrow="none" fromPosition="top" dashed=true /%}
{% edge from="merkleProof" to="route-validation" arrow="none" fromPosition="top" dashed=true  %}
지불자의 Merkle Proof가 

가드의 Merkle Root와 일치하지 않으면 검증이 실패합니다
{% /edge %}
{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="route-validation" to="allowList-pda" path="straight" /%}
{% edge from="allowList-pda" to="mint-candy-guard" path="straight" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}


{% /diagram %}

## 가드 설정

Allow List 가드는 다음 설정을 포함합니다:

- **Merkle Root**: 허용 목록을 나타내는 Merkle Tree의 Root입니다.

{% dialect-switcher title="Allow List 가드를 사용하여 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Merkle Tree를 관리하는 데 도움이 되도록 Umi 라이브러리는 다음과 같이 사용할 수 있는 `getMerkleRoot`와 `getMerkleProof`라는 두 가지 도우미 메서드를 제공합니다.

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

허용 목록의 Merkle Root를 계산한 후에는 이를 사용하여 Candy Machine에 Allow List 가드를 설정할 수 있습니다.

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

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [AllowList](https://mpl-candy-machine.typedoc.metaplex.com/types/AllowList.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Sugar에는 merkle root를 생성하고 관리하는 함수가 포함되어 있지 않습니다. sugar와 함께 허용 목록을 사용할 때는 앞서 설명한 JavaScript 함수나 [sol-tools](https://sol-tools.tonyboyle.io/cmv3/allow-list) 등을 사용하여 미리 계산한 다음, 다음과 같이 config에 merkle root 해시를 추가해야 합니다:

```json
"allowList" : {
    "merkleRoot": "<HASH>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

Allow List 가드는 다음 민팅 설정을 포함합니다:

- **Merkle Root**: 허용 목록을 나타내는 Merkle Tree의 Root입니다.

민팅할 수 있기 전에 **Merkle Proof를 제공하여 민팅 지갑을 검증해야 합니다**. 자세한 내용은 아래의 [Merkle Proof 검증](#validate-a-merkle-proof)을 참조하세요.

또한 SDK의 도움 없이 명령어를 구성할 계획이라면 민팅 명령어의 나머지 계정에 Allow List Proof PDA를 추가해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#allowlist)를 참조하세요.

{% dialect-switcher title="Allow List 가드로 민팅" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Allow List 가드의 민팅 설정을 전달할 수 있습니다.

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

API 참조: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [AllowListMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/AllowListMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_가드가 할당되는 즉시 sugar를 사용하여 민팅할 수 없습니다 - 따라서 특정 민팅 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 명령어

Allow List route 명령어는 다음 기능을 지원합니다.

### Merkle Proof 검증

_Path: `proof`_

민팅 명령어에 직접 Merkle Proof를 전달하는 대신, 민팅 지갑은 Allow List 가드의 route 명령어를 사용하여 [사전 검증](/ko/smart-contracts/candy-machine/mint#minting-with-pre-validation)을 수행해야 합니다.

이 route 명령어는 제공된 Merkle Proof로부터 Merkle Root를 계산하고, 유효한 경우 민팅 지갑이 허용 목록의 일부임을 증명하는 새로운 PDA 계정을 생성합니다. 따라서 민팅할 때 Allow List 가드는 지갑에 대한 민팅을 승인하거나 거부하기 위해 이 PDA 계정의 존재만 확인하면 됩니다.

그렇다면 왜 민팅 명령어 내에서 직접 Merkle Proof를 검증할 수 없을까요? 단순히 큰 허용 목록의 경우 Merkle Proof가 상당히 길어질 수 있기 때문입니다. 특정 크기 이후에는 이미 상당한 양의 명령어를 포함하는 민팅 트랜잭션에 포함하는 것이 불가능해집니다. 검증 프로세스를 민팅 프로세스에서 분리함으로써 허용 목록을 필요한 만큼 크게 만들 수 있게 됩니다.

route 명령어의 이 경로는 다음 인수를 받습니다:

- **Path** = `proof`: route 명령어에서 실행할 경로를 선택합니다.
- **Merkle Root**: 허용 목록을 나타내는 Merkle Tree의 Root입니다.
- **Merkle Proof**: Merkle Root를 계산하고 가드 설정에 저장된 Merkle Root와 일치하는지 확인하는 데 사용되어야 하는 중간 해시 목록입니다.
- **Minter** (선택사항): 지불자와 동일하지 않은 경우 서명자로서의 민터 계정입니다. 제공될 때, 이 계정은 증명이 유효하려면 허용 목록의 일부여야 합니다.

{% dialect-switcher title="지갑 사전 검증" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `routeArgs` 인수를 사용하여 Allow List 가드의 "Proof" Route 설정을 전달할 수 있습니다.

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

이제 `umi.identity` 지갑이 Candy Machine에서 민팅할 수 있습니다.

API 참조: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [AllowListRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/AllowListRouteArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_Sugar는 "Proof" Route를 호출하는 데 사용할 수 없습니다._ 

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}