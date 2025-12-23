---
title: 如何诊断 Solana 上的交易错误
metaTitle: 如何诊断 Solana 上的交易错误
description: 了解如何诊断 Solana 上的交易错误并为这些错误找到合理的解决方案。
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-21-2024'
---

## 向支持网络共享错误

如果您收到不理解的错误并希望向其他人展示，有时可能很难描述情况。这通常发生在使用某种形式的 SDK 发送交易时，例如 Metaplex Umi、Solana SDK、Solana Web3js。这些客户端通常会向 RPC 发送所谓的**预检交易**或模拟，以检查交易是否会成功。如果认为交易会失败，则不会将交易发送到链上，而只会抛出错误消息。虽然这是网络方面的良好行为，但它没有给我们任何可以合理获得帮助的东西。这就是跳过模拟/预检并强制将失败的交易注册到链上的用武之地，该交易可以与其他人共享。

## 跳过预检

您用于发送交易的大多数 SDK 都具有在发送交易时 `skipPreflight` 的功能。这将跳过模拟和预检，并强制链注册交易。这对我们有帮助的原因是，您尝试发送的确切交易已注册并存储在链上，包括：

- 使用的所有账户
- 提交的所有指令
- 所有日志，包括错误消息

然后可以将此失败的交易发送给某人以检查交易的详细信息，以帮助诊断您的交易为何失败。

这适用于 **Mainnet** 和 **Devnet**。这也适用于 **Localnet**，但更复杂，共享详细信息也更困难。

### umi

Metaplex Umi 的 `skipPreflight` 可以在 `sendAndConfirm()` 和 `send()` 函数参数中找到，可以像这样启用：

#### sendAndConfirm()
```ts
const tx = createV1(umi, {
    ...args
}).sendAndConfirm(umi, {send: { skipPreflight: true}})

// Convert signature to string
const signature = base58.deserialize(tx.signature);

// Log transaction signature
console.log(signature)
```

#### send()
```ts
const tx = createV1(umi, {
    ...args
}).send(umi, {skipPreflight: true})

// Convert signature to string
const signature = base58.deserialize(tx);

// Log transaction signature
console.log(signature)
```

### web3js

```ts
// Create Connection
const connection = new Connection("https://api.devnet.solana.com", "confirmed",);

// Create your transaction
const transaction = new VersionedTransaction()

// Add skipPreflight to the sendTransaction() function
const res = await connection.sendTransaction(transaction, [...signers], {skipPreflight: true})

// Log out the transaction signature
console.log(res)
```

### solana-client (rust)

```rust
// Create Connection
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

// Create your transaction
let transaction = new Transaction()

// Add skipPreflight to the sendTransaction() function
let res = rpc_client
    .send_transaction_with_config(&create_asset_tx, RpcSendTransactionConfig {
        skip_preflight: true,
        preflight_commitment: Some(CommitmentConfig::confirmed().commitment),
        encoding: None,
        max_retries: None,
        min_context_slot: None,
    })
    .await
    .unwrap();

// Log out the transaction signature
println!("Signature: {:?}", res)
```

通过记录交易 ID，您可以访问 Solana 区块链浏览器并搜索交易 ID，这将显示失败的交易。

- SolanaFM
- Solscan
- Solana Explorer

然后可以与可能能够协助您的人共享此交易 ID 或浏览器链接。

## 常见的错误类型

有一些常见的错误通常会发生。

### 错误代码 xx (23)

虽然通常伴随一些额外的文本来描述错误代码，但这些代码有时会以非描述性的方式单独出现。如果发生这种情况并且您知道抛出错误的程序，您有时可以在 Github 中找到该程序，它将有一个 errors.rs 页面，列出程序的所有可能错误。

从索引 0 开始，您可以向下计数/计算错误在列表中的位置。

以下是来自 Metaplex Core 程序的 error.rs 页面示例。

[https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/error.rs](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/error.rs)

如我们所见，如果我们从失败的交易中收到错误代码 20，那将转换为

```rust
/// 20 - Missing update authority
    #[error("Missing update authority")]
    MissingUpdateAuthority,
```

### 错误代码 6xxx (6002)

6xxx 错误代码是自定义程序 Anchor 错误代码。如上所述，如果您能够在 github 中找到该程序，通常会有一个 errors.rs 文件，其中列出了程序的错误和代码。Anchor 自定义程序错误代码从 6000 开始，因此列表中的第一个错误将是 6000，第二个是 6001 等...理论上，您可以只取错误代码的最后几位数字，在 6026 的情况下是 26，然后从索引 0 开始按之前的方式计算错误。

如果我们以 Mpl Core Candy Machine 程序为例，这是一个 Anchor 程序，因此我们的错误代码将从 6xxx 开始。

[https://github.com/metaplex-foundation/mpl-core-candy-machine/blob/main/programs/candy-machine-core/program/src/errors.rs](https://github.com/metaplex-foundation/mpl-core-candy-machine/blob/main/programs/candy-machine-core/program/src/errors.rs)

如果您的交易返回错误 `6006`，我们可以取数字的末尾，在这种情况下是 `6`，然后从索引 0 开始计算 error.rs 列表。

```rust
#[msg("Candy machine is empty")]
CandyMachineEmpty,
```

### 十六进制错误

在某些罕见情况下，您可能会遇到以十六进制格式返回的错误，例如 `0x1e`。

在这种情况下，您可以使用[十六进制到十进制转换器](https://www.rapidtables.com/convert/number/hex-to-decimal.html)将错误正确格式化为我们可以使用的内容。

- 如果错误为 xx 格式，请参阅[错误代码 xx](#error-codes-xx-23)
- 如果错误为 6xxx 格式，请参阅[错误代码 6xxx](#error-codes-6xxx-6002)

### 不正确的所有者

此错误通常意味着传入账户列表的账户不属于预期的程序，因此将失败。例如，Token Metadata 账户应该由 Token Metadata 程序拥有，如果交易账户列表中该特定位置的账户不符合该标准，则交易将失败。

这些类型的错误通常发生在 PDA 可能使用错误的种子生成或账户尚未初始化/创建时。

### 断言错误

断言错误是匹配错误。断言通常会采用 2 个变量（在大多数情况下是地址/公钥）并检查它们是否是相同的预期值。如果不是，将抛出 `Assert left='value' right='value'` 错误，详细说明两个值以及它们未按预期匹配。

### 0x1 尝试借记

这是一个常见错误，内容为 `Attempt to debit an account but found no record of a prior credit`。此错误基本上意味着账户中没有任何 SOL。
