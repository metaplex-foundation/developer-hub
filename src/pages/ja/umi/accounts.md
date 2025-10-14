---
title: アカウントの取得
metaTitle: アカウントの取得 | Umi
description: Umiを使用してアカウントを取得する方法
---

Umiを使用してSolanaブロックチェーンからアカウントデータを取得する方法を見てみましょう。そのためには、シリアライズされたデータを含むアカウントを取得するための[`RpcInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html)と、それらをデシリアライズするための[シリアライザー](serializers)が必要です。

## アカウント定義

Umiは、シリアライズされたデータを含むアカウントを`RpcAccount`として定義します。これには、アカウントヘッダーからの情報（つまり、アカウント上のSOL、プログラムオーナーなど）と、アカウントの公開キーとシリアライズされたデータが含まれます。

```ts
type RpcAccount = AccountHeader & {
  publicKey: PublicKey;
  data: Uint8Array;
};
```

また、存在する場合と存在しない場合がある`RpcAccount`を表す`MaybeRpcAccount`タイプも定義します。アカウントが存在しない場合、その公開キーを追跡して、アカウントのリストで見つからなかった公開キーを知ることができます。

```ts
type MaybeRpcAccount =
  | ({ exists: true } & RpcAccount)
  | { exists: false; publicKey: PublicKey };
```

`MaybeRpcAccount`を扱う際は、`assertAccountExists`ヘルパーメソッドを使用して、アカウントが存在することをアサートし、そうでない場合は失敗させることができます。

```ts
assertAccountExists(myMaybeAccount);
// これで、myMaybeAccountがRpcAccountであることがわかります。
```

最後に、デシリアライズされたデータ（ジェネリック型`T`として表される）を直接公開し、`publicKey`と`header`という2つの追加属性を持つジェネリック`Account`タイプを提供します。これにより、ネストされた`data`属性なしに、デシリアライズされたデータに直接アクセスできます。

```ts
type Account<T extends object> = T & {
  publicKey: PublicKey;
  header: AccountHeader;
};
```

## RPCアカウントの取得

UmiでのアカウントがShizuoka表現方法を理解したところで、それらを取得する方法を見てみましょう。

まず、`RpcInterface`の`getAccount`メソッドを使用して、単一のアカウントを取得できます。アカウントは存在する場合と存在しない場合があるため、これは`MaybeRpcAccount`インスタンスを返します。上記で述べたように、`assertAccountExists`関数を使用してそれが存在することを確認できます。

```ts
const myAccount = await umi.rpc.getAccount(myPublicKey);
assertAccountExists(myAccount);
```

指定されたアドレスにアカウントが存在するかどうかを知りたいだけの場合は、代わりに`accountExists`メソッドを使用できます。

```ts
const accountExists = await umi.rpc.accountExists(myPublicKey);
```

複数のアカウントを一度に取得する必要がある場合は、代わりに`getAccounts`メソッドを使用できます。これは、渡した各公開キーに対して1つずつの`MaybeRpcAccount`のリストを返します。

```ts
const myAccounts = await umi.rpc.getAccounts(myPublicKeys);
```

最後に、`getProgramAccounts`メソッドを使用して、指定された一連のフィルターに一致する指定されたプログラムからすべてのアカウントを取得できます。このメソッドは、存在するアカウントのみを返すため、直接`RpcAccount`のリストを返します。フィルターとデータスライシングについて詳しくは、以下の[Get Program Accountドキュメント](https://solanacookbook.com/guides/get-program-accounts.html)を参照してください。

```ts
// プログラムからすべてのアカウントを取得。
const allProgramAccounts = await umi.rpc.getProgramAccounts(myProgramId);

// プログラムからすべてのアカウントのスライスを取得。
const slicedProgramAccounts = await umi.rpc.getProgramAccounts(myProgramId, {
  dataSlice: { offset: 32, length: 8 },
});

// 指定されたフィルターセットに一致するプログラムからいくつかのアカウントを取得。
const filteredProgramAccounts = await umi.rpc.getProgramAccounts(myProgramId, {
  filters: [
    { dataSize: 42 },
    { memcmp: { offset: 0, bytes: new Uint8Array([1, 2, 3]) } },
  ],
});
```

プログラムアカウントを取得する際は、[`GpaBuilder`s](helpers#gpabuilders)に興味を持つかもしれません。

## アカウントのデシリアライズ

`RpcAccount`をデシリアライズされた`Account<T>`に変換するには、`deserializeAccount`関数と、アカウントのデータをデシリアライズする方法を知っている`Serializer`が必要です。`Serializer`について詳しくは[シリアライザーページ](serializers)で読むことができますが、データが2つの公開キーと1つの`u64`数値で構成されていると仮定した簡単な例を以下に示します。

```ts
import { assertAccountExists, deserializeAccount } from '@metaplex-foundation/umi';
import { struct, publicKey, u64 } from '@metaplex-foundation/umi/serializers';

// 既存のRPCアカウントが与えられた場合。
const myRpcAccount = await umi.rpc.getAccount(myPublicKey);
assertAccountExists(myRpcAccount);

// アカウントデータシリアライザーが与えられた場合。
const myDataSerializer = struct([
  ['source', publicKey()],
  ['destination', publicKey()],
  ['amount', u64()],
]);

// このようにアカウントをデシリアライズできます。
const myAccount = deserializeAccount(rawAccount, myDataSerializer);
// myAccount.source -> PublicKey
// myAccount.destination -> PublicKey
// myAccount.amount -> bigint
// myAccount.publicKey -> PublicKey
// myAccount.header -> AccountHeader
```

実際には、プログラムライブラリがアカウントデータシリアライザーとヘルパーを提供する必要があることに注意してください。以下は[Kinobi生成ライブラリ](kinobi)を使用した例です。

```ts
import { Metadata, deserializeMetadata, fetchMetadata, safeFetchMetadata } from '@metaplex-foundation/mpl-token-metadata';

// メタデータアカウントをデシリアライズ。
const metadata: Metadata = deserializeMetadata(umi, unparsedMetadataAccount);

// メタデータアカウントを取得してデシリアライズ、アカウントが存在しない場合は失敗。
const metadata: Metadata = await fetchMetadata(umi, metadataPublicKey);

// メタデータアカウントを取得してデシリアライズ、アカウントが存在しない場合はnullを返す。
const metadata: Metadata | null = await safeFetchMetadata(umi, metadataPublicKey);
```