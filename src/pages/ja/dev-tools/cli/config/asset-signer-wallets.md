---
title: アセット署名者ウォレット
metaTitle: アセット署名者ウォレット | Metaplex CLI
description: MPL CoreアセットのサイナーPDAをアクティブなCLIウォレットとして使用します。すべてのコマンドが自動的にexecuteでラップされ、カスタムスクリプトなしでPDAからSOL、トークン、アセットを転送できます。
keywords:
  - mplx cli
  - asset-signer wallet
  - PDA wallet
  - MPL Core execute
  - signer PDA
  - metaplex cli asset signer
  - core execute
about:
  - MPL Core Asset-signer wallets
  - PDA wallet management
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
faqs:
  - q: 各操作に個別のexecuteコマンドが必要ですか？
    a: いいえ。アセット署名者ウォレットがアクティブな場合、すべてのCLIコマンドは送信時に自動的にexecuteインストラクションでラップされます。`mplx toolbox sol transfer`や`mplx core asset create`などの標準コマンドを使用してください。これらの操作のための個別のexecuteサブコマンドは存在しません。
  - q: アセット所有者が保存済みウォレットにない場合はどうなりますか？
    a: CLIはエラーを返し、まず所有者ウォレットを追加するよう求めます。アセット署名者ウォレットを登録する前に、アセット所有者のキーペアで`mplx config wallets add <name> <keypair-path>`を実行してください。
  - q: PDAが署名している間、別のウォレットがトランザクション手数料を支払うことはできますか？
    a: はい。任意のコマンドに`-p /path/to/fee-payer.json`を渡します。アセット所有者は引き続きexecuteインストラクションに署名しますが、-pウォレットがSolanaトランザクション手数料を支払います。
  - q: executeでラップできない操作はどれですか？
    a: 大規模なアカウント作成（Merkleツリー、Candy Machine）とネイティブSOLラッピングは、Solana CPIサイズ制限により失敗します。まず通常のウォレットでこのインフラストラクチャを作成し、その後の操作でアセット署名者ウォレットに切り替えてください。
  - q: PDAが解決するアドレスを確認するにはどうすればよいですか？
    a: "`mplx core asset execute info <assetId>`を実行します。これにより、決定論的なサイナーPDAアドレスとその現在のSOL残高が表示されます。"
created: '03-19-2026'
updated: '03-19-2026'
---

## 概要

アセット署名者ウォレットを使用すると、[MPL Coreアセット](/core)のサイナーPDAをアクティブなCLIウォレットとして使用できます。アクティブな場合、すべてのCLIコマンドがオンチェーンの[`execute`](/dev-tools/cli/core/execute)インストラクションでインストラクションを自動的にラップします。カスタムスクリプトは不要です。

- `mplx config wallets add <name> --asset <assetId>`で任意のCoreアセットをウォレットとして登録
- アセット署名者ウォレットがアクティブな場合、すべてのCLIコマンドがPDAを通じて透過的に動作
- アセット所有者が`execute`インストラクションに署名し、`-p`で別の手数料支払者を指定可能
- 一部の操作はSolana CPI制約により制限あり（大規模なアカウント作成、ネイティブSOLラッピング）

## クイックスタート

```bash {% title="Asset-signer wallet setup" %}
# 1. アセットを作成（または所有する既存のものを使用）
mplx core asset create --name "My Vault" --uri "https://example.com/vault"

# 2. ウォレットとして登録（オンチェーンデータから所有者を自動検出）
mplx config wallets add vault --asset <assetId>

# 3. PDA情報を確認
mplx core asset execute info <assetId>

# 4. PDAに資金を送金
mplx toolbox sol transfer 0.1 <signerPdaAddress>

# 5. アセット署名者ウォレットに切り替え
mplx config wallets set vault

# 6. PDAとして任意のコマンドを使用
mplx toolbox sol balance
mplx toolbox sol transfer 0.01 <destination>
mplx core asset create --name "PDA Created NFT" --uri "https://example.com/nft"
```

## アセット署名者ウォレットの仕組み

CLIはnoop-signerパターンを使用してPDA操作を透過的にします。アセット署名者ウォレットがアクティブな場合：

1. **`umi.identity`** はPDAの公開鍵を持つnoopシグナーに設定 — コマンドはPDAを権限として自然にインストラクションを構築
2. **`umi.payer`** もPDA noopシグナーに設定 — 派生アドレス（ATA、トークンアカウント）が正しく解決
3. **送信時**、トランザクションは[MPL Coreの`execute`インストラクション](/dev-tools/cli/core/execute)でラップされ、PDAに代わってオンチェーンで署名
4. **実際のウォレット**（アセット所有者）が外部トランザクションに署名し、`setFeePayer`を通じて手数料を支払い

