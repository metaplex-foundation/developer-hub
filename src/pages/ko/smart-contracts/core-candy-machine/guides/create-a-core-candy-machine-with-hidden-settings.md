---
title: Hidden Settings로 Core Candy Machine 만들기
metaTitle: Hidden Settings로 Core Candy Machine 만들기 | Core Candy Machine
description: 숨기기-공개 NFT 드롭을 생성하기 위해 hidden settings로 Core Candy Machine을 만드는 방법.
---

숨기기-공개 NFT 드롭을 만들고 싶다면, Core Candy Machine을 사용하여 그 목표를 달성할 수 있습니다. 이 가이드는 전체 과정의 포괄적인 안내를 보장하기 위해 두 부분으로 나뉩니다.

이 가이드(1부)에서는 Core Candy Machine을 사용하여 숨기기-공개 NFT 드롭을 설정하고 민팅하는 단계별 과정을 안내합니다. 숙련된 개발자이든 NFT 드롭을 처음 접하는 사람이든, 이 가이드는 시작하는 데 필요한 모든 것을 제공합니다. NFT 드롭 공개와 검증은 2부에서 다뤄집니다.

숨기기-공개 NFT 드롭은 모든 NFT를 민팅한 후 공개하고 싶을 때 유용할 수 있습니다.

이것이 작동하는 방식은 Core Candy Machine을 설정할 때 hidden settings 필드를 구성하는 것입니다. 이 필드는 공개 전 모든 민팅된 NFT에 적용될 플레이스홀더 메타데이터(일반적인 이름과 URI)를 포함합니다. 또한 메타데이터의 미리 계산된 해시도 포함합니다.

공개 전에 민팅될 모든 NFT는 동일한 이름과 URI를 갖게 됩니다. 컬렉션이 민팅된 후, asset은 올바른 이름과 URI(메타데이터)로 업데이트됩니다.

컬렉션을 민팅한 후, 적절한 메타데이터로 Asset을 업데이트하는 공개 과정이 수행되어야 합니다.

Asset이 올바르게 업데이트되었는지 확인하기 위해 검증 단계가 수행됩니다. 이는 공개된 Asset의 업데이트된 메타데이터(이름과 URI)를 해시하고 hidden settings에 저장된 원래 해시와 비교하는 것을 포함합니다. 이는 모든 NFT가 정확하게 업데이트되었음을 보장합니다.

공개와 검증 단계 모두 이 가이드의 2부에서 다뤄질 것입니다.

## 필수 패키지

Core Candy Machine과 상호작용하기 위해 다음 패키지를 설치해야 합니다:

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore", "mpl-toolbox"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## umi 설정

환경을 설정한 후, umi 설정을 시작해보겠습니다.

Umi를 설정하는 동안 테스트용 새 지갑을 생성하거나, 파일시스템에서 지갑을 가져오거나, UI/프론트엔드에서 `walletAdapter`를 사용할 수도 있습니다.
이 예제에서는 비밀 키가 포함된 json 파일(wallet.json)에서 Keypair를 생성하겠습니다.

