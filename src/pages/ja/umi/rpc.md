---
title: RPCとの接続
metaTitle: RPCとの接続 | Umi
description: Metaplex Umiを使用したRPCとの接続
---
RPCを介してSolanaブロックチェーンとのやり取りは、あらゆる分散アプリケーションの重要な部分です。Umiは、まさにそれを行うのに役立つ[RpcInterface](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html)を提供します。

## RPCのエンドポイントの設定

デフォルトバンドルを介して新しいUmiインスタンスを作成する際、最初の引数としてRPCのエンドポイントまたは`@solana/web3.js`の`Connection`クラスのインスタンスを渡す必要があります。今後、これはRPCインターフェースでメソッドを呼び出すたびに使用されるエンドポイントまたは`Connection`になります。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { Connection } from '@solana/web3.js';

// RPCエンドポイントを渡す。
const umi = createUmi("https://api.mainnet-beta.solana.com");

// またはweb3.jsからの明示的なConnectionインスタンス。
const umi = createUmi(new Connection("https://api.mainnet-beta.solana.com"));
```

または、提供されるプラグインを使用してRPC実装を明示的に設定または更新することもできます。たとえば、`web3JsRpc`プラグインは、RPC実装を`@solana/web3.js`ライブラリを使用するように設定します。

```ts
import { web3JsRpc } from '@metaplex-foundation/umi-rpc-web3js';
import { Connection } from '@solana/web3.js';

umi.use(web3JsRpc("https://api.mainnet-beta.solana.com"));
umi.use(web3JsRpc(new Connection("https://api.mainnet-beta.solana.com")));
```

## RPCのエンドポイントとクラスターの取得

RPC実装が設定されると、以下のメソッドを介してそのエンドポイントとクラスターにアクセスできます：

```ts
const endpoint = umi.rpc.getEndpoint();
const cluster = umi.rpc.getCluster();
```

ここで、`cluster`は以下のいずれかです：

```ts
type Cluster = "mainnet-beta" | "devnet" | "testnet" | "localnet" | "custom"
```

## トランザクションの送信

以下のメソッドを使用してトランザクションを送信、確認、取得できます：

```ts
const signature = await umi.rpc.sendTransaction(myTransaction);
const confirmResult = await umi.rpc.confirmTransaction(signature, { strategy });
const transaction = await umi.rpc.getTransaction(signature);
```

トランザクションはSolanaクライアントの重要なコンポーネントなので、[トランザクションの送信](/jp/umi/transactions)ドキュメントページでより詳細に説明します。

## アカウントの取得

以下のメソッドを使用してアカウントを取得したり、その存在を確認できます：

```ts
const accountExists = await umi.rpc.accountExists(myPublicKey);
const maybeAccount = await umi.rpc.getAccount(myPublicKey);
const maybeAccounts = await umi.rpc.getAccounts(myPublicKeys);
const accounts = await umi.rpc.getProgramAccounts(myProgramId, { filters });
```

アカウントの取得は最も一般的な操作の1つなので、[アカウントの取得](accounts)ドキュメントページでより詳細に説明します。

## サポートされているクラスターでのSOLのエアドロップ

使用されているクラスターがエアドロップをサポートしている場合、以下のメソッドを使用してアカウントにSOLを送信し、リクエストを確認できます。

```ts
// "myPublicKey"に1.5SOLを送信し、トランザクションが確認されるまで待機。
await umi.rpc.airdrop(myPublicKey, sol(1.5));
```

## アカウントの残高の取得

以下のメソッドを使用して、任意のアカウントのSOL残高を取得できます。これは[ここで文書化されている](helpers#amounts)ように`SolAmount`オブジェクトを返します。

```ts
const balance = await umi.rpc.getBalance(myPublicKey);
```

## 最新のブロックハッシュの取得

以下のメソッドを介して、有効期限ブロック高と一緒に最新のブロックハッシュを取得できます：

```ts
const { blockhash, lastValidBlockHeight } = await umi.rpc.getLatestBlockhash();
```

## 最新のスロットの取得

以下のメソッドを介して、最新のスロットを数値として取得できます：

```ts
const recentSlot = await umi.rpc.getSlot();
```

## レント免除の取得

アカウントのストレージ料金を把握する必要がある場合は、`getRent`メソッドを使用して、アカウントのデータが必要とするバイト数を渡すことができます。これは、レント免除料金（いわゆるストレージ料金）を`SolAmount`として返します。
  
  ```ts
const rent = await umi.rpc.getRent(100);
```

これは自動的にアカウントヘッダーのサイズを考慮するため、アカウントのデータのバイトのみを渡すだけでよいことに注意してください。

今度は、それぞれ100バイトのデータを持つ3つのアカウントのレント免除料金を取得したいとします。`umi.rpc.getRent(100 * 3)`を実行しても正確な応答は得られません。なぜなら、3つのアカウントではなく1つのアカウントのアカウントヘッダーのみが追加されるからです。これが、Umiが`includesHeaderBytes`オプションを`true`に設定することで、アカウントヘッダーサイズを明示的に渡すことを許可する理由です。

```ts
const rent = await umi.rpc.getRent((ACCOUNT_HEADER_SIZE + 100) * 3, {
  includesHeaderBytes: true
});
```

## カスタムRPCリクエストの送信

各RPCエンドポイントは独自のカスタムメソッドを提供する場合があるため、Umiでは`call`メソッドを介してRPCにカスタムリクエストを送信できます。最初の引数としてメソッド名を取り、2番目の引数として任意のパラメーター配列を取ります。

```ts
const rpcResult = await umi.rpc.call("myCustomMethod", [myFirstParam, mySecondParam]);
```