## アセット署名者ウォレットの登録

```bash {% title="Add asset-signer wallet" %}
mplx config wallets add <name> --asset <assetId>
```

`--asset`フラグが通常のウォレットとの違いです。CLIはアセットをオンチェーンで取得し、所有者を特定して、保存済みの[ウォレット](/dev-tools/cli/config/wallets)と照合します。所有者がウォレットリストにない場合は、まず所有者ウォレットを追加する必要があります。

登録後は、標準の[ウォレットコマンド](/dev-tools/cli/config/wallets)（`list`、`set`、`remove`）で他のウォレットと同様に管理できます。アセット署名者ウォレットはウォレットリストで`asset-signer`タイプとして表示されます。

{% callout type="note" %}
`-k`フラグは、アセット署名者ウォレットを含むアクティブなウォレットを、単一のコマンドでバイパスします。
{% /callout %}

## 別の手数料支払者

オンチェーンの`execute`インストラクションは、別の権限と手数料支払者アカウントをサポートします。`-p`を使用して、アセット所有者がexecuteに署名している間、別のウォレットにトランザクション手数料を支払わせることができます：

```bash {% title="Separate fee payer" %}
mplx toolbox sol transfer 0.01 <destination> -p /path/to/fee-payer.json
```

アセット所有者は引き続き`execute`インストラクションに署名します。`-p`ウォレットはSolanaトランザクション手数料のみを支払います。

## サポートされるコマンド

すべてのCLIコマンドがアセット署名者ウォレットで動作します。トランザクションのラッピングは送信レイヤーで透過的に行われます。

| カテゴリ | コマンド |
|----------|----------|
| **Core** | `asset create`, `asset transfer`, `asset burn`, `asset update`, `collection create` |
| **Toolbox SOL** | `balance`, `transfer`, `wrap`, `unwrap` |
| **Toolbox Token** | `transfer`, `create`, `mint` |
| **Toolbox Raw** | `raw --instruction <base64>` |
| **Token Metadata** | `transfer`, `create`, `update` |
| **Bubblegum** | `nft create`, `nft transfer`, `nft burn`, `collection create` |
| **Genesis** | `create`, `bucket add-*`, `deposit`, `withdraw`, `claim`, `finalize`, `revoke` |
| **Distribution** | `create`, `deposit`, `withdraw` |
| **Candy Machine** | `insert`, `withdraw` |

## CPI制限事項

Solana CPIの制約により、一部の操作は`execute()`でラップできません：

- **大規模なアカウント作成** — MerkleツリーとCandy MachineはCPIアカウント割り当て制限を超過
- **ネイティブSOLラッピング** — トークンアカウントへの`transferSol`はCPIコンテキストで失敗

{% callout type="warning" %}
これらの操作には、通常の[ウォレット](/dev-tools/cli/config/wallets)を使用するか、まずインフラストラクチャを作成してから、その後の操作でアセット署名者ウォレットに切り替えてください。
{% /callout %}

## Toolbox Rawによるローインストラクション

`mplx toolbox raw`コマンドは、任意のbase64エンコードされたインストラクションを実行します。アセット署名者ウォレットがアクティブな場合、これらは自動的に`execute()`でラップされます。

```bash {% title="Execute raw instructions" %}
# 単一のインストラクション
mplx toolbox raw --instruction <base64>

# 複数のインストラクション
mplx toolbox raw --instruction <ix1> --instruction <ix2>

# stdinから読み取り
echo "<base64>" | mplx toolbox raw --stdin
```

### ローインストラクションの構築

CLIにはbase64エンコードされたインストラクションを構築するためのシリアライゼーションヘルパーが含まれています：

```typescript {% title="build-raw-instruction.ts" %}
import { publicKey } from '@metaplex-foundation/umi'
import { serializeInstruction } from '@metaplex-foundation/cli/lib/execute/deserializeInstruction'

const signerPda = '<PDA address from execute info>'
const destination = '<destination address>'

// System Program SOL transfer
const data = new Uint8Array(12)
const view = new DataView(data.buffer)
view.setUint32(0, 2, true)             // Transfer discriminator
view.setBigUint64(4, 1_000_000n, true) // 0.001 SOL

const ix = {
  programId: publicKey('11111111111111111111111111111111'),
  keys: [
    { pubkey: publicKey(signerPda), isSigner: true, isWritable: true },
    { pubkey: publicKey(destination), isSigner: false, isWritable: true },
  ],
  data,
}

console.log(serializeInstruction(ix))
// Pass the output to: mplx toolbox raw --instruction <base64>
```

