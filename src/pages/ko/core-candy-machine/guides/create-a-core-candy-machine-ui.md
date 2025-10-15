---
title: Core Candy Machine에서 Asset을 민팅하는 웹사이트 만들기
metaTitle: Core Candy Machine에서 Asset을 민팅하는 웹사이트 만들기 | Core Candy Machine
description: Solana에서 Candy Machine 민팅 프로그램과 상호 작용하는 UI를 만드는 방법.
---

Solana에서 Core NFT 컬렉션을 출시하려는 경우, 일반적으로 사용자가 와서 Asset을 구매할 수 있는 Candy Machine을 사용합니다. 사용자 친화적인 경험을 제공하기 위해 웹사이트를 갖는 것이 권장됩니다. 이 가이드는 자신만의 민팅 함수를 구축하는 방법에 중점을 둡니다. 또한 Candy Machine에서 데이터를 가져와서 예를 들어 민팅 가능한 남은 수량을 표시하는 방법도 보여줍니다.

이 가이드는 완전한 웹사이트 구현을 제공하기보다는 Core Candy Machine의 핵심 기능과 상호작용에 중점을 둡니다. 웹사이트에 버튼을 추가하거나 지갑 어댑터와 통합하는 것과 같은 측면은 다루지 않습니다. 대신 Core Candy Machine 작업에 필요한 핵심 정보를 제공합니다.

UI 요소와 지갑 통합을 포함한 전체 웹사이트 구현을 원한다면, [`metaplex-nextjs-tailwind-template`](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template)과 같은 템플릿으로 시작할 수 있습니다. 이 템플릿에는 Wallet Adapter와 같은 구성 요소를 위한 많은 설정 단계가 포함되어 있습니다.

일반적인 웹 개발 관행이나 특정 프레임워크 사용에 대한 지침을 찾고 있다면, Visual Studio Code와 같은 도구는 광범위한 문서와 커뮤니티 리소스를 제공합니다.

## 전제조건

