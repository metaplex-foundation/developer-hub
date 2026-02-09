---
title: Umiのインターフェース
metaTitle: インターフェース | Umi
description: Umiのインターフェースの概要
---
## コアインターフェース

Umiは、Solanaブロックチェーンとの相互作用を簡単にするコアインターフェースのセットを定義します。具体的には、以下の通りです：
- [`Signer`](https://umi.typedoc.metaplex.com/interfaces/umi.Signer.html): トランザクションとメッセージに署名できるウォレットを表すインターフェース。
- [`EddsaInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.EddsaInterface.html): EdDSAアルゴリズムを使用してキーペアの作成、PDAの検索、メッセージの署名/検証を行うインターフェース。
- [`RpcInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html): Solana RPCクライアントを表すインターフェース。
- [`TransactionFactoryInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.TransactionFactoryInterface.html): トランザクションの作成とシリアライゼーションを可能にするインターフェース。
- [`UploaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html): ファイルをアップロードし、それらにアクセスするためのURIを取得するインターフェース。
- [`DownloaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.DownloaderInterface.html): 指定されたURIからファイルをダウンロードするインターフェース。
- [`HttpInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.HttpInterface.html): HTTPリクエストを送信するインターフェース。
- [`ProgramRepositoryInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.ProgramRepositoryInterface.html): プログラムの登録と取得のためのインターフェース。

## Contextインターフェース

上記のインターフェースはすべて、コード内でそれらを注入するために使用できる`Context`インターフェースで定義されています。`Context`タイプは次のように定義されています：

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

ご覧のように、`Signer`インターフェースはコンテキスト内で2回使用されています：
- `identity`として1回：あなたのアプリを使用する署名者。
- `payer`として1回：トランザクション手数料やストレージ手数料などの費用を支払う署名者。通常、これは`identity`と同じ署名者になりますが、それらを分離することで、アプリにより多くの柔軟性を提供します（例：ユーザーエクスペリエンスを向上させるためにユーザーからいくつかのコストを抽象化したい場合）。

## Umiインターフェース

`Umi`インターフェースはこの`Context`インターフェースの上に構築され、エンドユーザーがプラグインを登録できる`use`メソッドを追加するだけです。次のように定義されています：

```ts
interface Umi extends Context {
  use(plugin: UmiPlugin): Umi;
}
```

したがって、エンドユーザーは次のように`Umi`インスタンスにプラグインを追加できます：

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
