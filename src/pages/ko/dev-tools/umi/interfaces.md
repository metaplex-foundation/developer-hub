---
title: Umi의 인터페이스
metaTitle: 인터페이스 | Umi
description: Umi의 인터페이스 개요
---
## 핵심 인터페이스

Umi는 Solana 블록체인과 쉽게 상호작용할 수 있게 해주는 핵심 인터페이스 세트를 정의합니다. 구체적으로는 다음과 같습니다:

- [`Signer`](https://umi.typedoc.metaplex.com/interfaces/umi.Signer.html): 트랜잭션과 메시지에 서명할 수 있는 지갑을 나타내는 인터페이스입니다.
- [`EddsaInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.EddsaInterface.html): EdDSA 알고리즘을 사용하여 키페어를 생성하고, PDA를 찾고, 메시지에 서명/검증하는 인터페이스입니다.
- [`RpcInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html): Solana RPC 클라이언트를 나타내는 인터페이스입니다.
- [`TransactionFactoryInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.TransactionFactoryInterface.html): 트랜잭션을 생성하고 직렬화할 수 있게 해주는 인터페이스입니다.
- [`UploaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html): 파일을 업로드하고 접근할 수 있는 URI를 얻을 수 있게 해주는 인터페이스입니다.
- [`DownloaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.DownloaderInterface.html): 주어진 URI에서 파일을 다운로드할 수 있게 해주는 인터페이스입니다.
- [`HttpInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.HttpInterface.html): HTTP 요청을 보낼 수 있게 해주는 인터페이스입니다.
- [`ProgramRepositoryInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.ProgramRepositoryInterface.html): 프로그램을 등록하고 검색하는 인터페이스입니다.

## Context 인터페이스

위의 인터페이스들은 모두 코드에 주입하는 데 사용할 수 있는 `Context` 인터페이스에 정의되어 있습니다. `Context` 타입은 다음과 같이 정의됩니다:

```ts
interface Context {
  downloader: DownloaderInterface;
  eddsa: EddsaInterface;
  http: HttpInterface;
  identity: Signer;
  payer: Signer;
  programs: ProgramRepositoryInterface;
  rpc: RpcInterface;
  transactions: TransactionFactoryInterface;
  uploader: UploaderInterface;
};
```

보시다시피 `Signer` 인터페이스는 컨텍스트에서 두 번 사용됩니다:

- `identity`는 앱을 사용하는 서명자입니다.
- `payer`는 트랜잭션 수수료와 스토리지 수수료 같은 비용을 지불하는 서명자입니다. 보통 이는 `identity`와 같은 서명자이지만 이를 분리함으로써 앱에 더 많은 유연성을 제공합니다. 예를 들어 사용자 경험을 개선하기 위해 사용자로부터 일부 비용을 추상화하고자 하는 경우입니다.

## Umi 인터페이스

`Umi` 인터페이스는 이 `Context` 인터페이스 위에 구축되며 최종 사용자가 플러그인을 등록할 수 있게 해주는 `use` 메서드만 추가합니다. 다음과 같이 정의됩니다:

```ts
interface Umi extends Context {
  use(plugin: UmiPlugin): Umi;
}
```

따라서 최종 사용자는 다음과 같이 `Umi` 인스턴스에 플러그인을 추가할 수 있습니다:

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { awsUploader } from '@metaplex-foundation/umi-uploader-aws';
import { myProgramRepository } from '../plugins';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(walletAdapterIdentity(...))
  .use(awsUploader(...))
  .use(myProgramRepository());
```
