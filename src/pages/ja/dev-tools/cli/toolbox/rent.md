---
# Remember to also update the date in src/components/products/guides/index.js
title: レント
metaTitle: レント | Metaplex CLI
description: 指定されたサイズのSolanaアカウントに必要なレントコストを計算します。
keywords:
  - mplx CLI
  - Solana rent
  - rent exemption
  - account size
  - lamports
about:
  - Metaplex CLI
  - Solana Rent
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 概要

`mplx toolbox rent`コマンドは、指定されたサイズのSolanaアカウントに必要なレント免除の残高を返します。

- 現在のレートを、設定されたRPCから直接読み取ります。
- デフォルトではSOLで出力し、`--lamports`を指定すると生のlamportsで出力します。
- `--noHeader`を渡すと128バイトのアカウントヘッダーを除外します。
- 読み取り専用です — トランザクションは送信されません。

## クイックリファレンス

以下の表は、コマンドの入力、フラグ、および一般的なアカウントサイズをまとめたものです。

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox rent <bytes>` |
| 必須引数 | `bytes` — バイト数の整数 |
| オプションフラグ | `--lamports`、`--noHeader` |
| 読み取り専用 | はい — トランザクションは送信されません |
| 一般的なサイズ | SPL mint = 82 bytes · SPL token account = 165 bytes |

## 基本的な使用法

アカウントのサイズ（バイト単位）を唯一の位置引数として渡します。

```bash
mplx toolbox rent <bytes>
```

## 引数

このコマンドは、単一の位置整数を取ります。

- `bytes` *(必須)*: アカウントが占有するバイト数。

## フラグ

オプションフラグは、単位とアカウントヘッダーを含めるかどうかを調整します。

- `--noHeader`: レント計算時に128バイトのアカウントヘッダーを無視します。
- `--lamports`: レントコストをSOLではなくlamportsで表示します。

## 例

これらの例は、一般的なレント計算のシナリオをカバーしています。

```bash
# 165バイトのSPLトークンアカウントのレント
mplx toolbox rent 165

# lamportsでのレント
mplx toolbox rent 165 --lamports

# 128バイトのアカウントヘッダーを除外
mplx toolbox rent 165 --noHeader
```

## 出力

デフォルトの出力は、指定されたバイトサイズに対するレント免除残高をSOLで表示します。

```
--------------------------------
    Rent cost for <bytes> bytes is <amount> SOL
--------------------------------
```

## 注意事項

- Solanaアカウントは、パージを回避するために少なくともレント免除の最低残高を保持する必要があります。
- 一般的なサイズ: SPLトークンアカウント = `165` bytes、SPL mint = `82` bytes。
