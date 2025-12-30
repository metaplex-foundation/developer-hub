---
title: SOL転送
metaTitle: SOL転送 | Metaplex CLI
description: 指定されたアドレスにSOLを転送
---

`mplx toolbox sol transfer`コマンドを使用すると、現在のウォレットから任意のSolanaアドレスにSOLを転送できます。

## 基本的な使用法

```bash
mplx toolbox sol transfer <amount> <address>
```

## 引数

- `amount`: 転送するSOLの量（必須）
- `address`: SOLを転送するSolanaアドレス（必須）

## 例

### アドレスに1 SOLを転送
```bash
mplx toolbox sol transfer 1 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

## 出力

転送が成功した後、コマンドは以下を表示します：
```
--------------------------------
    Transferred <amount> SOL to <address>
    Signature: <transactionSignature>
--------------------------------
```

## 注意事項

- 転送量はSOLで指定されます（lamportsではありません）
- 宛先アドレスは有効なSolana公開鍵である必要があります
- コマンドはSolanaネットワーク（mainnet/devnet/testnet）への接続が必要です
- 転送のために十分なSOLがウォレットにあることを確認してください
- トランザクション署名は確認目的で提供されます
- 転送は一度ブロックチェーンで確認されると取り消せません