### インストラクションバイナリフォーマット

| バイト | フィールド |
|--------|-----------|
| 32 | プログラムID |
| 2 | アカウント数（u16リトルエンディアン） |
| アカウントごとに33 | 32バイト公開鍵 + 1バイトフラグ（ビット0 = isSigner、ビット1 = isWritable） |
| 残り | インストラクションデータ |

## クイックリファレンス

| 項目 | 値 |
|------|-----|
| ウォレット追加 | `mplx config wallets add <name> --asset <assetId>` |
| ウォレット切り替え | `mplx config wallets set <name>` |
| PDA検査 | [`mplx core asset execute info <assetId>`](/dev-tools/cli/core/execute) |
| オーバーライド | 任意のコマンドで`-k /path/to/keypair.json` |
| 手数料支払者 | 任意のコマンドで`-p /path/to/payer.json` |
| PDA導出 | `findAssetSignerPda(umi, { asset: assetPubkey })` |
| 設定ファイル | `~/.config/mplx/config.json` |
| ソース | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 用語集

| 用語 | 定義 |
|------|------|
| サイナーPDA | [MPL Coreアセット](/core)から派生されたプログラム派生アドレスで、SOL、トークンを保持し、他のアセットを所有可能 |
| Executeインストラクション | PDAがアセットに代わってインストラクションに署名できるようにする[MPL Core](/core)オンチェーンインストラクション |
| Noopシグナー | 公開鍵を提供するが署名を生成しないプレースホルダーシグナー — コマンドがPDAをターゲットとしてインストラクションを構築するために使用 |
| CPI | Cross-Program Invocation — あるSolanaプログラムが別のプログラムを呼び出すこと。CPIコンテキストではサイズ制限あり |

## FAQ

### 各操作に個別のexecuteコマンドが必要ですか？

いいえ。アセット署名者ウォレットがアクティブな場合、すべてのCLIコマンドは送信時に自動的に`execute`インストラクションでラップされます。`mplx toolbox sol transfer`や`mplx core asset create`などの標準コマンドを使用してください。これらの操作のための個別のexecuteサブコマンドは存在しません。

### アセット所有者が保存済みウォレットにない場合はどうなりますか？

CLIはエラーを返し、まず所有者ウォレットを追加するよう求めます。アセット署名者ウォレットを登録する前に、アセット所有者のキーペアで`mplx config wallets add <name> <keypair-path>`を実行してください。

### PDAが署名している間、別のウォレットがトランザクション手数料を支払えますか？

はい。任意のコマンドに`-p /path/to/fee-payer.json`を渡します。アセット所有者は引き続き[`execute`](/dev-tools/cli/core/execute)インストラクションに署名しますが、`-p`ウォレットがSolanaトランザクション手数料を支払います。

### executeでラップできない操作はどれですか？

大規模なアカウント作成（Merkleツリー、Candy Machine）とネイティブSOLラッピングは、Solana CPIサイズ制限により失敗します。まず通常の[ウォレット](/dev-tools/cli/config/wallets)でこのインフラストラクチャを作成し、その後の操作でアセット署名者ウォレットに切り替えてください。

### PDAが解決するアドレスを確認するにはどうすればよいですか？

[`mplx core asset execute info <assetId>`](/dev-tools/cli/core/execute)を実行します。これにより、決定論的なサイナーPDAアドレスとその現在のSOL残高が表示されます。

## 注意事項

- アセット署名者ウォレットには、アセット所有者のウォレットが[ウォレット設定](/dev-tools/cli/config/wallets)に保存されている必要があります — まず所有者ウォレットを追加してください
- アセット署名者ウォレットは、PDAアドレス、リンクされたアセットID、および所有者ウォレットへの参照を設定ファイルに保存します
- アセット署名者ウォレットから切り替えると、コマンドは通常のキーペア署名に戻ります
- `-k`フラグはアセット署名者ウォレットを含む、アクティブなウォレットよりも常に優先されます
- `mplx toolbox raw`によるローインストラクションは、アセット署名者ウォレットがアクティブな場合、他のコマンドと同様に`execute()`でラップされます
