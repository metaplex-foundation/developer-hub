---
title: ルールセットの作成または更新
metaTitle: 作成/更新 | Token Auth Rules
description: ルールセットの作成と更新方法
---

## はじめに

Token Authorization Rulesのルールセットは、Token Auth Rulesプログラムが所有するPDAに格納された**コンポジットルール**と**プリミティブルール**のコレクションです。

## ルールセットの作成または更新

ルールセットは、同じ命令**CreateOrUpdate**への呼び出しを通じて作成および更新されます。渡されたPDAが初期化されていない場合、プログラムはそれを作成します。そうでない場合は、渡されたルールセットデータを新しいリビジョンとしてルールセットを更新します。以下のパラメータを渡す必要があります：

- **payer** - ルールセットの権限および賃料の支払者。
- **ruleSetPda** - ルールセットが格納されるPDA。PDAは"rule_set_state"、**payer**、**rule_set_name**を導出シードとして使用します。**rule_set_name**は32文字未満の任意の文字列にできます。
- **systemProgram** - システムプログラム。
- **ruleSetRevision** - ルールセットのシリアル化されたデータ。

```ts
import {
  RuleSetRevisionV2,
  createOrUpdateV1,
  findRuleSetPda,
  programOwnedV2,
} from '@metaplex-foundation/mpl-token-auth-rules';

const owner = umi.identity;
const program = generateSigner(umi).publicKey;
const name = 'transfer_test';
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name,
  owner: owner.publicKey,
  operations: {
    Transfer: programOwnedV2('Destination', program),
  },
};

// このデータを使用して新しいルールセットアカウントを作成する場合。
const ruleSetPda = findRuleSetPda(umi, { owner: owner.publicKey, name });
await createOrUpdateWithBufferV1(umi, {
  payer: owner,
  ruleSetPda,
  ruleSetRevision: some(revision),
}).sendAndConfirm(umi);
```

## リソース

- [Token Auth Rule GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [JSクライアントのTypeScriptリファレンス](https://mpl-token-auth-rules.typedoc.metaplex.com/)