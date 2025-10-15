---
title: 다른 지갑으로 NFT를 민팅하는 방법 - 에어드롭 예제
metaTitle: Candy Machine에서 다른 지갑으로 민팅 | Candy Machine
description: Candy Machine에서 다른 지갑 주소로 NFT를 민팅하는 방법에 대한 개발자 가이드입니다. 에어드롭 및 유사한 사용 사례에 유용합니다.
---

## 개요
이 가이드는 Candy Machine에서 다른 지갑 주소로 NFT를 민팅하는 방법을 설명합니다 - 에어드롭, 경품 또는 여러 수신자에게 NFT를 배포하는 일반적인 요구사항입니다.

## 사전 준비사항
둘 중 하나
- Solana와 NFT에 대한 기본적인 이해
- 거래 수수료를 위한 자금이 있는 지갑

- Sugar CLI (v2.0.0 이상)
또는
- Node.js 16.0 이상
- @metaplex-foundation/mpl-token-metadata
- @metaplex-foundation/mpl-toolbox
- @metaplex-foundation/umi-bundle-defaults
- @metaplex-foundation/mpl-candy-machine

다른 지갑으로 NFT를 민팅하는 것은 에어드롭, 경품 또는 여러 수신자에게 NFT를 배포하는 데 특히 유용할 수 있습니다. 이 가이드는 Candy Machine에서 다른 지갑 주소로 NFT를 민팅하는 과정을 안내합니다. 민팅 프로세스를 시작하는 사람이 민팅 비용을 부담한다는 점에 유의해야 합니다. 따라서 수신자가 직접 NFT를 클레임하도록 하는 것이 종종 더 비용 효율적입니다.

{% callout type="note" title="중요한 고려사항" %}
- 다른 지갑으로 민팅하는 것은 비용이 많이 들 수 있습니다. 대신 클레임 메커니즘을 사용하는 것을 고려할 수 있습니다.
- 가드가 있는 Candy Machine과 가드가 없는 Candy Machine에는 다른 도구를 사용할 수 있습니다. 가드 없이 민팅하는 것이 일반적으로 더 쉽습니다.
{% /callout %}

