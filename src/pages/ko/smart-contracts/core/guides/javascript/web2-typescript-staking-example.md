---
title: JavaScript를 사용하여 Core 스테이킹 생성하기
metaTitle: JavaScript를 사용하여 Core 스테이킹 생성하기 | Core 가이드
description: 이 가이드는 FreezeDelegate와 Attribute 플러그인을 활용하여 백엔드 서버를 사용한 web2 관행으로 스테이킹 플랫폼을 생성하는 방법을 보여줍니다.
---

이 개발자 가이드는 attribute 플러그인과 freeze delegate만을 활용하여 TypeScript만으로 컬렉션용 스테이킹 프로그램을 생성하는 방법을 보여줍니다. **이 접근 방식은 스테이킹 시간을 추적하고 스테이킹/언스테이킹을 관리하기 위한 스마트 컨트랙트가 필요하지 않아** Web2 개발자들에게 더 접근하기 쉽게 만듭니다.

## 시작하기: 프로그램 뒤의 로직 이해하기

이 프로그램은 표준 TypeScript 백엔드로 작동하며 비밀에 있는 자산 키페어 권한을 사용하여 속성 변경에 서명합니다.

**이 예제를 구현하려면 다음 구성 요소가 필요합니다:**
- **자산**
- **컬렉션** (선택사항이지만 이 예제와 관련)
- **FreezeDelegate 플러그인**
- **Attribute 플러그인**

### Freeze Delegate 플러그인

**Freeze Delegate 플러그인**은 **소유자 관리 플러그인**으로, 자산에 적용하려면 소유자의 서명이 필요합니다.

이 플러그인은 **delegate가 자산을 동결하고 해동하여 전송을 방지**할 수 있게 해줍니다. 자산 소유자 또는 플러그인 권한은 언제든지 이 플러그인을 취소할 수 있지만, 자산이 동결된 경우는 예외입니다(이 경우 취소하기 전에 해동해야 함).

**이 플러그인 사용은 가벼워서**, 자산을 동결/해동하는 것은 플러그인 데이터의 불린 값을 변경하는 것만 포함합니다(유일한 인수는 Frozen: bool).

_[여기](/core/plugins/freeze-delegate)에서 더 자세히 알아보세요_

### Attribute 플러그인

**Attribute 플러그인**은 **권한 관리 플러그인**으로, 자산에 적용하려면 권한의 서명이 필요합니다. 컬렉션에 포함된 자산의 경우 자산의 권한 필드가 컬렉션 주소로 점유되어 있으므로 컬렉션 권한이 권한 역할을 합니다.

이 플러그인은 **자산에 직접 데이터 저장을 허용하여 온체인 속성이나 특성으로 기능**합니다. 이러한 특성은 mpl-program에서처럼 오프체인에 저장되지 않으므로 온체인 프로그램에서 직접 액세스할 수 있습니다.

**이 플러그인은 AttributeList 필드를 받아들이며**, 이는 키와 값 쌍의 배열로 구성되고 둘 다 문자열입니다.

_[여기](/core/plugins/attribute)에서 더 자세히 알아보세요_

### 프로그램 로직

간단함을 위해 이 예제는 스테이킹 프로그램이 의도한 대로 작동하는 데 필수적인 **stake**와 **unstake** 함수, 두 가지 인스트럭션만 포함합니다. 누적된 포인트를 활용하는 **spendPoint** 인스트럭션과 같은 추가 인스트럭션을 추가할 수 있지만 이는 독자가 구현하도록 남겨두었습니다.

_Stake와 Unstake 함수 모두 이전에 소개된 플러그인들을 다르게 활용합니다_.

인스트럭션을 살펴보기 전에 사용되는 속성인 `staked`와 `staked_time` 키에 대해 이야기해 보겠습니다. `staked` 키는 자산이 스테이킹되었는지와 스테이킹된 경우 언제 스테이킹되었는지를 나타냅니다(언스테이킹됨 = 0, 스테이킹됨 = 스테이킹된 시간). `staked_time` 키는 자산의 총 스테이킹 기간을 추적하며, 자산이 언스테이킹된 후에만 업데이트됩니다.