- 이미 생성된 Candy Machine. 생성 방법에 대한 자세한 정보는 [여기](https://developers.metaplex.com/kr/core-candy-machine/create)에서 찾을 수 있습니다.
- 웹 개발과 선택한 프레임워크에 대한 기본적인 숙련도. umi와의 최고 호환성을 위해 Next JS를 권장합니다.

## 필수 패키지

선택한 템플릿이나 구현에 관계없이, Core Candy Machine과 상호작용하기 위해 다음 패키지를 설치해야 합니다:

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## 온체인 데이터 가져오기

환경을 설정한 후, Candy Machine에 집중할 수 있습니다. 민팅 UI는 종종 다음과 같은 데이터를 표시하려고 합니다:

- 이미 민팅된 Asset 수
- Candy Machine의 Asset 수
- 민팅이 시작될 때까지의 시간
- Asset의 가격
- 기타

사용자에게 표시되지 않지만 백그라운드 계산에 사용되는 추가 데이터를 가져오는 것도 의미가 있을 수 있습니다. 예를 들어, [Redeemed Amount](/kr/core-candy-machine/guards/redeemed-amount) Guard를 사용할 때, 사용자가 더 민팅할 수 있는지 확인하기 위해 이미 교환된 수량을 가져올 것입니다.

### Candy Machine 데이터 가져오기
Candy Machine 계정에는 사용 가능한 Asset과 교환된 Asset의 수와 같은 데이터가 저장됩니다. 또한 일반적으로 Candy Guard의 주소인 `mintAuthority`도 저장합니다.

Candy Machine을 가져오려면, 다음과 같이 `fetchCandyMachine` 함수를 사용할 수 있습니다:

Metaplex Aura Devnet 엔드포인트를 사용할 것입니다.
Solana와 Eclipse 블록체인에서 Metaplex Aura 네트워크에 액세스하려면 엔드포인트와 API 키를 위해 Aura 앱을 방문할 수 있습니다 [여기](https://aura-app.metaplex.com/).

```ts
import {
  mplCandyMachine,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

// 다음 두 줄은 이전에 umi를 설정하지 않은 경우에만 필요합니다
// Aura 데이터 네트워크에서 Solana Devnet을 엔드포인트로 사용합니다
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
            .use(mplCandyMachine());

const candyMachineId = "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9";
const candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
console.log(candyMachine)
```

이것은 다음과 같이 Candy Machine 데이터를 반환합니다:

{% dialect-switcher title="JSON Result" %}
{% dialect title="JSON" id="json-cm" %}

{% totem-accordion title="Candy Machine Data" %}
```json
{
    "publicKey": "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9",
    "header": {
        "executable": false,
        "owner": "CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J",
        "lamports": {
            "basisPoints": "91814160",
            "identifier": "SOL",
            "decimals": 9
        },
        "rentEpoch": "18446744073709551616",
        "exists": true
    },
    "discriminator": [
        51,
        173,
        177,
        113,
        25,
        241,
        109,
        189
    ],
    "authority": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
    "mintAuthority": "ACJCHhsWCKw9Euu9nLdyxajqitvmwrXQMRWe2mrmva8u",
    "collectionMint": "GPHD33NBaM8TgvbfgcxrusD6nyfhNLbeyKjxMRLAr9LM",
    "itemsRedeemed": "13",
    "data": {
        "itemsAvailable": "16",
        "maxEditionSupply": "0",
        "isMutable": true,
        "configLineSettings": {
            "__option": "Some",
            "value": {
                "prefixName": "",
                "nameLength": 32,
                "prefixUri": "",
                "uriLength": 200,
                "isSequential": false
            }
        },
        "hiddenSettings": {
            "__option": "None"
        }
    },
    "items": [
        {
            "index": 0,
            "minted": true,
            "name": "0.json",
            "uri": ""
        },
        [...]
    ],
    "itemsLoaded": 16
}
```
{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}

UI 관점에서 여기서 가장 중요한 필드는 `itemsRedeemed`, `itemsAvailable`, `mintAuthority`입니다. 경우에 따라 일부 `items`를 웹사이트에 티저 이미지로 표시하는 것도 흥미로울 수 있습니다.

#### 남은 Asset 수량 표시
`13 / 16 Assets minted`와 같은 섹션을 표시하려면 다음과 같은 것을 사용합니다:

```ts
const mintedString = `${candyMachine.itemsRedeemed} / ${candyMachine.itemsAvailable} Assets minted`
```

`3 available`과 같이 남은 민팅 가능한 Asset을 얻으려면 다음과 같은 계산을 실행합니다:

```ts
const availableString = `${candyMachine.itemsAvailable - candyMachine.itemsRedeemed} available`;
```

### Candy Guard 데이터 가져오기
Candy Guard는 민팅을 허용하기 위해 충족해야 하는 조건을 포함합니다. 예를 들어 Sol 또는 Token 지불이 발생하거나, 하나의 지갑이 민팅할 수 있는 Asset 수를 제한하는 등이 있습니다. Candy Guard에 대한 자세한 정보는 [Candy Guard 페이지](/kr/core-candy-machine/guards)에서 찾을 수 있습니다.

Candy Machine 데이터와 마찬가지로 guard 계정을 가져오는 것이 필수는 아닙니다. 그렇게 하면 Candy Guard에서 SOL 가격만 업데이트하고 웹사이트의 숫자도 자동으로 업데이트하는 등 더 많은 유연성을 허용할 수 있습니다.

여러 Candy Machine에 사용할 수 있는 더 유연한 UI를 구축하려면 Candy Guard를 가져오는 것이 민팅 함수를 동적으로 구축하고 자격을 확인할 수 있게 해줍니다.

다음 코드 조각은 `candyMachine` 계정이 이전에 가져와졌다고 가정합니다. `candyMachine.mintAuthority` 대신 Candy Guard의 publicKey를 하드코딩할 수도 있습니다.

```ts
import { safeFetchCandyGuard } from "@metaplex-foundation/mpl-core-candy-machine";

const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
```

{% dialect-switcher title="JSON Result" %}
{% dialect title="JSON" id="json-cg" %}

{% totem-accordion title="Candy Guard Data" %}
{% totem-prose %}
이 객체에서 UI에 가장 중요한 필드는 `guards` 객체입니다. 항상 적용되는 `default` guard를 포함합니다. `guards.groups`는 다른 [Guard Groups](/kr/core-candy-machine/guard-groups)를 포함합니다.
{% /totem-prose %}

```json
{
    "publicKey": "ACJCHhsWCKw9Euu9nLdyxajqitvmwrXQMRWe2mrmva8u",
    "header": {
        "executable": false,
        "owner": "CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ",
        "lamports": {
            "basisPoints": "2561280",
            "identifier": "SOL",
            "decimals": 9
        },
        "rentEpoch": "18446744073709551616",
        "exists": true
    },
    "discriminator": [
        44,
        207,
        199,
        184,
        112,
        103,
        34,
        181
    ],
    "base": "Ct5CWicvmjETYXarcUVJenfz3CCh2hcrCM3CMiB8x3k9",
    "bump": 255,
    "authority": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV",
    "guards": {
        "botTax": {
            "__option": "None"
        },
        "solPayment": {
            "__option": "None"
        },
        "tokenPayment": {
            "__option": "None"
        },
        "startDate": {
            "__option": "None"
        },
        "thirdPartySigner": {
            "__option": "None"
        },
        "tokenGate": {
            "__option": "None"
        },
        "gatekeeper": {
            "__option": "None"
        },
        "endDate": {
            "__option": "None"
        },
        "allowList": {
            "__option": "None"
        },
        "mintLimit": {
            "__option": "None"
        },
        "nftPayment": {
            "__option": "None"
        },
        "redeemedAmount": {
            "__option": "None"
        },
        "addressGate": {
            "__option": "None"
        },
        "nftGate": {
            "__option": "None"
        },
        "nftBurn": {
            "__option": "None"
        },
        "tokenBurn": {
            "__option": "None"
        },
        "freezeSolPayment": {
            "__option": "None"
        },
        "freezeTokenPayment": {
            "__option": "None"
        },
        "programGate": {
            "__option": "None"
        },
        "allocation": {
            "__option": "None"
        },
        "token2022Payment": {
            "__option": "None"
        },
        "solFixedFee": {
            "__option": "None"
        },
        "nftMintLimit": {
            "__option": "None"
        },
        "edition": {
            "__option": "None"
        },
        "assetPayment": {
            "__option": "None"
        },
        "assetBurn": {
            "__option": "None"
        },
        "assetMintLimit": {
            "__option": "None"
        },
        "assetBurnMulti": {
            "__option": "None"
        },
        "assetPaymentMulti": {
            "__option": "None"
        },
        "assetGate": {
            "__option": "None"
        },
        "vanityMint": {
            "__option": "None"
        }
    },
    "groups": [
        {
            "label": "group1",
            "guards": {
                "botTax": {
                    "__option": "Some",
                    "value": {
                        "lamports": {
                            "basisPoints": "10000000",
                            "identifier": "SOL",
                            "decimals": 9
                        },
                        "lastInstruction": false
                    }
                },
                "solPayment": {
                    "__option": "Some",
                    "value": {
                        "lamports": {
                            "basisPoints": "100000000",
                            "identifier": "SOL",
                            "decimals": 9
                        },
                        "destination": "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV"
                    }
                },
                "tokenPayment": {
                    "__option": "None"
                },
                "startDate": {
                    "__option": "Some",
                    "value": {
                        "date": "1723996800"
                    }
                },
                "thirdPartySigner": {
                    "__option": "None"
                },
                "tokenGate": {
                    "__option": "None"
                },
                "gatekeeper": {
                    "__option": "None"
                },
                "endDate": {
                    "__option": "Some",
                    "value": {
                        "date": "1729270800"
                    }
                },
                "allowList": {
                    "__option": "None"
                },
                "mintLimit": {
                    "__option": "Some",
                    "value": {
                        "id": 1,
                        "limit": 5
                    }
                },
                "nftPayment": {
                    "__option": "None"
                },
                "redeemedAmount": {
                    "__option": "None"
                },
                "addressGate": {
                    "__option": "None"
                },
                "nftGate": {
                    "__option": "None"
                },
                "nftBurn": {
                    "__option": "None"
                },
                "tokenBurn": {
                    "__option": "None"
                },
                "freezeSolPayment": {
                    "__option": "None"
                },
                "freezeTokenPayment": {
                    "__option": "None"
                },
                "programGate": {
                    "__option": "None"
                },
                "allocation": {
                    "__option": "None"
                },
                "token2022Payment": {
                    "__option": "None"
                },
                "solFixedFee": {
                    "__option": "None"
                },
                "nftMintLimit": {
                    "__option": "None"
                },
                "edition": {
                    "__option": "None"
                },
                "assetPayment": {
                    "__option": "None"
                },
                "assetBurn": {
                    "__option": "None"
                },
                "assetMintLimit": {
                    "__option": "None"
                },
                "assetBurnMulti": {
                    "__option": "None"
                },
                "assetPaymentMulti": {
                    "__option": "None"
                },
                "assetGate": {
                    "__option": "None"
                },
                "vanityMint": {
                    "__option": "None"
                }
            }
        },
    ]
}
```
{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}

### 추가 Candy Machine 관련 계정 가져오기
구현하려는 Guard의 선택에 따라 추가 계정을 가져와야 할 수 있습니다. 예를 들어, 지갑의 민팅 자격을 확인하고 `mintLimit` Guard를 사용하고 있다면, `mintCounter` 계정을 검색해야 합니다. 이 계정은 특정 guard 하에서 특정 지갑이 이미 민팅한 NFT 수를 기록합니다.

#### `MintLimit` 계정
[`MintLimit`](/kr/core-candy-machine/guards/mint-limit) guard가 활성화되면, 사용자 지갑에 대한 `MintCounter` 계정을 검색하는 것이 좋습니다. 이를 통해 사용자가 민팅 한도에 도달했는지 또는 여전히 추가 아이템을 민팅할 자격이 있는지 확인할 수 있습니다.

다음 코드 조각은 `MintCounter`를 가져오는 방법을 보여줍니다. 이 예제는 Candy Machine과 Candy Guard 데이터를 이미 얻었다고 가정합니다:

```ts
import { safeFetchMintCounterFromSeeds } from "@metaplex-foundation/mpl-core-candy-machine";

const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
  id: 1, // guard config에서 설정한 mintLimit id
  user: umi.identity.publicKey,
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```

#### `NftMintLimit` 계정
`MintLimit` guard와 마찬가지로 [`NftMintLimit`](/kr/core-candy-machine/guards/nft-mint-limit) guard의 `NftMintCounter` 계정을 가져와 자격을 확인하는 것이 의미가 있을 수 있습니다.

다음 코드 조각은 `NftMintCounter` 계정을 가져오는 방법을 보여줍니다. 이 예제는 Candy Machine과 Candy Guard 데이터를 이미 얻었다고 가정합니다:

```ts
import {
  findNftMintCounterPda,
  fetchNftMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findNftMintCounterPda(umi, {
  id: 1, // guard config에서 설정한 nftMintLimit id
  mint: asset.publicKey, // 사용자가 소유한 nft의 주소
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
});

const nftMintCounter = fetchNftMintCounter(umi, pda)
```

#### `AssetMintLimit` 계정
`NftMintCounter` guard와 마찬가지로 [`AssetMintLimit`](/kr/core-candy-machine/guards/asset-mint-limit) guard의 `AssetMintCounter` 계정을 가져와 자격을 확인하는 것이 의미가 있을 수 있습니다.

다음 코드 조각은 `AssetMintCounter` 계정을 가져오는 방법을 보여줍니다. 이 예제는 Candy Machine 데이터를 이미 얻었다고 가정합니다:

```ts
import {
  findAssetMintCounterPda,
  fetchAssetMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findAssetMintCounterPda(umi, {
  id: 1, // guard config에서 설정한 assetMintLimit id
  asset: asset.publicKey, // 사용자가 소유한 core nft의 주소
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
});

const assetMintCounter = fetchAssetMintCounter(umi, pda);
```

#### `Allocation` 계정
`Allocation` guard의 경우 주어진 그룹에서 추가 NFT를 민팅할 수 있는지 확인하기 위해 `AllocationTracker` 계정을 가져오는 것이 의미가 있을 수 있습니다.

다음 코드 조각은 `AllocationTracker` 계정을 가져오는 방법을 보여줍니다. 이 예제는 Candy Machine 데이터를 이미 얻었다고 가정합니다:

```ts
import {
  safeFetchAllocationTrackerFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allocationTracker = await safeFetchAllocationTrackerFromSeeds(umi, {
  id: 1, // guard config에서 설정한 allocation id
  candyMachine: candyMachine.publicKey,
  candyGuard: candyMachine.mintAuthority,
});
```

#### `Allowlist` 계정
Allowlist guard를 구현할 때는 미리 `route` 명령을 실행하는 것이 중요합니다. 이 명령은 각 지갑과 Candy Machine 조합에 대해 고유한 계정을 생성하여 지갑을 민팅 승인된 것으로 효과적으로 표시합니다.

UI 관점에서 이 계정을 쿼리하는 것이 유용합니다. 이를 통해 `route` 명령을 실행해야 하는지 또는 사용자가 민팅 명령으로 직접 진행할 수 있는지 결정할 수 있습니다.

다음 코드 조각은 이 계정을 가져오는 방법을 보여줍니다. Candy Machine 데이터를 이미 검색했다고 가정합니다. 그러나 원한다면 `candyGuard`와 `candyMachine` 공개 키를 대신 하드코딩할 수도 있습니다.

```ts
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
  candyGuard: candyMachine.mintAuthority,
  candyMachine: candyMachine.publicKey,
  merkleRoot: getMerkleRoot(allowlist),
  user: umi.identity.publicKey,
});
```

### 지갑 데이터 가져오기
자격을 검증하기 위해 연결된 지갑에 대한 정보를 가져올 수도 있습니다. 사용하는 Guard에 따라 지갑에 있는 SOL의 양과 지갑이 소유한 Token 및 NFT를 알고 싶을 수 있습니다.

SOL 잔액을 가져오려면 내장된 `getAccount` umi 함수를 사용하여 지갑 계정을 가져올 수 있습니다:
```ts
const account = await umi.rpc.getAccount(umi.identity.publicKey);
const solBalance = account.lamports;
```

토큰이나 NFT를 요구하는 guard 중 하나를 사용하고 있다면 이것들도 가져오고 싶을 것입니다. 이를 위해 [DAS API](/kr/das-api/methods/get-asset-by-owner)를 사용하는 것을 권장합니다. DAS는 RPC 제공자가 유지관리하는 Token의 인덱스입니다. 이를 사용하면 하나의 호출로 모든 필요한 정보를 가져올 수 있습니다. UI에서는 반환된 객체를 사용하여 연결된 지갑이 필요한 토큰이나 NFT를 소유하고 있는지 확인할 수 있습니다.

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

// 어딘가에서 umi 인스턴스를 정의할 때 이미
// `.use(dasApi());`를 추가할 수 있으므로 umi를 다시 정의할 필요가 없습니다.
const umi = createUmi('<ENDPOINT>').use(dasApi());

const assets = await umi.rpc.getAssetsByOwner({
    umi.identity.publicKey
});

```

## 자격 확인
모든 필요한 데이터를 가져온 후 연결된 지갑이 민팅을 허용받는지 여부를 확인할 수 있습니다.

그룹이 Candy Machine에 첨부되면 `default` guard가 생성된 모든 그룹에 전체적으로 적용된다는 점이 중요합니다. 또한 그룹이 활성화되면 `default` 그룹에서 민팅하는 능력이 비활성화되고 민팅을 위해 생성된 그룹을 사용해야 합니다.

따라서 정의된 그룹이 없으면 `default` 그룹의 모든 민팅 조건이 충족되는지 확인해야 합니다. 그룹이 정의되어 있으면 `default` guard와 현재 민팅 그룹 guard의 조합이 모두 검증되어야 합니다.

그룹을 활용하지 않고 `startDate`, `SolPayment`, `mintLimit` guard가 첨부된 Candy Machine이 주어졌을 때, 사용자가 민팅 함수를 호출하도록 허용하기 전에 다음 검증이 수행되어야 합니다. `candyGuard`가 이전에 가져와졌고 하나의 Core NFT Asset이 민팅되어야 한다고 가정합니다.

1. `startDate`가 과거인지 확인합니다. 여기서는 사용자 장치 시간을 사용하지 않고 대신 현재 내부 Solana 블록시간을 가져옵니다. 이것이 Candy Machine이 민팅 시 검증에 사용할 시간이기 때문입니다:
```ts
import { unwrapOption } from '@metaplex-foundation/umi';

let allowed = true;

// 현재 슬롯을 가져오고 블록시간을 읽습니다
const slot = await umi.rpc.getSlot();
let solanaTime = await umi.rpc.getBlockTime(slot);

// `default` startDate guard가 첨부되었는지 확인
const startDate = unwrapOption(candyGuard.guards.startDate);
if (startDate) {
  // startTime이 미래에 있는지 검증
  if (solanaTime < startDate) {
        console.info(`StartDate not reached!`);
        allowed = false;
  }
}
```

2. 지갑이 민팅 비용을 지불할 충분한 SOL을 가지고 있는지 확인합니다. 여기서는 트랜잭션 수수료를 포함하지 않고 위에서 설명한 대로 `SolBalance`가 가져와졌다고 가정합니다.
```ts
import { unwrapOption } from '@metaplex-foundation/umi';

const solPayment = unwrapOption(candyGuard.guards.solPayment);
if (solPayment){
  if (solPayment.lamports.basisPoints > solBalance){
    console.info(`Not enough SOL!`);
    allowed = false;
  }
}
```

3. `mintLimit`에 아직 도달하지 않았는지 확인합니다:
```ts
import { unwrapOption } from '@metaplex-foundation/umi';
import {
  safeFetchMintCounterFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const mintLimit = unwrapOption(candyGuard.guards.mintLimit);
if (mintLimit){
      const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
      id: mintLimit.id,
      user: umi.identity.publicKey,
      candyMachine: candyMachine.publicKey,
      candyGuard: candyMachine.mintAuthority,
    });

    // mintCounter PDA가 존재함 (첫 번째 민팅이 아님)
    if (mintCounter && mintLimit.limit >= mintCounter.count
    ) {
      allowed = false;
    }
}
```

지갑이 민팅할 자격이 없을 때는 민팅 버튼을 비활성화하고 사용자에게 민팅할 자격이 없는 이유를 보여주는 것이 도움이 됩니다. 예: `Not enough SOL!` 메시지.

## Guard Routes
특정 Guard는 민팅이 발생하기 전에 특정 명령이 실행되어야 합니다. 이러한 명령은 데이터를 저장하거나 지갑의 민팅 자격 증명을 제공하는 계정을 생성합니다. 이러한 명령의 실행 빈도는 Guard 유형에 따라 다릅니다.

{% callout type="note" title="이 섹션의 대상 독자" %}
`Allocation`, `FreezeSolPayment`, `FreezeTokenPayment` 또는 `Allowlist` guard를 사용하지 않는 경우 이 섹션을 건너뛰어도 안전합니다.
{% /callout %}

일부 Guard는 전체 Candy Machine에 대해 한 번만 route를 실행하면 됩니다. 이러한 경우 UI에 함수를 포함할 필요는 없지만 스크립트를 통해 미리 한 번 실행할 수 있습니다:
- [Allocation](/kr/core-candy-machine/guards/allocation)
- [FreezeSolPayment](/kr/core-candy-machine/guards/freeze-sol-payment)
- [FreezeTokenPayment](/kr/core-candy-machine/guards/freeze-token-payment)

다른 Guard는 각 개별 지갑에 대해 route를 실행해야 합니다. 이러한 경우 민팅 트랜잭션 이전에 route 명령을 실행해야 합니다:
- [Allowlist](/kr/core-candy-machine/guards/allow-list)

Guard route 구현 예시로 **Allowlist** guard의 경우를 고려해보겠습니다. 이는 앞서 설명한 대로 `allowListProof`가 가져와졌고, `allowlist`가 적격한 지갑 주소의 배열을 나타낸다고 가정합니다. 다음 코드는 구현에서 이 시나리오를 처리하는 방법을 보여줍니다.

```ts
import {
  getMerkleRoot,
  getMerkleProof,
  route
} from "@metaplex-foundation/mpl-core-candy-machine";
import {
  publicKey,
} from "@metaplex-foundation/umi";

// 위에서 설명한 대로 AllowListProof를 가져왔다고 가정
if (allowListProof === null) {
  route(umi, {
    guard: "allowList",
    candyMachine: candyMachine.publicKey,
    candyGuard: candyMachine.mintAuthority,
    group: "default", // 여기에 guard 라벨을 추가하세요
    routeArgs: {
      path: "proof",
      merkleRoot: getMerkleRoot(allowlist),
      merkleProof: getMerkleProof(allowlist, publicKey(umi.identity)),
    },
  })
}
```

## 민팅 함수 생성
첨부된 모든 guard에 대한 자격 확인을 구현하는 것이 권장됩니다. 그룹이 첨부되어 있으면 `default` guard가 모든 추가 그룹에 적용되면서 동시에 `default` 그룹을 비활성화한다는 점을 염두에 두세요.

이러한 확인이 완료되고 필요한 경우 route 명령이 실행된 후 민팅 트랜잭션을 구축할 수 있습니다. guard에 따라 `mintArgs`를 전달해야 할 수 있습니다. 이는 올바른 계정과 데이터를 전달하여 민팅 트랜잭션을 구축하는 데 도움이 되는 인수입니다. 예를 들어 `mintLimit` guard는 `mintCounter` 계정이 필요합니다. Umi SDK는 이러한 세부 사항을 추상화하지만 트랜잭션을 올바르게 구축하기 위해 일부 정보가 여전히 필요합니다.

`startDate`, `SolPayment`, `mintLimit` Guard가 첨부된 Candy Machine을 다시 가정하여 `mintArgs`를 구축하는 방법을 살펴보겠습니다.

```ts
import { some, unwrapOption } from '@metaplex-foundation/umi';
import {
  DefaultGuardSetMintArgs
} from "@metaplex-foundation/mpl-core-candy-machine";

let mintArgs: Partial<DefaultGuardSetMintArgs> = {};

// solPayment mintArgs 추가
const solPayment = unwrapOption(candyGuard.guards.solPayment)
if (solPayment) {
  mintArgs.solPayment = some({
    destination: solPayment.destination,
  });
}

// mintLimit mintArgs 추가
const mintLimit = unwrapOption(candyGuard.guards.mintLimit)
if (mintLimit) {
  mintArgs.mintLimit = some({ id: mintLimit.id });
}
```

모든 Guard가 추가 `mintArgs`를 전달해야 하는 것은 아닙니다. 이것이 위 코드 조각에 `startDate`가 없는 이유입니다. 사용하는 guard가 `mintArgs`를 전달해야 하는지 이해하려면 [Developer Hub](/kr/core-candy-machine) Guard 페이지를 확인하는 것이 권장됩니다. "Mint Settings"이 설명되어 있으면 이 guard에 대해 `mintArgs`를 전달해야 합니다.

이제 `mintArgs`가 구축되었으므로 민팅 함수 자체를 호출하는 방법을 살펴보겠습니다. 다음 코드 조각은 위에서 설명한 대로 `candyMachine`과 `candyGuard`가 가져와졌다고 가정합니다. 기술적으로 `candyMachine`, `collection`, `candyGuard`의 publicKey와 모든 `mintArgs`는 가져오기를 원하지 않는 경우 수동으로 전달할 수도 있습니다.

```ts
// NFT 주소 생성
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} minted!`)
```

