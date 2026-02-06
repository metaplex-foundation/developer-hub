---
title: Program Owned
metaTitle: Program Owned | Token Auth Rules
description: Program Ownedプリミティブルール
---

## Program Owned

指定されたプログラムがアカウントを所有していることをチェックします。これは、通常それらが導出されるプログラムによって常に所有されるPDA（例：マーケットプレイスやユーティリティプログラム）に有用です。

### フィールド

- **program** - フィールドで指定されたアカウントを所有していなければならないプログラム
- **field** - 所有者をチェックするペイロード内のフィールド

```js
// このルールセットは、指定されたフィールドのPDAが示されたプログラムによって所有されている場合のみtrueと評価されます。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'ProgramOwned',
      field: 'Escrow',
      program: publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'),
    },
  },
}
```

## Program Owned List

可能な所有プログラムのリストと比較する[Program Owned](#program-owned)のバージョンです。

### フィールド

- **programs** - フィールドで指定されたアカウントを所有していなければならないプログラムのベクター
- **field** - 所有者をチェックするペイロード内のフィールド

```js
// このルールセットは、指定されたフィールドのPDAが示されたプログラムのいずれかによって所有されている場合のみtrueと評価されます。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'ProgramOwnedList',
      field: 'Escrow',
      programs: [
        publicKey('TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN'),
        publicKey('M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K'),
      ],
    },
  },
}
```

## Program Owned Tree

可能な所有プログラムのマークル木と比較する[Program Owned](#program-owned)のバージョンです。

### フィールド

- **pubkey_field** - 所有者をチェックするペイロード内のフィールド
- **proof_field** - ハッシュされる完全なマークル証明を含むペイロード内のフィールド
- **root** - マークル木のルート

```js
// このルールセットは、提供されたPDAと証明が正しいマークルルートにハッシュされる場合のみtrueと評価されます。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    list: {
      type: 'ProgramOwnedTree',
      pubkeyField: "Escrow",
      proofField: "EscrowProof",
      root: [229, 0, 134, 58, 163, 244, 192, 254, 190, 193, 110, 212, 193, 145, 147, 18, 171, 160 213, 18, 52, 155, 8, 51, 44, 55, 25, 245, 3, 47, 172, 111],
    },
  },
}
```