**인스트럭션**:
- **Stake**: 이 인스트럭션은 플래그를 true로 설정하여 자산을 동결하기 위해 Freeze Delegate 플러그인을 적용합니다. 또한 Attribute 플러그인의 `staked` 키를 0에서 현재 시간으로 업데이트합니다.
- **Unstake**: 이 인스트럭션은 Freeze Delegate 플러그인의 플래그를 변경하고 악의적인 엔티티가 자산을 제어하고 해동하기 위해 몸값을 요구하는 것을 방지하기 위해 취소합니다. 또한 `staked` 키를 0으로 업데이트하고 `staked_time`을 현재 시간에서 스테이킹된 타임스탬프를 뺀 값으로 설정합니다.

## 프로그램 구축: 단계별 가이드

이제 프로그램 뒤의 로직을 이해했으므로 **코드에 뛰어들어 모든 것을 결합할 시간입니다**!

### 의존성 및 임포트

프로그램을 작성하기 전에 프로그램이 작동하도록 하기 위해 필요한 패키지와 그들로부터 필요한 함수를 살펴보겠습니다!

이 예제에서 사용되는 다양한 패키지를 살펴보겠습니다:

```json
"dependencies": {
    "@metaplex-foundation/mpl-core": "1.1.0-alpha.0",
    "@metaplex-foundation/mpl-token-metadata": "^3.2.1",
    "@metaplex-foundation/umi-bundle-defaults": "^0.9.1",
    "bs58": "^5.0.0",
    "typescript": "^5.4.5"
}
```

그리고 이러한 패키지들로부터의 다양한 함수들은 다음과 같습니다:

```typescript
import { createSignerFromKeypair, signerIdentity, publicKey, transactionBuilder, Transaction } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { addPlugin, updatePlugin, fetchAsset, removePlugin } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';
```

### Umi 및 Core SDK 개요

이 가이드에서는 **Umi**와 **Core SDK**를 모두 사용하여 필요한 모든 인스트럭션을 생성합니다.

**Umi는 Solana 프로그램용 JavaScript 클라이언트를 구축하고 사용하기 위한 모듈식 프레임워크**입니다. 핵심 인터페이스 세트를 정의하는 의존성 없는 라이브러리를 제공하여 라이브러리가 특정 구현과 독립적으로 작동할 수 있게 합니다.

_더 자세한 정보는 [여기](/umi/getting-started)에서 개요를 찾을 수 있습니다_

**이 예제의 기본 Umi 설정은 다음과 같습니다**:
```typescript
const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
```

이 설정은 다음을 포함합니다:
- **Umi 제공업체를 위한 Devnet과의 연결 설정**
- **권한과 지불자로 사용될 키페어 설정** (umi.use(signerIdentity(...)))

**참고**: 이 예제에 새 키페어를 사용하려면 언제든지 generateSigner() 함수를 사용하여 하나를 생성할 수 있습니다.

### 자산 생성 및 컬렉션에 추가

스테이킹과 언스테이킹 로직을 살펴보기 전에 **처음부터 자산을 생성하고 컬렉션에 추가하는 방법**을 배워야 합니다.

