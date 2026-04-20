---
# Remember to also update the date in src/components/products/guides/index.js
title: トランザクションの実行
metaTitle: トランザクションの実行 | Metaplex CLI
description: アクティブなウォレットを使用して、任意のbase64エンコードされたSolana命令に署名して送信します。
keywords:
  - mplx CLI
  - execute transaction
  - base64 instruction
  - MPL Core execute
  - Solana
about:
  - Metaplex CLI
  - Solana Transactions
proficiencyLevel: Advanced
created: '04-20-2026'
updated: '04-20-2026'
---

## 概要

`mplx toolbox transaction`コマンドは、現在のウォレットを使用して、任意のbase64エンコードされたSolana命令に署名して送信します。

- `--instruction`（繰り返し可能）経由で、1つ以上のbase64エンコードされた命令を受け付けます。
- `--stdin`を使用すると、stdinから命令を1行ずつ読み取ります。
- アセット署名者ウォレットがアクティブな場合、命令をMPL Coreの`execute`呼び出しで自動的にラップします。
- `--instruction`と`--stdin`は相互に排他的です。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox transaction --instruction <b64>` |
| フラグ | `-i, --instruction <b64>`（繰り返し可能）、`--stdin` |
| 入力 | base64エンコードされたSolana命令 |
| アセット署名者ウォレット | 命令はMPL Coreの`execute`でラップされます |
| 相互排他 | `--instruction`と`--stdin` |

## 基本的な使用法

各base64エンコードされた命令を`--instruction`経由で渡すか、stdinからパイプします。

```bash
# 1つ以上の命令をフラグで渡す
mplx toolbox transaction --instruction <base64>

# base64命令をstdin経由でパイプ（1行に1つ）
echo "<base64>" | mplx toolbox transaction --stdin
```

## フラグ

このコマンドは完全にフラグによって制御されます。

- `-i, --instruction <base64>`: base64エンコードされた命令。複数の命令を含めるために繰り返すことができます。
- `--stdin`: stdinからbase64命令を1行に1つずつ読み取ります。`--instruction`と相互に排他的です。

## 例

これらの例は、単一、バッチ、およびパイプされた呼び出しを示しています。

```bash
mplx toolbox transaction --instruction <base64EncodedInstruction>
mplx toolbox transaction --instruction <ix1> --instruction <ix2>
echo "<base64>" | mplx toolbox transaction --stdin
```

## 出力

成功すると、コマンドは署名者、命令数、およびトランザクション署名を出力します。

```
--------------------------------
  Signer:         <wallet_pubkey>
  Instructions:   <count>
  Signature:      <signature>
--------------------------------
<explorer_url>
```

## 注意事項

- バッチ内のすべての命令は、現在のウォレットのアイデンティティで署名されます。
- [アセット署名者ウォレット](/dev-tools/cli/config/asset-signer-wallets)がアクティブな場合、命令はMPL Coreの`execute`命令で自動的にラップされます。
- このコマンドはエスケープハッチです — 可能な限り目的別のコマンドを優先してください。
