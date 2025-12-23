---
title: 使用规则集验证
metaTitle: 验证 | Token Auth Rules
description: 如何使用规则集运行验证
---

## 介绍
Token Authorization Rules上的Validate指令接受操作、代币和负载，并使用该数据评估规则集以确定是否允许该操作。最常见的用途是Metaplex可编程NFT上的版税强制执行。在pNFT上，Delegate和Transfer指令是**操作**，正在委托或转移的NFT是**代币**，**负载**使用操作的不同属性构建。

## 构建负载
大多数**原始规则**包含一个**字段**。这意味着指示传入验证调用的负载中的字段。存储在这些字段中的值从负载HashMap获取，并用于评估各种规则。下面是Token Metadata如何为转移NFT构建负载的示例。

```rust
// 转移金额
auth_data
    .payload
    .insert("Amount", PayloadType::Number(amount));

// 转移权限
auth_data.payload.insert(
    "Authority",
    PayloadType::Pubkey(*authority_info.key),
);

// 转移来源
auth_data.payload.insert(
    "Source",
    PayloadType::Pubkey(*source_info.key),
);

// 转移目标
auth_data.payload.insert(
    "Destination",
    PayloadType::Pubkey(*destination_info.key),
);
```

## 调用Validate
- **rule_set_pda** - 包含将被评估的规则集的PDA。
- **mint** - 正在操作的代币的铸币。
- **system_program** - 系统程序
- **payer**（可选）- 将支付任何状态更改的用户。
- **rule_authority**（可选）- 必须签名以修改状态的权限。
- **rule_set_state_pda**（可选）- 包含规则集任何状态的PDA（当前未使用）。
- **operation** - 正在对代币执行的操作（例如转移、委托）。
- **payload** - 包含代币发生情况详细信息的HashMap。
- **update_rule_state** - 指示是否正在更新规则集状态的布尔值。
- **rule_set_revision**（可选）- 要评估的规则集修订版本。如果为None，则使用最新修订版本。

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

## 资源

- [Token Auth Rule GitHub仓库](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [JS客户端的TypeScript参考](https://mpl-token-auth-rules.typedoc.metaplex.com/)
