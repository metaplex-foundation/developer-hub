---
title: Solanaでのトランザクションエラーの診断方法
metaTitle: Solanaでのトランザクションエラーの診断方法 | Metaplex Guides
description: Solanaでトランザクションエラーを診断し、これらのエラーに対する論理的な解決策を見つける方法を学習します。
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-21-2024'
---

## サポートネットワークへのエラー共有

理解できないエラーが発生し、他の人に見せたい場合、状況を説明することが難しい場合があります。これは、Metaplex Umi、Solana SDK、Solana Web3jsなどの何らかのSDKを使用してトランザクションを送信する際によく発生します。これらのクライアントは**プリフライトトランザクション**またはシミュレーションと呼ばれるものをRPCに送信して、トランザクションが成功するかどうかを確認することがよくあります。トランザクションが失敗すると判定されると、トランザクションはチェーンに送信されず、代わりにエラーメッセージが投げられるだけです。これはネットワーク側での良い動作ですが、論理的にヘルプを得ることができる情報は何も与えてくれません。ここで、シミュレーション/プリフライトをスキップし、失敗したトランザクションを強制的にチェーンに登録させることで、他の人と共有可能になります。

## プリフライトのスキップ

トランザクション送信に使用しているほとんどのSDKには、トランザクション送信時に`skipPreflight`する機能が備わっています。これによりシミュレーションとプリフライトがスキップされ、チェーンに強制的にトランザクションが登録されます。これが私たちの助けになる理由は、送信しようとしているトランザクションが正確にチェーンに登録・保存され、以下を含むためです：

- 使用されたすべてのアカウント
- 送信されたすべての命令
- エラーメッセージを含むすべてのログ

この失敗したトランザクションは、誰かにトランザクションの詳細を検査してもらい、なぜトランザクションが失敗しているのかを診断してもらうために送信できます。

これは**メインネット**と**デブネット**の両方で動作します。**ローカルネット**でも動作しますが、より複雑で詳細の共有がより困難です。

### umi

Metaplex Umiの`skipPreflight`は、`sendAndConfirm()`と`send()`関数の引数にあり、次のように有効にできます：

#### sendAndConfirm()
```ts
const tx = createV1(umi, {
    ...args
}).sendAndConfirm(umi, {send: { skipPreflight: true}})

// シグネチャを文字列に変換
const signature = base58.deserialize(tx.signature);

// トランザクションシグネチャをログ
console.log(signature)
```

#### send()
```ts
const tx = createV1(umi, {
    ...args
}).send(umi, {skipPreflight: true})

// シグネチャを文字列に変換
const signature = base58.deserialize(tx);

// トランザクションシグネチャをログ
console.log(signature)
```

### web3js

```ts
// 接続を作成
const connection = new Connection("https://api.devnet.solana.com", "confirmed",);

// トランザクションを作成
const transaction = new VersionedTransaction()

// sendTransaction()関数にskipPreflightを追加
const res = await connection.sendTransaction(transaction, [...signers], {skipPreflight: true})

// トランザクションシグネチャをログ出力
console.log(res)
```

### solana-client (rust)

```rust
// 接続を作成
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

// トランザクションを作成
let transaction = new Transaction()

// sendTransaction()関数にskipPreflightを追加
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

// トランザクションシグネチャをログ出力
println!("Signature: {:?}", res)
```

トランザクションIDをログ出力することで、SolanaブロックチェーンエクスプローラにアクセスしてトランザクションIDを検索し、失敗したトランザクションを表示できます。

- SolanaFM
- Solscan
- Solana Explorer

このトランザクションIDまたはエクスプローラリンクは、支援してくれる可能性がある人と共有できます。

## 一般的なエラーの種類

よく発生する一般的なエラーがいくつかあります。

### エラーコード xx (23)

通常、エラーを説明する追加のテキストと一緒に表示されますが、これらのコードは記述的でない方法で単独で表示されることがあります。これが発生し、エラーを投げたプログラムがわかっている場合、プログラムをGithubで見つけることができることがあり、プログラムのすべての可能なエラーをリストアップするerrors.rsページがあります。

インデックス0から開始して、リスト内のエラーの位置を数えて/計算することができます。

これはMetaplex Coreプログラムのerrorｓ.rsページの例です。

[Core Program Error Codes](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/error.rs)

失敗したトランザクションからエラーコード20を受信していた場合、これは以下に変換されることがわかります：

```rust
/// 20 - アップデート権限がありません
    #[error("Missing update authority")]
    MissingUpdateAuthority,
```

### エラーコード 6xxx (6002)

6xxxエラーコードは、カスタムプログラムAnchorエラーコードです。上記と同様に、プログラムをgithubで見つけることができる場合、通常はプログラムのエラーとコードをリストアップするerrors.rsファイルがあります。Anchorカスタムプログラムエラーコードは6000から開始されるため、リストの最初のエラーは6000、2番目は6001などになります。理論的には、エラーコードの最後の桁を取ることができます。6026の場合、これは26で、インデックス0から開始して前述のようにエラーを下っていきます。

Mpl Core Candy Machineプログラムを例にすると、これはAnchorプログラムなので、エラーコードは6xxxから始まります。

[Core Candy Machine Error Codes](https://github.com/metaplex-foundation/mpl-core-candy-machine/blob/main/programs/candy-machine-core/program/src/errors.rs)

トランザクションが`6006`のエラーを返している場合、数字の末尾（この場合は`6`）を取り、インデックス0から開始してerrors.rsリストを下っていけます。

```rust
#[msg("Candy machineが空です")]
CandyMachineEmpty,
```

### 16進エラー

稀に、`0x1e`などの16進形式でエラーが返されることがあります。

この場合、[16進数から10進数へのコンバーター](https://www.rapidtables.com/convert/number/hex-to-decimal.html)を使用して、エラーを使用可能な形式に正しく変換できます。

- エラーがxx形式の場合は[エラーコード xx](#error-codes-xx-23)を参照
- エラーが6xxx形式の場合は[エラーコード 6xxx](#error-codes-6xxx-6002)を参照

### 不正な所有者

このエラーは通常、アカウントリストに渡されたアカウントが期待されるプログラムによって所有されていないため、失敗することを意味します。例えば、Token MetadataアカウントはToken Metadataプログラムによって所有されることが期待されており、トランザクションのアカウントリスト内の特定の位置にあるアカウントがその基準を満たしていない場合、トランザクションは失敗します。

これらの種類のエラーは、PDAが間違ったシードで生成された場合や、アカウントがまだ初期化/作成されていない場合によく発生します。

### アサートエラー

アサートエラーは一致エラーです。アサートは通常、2つの変数（多くの場合、アドレス/公開鍵）を取り、それらが同じ期待値であるかをチェックします。そうでない場合、`Assert left='value' right='value'`エラーが投げられ、2つの値と期待通りに一致しないことが詳述されます。

### 0x1 デビット試行

これは`Attempt to debit an account but found no record of a prior credit`と読まれる一般的なエラーです。このエラーは基本的に、アカウント内にSOLがないことを意味します。
