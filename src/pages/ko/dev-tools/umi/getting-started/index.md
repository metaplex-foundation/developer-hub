---
title: 시작하기
metaTitle: 시작하기 | Umi
description: Solana를 위한 Javascript 프레임워크.
---

## Umi 설치

Umi를 사용하려면 Umi와 사용하고 싶은 모든 외부 플러그인을 설치해야 합니다. 또는 특정 플러그인이 필요하지 않다면 대부분의 사용 사례에 적합한 플러그인 세트가 포함된 기본 번들을 설치할 수 있습니다.

**참고**: 기본 번들이 일부 인터페이스에 web3.js에 의존하므로 해당 패키지도 설치해야 합니다.

### 필수 패키지

{% packagesUsed packages=["umi", "umiDefaults", "@solana/web3.js@1"] type="npm" /%}

설치하려면 다음 명령을 사용하세요:

```
npm i @metaplex-foundation/umi
```

```
npm i @metaplex-foundation/umi-bundle-defaults
```

```
npm i @solana/web3.js@1
```

### 라이브러리 작성자용

종속성을 대폭 줄이기 위해 Umi의 인터페이스를 사용하고자 하는 라이브러리 작성자는 메인 Umi 라이브러리만 설치하면 됩니다. 최종 사용자가 여러 버전의 Umi 라이브러리를 사용하지 않도록 다음 명령을 사용하여 peer 종속성으로 설치하는 것을 적극 권장합니다:

```
npm i @metaplex-foundation/umi --save-peer
```

그런 다음 Umi의 `Context` 객체나 그 일부를 사용하여 함수에 필요한 인터페이스를 주입할 수 있습니다.

{% totem %}

{% totem-accordion title="예시" %}

```ts
import type { Context, PublicKey } from '@metaplex-foundation/umi';
import { u32 } from '@metaplex-foundation/umi/serializers';

export async function myFunction(
  context: Pick<Context, 'rpc'>, // <-- 필요한 인터페이스를 주입합니다.
  publicKey: PublicKey
): number {
  const rawAccount = await context.rpc.getAccount(publicKey);
  if (!rawAccount.exists) return 0;
  return u32().deserialize(rawAccount.data)[0];
}
```

{% /totem-accordion %}

{% /totem %}

### 테스트용

또한 Umi는 최종 사용자와 라이브러리 작성자 모두가 코드를 테스트하는 데 도움이 될 수 있는 테스팅 번들을 제공합니다. 예를 들어, 실제 스토리지 제공업체에 의존하지 않고 코드를 안정적으로 테스트할 수 있도록 `UploaderInterface`와 `DownloaderInterface` 모두에 사용되는 `MockStorage` 구현이 포함되어 있습니다.

```
npm i @metaplex-foundation/umi
```

```
npm i @metaplex-foundation/umi-bundle-tests
```

## Umi 기본사항

이 섹션에서는 Umi를 시작하는 데 필요한 기본 단계를 다룹니다:
- [Umi 생성 및 RPC 연결](/ko/dev-tools/umi/getting-started#connecting-to-an-rpc)
- [지갑 연결](/ko/dev-tools/umi/getting-started#connecting-a-wallet)
- [프로그램 및 클라이언트 등록](/ko/dev-tools/umi/getting-started#registering-programs-and-clients)

### RPC에 연결

Solana는 다양한 목적을 제공하는 서로 다른 클러스터(예: Mainnet-beta, Devnet, Testnet, ...)를 가지고 있으며, 각각은 RPC 요청을 처리하는 전용 API 노드를 가지고 있습니다.

Umi를 선택한 클러스터에 연결하는 것은 RPC 엔드포인트가 첫 번째 인수로 전달되므로 umi 인스턴스를 생성하는 것만큼 간단합니다.

**참고**: **Mainnet**에 연결하는 경우 제한 사항으로 인해 공용 엔드포인트(`https://api.mainnet-beta.solana.com`) 대신 Solana RPC 제공업체의 전용 RPC 엔드포인트를 사용하는 것이 권장됩니다.

Umi 인스턴스를 생성하려면 `createUmi` 함수를 가져와서 RPC 엔드포인트를 제공하세요. 선택적으로 두 번째 인수로 커밋 레벨을 지정할 수도 있습니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('<RPC-Endpoint>', '<Commitment-Level>')
```

### 지갑 연결

Umi를 설정할 때 트랜잭션을 전송하기 위해 지갑을 사용하거나 생성해야 합니다. 이를 위해 테스트용 **새 지갑을 생성**하거나, 파일 시스템에서 **기존 지갑을 가져오거나**, 웹 기반 dApp용 **walletAdapter를 사용**할 수 있습니다.

**참고**: `walletAdapter` 섹션은 이미 `walletAdapter`를 설치하고 설정했다고 가정하고 Umi에 연결하는 데 필요한 코드만 제공합니다. 포괄적인 가이드는 [이것](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)을 참조하세요.

{% totem %}

{% totem-accordion title="새 지갑에서" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// 새로운 키페어 서명자를 생성합니다.
const signer = generateSigner(umi)

// Umi에게 새 서명자를 사용하도록 지시합니다.
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="파일 시스템에 저장된 기존 지갑에서" %}

```ts
import * as fs from "fs";
import * as path from "path";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// fs를 사용하여 상대 경로를 통해 사용하고자 하는
// 지갑에 도달할 때까지 파일 시스템을 탐색합니다.
const walletFile = fs.readFileSync(
  path.join(__dirname, './keypair.json')
)

// 일반적으로 키페어는 Uint8Array로 저장되므로
// 사용 가능한 키페어로 변환해야 합니다.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Umi가 이 키페어를 사용하기 전에
// Signer 타입을 생성해야 합니다.
const signer = createSignerFromKeypair(umi, keypair);

// Umi에게 새 서명자를 사용하도록 지시합니다.
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="Wallet Adapter를 사용하여 저장된 기존 지갑에서" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')

// Wallet Adapter를 Umi에 등록
umi.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

**참고**: **Umi** 인터페이스는 **Signer**의 두 인스턴스를 저장합니다: 앱을 사용하는 **identity**와 트랜잭션 및 스토리지 수수료를 지불하는 **payer**. 기본적으로 `signerIdentity` 메서드는 대부분의 경우 신원이 지불자이기도 하므로 **payer** 속성도 업데이트합니다.

자세히 알아보려면 [Umi Context Interfaces 단락](/ko/dev-tools/umi/interfaces#the-context-interface)을 참조하세요.

### 프로그램 및 클라이언트 등록

경우에 따라 Umi는 사용하고자 하는 프로그램이나 클라이언트를 지정하도록 요구합니다(예: Core Asset을 민팅할 때 Umi에게 `Core` 프로그램을 사용하도록 지시해야 함). Umi 인스턴스에서 `.use()` 메서드를 호출하고 클라이언트를 전달하여 이를 수행할 수 있습니다.

`mpl-token-metadata` 클라이언트를 Umi에 등록하는 방법은 다음과 같습니다:

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplTokenMetadata())
```

**참고**: 다음과 같이 `.use()` 호출을 연결하여 여러 클라이언트를 등록할 수도 있습니다:

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplTokenMetadata())
  .use(mplCandyMachine())
```