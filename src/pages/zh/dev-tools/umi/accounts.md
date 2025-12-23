---
title: 获取账户
metaTitle: 获取账户 | Umi
description: 如何使用 Umi 获取账户
---

让我们看看如何使用 Umi 从 Solana 区块链获取账户数据。为此，我们需要 [`RpcInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html) 来获取具有序列化数据的账户，以及[序列化器](serializers)来帮助反序列化它们。

## 账户定义

Umi 将具有序列化数据的账户定义为 `RpcAccount`。它包含来自账户头的信息——即账户上的 SOL、程序所有者等——以及账户的公钥和序列化数据。

```ts
type RpcAccount = AccountHeader & {
  publicKey: PublicKey;
  data: Uint8Array;
};
```

它还定义了一个 `MaybeRpcAccount` 类型，表示可能存在也可能不存在的 `RpcAccount`。当账户不存在时，它会跟踪其公钥，以便在账户列表中，我们知道哪个公钥未找到。

```ts
type MaybeRpcAccount =
  | ({ exists: true } & RpcAccount)
  | { exists: false; publicKey: PublicKey };
```

处理 `MaybeRpcAccount` 时，您可以使用 `assertAccountExists` 辅助方法来断言账户存在，否则失败。

```ts
assertAccountExists(myMaybeAccount);
// 从现在起，我们知道 myMaybeAccount 是一个 RpcAccount。
```

最后但同样重要的是，它提供了一个通用 `Account` 类型，直接公开反序列化的数据——表示为通用类型 `T`——以及两个额外属性：`publicKey` 和 `header`。这允许我们直接访问反序列化的数据，而无需嵌套的 `data` 属性。

```ts
type Account<T extends object> = T & {
  publicKey: PublicKey;
  header: AccountHeader;
};
```

## 获取 RPC 账户

现在我们知道 Umi 中如何表示账户，让我们看看如何获取它们。

首先，我们可以使用 `RpcInterface` 的 `getAccount` 方法获取单个账户。这将返回一个 `MaybeRpcAccount` 实例，因为账户可能存在也可能不存在。如上所述，您可以使用 `assertAccountExists` 函数来确保它存在。

```ts
const myAccount = await umi.rpc.getAccount(myPublicKey);
assertAccountExists(myAccount);
```

请注意，如果您只想知道给定地址的账户是否存在，可以改用 `accountExists` 方法。

```ts
const accountExists = await umi.rpc.accountExists(myPublicKey);
```

如果您需要一次获取多个账户，可以改用 `getAccounts` 方法。这将返回一个 `MaybeRpcAccount` 列表，每个传入的公钥对应一个。

```ts
const myAccounts = await umi.rpc.getAccounts(myPublicKeys);
```

最后，`getProgramAccounts` 方法可用于从给定程序获取与给定过滤器集匹配的所有账户。此方法直接返回 `RpcAccount` 列表，因为它只返回存在的账户。请参阅以下[获取程序账户文档](https://solanacookbook.com/guides/get-program-accounts.html)以了解更多关于过滤器和数据切片的信息。

```ts
// 从程序获取所有账户。
const allProgramAccounts = await umi.rpc.getProgramAccounts(myProgramId);

// 从程序获取所有账户的切片。
const slicedProgramAccounts = await umi.rpc.getProgramAccounts(myProgramId, {
  dataSlice: { offset: 32, length: 8 },
});

// 从程序获取与给定过滤器集匹配的某些账户。
const filteredProgramAccounts = await umi.rpc.getProgramAccounts(myProgramId, {
  filters: [
    { dataSize: 42 },
    { memcmp: { offset: 0, bytes: new Uint8Array([1, 2, 3]) } },
  ],
});
```

请注意，在获取程序账户时，您可能对 [`GpaBuilder`](helpers#gpabuilders) 感兴趣。

## 反序列化账户

为了将 `RpcAccount` 转换为反序列化的 `Account<T>`，我们只需要 `deserializeAccount` 函数和一个知道如何反序列化账户数据的 `Serializer`。您可以在[序列化器页面](serializers)上阅读更多关于 `Serializer` 的信息，但这里有一个快速示例，假设数据由两个公钥和一个 `u64` 数字组成。

```ts
import { assertAccountExists, deserializeAccount } from '@metaplex-foundation/umi';
import { struct, publicKey, u64 } from '@metaplex-foundation/umi/serializers';

// 给定一个现有的 RPC 账户。
const myRpcAccount = await umi.rpc.getAccount(myPublicKey);
assertAccountExists(myRpcAccount);

// 和一个账户数据序列化器。
const myDataSerializer = struct([
  ['source', publicKey()],
  ['destination', publicKey()],
  ['amount', u64()],
]);

// 我们可以这样反序列化账户。
const myAccount = deserializeAccount(rawAccount, myDataSerializer);
// myAccount.source -> PublicKey
// myAccount.destination -> PublicKey
// myAccount.amount -> bigint
// myAccount.publicKey -> PublicKey
// myAccount.header -> AccountHeader
```

请注意，在实践中，程序库应该为您提供账户数据序列化器和辅助函数。这是一个使用 [Kinobi 生成库](kinobi)的示例。

```ts
import { Metadata, deserializeMetadata, fetchMetadata, safeFetchMetadata } from '@metaplex-foundation/mpl-token-metadata';

// 反序列化元数据账户。
const metadata: Metadata = deserializeMetadata(umi, unparsedMetadataAccount);

// 获取并反序列化元数据账户，如果账户不存在则失败。
const metadata: Metadata = await fetchMetadata(umi, metadataPublicKey);

// 获取并反序列化元数据账户，如果账户不存在则返回 null。
const metadata: Metadata | null = await safeFetchMetadata(umi, metadataPublicKey);
```