이 가이드에는 두 가지 접근 방식이 설명되어 있습니다:
1. [sugar CLI](#using-sugar-cli)를 사용한 민팅
2. [Javascript](#using-typescript-and-mpl-candy-machine)를 사용한 민팅

## Sugar CLI 사용
Sugar CLI는 다른 지갑으로 NFT를 민팅하기 위한 두 가지 주요 명령을 제공합니다:
1. `sugar mint` - *하나*의 특정 지갑으로 민팅
2. `sugar airdrop` - *여러* 지갑으로 민팅

### `sugar mint`로 단일 수신자 민팅
단일 수신자 지갑으로 NFT를 민팅하려면 다음 매개변수와 함께 `sugar mint` 명령을 사용하세요:

- `--receiver <WALLET>`: 수신자의 지갑 주소를 지정
- `--number <NUMBER>`: (선택 사항) 해당 지갑으로 민팅할 NFT 수를 지정

**예제**:

지갑 Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV로 3개의 NFT를 민팅하려면 다음과 같이 호출합니다:

```sh
sugar mint --receiver Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV -n 3 --candy-machine 11111111111111111111111111111111
```

### `sugar airdrop`으로 여러 수신자에게 민팅

단일 명령으로 여러 지갑에 NFT를 민팅하려면 `sugar airdrop`을 사용할 수 있습니다. 이는 주소와 각 지갑이 받을 NFT 수를 포함하는 파일이 필요합니다. 이러한 파일은 예를 들어 특정 컬렉션의 NFT 소유자를 스냅샷하고 그들의 지갑과 보유한 NFT를 다음 형식의 파일에 추가하여 생성할 수 있습니다:

```json
{
  "22222222222222222222222222222222": 3,
  "33333333333333333333333333333333": 1
}
```

기본적으로 sugar는 이 파일이 `airdrop_list.json`이라고 불리기를 기대합니다. 이 기본 이름은 `--airdrop-list`로 변경할 수 있습니다.

**예제**:
이 에어드롭을 실행하려면 다음 명령을 사용할 수 있습니다
```sh
sugar airdrop --candy-machine 11111111111111111111111111111111
```

## Typescript와 `mpl-candy-machine` 사용

이 섹션에서는 Javascript에서 민트 함수에 대한 코드 스니펫을 보여줍니다. 두 예제 모두 candy machine이 생성되고 이후 단일 NFT가 민팅되는 전체 코드 스니펫을 포함합니다. 완전한 에어드롭 스크립트를 구현하려면 민트 함수 주위에 루프와 오류 처리를 구현해야 합니다.

Typescript를 사용하여 다른 지갑으로 민팅할 때 Candy Machine이 가드를 사용하는지 여부에 따라 두 가지 주요 접근 방식이 있습니다:

### 가드 없이 민팅
가드가 없는 Candy Machine의 경우 `mintFromCandyMachineV2`를 사용하세요. 이 함수를 사용하면 수신자를 `nftOwner`로 직접 지정할 수 있습니다.

Solana 및 Eclipse 블록체인에서 Metaplex Aura 네트워크에 액세스하려면 [여기](https://aura-app.metaplex.com/)에서 엔드포인트 및 API 키에 대한 Aura 앱을 방문할 수 있습니다.

```js
const candyMachineAccount = await fetchCandyMachine(umi, publicKey("CM Address"));

const recipient = publicKey('Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV')
const nftMint = generateSigner(umi)
const mintTx = await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachineAccount.publicKey,
      nftMint,
      token: findAssociatedTokenPda(umi, {
        mint: nftMint.publicKey,
        owner: recipient,
      }),
      collectionMint: candyMachineAccount.collectionMint,
      collectionUpdateAuthority: candyMachineAccount.authority,
      tokenStandard: TokenStandard.NonFungible,
      mintArgs: {
        mintLimit: some({ // mintArgs가 필요한 가드는 여기에 지정해야 합니다
          id: 1,
        }),
      },
    })
  )
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' },
  })
```

{% totem %}
{% totem-accordion title="전체 코드 예제" %}
```js
import {
  addConfigLines,
  createCandyMachineV2,
  fetchCandyMachine,
  mintFromCandyMachineV2,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi-serializers";
import {
  createMintWithAssociatedToken,
  setComputeUnitLimit,
} from "@metaplex-foundation/mpl-toolbox";

/**
 * 이 스크립트는 가드 없이 기본 Candy Machine을 생성하고
 * 수신자 지갑으로 NFT를 민팅하는 방법을 보여줍니다.
 */

// 구성
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "https://devnet-aura.metaplex.com/<YOUR_API_KEY>";

(async () => {
  try {
    // --- 설정 ---
    
    // Solana에 연결 초기화
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // 테스트 지갑 생성 및 자금 조달
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- 컬렉션 NFT 생성 ---
    
    const collectionMint = generateSigner(umi);
    console.log("컬렉션 NFT 생성 중...");
    console.log("컬렉션 주소:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
      collectionDetails: {
        __kind: 'V1',
        size: 0,
      },
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("컬렉션 생성됨:", base58.deserialize(createNftTx.signature)[0]);

    // --- Candy Machine 생성 ---

    console.log("기본 Candy Machine 생성 중...");
    const candyMachine = generateSigner(umi);
    
    const createCandyMachineV2Tx = await (
      await createCandyMachineV2(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 2,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          {
            address: umi.identity.publicKey,
            verified: false,
            percentageShare: 100,
          },
        ],
        configLineSettings: some({
          prefixName: "My NFT #",
          nameLength: 3,
          prefixUri: "https://example.com/",
          uriLength: 29,
          isSequential: false,
        }),
      })
    )
      .add(
        addConfigLines(umi, {
          candyMachine: candyMachine.publicKey,
          index: 0,
          configLines: [
            { name: "1", uri: "https://example.com/nft1.json" },
            { name: "2", uri: "https://example.com/nft2.json" },
          ],
        })
      )
      .sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
      
    console.log("Candy Machine 생성됨:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- NFT 민팅 ---

    console.log("수신자에게 NFT 민팅 중...");
    
    // 최신 Candy Machine 상태 가져오기
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // 민트 트랜잭션 생성
    const nftMint = generateSigner(umi);
    const mintTx = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient })
      )
      .add(
        mintFromCandyMachineV2(umi, {
          candyMachine: candyMachine.publicKey,
          mintAuthority: umi.identity,
          nftOwner: recipient,
          nftMint,
          collectionMint: candyMachineAccount.collectionMint,
          collectionUpdateAuthority: candyMachineAccount.authority,
        })
      )
      .sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

    console.log("NFT 민팅 성공!");  
    console.log("민트 트랜잭션:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("실행 실패:", error);
  }
})();

```
{% /totem-accordion  %}
{% /totem %}

### 가드와 함께 민팅
가드가 있는 Candy Machine의 경우 `mintV2`를 사용하세요. 이 경우 먼저 `createMintWithAssociatedToken`을 사용하여 수신자를 위한 토큰 계정과 연결 토큰 계정을 생성해야 합니다. 이를 통해 수신자는 트랜잭션에 서명할 필요 없이 NFT를 받을 수 있습니다.

```js
const candyMachineAccount = await fetchCandyMachine(umi, publicKey("CM Address"));

const recipient = publicKey('Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV')
const nftMint = generateSigner(umi)
const mintTx = await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient }))
  .add(
    mintFromCandyMachineV2(umi, {
      candyMachine: candyMachine.publicKey,
      mintAuthority: umi.identity,
      nftOwner: recipient,
      nftMint,
      collectionMint: candyMachineAccount.collectionMint,
      collectionUpdateAuthority: candyMachineAccount.authority,
    })
  )
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' },
  })
```

{% totem %}
{% totem-accordion title="전체 코드 예제" %}
```js
import {
  addConfigLines,
  create,
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from "@metaplex-foundation/umi-serializers";
import {
  createMintWithAssociatedToken,
  findAssociatedTokenPda,
  setComputeUnitLimit,
} from "@metaplex-foundation/mpl-toolbox";

/**
 * 이 스크립트는 민트 제한 가드가 있는 Candy Machine을 생성하고
 * 수신자 지갑으로 NFT를 민팅하는 방법을 보여줍니다.
 */

// 구성
const RECIPIENT_ADDRESS = "Tes1zkZkXhgTaMFqVgbgvMsVkRJpq4Y6g54SbDBeKVV";
const RPC_ENDPOINT = "ENDPOINT";

(async () => {
  try {
    // --- 설정 ---
    
    // Solana에 연결 초기화
    const umi = createUmi(RPC_ENDPOINT).use(mplCandyMachine());
    const recipient = publicKey(RECIPIENT_ADDRESS);

    // 테스트 지갑 생성 및 자금 조달
    const walletSigner = generateSigner(umi);
    umi.use(keypairIdentity(walletSigner));
    console.log("devnet SOL로 테스트 지갑에 자금 조달 중...");
    await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1), {
      commitment: "finalized",
    });

    // --- 컬렉션 NFT 생성 ---
    
    const collectionMint = generateSigner(umi);
    console.log("컬렉션 NFT 생성 중...");
    console.log("컬렉션 주소:", collectionMint.publicKey);

    const createNftTx = await createNft(umi, {
      mint: collectionMint,
      authority: umi.identity,
      name: "My Collection NFT",
      uri: "https://example.com/path/to/some/json/metadata.json",
      sellerFeeBasisPoints: percentAmount(9.99, 2),
      isCollection: true,
      collectionDetails: {
        __kind: 'V1',
        size: 0,
      },
    }).sendAndConfirm(umi, {
      confirm: { commitment: "finalized" },
    });
    console.log("컬렉션 생성됨:", base58.deserialize(createNftTx.signature)[0]);

    // --- Candy Machine 생성 ---

    console.log("민트 제한 가드로 Candy Machine 생성 중...");
    const candyMachine = generateSigner(umi);
    
    const createCandyMachineV2Tx = await (
      await create(umi, {
        candyMachine,
        tokenStandard: TokenStandard.NonFungible,
        collectionMint: collectionMint.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 2,
        sellerFeeBasisPoints: percentAmount(1.23),
        creators: [
          {
            address: umi.identity.publicKey,
            verified: false,
            percentageShare: 100,
          },
        ],
        guards: {
          mintLimit: some({
            id: 1,
            limit: 2,
          }),
        },
        configLineSettings: some({
          prefixName: "My NFT #",
          nameLength: 3,
          prefixUri: "https://example.com/",
          uriLength: 29,
          isSequential: false,
        }),
      })
    )
      .add(
        addConfigLines(umi, {
          candyMachine: candyMachine.publicKey,
          index: 0,
          configLines: [
            { name: "1", uri: "https://example.com/nft1.json" },
            { name: "2", uri: "https://example.com/nft2.json" },
          ],
        })
      )
      .sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
      
    console.log("Candy Machine 생성됨:", base58.deserialize(createCandyMachineV2Tx.signature)[0]);

    // --- NFT 민팅 ---

    console.log("수신자에게 NFT 민팅 중...");
    
    // 최신 Candy Machine 상태 가져오기
    const candyMachineAccount = await fetchCandyMachine(umi, candyMachine.publicKey);

    // 민트 트랜잭션 생성
    const nftMint = generateSigner(umi);
    const mintTx = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        createMintWithAssociatedToken(umi, { mint: nftMint, owner: recipient })
      )
      .add(
        mintV2(umi, {
          candyMachine: candyMachineAccount.publicKey,
          nftMint,
          token: findAssociatedTokenPda(umi, {
            mint: nftMint.publicKey,
            owner: recipient,
          }),
          collectionMint: candyMachineAccount.collectionMint,
          collectionUpdateAuthority: candyMachineAccount.authority,
          tokenStandard: TokenStandard.NonFungible,
          mintArgs: {
            mintLimit: some({
              id: 1,
            }),
          },
        })
      )
      .sendAndConfirm(umi, {
        confirm: { commitment: "finalized" },
      });

    console.log("NFT 민팅 성공!");
    console.log("민트 트랜잭션:", base58.deserialize(mintTx.signature)[0]);

  } catch (error) {
    console.error("실행 실패:", error);
  }
})();
```
{% /totem-accordion  %}
{% /totem %}
