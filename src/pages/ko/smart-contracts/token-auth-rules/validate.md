---
title: Rule Set으로 검증하기
metaTitle: Validate | Token Auth Rules
description: Rule Set을 사용하여 검증을 실행하는 방법
---

## 소개

Token Authorization Rules의 Validate 명령은 operation, token, payload를 받아서 해당 데이터를 사용하여 rule set을 평가하여 operation이 허용되는지 결정합니다. 이것의 가장 일반적인 사용은 Metaplex 프로그래머블 NFT에서의 로열티 강제입니다. pNFT에서 Delegate와 Transfer 명령은 **Operations**이고, 위임되거나 전송되는 NFT가 **Token**이며, **Payload**는 Operation의 다양한 속성을 사용하여 구성됩니다.

## Payload 구성

대부분의 **Primitive Rules**는 **field**를 포함합니다. 이는 validate 호출에 전달되는 Payload의 필드를 나타내기 위한 것입니다. 이러한 필드에 저장된 값은 Payload HashMap에서 가져와서 다양한 규칙의 평가에 사용됩니다. 다음은 Token Metadata가 NFT 전송을 위한 payload를 구성하는 방법의 예입니다.

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

## Validate 호출

- **rule_set_pda** - 평가될 Rule Set을 포함하는 PDA입니다.
- **mint** - 작업이 수행되는 토큰의 mint입니다.
- **system_program** - System Program입니다.
- **payer** (선택사항) - 상태 변경에 대한 비용을 지불할 사용자입니다.
- **rule_authority** (선택사항) - 상태를 수정하기 위해 서명해야 하는 권한입니다.
- **rule_set_state_pda** (선택사항) - Rule Set에 대한 상태를 포함하는 PDA입니다 (현재 사용되지 않음).
- **operation** - 토큰에서 수행되는 작업입니다 (예: Transfer, Delegate).
- **payload** - 토큰에 발생하는 일에 대한 자세한 정보를 포함하는 HashMap입니다.
- **update_rule_state** - Rule Set 상태가 업데이트되고 있는지 여부를 나타내는 불린값입니다.
- **rule_set_revision** (선택사항) - 평가될 Rule Set의 개정판입니다. None인 경우 최신 개정판이 사용됩니다.

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

## 리소스

- [Token Auth Rule GitHub repository](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [TypeScript references for the JS client](https://mpl-token-auth-rules.typedoc.metaplex.com/)
