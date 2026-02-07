---
title: ルールセットを使用した検証
metaTitle: 検証 | Token Auth Rules
description: ルールセットを使用して検証を実行する方法
---

## はじめに
Token Authorization RulesのValidate命令は、オペレーション、トークン、およびペイロードを受け取り、そのデータを使用してルールセットを評価し、オペレーションが許可されるかどうかを判断します。これの最も一般的な使用は、MetaplexプログラマブルNFTでのロイヤリティの強制です。pNFTでは、DelegateおよびTransfer命令が**オペレーション**であり、デリゲートまたは転送されるNFTが**トークン**で、**ペイロード**はオペレーションの異なる属性を使用して構築されます。

## ペイロードの構築
ほとんどの**プリミティブルール**には**フィールド**が含まれています。これは、validate呼び出しに渡されるペイロード内のフィールドを示すことを意図しています。これらのフィールドに格納された値は、ペイロードHashMapから取得され、さまざまなルールの評価に使用されます。以下は、Token MetadataがNFT転送用のペイロードを構築する方法の例です。

```rust
// Transfer Amount
auth_data
    .payload
    .insert("Amount", PayloadType::Number(amount));

// Transfer Authority
auth_data.payload.insert(
    "Authority",
    PayloadType::Pubkey(*authority_info.key),
);

// Transfer Source
auth_data.payload.insert(
    "Source",
    PayloadType::Pubkey(*source_info.key),
);

// Transfer Destination
auth_data.payload.insert(
    "Destination",
    PayloadType::Pubkey(*destination_info.key),
);
```

## Validateの呼び出し
- **rule_set_pda** - 評価されるルールセットを含むPDA。
- **mint** - 操作されるトークンのミント。
- **system_program** - システムプログラム
- **payer**（オプション） - 状態変更の費用を支払うユーザー。
- **rule_authority**（オプション） - 状態の変更に署名する必要がある権限。
- **rule_set_state_pda**（オプション） - ルールセットの状態を含むPDA（現在未使用）。
- **operation** - トークンに対して実行されるオペレーション（例：Transfer、Delegate）。
- **payload** - トークンに何が起こっているかの詳細情報を含むHashMap。
- **update_rule_state** - ルールセット状態が更新されているかどうかを示すブール値。
- **rule_set_revision**（オプション） - 評価されるルールセットのリビジョン。Noneの場合、最新のリビジョンが使用されます。

```rust
let validate_ix = ValidateBuilder::new()
    .rule_set_pda(*ruleset.key)
    .mint(*mint_info.key)
    .additional_rule_accounts(account_metas)
    .build(ValidateArgs::V1 {
        operation: operation.to_string(),
        payload: auth_data.payload.clone(),
        update_rule_state: false,
        rule_set_revision,
    })
    .map_err(|_error| ErrorCode::InvalidAuthorizationRules)?
    .instruction();

let mut account_infos = vec![ruleset.clone(), mint_info.clone()];
account_infos.extend(additional_rule_accounts.into_iter().cloned());
invoke_signed(&validate_ix, account_infos.as_slice(), &[])
```

## リソース

- [Token Auth Rule GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [JSクライアントのTypeScriptリファレンス](https://mpl-token-auth-rules.typedoc.metaplex.com/)
