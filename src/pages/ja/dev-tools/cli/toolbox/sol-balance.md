---
title: SOL残高
description: ウォレットアドレスのSOL残高を確認
---

ウォレットアドレスのSOL残高を確認します。このコマンドを使用すると、ネットワーク上の任意のウォレットのSOL残高を迅速に確認できます。

## 基本的な使用法

```bash
mplx toolbox sol-balance <address>
```

## 引数

| 引数 | 説明 |
|----------|-------------|
| `address` | 確認するウォレットアドレス（オプション、アクティブなウォレットにデフォルト） |

## 例

### アクティブなウォレット残高を確認

```bash
mplx toolbox sol-balance
```

### 特定のウォレット残高を確認

```bash
mplx toolbox sol-balance 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

## 出力

コマンドは整形された出力でSOL残高を表示します：

```
--------------------------------
SOL Balance
--------------------------------
Address: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Balance: 1.5 SOL
--------------------------------
```

## 注意事項

- アドレスが提供されない場合、コマンドはアクティブなウォレットの残高を確認します
- 残高はSOLで表示されます（lamportsではありません）
- コマンドはアクティブなRPCエンドポイントを使用します
- トランザクションのために十分なSOLがあることを確認してください
- 残高はリアルタイムでブロックチェーンの現在の状態を反映します

## 関連コマンド

- [SOL転送](/ja/dev-tools/cli/toolbox/sol-transfer) - アドレス間でSOLを転送
- [トークン転送](/ja/dev-tools/cli/toolbox/token-transfer) - トークンを転送
- [エアドロップ](/ja/dev-tools/cli/toolbox/sol-airdrop) - SOLエアドロップをリクエスト（devnetのみ）