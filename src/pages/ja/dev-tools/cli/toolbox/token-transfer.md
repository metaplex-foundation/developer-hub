---
title: トークン転送
metaTitle: トークン転送 | Metaplex CLI
description: 宛先アドレスにトークンを転送
---

ウォレットから宛先アドレスにトークンを転送します。宛先ウォレットがトークンアカウントを持っていない場合は、自動的に作成されます。

## 基本的な使用法

```bash
mplx toolbox token transfer <mintAddress> <amount> <destination>
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `mintAddress` | 転送するトークンのミントアドレス |
| `amount` | ベーシスポイントで転送するトークン量 |
| `destination` | 宛先ウォレットアドレス |

## 例

### 宛先アドレスに100トークンを転送

```bash
mplx toolbox token transfer 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU 10000000000 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

## 出力

コマンドは、トークンの転送中に進捗スピナーを表示し、成功時にトランザクション署名を表示します：

```
--------------------------------
Token Transfer         
--------------------------------
⠋ Transferring tokens...
✔ Tokens Transferred Successfully!
--------------------------------
'Tokens Transferred Successfully!'
Signature: 2xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
--------------------------------
```

## 注意事項

- コマンドは、宛先アドレスが存在しない場合、自動的にトークンアカウントを作成します
- 量はベーシスポイントで指定されます（1トークン = 1,000,000,000ベーシスポイント）
- 新しいトークンアカウントを作成する場合、トランザクションには賃料免除のためのSOLが必要です
- 転送前にウォレットに十分なトークンがあることを確認してください

## エラーハンドリング

転送が失敗した場合、コマンドはエラーメッセージを表示し、例外をスローします。一般的なエラーには以下があります：

- トークン残高不足
- 無効なミントアドレス
- 無効な宛先アドレス
- ネットワークエラー

## 関連コマンド

- [トークン作成](/ja/dev-tools/cli/toolbox/token-create) - 新しいトークンを作成
- [残高確認](/ja/dev-tools/cli/toolbox/sol-balance) - トークン残高を確認
- [SOL転送](/ja/dev-tools/cli/toolbox/sol-transfer) - アドレス間でSOLを転送