Solana Devnet 엔드포인트를 사용할 것입니다.

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, some, none, createSignerFromKeypair, signerIdentity, transactionBuilder, dateTime } from "@metaplex-foundation/umi";
import { mplCandyMachine as mplCoreCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import * as fs from 'fs';

// `mplCoreCandyMachine()` 플러그인을 로드하면서 Solana Devnet을 엔드포인트로 사용합니다.
const umi = createUmi("https://api.devnet.solana.com")
            .use(mplCoreCandyMachine());

// 비밀 키가 포함된 wallet json 파일에서 Keypair를 생성하고, 생성된 키페어를 기반으로 서명자를 생성합니다.
const walletFile = fs.readFileSync('./wallet.json');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
const signer = createSignerFromKeypair(umi, keypair);
console.log("Signer: ", signer.publicKey);

// 주어진 서명자로 신원과 지불자를 설정합니다.
umi.use(signerIdentity(signer));
```

UMI 설정에 대한 자세한 정보는 [여기](/ko/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#setting-up-umi)에서 찾을 수 있습니다.

## 공개 데이터 준비
이제 최종 공개된 NFT의 메타데이터가 포함될 공개 데이터를 준비해보겠습니다. 이 데이터는 컬렉션의 각 NFT에 대한 이름과 URI를 포함하며 민팅 후 플레이스홀더 메타데이터를 업데이트하는 데 사용됩니다.
이 메타데이터는 각 asset에 대해 업로드되며, 결과 URI를 사용할 것입니다.

공개 데이터를 직접 업로드해야 한다는 점을 참고하세요.
이 과정은 기본적으로 결정론적이지 않을 것입니다. 결정론적인 방식으로 수행하려면 [turbo](/ko/guides/general/create-deterministic-metadata-with-turbo)를 사용할 수 있습니다.

이 예제에서는 5개 asset의 컬렉션으로 작업할 것이므로, 공개 데이터에는 각각 개별 NFT의 이름과 URI를 나타내는 5개 객체의 배열이 포함됩니다.

또한 공개 데이터의 해시를 생성할 것입니다. 이 해시는 Core Candy Machine의 hidden settings에 저장되며 검증 단계에서 메타데이터가 올바르게 업데이트되었는지 확인하는 데 사용됩니다.

```ts
import crypto from 'crypto';

// 공개 과정에서 사용될 asset의 공개 데이터
const revealData = [
      { name: 'Nft #1', uri: 'http://example.com/1.json' },
      { name: 'Nft #2', uri: 'http://example.com/2.json' },
      { name: 'Nft #3', uri: 'http://example.com/3.json' },
      { name: 'Nft #4', uri: 'http://example.com/4.json' },
      { name: 'Nft #5', uri: 'http://example.com/5.json' },
    ]

let string = JSON.stringify(revealData)
let hash = crypto.createHash('sha256').update(string).digest()
```

## 컬렉션 생성

이제 Collection asset을 생성해보겠습니다.
이를 위해 mpl-core 라이브러리는 해당 작업을 수행하는 데 도움이 되는 `createCollection` 메서드를 제공합니다.

컬렉션에 대해 자세히 알아보려면 [여기](/ko/smart-contracts/core/collections)를 참고하세요.

```ts
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core';

const collectionMint = generateSigner(umi);

const creator1 = generateSigner(umi).publicKey;
const creator2 = generateSigner(umi).publicKey;

console.log("collection update authority: ", collectionUpdateAuthority.publicKey);
await createCollection(umi, {
    collection: collectionMint,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    plugins: [
        {
            type: 'Royalties',
            basisPoints: 500,
            creators: [
            {
                address: creator1,
                percentage: 20,
            },
            {
                address: creator2,
                percentage: 80,
            },
        ],
        ruleSet: ruleSet('None'),
        },
    ],
}).sendAndConfirm(umi)
```

`Royalties` 타입의 플러그인을 추가하고 로열티를 공유할 2명의 다른 생성자를 추가했습니다.

이제 생성한 컬렉션을 가져와서 세부 정보를 출력해보겠습니다.

```ts
import { fetchCollection } from '@metaplex-foundation/mpl-core';

const collection = await fetchCollection(umi, collectionMint.publicKey);

console.log("Collection Details: \n", collection);
```

## Hidden Settings로 Core Candy Machine 생성

다음 단계는 Hidden Settings로 Core Candy Machine을 생성하는 것입니다.

이를 달성하기 위해 mpl-core-candy-machine 라이브러리의 `create` 메서드를 사용하고, `revealData`에서 플레이스홀더 이름, URI, 미리 계산된 해시로 `hiddenSettings`를 설정합니다.

Core Candy Machine 생성과 guard에 대한 자세한 정보는 [여기](/ko/smart-contracts/core-candy-machine/create)에서 찾을 수 있습니다.

또한 민팅이 시작되는 시점을 결정하는 startDate guard를 구성합니다. 이는 사용 가능한 많은 guard 중 하나일 뿐이며 사용 가능한 모든 guard의 목록은 [여기](/ko/smart-contracts/candy-machine/guards)에서 찾을 수 있습니다.

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine';

const candyMachine = generateSigner(umi);

const res = await create(umi, {
    candyMachine,
    collection: collectionMint.publicKey,
    collectionUpdateAuthority: umi.identity,
    itemsAvailable: 5,
    configLineSettings: none(),
    hiddenSettings: some({
        name: 'My Hidden NFT Project',
        uri: 'https://example.com/path/to/teaser.json',
        hash: hash,
    }),
    guards: {
        startDate: some({ date: dateTime('2024-01-01T16:00:00Z') }),
    }
});
let tx = await res.sendAndConfirm(umi);
```

이제 생성한 candy machine을 가져와서 세부 정보를 출력해보겠습니다.
이를 달성하기 위해 mpl-core-candy-machine 라이브러리의 `fetchCandyMachine` 메서드를 사용합니다.

```ts
import { fetchCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';

let candyMachineDetails = await fetchCandyMachine(umi, candyMachine.publicKey);

console.log("Candy Machine Details: \n", candyMachineDetails);
```

이것은 다음과 같이 Candy Machine 데이터를 반환합니다:

```json
{
  "publicKey": "FVQYpQxtT4ZqCmq3MNiWY1mZcEJsVA6DaaW6bMhERoVY",
  "header": {
    "executable": false,
    "owner": "CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J",
    "lamports": { "basisPoints": 5428800, "identifier": "SOL", "decimals": 9 },
    "rentEpoch": 18446744073709551616,
    "exists": true
  },
  "discriminator": [
    51, 173, 177, 113,
    25, 241, 109, 189
  ],
  "authority": "Cce2qGViiD1SqAiJMDJVJQrGfxcb3DMyLgyhaqYB8uZr",
  "mintAuthority": "4P6VhHmNi9Qt5eRuQsE9SaE5bYWoLxpdPwmfNZeiU2mv",
  "collectionMint": "3RLCk7G2ckGHt7XPNfzUYKLriME2BmMoumF8N4H5LvsS",
  "itemsRedeemed": 0,
  "data": {
    "itemsAvailable": 5,
    "maxEditionSupply": 0,
    "isMutable": true,
    "configLineSettings": { "__option": "None" },
    "hiddenSettings": { "__option": "Some", "value": "[Object]" }
  },
  "items": [],
  "itemsLoaded": 0
}
"Candy Guard Account":
 {
  "publicKey": "4P6VhHmNi9Qt5eRuQsE9SaE5bYWoLxpdPwmfNZeiU2mv",
  "header": {
    "executable": false,
    "owner": "CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ",
    "lamports": { "basisPoints": 1538160, "identifier": "SOL", "decimals": 9 },
    "rentEpoch": 18446744073709551616,
    "exists": true
  },
  "discriminator": [
     44, 207, 199, 184,
    112, 103,  34, 181
  ],
  "base": "FVQYpQxtT4ZqCmq3MNiWY1mZcEJsVA6DaaW6bMhERoVY",
  "bump": 251,
  "authority": "Cce2qGViiD1SqAiJMDJVJQrGfxcb3DMyLgyhaqYB8uZr",
  "guards": {
    "botTax": { "__option": "None" },
    "solPayment": { "__option": "None" },
    "tokenPayment": { "__option": "None" },
    "startDate": { "__option": "Some", "value": "[Object]" },
    "thirdPartySigner": { "__option": "None" },
    "tokenGate": { "__option": "None" },
    "gatekeeper": { "__option": "None" },
    "endDate": { "__option": "None" },
    "allowList": { "__option": "None" },
    "mintLimit": { "__option": "None" },
    "nftPayment": { "__option": "None" },
    "redeemedAmount": { "__option": "None" },
    "addressGate": { "__option": "None" },
    "nftGate": { "__option": "None" },
    "nftBurn": { "__option": "None" },
    "tokenBurn": { "__option": "None" },
    "freezeSolPayment": { "__option": "None" },
    "freezeTokenPayment": { "__option": "None" },
    "programGate": { "__option": "None" },
    "allocation": { "__option": "None" },
    "token2022Payment": { "__option": "None" },
    "solFixedFee": { "__option": "None" },
    "nftMintLimit": { "__option": "None" },
    "edition": { "__option": "None" },
    "assetPayment": { "__option": "None" },
    "assetBurn": { "__option": "None" },
    "assetMintLimit": { "__option": "None" },
    "assetBurnMulti": { "__option": "None" },
    "assetPaymentMulti": { "__option": "None" },
    "assetGate": { "__option": "None" },
    "vanityMint": { "__option": "None" },
  },
  "groups": []
}
```

보시다시피 의도한 대로 실제로 `startDate`만 설정된 Candy Guard 계정도 출력됩니다.

## 컬렉션 민팅

이제 Core Candy Machine에서 5개의 NFT를 민팅해보겠습니다.

민팅된 모든 asset은 생성한 Core Candy Machine의 `hiddenSettings` 필드에 설정한 플레이스홀더 이름과 URI를 갖게 됩니다.

이러한 플레이스홀더 요소는 공개 과정에서 업데이트됩니다.

```ts
import { mintV1 } from '@metaplex-foundation/mpl-core-candy-machine';

const nftMint = [
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
];

for(let i = 0; i < nftMint.length; i++) {
    let mintNFT = await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
        mintV1(umi, {
            candyMachine: candyMachine.publicKey,
            asset: nftMint[i],
            collection: collectionMint.publicKey,
        })
    ).sendAndConfirm(umi);

    console.log("NFT minted!");
};
```

## 결론
축하합니다! 가이드의 1부를 완료하고 hidden settings로 Core Candy Machine을 성공적으로 설정했습니다.

우리가 한 모든 일을 다시 살펴보겠습니다:
- UMI 설정부터 시작했습니다.
- UMI를 설정한 후, 초기 민팅 후 asset을 업데이트하는 데 사용될 메타데이터(이름과 URI)가 포함된 배열을 생성했습니다. 여기에는 검증 목적으로 해시 계산이 포함되었습니다.
- 민팅된 asset이 속할 Collection asset을 생성했습니다.
- hidden setting, 5개의 사용 가능한 아이템, 시작 시간 guard가 있는 Core Candy Machine을 생성했습니다.
- Core Candy Machine의 hidden setting에 저장된 플레이스홀더 값으로 Core Candy Machine에서 모든 asset을 민팅했습니다.

2부에서는 asset을 공개하고 메타데이터를 검증하는 단계를 다룰 것입니다. 여기에는 다음이 포함됩니다:
- 컬렉션 asset을 가져와서 준비된 공개 데이터로 메타데이터를 업데이트합니다.
- 공개된 asset의 메타데이터(이름과 URI)를 해시하고 예상 해시와 비교하여 공개 과정이 성공했는지 확인합니다.
