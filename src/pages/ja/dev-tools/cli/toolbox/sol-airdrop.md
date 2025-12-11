---
title: SOLエアドロップ
description: 指定されたアドレスにSOLをエアドロップ
---

`mplx toolbox sol airdrop`コマンドを使用すると、指定されたアドレスにSOLをエアドロップできます。これはテストと開発目的に有用です。

## 基本的な使用法

### 現在のウォレットにエアドロップ
```bash
mplx toolbox sol airdrop <amount>
```

### 特定のアドレスにエアドロップ
```bash
mplx toolbox sol airdrop <amount> <address>
```

## 引数

- `amount`: エアドロップするSOLの量（必須）
- `address`: SOLをエアドロップするアドレス（オプション、現在のウォレットにデフォルト）

## 例

### 現在のウォレットに1 SOLをエアドロップ
```bash
mplx toolbox sol airdrop 1
```

### 特定のアドレスに2 SOLをエアドロップ
```bash
mplx toolbox sol airdrop 2 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

## 出力

エアドロップが成功した後、コマンドは以下を表示します：
```
--------------------------------
    Airdropped <amount> SOL to <address>
--------------------------------
```

## 注意事項

- このコマンドは主にテストと開発目的のために意図されています
- エアドロップ量はSOLで指定されます（lamportsではありません）
- アドレスが提供されない場合、SOLは現在のウォレットアドレスにエアドロップされます
- コマンドは開発ネットワーク（devnet/testnet）への接続が必要です
- エアドロップ操作のために十分なSOLがウォレットにあることを確認してください