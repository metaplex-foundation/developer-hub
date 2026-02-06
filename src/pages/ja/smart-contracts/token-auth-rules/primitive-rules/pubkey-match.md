---
title: Public Key
metaTitle: Public Key | Token Auth Rules
description: Public Keyプリミティブルール
---

## Pubkey Match
指定されたPubkeyが特定のPubkeyと一致することをチェックします。例えば、このルールは特定の人のみがNFTでオペレーションを実行するアクセス権を持つべき場合に使用できます。

### フィールド
* **pubkey** - 比較対象の公開キー
* **field** - チェックするペイロード内のPubkeyを指定するフィールド

```js
// このルールセットは、転送先がPublic Keyと一致する場合のみtrueと評価されます。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'PubkeyMatch',
      field: 'Destination',
      publicKey: publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'),
    },
  },
}
```

## Pubkey List Match
Pubkeyが可能なPubkeyのリストに含まれることをチェックする[PubkeyMatch](#pubkey-match)のバージョンです。例えば、このルールはトークンとの相互作用を許可されたユーザーの許可リストを構築するために使用できます。

### フィールド
* **pubkeys** - 比較対象の公開キーのリスト
* **field** - チェックするペイロード内のPubkeyを指定するフィールド

```js
// このルールセットは、転送先がPublic Keyの1つと一致する場合のみtrueと評価されます。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'PubkeyListMatch',
      field: 'Destination',
      publicKeys: [publicKey('DhYCi6pvfhJkPRpt5RjYwsE1hZw84iu6twbRt9B6dYLV'), publicKey('6twkdkDaF3xANuvpUQvENSLhtNmPxzYAEu8qUKcVkWwy')],
    },
  },
}
```

## Pubkey Tree Match
Pubkeyが可能なPubkeyのマークル木に含まれることをチェックする[PubkeyMatch](#pubkey-match)のバージョンです。例えば、このルールはトークンとの相互作用を許可されたユーザーの非常に大きな許可リストを構築するために使用できます。

### フィールド
* **pubkey_field** - チェックするpubkeyを含むペイロード内のフィールド
* **proof_field** - ハッシュされる完全なマークル証明を含むペイロード内のフィールド
* **root** - マークル木のルート

```js
// このルールセットは、転送先と証明がマークルルートにハッシュされる場合のみtrueと評価されます。
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'PubkeyTreeMatch',
      pubkeyField: 'Destination',
      proofField: 'DestinationProof',
      root: [229, 0, 134, 58, 163, 244, 192, 254, 190, 193, 110, 212, 193, 145, 147, 18, 171, 160 213, 18, 52, 155, 8, 51, 44, 55, 25, 245, 3, 47, 172, 111],
    },
  },
}
```