**컬렉션 생성**:
```typescript
(async () => {
   // 컬렉션 KeyPair 생성
   const collection = generateSigner(umi)
   console.log("\nCollection Address: ", collection.publicKey.toString())

   // 컬렉션 생성
   const tx = await createCollection(umi, {
       collection: collection,
       name: 'My Collection',
       uri: 'https://example.com/my-collection.json',
   }).sendAndConfirm(umi)

   // 트랜잭션에서 서명 역직렬화
   const signature = base58.deserialize(tx.signature)[0];
   console.log(`\nCollection Created: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
})();
```

**자산 생성 및 컬렉션에 추가:**
```typescript
(async () => {
   // 자산 KeyPair 생성
   const asset = generateSigner(umi)
   console.log("\nAsset Address: ", asset.publicKey.toString())


   // 컬렉션 전달 및 가져오기
   const collection = publicKey("<collection_pubkey>")
   const fetchedCollection = await fetchCollection(umi, collection);


   // 자산 생성
   const tx = await create(umi, {
       name: 'My NFT',
       uri: 'https://example.com/my-nft.json',
       asset,
       collection: fetchedCollection,
   }).sendAndConfirm(umi)


   // 트랜잭션에서 서명 역직렬화
   const signature = base58.deserialize(tx.signature)[0];
   console.log(`Asset added to the Collection: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
})();
```

### 스테이킹 인스트럭션

다음은 완전한 **스테이킹 인스트럭션**입니다.
mpl-core SDK의 `fetchAsset(...)` 인스트럭션을 사용하여 attribute 플러그인이 있는지 여부와 있다면 포함하고 있는 속성을 포함하여 자산에 대한 정보를 검색하는 것부터 시작합니다.

```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```

1. **Attribute 플러그인 확인**
자산에 attribute 플러그인이 없다면 추가하고 `staked`와 `stakedTime` 키로 채웁니다.

```typescript
if (!fetchedAsset.attributes) {
    tx = await transactionBuilder().add(addPlugin(umi, {
        asset,
        collection,
        plugin: {
        type: "Attributes",
        attributeList: [
            { key: "staked", value: currentTime },
            { key: "stakedTime", value: "0" },
        ],
        },
    })).add(
        [...]
    )
} else {
```

2. **스테이킹 속성 확인**:
자산에 스테이킹 속성이 있다면 스테이킹 인스트럭션에 필요한 스테이킹 속성이 포함되어 있는지 확인합니다.

```typescript
} else {
    const assetAttribute = fetchedAsset.attributes.attributeList;
    const isInitialized = assetAttribute.some(
        (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
    );
```

있다면 자산이 이미 스테이킹되었는지 확인하고 `staked` 키를 현재 타임스탬프 문자열로 업데이트합니다:

```typescript
if (isInitialized) {
    const stakedAttribute = assetAttribute.find(
        (attr) => attr.key === "staked"
    );

    if (stakedAttribute && stakedAttribute.value !== "0") {
        throw new Error("Asset is already staked");
    } else {
        assetAttribute.forEach((attr) => {
            if (attr.key === "staked") {
                attr.value = currentTime;
            }
        });
    }
} else {
```

없다면 기존 속성 목록에 추가합니다.

```typescript
} else {
    assetAttribute.push({ key: "staked", value: currentTime });
    assetAttribute.push({ key: "stakedTime", value: "0" });
}
```

3. **Attribute 플러그인 업데이트**:
새롭거나 수정된 속성으로 attribute 플러그인을 업데이트합니다.

```typescript
tx = await transactionBuilder().add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "Attributes",
        attributeList: assetAttribute,
    },
})).add(
    [...]
)
```

4. **자산 동결**
자산에 이미 attribute 플러그인이 있었든 없었든 거래될 수 없도록 자산을 제자리에서 동결합니다.

```typescript
tx = await transactionBuilder().add(
    [...]
).add(addPlugin(umi, {
    asset,
    collection,
    plugin: {
        type: "FreezeDelegate",
        frozen: true,
        authority: { type: "UpdateAuthority" }
    }
})).buildAndSign(umi);
```

**전체 인스트럭션은 다음과 같습니다**:
```typescript
(async () => {
    // 자산과 컬렉션 전달
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")

    // 자산 속성 가져오기
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("\nThis is the current state of your Asset Attribute Plugin: ", fetchedAsset.attributes);

    const currentTime = new Date().getTime().toString();

    let tx: Transaction;

    // 자산에 Attribute 플러그인이 연결되어 있는지 확인하고, 없다면 추가
    if (!fetchedAsset.attributes) {
        tx = await transactionBuilder().add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
            type: "Attributes",
            attributeList: [
                { key: "staked", value: currentTime },
                { key: "stakedTime", value: "0" },
            ],
            },
        })).add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
                type: "FreezeDelegate",
                frozen: true,
                authority: { type: "UpdateAuthority" }
            }
        })).buildAndSign(umi);
    } else {
        // 있다면 자산 Attribute 플러그인 attributeList 가져오기
        const assetAttribute = fetchedAsset.attributes.attributeList;
        // 자산이 이미 스테이킹되었는지 확인
        const isInitialized = assetAttribute.some(
            (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
        );

        // 그렇다면 이미 스테이킹되었는지 확인하고 그렇지 않다면 staked 속성 업데이트
        if (isInitialized) {
            const stakedAttribute = assetAttribute.find(
                (attr) => attr.key === "staked"
            );

            if (stakedAttribute && stakedAttribute.value !== "0") {
                throw new Error("Asset is already staked");
            } else {
                assetAttribute.forEach((attr) => {
                    if (attr.key === "staked") {
                        attr.value = currentTime;
                    }
                });
            }
        } else {
            // 그렇지 않다면 staked & stakedTime 속성 추가
            assetAttribute.push({ key: "staked", value: currentTime });
            assetAttribute.push({ key: "stakedTime", value: "0" });
        }

        // 자산 Attribute 플러그인 업데이트 및 FreezeDelegate 플러그인 추가
        tx = await transactionBuilder().add(updatePlugin(umi, {
            asset,
            collection,
            plugin: {
            type: "Attributes",
                attributeList: assetAttribute,
            },
        })).add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
                type: "FreezeDelegate",
                frozen: true,
                authority: { type: "UpdateAuthority" }
            }
        })).buildAndSign(umi);
    }

    // 트랜잭션에서 서명 역직렬화
    console.log(`Asset Staked: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=devnet-alpha`);
})();
```

### 언스테이킹 인스트럭션

언스테이킹 인스트럭션은 스테이킹 인스트럭션 후에만 호출될 수 있으므로 많은 검사가 스테이킹 인스트럭션 자체에 의해 본질적으로 처리되기 때문에 훨씬 더 간단할 것입니다.

자산에 대한 모든 정보를 검색하기 위해 `fetchAsset(...)` 인스트럭션을 호출하는 것부터 시작합니다.

```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```

1. **attribute 플러그인에 대한 모든 검사 실행**

자산이 이미 스테이킹 인스트럭션을 거쳤는지 확인하기 위해 **인스트럭션은 다음에 대해 attribute 플러그인을 확인합니다**:
- **자산에 attribute 플러그인이 존재하는가?**
- **staked 키가 있는가?**
- **stakedTime 키가 있는가?**

이러한 검사 중 하나라도 누락되면 자산은 스테이킹 인스트럭션을 거친 적이 없습니다.

```typescript
if (!fetchedAsset.attributes) {
    throw new Error(
        "Asset has no Attribute Plugin attached to it. Please go through the stake instruction before."
    );
}

const assetAttribute = fetchedAsset.attributes.attributeList;
const stakedTimeAttribute = assetAttribute.find((attr) => attr.key === "stakedTime");
if (!stakedTimeAttribute) {
    throw new Error(
        "Asset has no stakedTime attribute attached to it. Please go through the stake instruction before."
    );
}

const stakedAttribute = assetAttribute.find((attr) => attr.key === "staked");
if (!stakedAttribute) {
    throw new Error(
        "Asset has no staked attribute attached to it. Please go through the stake instruction before."
    );
}
```

자산에 스테이킹 속성이 있음을 확인한 후 **자산이 현재 스테이킹되어 있는지 확인합니다**. 스테이킹되어 있다면 다음과 같이 스테이킹 속성을 업데이트합니다:
- `Staked` 필드를 0으로 설정
- `stakedTime`을 `stakedTime` + (currentTimestamp - stakedTimestamp)로 업데이트

```typescript
if (stakedAttribute.value === "0") {
    throw new Error("Asset is not staked");
} else {
    const stakedTimeValue = parseInt(stakedTimeAttribute.value);
    const stakedValue = parseInt(stakedAttribute.value);
    const elapsedTime = new Date().getTime() - stakedValue;

    assetAttribute.forEach((attr) => {
        if (attr.key === "stakedTime") {
            attr.value = (stakedTimeValue + elapsedTime).toString();
        }
        if (attr.key === "staked") {
            attr.value = "0";
        }
    });
}
```

2. **Attribute 플러그인 업데이트**
새롭거나 수정된 속성으로 attribute 플러그인을 업데이트합니다.

```typescript
tx = await transactionBuilder().add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
        type: "Attributes",
        attributeList: assetAttribute,
    },
})).add(
    [...]
).add(
    [...]
).buildAndSign(umi);
```

3. **FreezeDelegate 플러그인 해동 및 제거**
인스트럭션의 끝에서 자산을 해동하고 FreezeDelegate 플러그인을 제거하여 자산이 `자유롭고` `update_authority`에 의해 제어되지 않도록 합니다.

```typescript
tx = await transactionBuilder().add(
    [...]
).add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "FreezeDelegate",
    frozen: false,
    },
})).add(removePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "FreezeDelegate",
    },
})).buildAndSign(umi);
```

**전체 인스트럭션은 다음과 같습니다**:
```typescript
(async () => {
    // 자산과 컬렉션 전달
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")

    let tx: Transaction;

    // 자산 속성 가져오기
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("This is the current state of your Asset Attribute Plugin", fetchedAsset.attributes);

    // 자산에 attribute 플러그인이 연결되어 있지 않다면 오류 발생
    if (!fetchedAsset.attributes) {
      throw new Error(
        "Asset has no Attribute Plugin attached to it. Please go through the stake instruction before."
      );
    }

    const assetAttribute = fetchedAsset.attributes.attributeList;
    // 자산에 stakedTime 속성이 연결되어 있는지 확인하고, 없다면 오류 발생
    const stakedTimeAttribute = assetAttribute.find((attr) => attr.key === "stakedTime");
    if (!stakedTimeAttribute) {
      throw new Error(
        "Asset has no stakedTime attribute attached to it. Please go through the stake instruction before."
      );
    }

    // 자산에 staked 속성이 연결되어 있는지 확인하고, 없다면 오류 발생
    const stakedAttribute = assetAttribute.find((attr) => attr.key === "staked");
    if (!stakedAttribute) {
      throw new Error(
        "Asset has no staked attribute attached to it. Please go through the stake instruction before."
      );
    }

    // 자산이 이미 스테이킹되었는지(!0) 확인하고, 그렇지 않다면 오류 발생.
    if (stakedAttribute.value === "0") {
      throw new Error("Asset is not staked");
    } else {
      const stakedTimeValue = parseInt(stakedTimeAttribute.value);
      const stakedValue = parseInt(stakedAttribute.value);
      const elapsedTime = new Date().getTime() - stakedValue;

      // stakedTime 속성을 새 값으로 업데이트하고 staked 속성을 0으로 업데이트
      assetAttribute.forEach((attr) => {
        if (attr.key === "stakedTime") {
          attr.value = (stakedTimeValue + elapsedTime).toString();
        }
        if (attr.key === "staked") {
          attr.value = "0";
        }
      });
    }

    // 새 attributeList로 자산 Attribute 플러그인 업데이트
    // 그 다음 자산을 해동하기 위해 자산 FreezeDelegate 플러그인 업데이트
    // 그리고 자산에서 FreezeDelegate 플러그인 제거
    tx = await transactionBuilder().add(updatePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "Attributes",
        attributeList: assetAttribute,
      },
    })).add(updatePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "FreezeDelegate",
        frozen: false,
      },
    })).add(removePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "FreezeDelegate",
      },
    })).buildAndSign(umi);

     // 트랜잭션에서 서명 역직렬화
     console.log(`Asset Unstaked: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=devnet-alpha`);
})();
```

## 결론

축하합니다! 이제 NFT 컬렉션을 위한 스테이킹 솔루션을 생성할 수 있는 장비를 갖추었습니다! Core와 Metaplex에 대해 더 자세히 알고 싶다면 [개발자 허브](/core/getting-started)를 확인하세요.