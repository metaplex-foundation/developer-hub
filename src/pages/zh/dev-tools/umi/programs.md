---
title: 注册程序
metaTitle: Umi 程序注册 - Solana 程序管理指南 | Metaplex
description: 向 Metaplex Umi 注册程序
---
为了创建与 Solana 程序交互的客户端，了解您的集群中哪些程序可用以及它们在哪个地址非常重要。Umi 提供了一个 `ProgramRepositoryInterface`，作为您客户端的一个大型程序注册表。

这也允许我们：
- 从其他库注册程序。
- 注册我们自己的程序并覆盖现有程序。
- 按名称或公钥在当前集群或特定集群中获取程序。
- 按名称或代码解析程序错误。

## 定义程序

Umi 提供了一个 `Program` 类型来表示 Solana 程序。它包含程序的名称、公钥以及一些可用于解析其错误和它部署到哪个集群的函数。

```ts
export type Program = {
  name: string;
  publicKey: PublicKey;
  getErrorFromCode: (code: number, cause?: Error) => ProgramError | null;
  getErrorFromName: (name: string, cause?: Error) => ProgramError | null;
  isOnCluster: (cluster: Cluster) => boolean;
};
```

您可以[通过其 API 参考了解有关 `Program` 类型属性的更多信息](https://umi.typedoc.metaplex.com/types/umi.Program.html)，但请注意 `name` 属性应该是唯一的，并且按照惯例应该使用驼峰命名格式。为了避免与其他组织发生冲突，建议使用对您组织唯一的命名空间作为程序名称的前缀。例如，Metaplex 程序以 `mpl` 为前缀：`mplTokenMetadata` 或 `mplCandyMachine`。

## 添加程序

要向程序仓库注册新程序，您可以像这样使用 `ProgramRepositoryInterface` 的 `add` 方法。

```ts
umi.programs.add(myProgram);
```

如果此程序已存在于仓库中——即它具有相同的名称或至少一个冲突集群的相同公钥——它将被新添加的程序覆盖。要更改此行为，您可以将第二个参数 `override` 设置为 `false`。在下面的示例中，只有当没有其他注册程序与用户的查询匹配时，才会检索此程序。

```ts
umi.programs.add(myProgram, false);
```

## 获取程序

一旦程序被注册，您可以通过 `get` 方法按其名称或公钥获取它。如果程序存在于仓库中，则返回该程序。否则，它将抛出错误。

```ts
// 按名称获取程序。
const myProgram = umi.programs.get('myProgram');

// 按公钥获取程序。
const myProgram = umi.programs.get(publicKey('...'));
```

默认情况下，`get` 方法只会返回部署到当前集群的程序——即 `isOnCluster` 方法对当前集群返回 `true`。只能通过接受 [`ClusterFilter`](https://umi.typedoc.metaplex.com/types/umi.ClusterFilter.html) 的第二个参数指定不同的集群。

`ClusterFilter` 可以是显式的 [`Cluster`](https://umi.typedoc.metaplex.com/types/umi.Cluster.html)、`"current"` 以选择当前集群，或 `"all"` 以选择部署到任何集群的程序。

```ts
// 获取当前集群上的程序。
umi.programs.get('myProgram');
umi.programs.get('myProgram', 'current');

// 获取特定集群上的程序。
umi.programs.get('myProgram', 'mainnet-beta');
umi.programs.get('myProgram', 'devnet');

// 获取任何集群上的程序。
umi.programs.get('myProgram', 'all');
```

还值得注意的是，`get` 方法是泛型的，可以返回 `Program` 类型的超集。例如，假设您有一个 `CandyGuardProgram` 类型扩展 `Program` 类型以存储该程序上的 `availableGuards`。然后，如果您知道要获取的程序应该是该类型，您可以通过将其类型参数设置为 `CandyGuardProgram` 来告诉 `get` 方法。

```ts
umi.programs.get<CandyGuardProgram>('mplCandyGuard');
```

此外，`ProgramRepositoryInterface` 提供了一个 `has` 方法来检查程序是否存在于仓库中，以及一个 `all` 方法来检索仓库中的所有程序。这两个方法都接受与 `get` 方法相同的 `ClusterFilter` 参数。

```ts
// 检查程序是否存在于仓库中。
umi.programs.has('myProgram');
umi.programs.has(publicKey('...'));
umi.programs.has('myProgram', 'mainnet-beta');
umi.programs.has('myProgram', 'all');

// 检索仓库中的所有程序。
umi.programs.all();
umi.programs.all('mainnet-beta');
umi.programs.all('all');
```

最后，由于获取程序的公钥是一个常见操作，`ProgramRepositoryInterface` 提供了一个 `getPublicKey` 方法可用于直接获取程序的公钥。可以提供 `fallback` 公钥，以避免在程序不存在于仓库中时抛出错误，而是返回给定的公钥。

```ts
// 获取程序的公钥。
umi.programs.getPublicKey('myProgram');

// 获取带有回退的程序公钥。
const fallback = publicKey('...');
umi.programs.getPublicKey('myProgram', fallback);

// 获取特定集群上程序的公钥。
umi.programs.getPublicKey('myProgram', fallback, 'mainnet-beta');
```

## 解析程序错误

`ProgramRepositoryInterface` 提供了一个 `resolveError` 方法，可用于从交易错误中解析自定义程序错误。此方法接受任何带有 `logs` 属性的 `Error` 和产生此错误的 `Transaction` 实例。如果从错误日志中识别出自定义程序错误，它将返回 `ProgramError` 的实例。否则，它返回 `null`。

```ts
umi.programs.resolveError(error, transaction);
```