## 고급 민팅 기법

우리가 논의한 기본 민팅 함수는 대부분의 경우에 잘 작동하지만, 민팅 프로세스를 향상시키기 위해 사용할 수 있는 몇 가지 고급 기법이 있습니다. 이 중 몇 가지를 살펴보겠습니다:

### 하나의 트랜잭션으로 여러 NFT 민팅

효율성을 위해 사용자가 단일 트랜잭션에서 여러 NFT를 민팅할 수 있도록 하고 싶을 수 있습니다. 이를 달성하는 방법은 다음과 같습니다:

특정 설정에 따라 [Transaction Builders](/kr/umi/transactions#transaction-builders)를 결합하여 하나의 트랜잭션에서 여러 NFT를 민팅할 수 있도록 하는 것이 도움이 될 수 있습니다.

```ts
let builder = transactionBuilder()
  .add(mintV1(...))
  .add(mintV1(...))
```

트랜잭션에 너무 많은 `mintV1` 명령을 추가하면 `Transaction too large` 오류가 발생합니다. [`builder.fitsInOneTransaction(umi)`](/kr/umi/transactions#transaction-builders) 함수를 사용하면 트랜잭션을 보내기 전에 이를 확인할 수 있어 필요한 경우 트랜잭션을 분할할 수 있습니다. 분할이 필요한 경우 [`signAllTransactions`](/kr/umi/transactions#building-and-signing-transactions)를 사용하는 것이 권장되므로 Wallet Adapter에서 하나의 팝업만 승인하면 됩니다.

### Guard Groups

Guard group은 서로 다른 구성으로 여러 guard 세트를 정의할 수 있게 해주는 Core Candy Machine의 강력한 기능입니다. 다음과 같은 시나리오에서 특히 유용할 수 있습니다:

1. 계층화된 민팅: VIP, 조기 액세스, 공개 판매를 위한 다양한 그룹.
2. 여러 지불 옵션: SOL 지불, SPL 토큰 지불 등을 위한 그룹.
3. 시간 기반 민팅: 다른 시작 및 종료 날짜를 가진 그룹.
4. 허용목록 기반 민팅: 허용목록 사용자와 공개 판매를 위한 그룹.

UI에서 guard group을 구현하려면 두 가지 주요 접근 방식이 있습니다:

1. 여러 버튼 접근 방식:
   각 그룹에 대해 별도의 버튼을 만들어 사용자가 선호하는 민팅 옵션을 선택할 수 있게 합니다.

2. 자동 그룹 선택:
   사용자의 자격과 현재 조건을 기반으로 사용자에게 최적의 그룹을 결정하는 함수를 구현합니다.

어떤 시나리오나 접근 방식을 선택하든, 특정 그룹과 작동하도록 `mintV1` 명령을 조정하는 방법은 다음과 같습니다. 핵심 수정 사항은 원하는 라벨을 지정하는 `group` 매개변수를 포함하는 것입니다.

```ts
// NFT 주소 생성
const nftMint = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachine.publicKey,
  collection: candyMachine.collectionMint,
  asset: nftMint,
  candyGuard: candyGuard.publicKey,
  mintArgs,
  group: "group1",
}).sendAndConfirm(umi)

console.log(`NFT ${nftMint.publicKey} minted!`)
```

## 다음 단계

프론트엔드에서 Candy Machine과 상호작용하는 핵심 사항을 마스터했으므로, 프로젝트를 더욱 향상시키고 배포하기 위해 다음 단계를 고려할 수 있습니다:

1. 호스팅: 호스팅 플랫폼에 배포하여 사용자가 프론트엔드에 액세스할 수 있도록 합니다. 개발자들 사이에서 인기 있는 옵션은 다음과 같습니다:
   - Vercel
   - Cloudflare Pages
   - Netlify
   - GitHub Pages

2. 테스팅: 다양한 장치와 브라우저에서 UI를 철저히 테스트하여 원활한 사용자 경험을 보장합니다.

3. 최적화: 특히 민팅 이벤트 중 높은 트래픽이 예상되는 경우 성능을 위해 프론트엔드를 미세 조정합니다.

4. 모니터링: Candy Machine UI의 상태를 추적하고 발생할 수 있는 문제를 신속하게 해결하기 위한 모니터링 도구를 설정합니다.

이러한 영역에 집중함으로써 Core Candy Machine을 사용하여 성공적인 NFT 민팅 프로젝트를 시작하고 유지관리할 준비가 잘 될 것입니다.