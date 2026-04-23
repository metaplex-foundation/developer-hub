---
title: アセットの更新
metaTitle: アセットの更新 | Metaplex CLI
description: Metaplex CLI の mplx core asset update コマンドを使用して、MPL Core アセットのメタデータ、名前、URI、画像、またはコレクションメンバーシップを更新します。
keywords:
  - mplx cli
  - core asset update
  - MPL Core
  - update NFT
  - metaplex cli update
  - core update
  - collection management
  - add to collection
  - remove from collection
  - move collection
about:
  - MPL Core Asset update
  - Metaplex CLI
  - collection management
proficiencyLevel: Beginner
created: '03-15-2026'
updated: '04-17-2026'
---

## Summary

`mplx core asset update` コマンドは、[MPL Core アセット](/core)のオンチェーン名、URI、画像、オフチェーンメタデータ、または[コレクション](/core/collections)メンバーシップを変更します。

- メタデータフィールドを個別 (`--name`、`--uri`) または JSON ファイル (`--offchain`) から更新
- `--image` で新しい画像をアップロードして割り当て
- コレクションへのアセット追加、コレクション間の移動、コレクションからの削除
- 呼び出し元がアセットの現在の[アップデートオーソリティ](/core/update)（またはコレクションアセットの場合はコレクションのアップデートオーソリティ）である必要があります

## Basic Usage

```bash {% title="Update an asset" %}
mplx core asset update <assetId> [options]
```

少なくとも 1 つの更新フラグを指定する必要があります。複数のフラグを 1 つのコマンドに組み合わせることができます。例えば、名前の更新とコレクションへの追加を同時に行えます。

## Update Options

| Flag | Description |
|------|-------------|
| `--name <string>` | アセットの新しい名前（`--offchain` と併用不可） |
| `--uri <string>` | アセットメタデータの新しい URI（`--offchain` と併用不可） |
| `--image <path>` | アップロードする新しい画像ファイルへのパス |
| `--offchain <path>` | JSON メタデータファイルへのパス（`--name` または `--uri` と併用不可） |
| `--collection <collectionId>` | アセットをコレクションに追加、または別のコレクションに移動（`--remove-collection` と併用不可） |
| `--remove-collection` | 現在のコレクションからアセットを削除（`--collection` と併用不可） |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | 設定ファイルへのパス。デフォルトは `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはレジャーへのパス（例：`usb://ledger?key=0`） |
| `-p, --payer <value>` | 支払者キーペアファイルまたはレジャーへのパス |
| `-r, --rpc <value>` | クラスターの RPC URL |
| `--commitment <option>` | コミットメントレベル：`processed`、`confirmed`、または `finalized` |
| `--json` | 出力を JSON 形式でフォーマット |
| `--log-level <option>` | ログレベル：`debug`、`warn`、`error`、`info`、または `trace`（デフォルト：`info`） |

## Update Metadata

アセットの名前、URI、画像、またはオフチェーンメタデータを更新します。`--offchain` フラグはローカル JSON ファイルを読み込み、その `name` フィールドからオンチェーン名を同期します。`--image` フラグはファイルをアップロードし、メタデータ内の画像 URI を更新します。

{% code-tabs-imported from="core/update-asset" frameworks="cli" /%}

## Manage Collection Membership

`--collection` および `--remove-collection` フラグは、アセットが属する[コレクション](/core/collections)を制御します。これらのフラグは単独で使用することも、メタデータ更新フラグと組み合わせて 1 つのトランザクションで使用することもできます。

### Add an Asset to a Collection

`--collection` フラグは、スタンドアロンのアセットをコレクションに割り当てます。アセットの[アップデートオーソリティ](/core/update)はアドレスからコレクションに変更されます。

{% code-tabs-imported from="core/add-to-collection" frameworks="cli" /%}

Output:

```
✔ Asset added to collection (Tx: <transactionSignature>)
```

{% callout type="note" %}
アセットをコレクションに追加するには、アセットと対象コレクションの両方のアップデートオーソリティである必要があります。
{% /callout %}

### Move an Asset to a Different Collection

すでにコレクションに属しているアセットに同じ `--collection` フラグを使用します。CLI が既存のコレクションを検出し、アセットを新しいコレクションに移動します。

{% code-tabs-imported from="core/change-collection" frameworks="cli" /%}

Output:

```
✔ Asset moved to new collection (Tx: <transactionSignature>)
```

{% callout type="note" %}
アセットの現在のコレクションと対象コレクションの両方のアップデートオーソリティである必要があります。
{% /callout %}

### Remove an Asset from a Collection

`--remove-collection` フラグは、アセットを現在のコレクションから切り離します。アセットのアップデートオーソリティはコレクションから署名者のアドレスに戻ります。

{% code-tabs-imported from="core/remove-from-collection" frameworks="cli" /%}

Output:

```
✔ Asset removed from collection (Tx: <transactionSignature>)
```

コレクションに属していないアセットに対して `--remove-collection` を実行するとエラーになります：

```
✖ Asset is not in a collection
  Error: Cannot remove from collection: asset does not belong to a collection
```

{% callout type="note" %}
コレクションフラグはメタデータフラグと 1 つのトランザクションで組み合わせることができます。例：`mplx core asset update <assetId> --name "New Name" --collection <collectionId>`。
{% /callout %}

## Output

メタデータ更新が成功すると、コマンドは以下を表示します：

```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

コレクションのみの操作では、出力は確認行 1 行です：

```
✔ Asset added to collection (Tx: <transactionSignature>)
```

構造化出力には `--json` を使用します：

```json {% title="JSON response" %}
{
  "asset": "<assetId>",
  "signature": "<transactionSignature>",
  "explorer": "<explorerUrl>"
}
```

## Quick Reference

| Item | Value |
|------|-------|
| Update command | `mplx core asset update` |
| Add-to-collection alias | `mplx core collection add`（コレクション追加のケースのみ対象。移動、削除、メタデータのみの更新には適用されません） |
| Applies to | [MPL Core Assets](/core) のみ — Token Metadata NFT には非対応 |
| Source | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## Notes

- 少なくとも 1 つの更新フラグを指定する必要があります：`--name`、`--uri`、`--image`、`--offchain`、`--collection`、または `--remove-collection`
- `--name` および `--uri` フラグは `--offchain` と併用できません
- `--collection` および `--remove-collection` フラグは相互排他です
- `--offchain` を使用する場合、JSON メタデータファイルには有効な `name` フィールドが含まれている必要があります — オンチェーン名はこれから同期されます
- `--image` フラグはファイルをアップロードし、メタデータ内の画像 URI を自動的に更新します
- コレクション操作はアセットの[アップデートオーソリティ](/core/update)を変更します：コレクションへの追加ではコレクションアドレスに設定され、削除では署名者のウォレットアドレスに戻ります
- 呼び出し元は、いかなる更新を実行する場合もアセットのアップデートオーソリティ（またはコレクションアセットの場合はコレクションのアップデートオーソリティ）である必要があります
- このコマンドは [MPL Core Assets](/core) のみに適用されます — Token Metadata NFT の場合は別の更新命令を使用してください
