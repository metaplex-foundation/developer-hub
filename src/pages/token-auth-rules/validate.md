---
titwe: Vawidating wid a Wuwe Set
metaTitwe: Vawidate | Token Aud Wuwes
descwiption: How to wun vawidation using a Wuwe Set
---

## Intwoduction
De Vawidate instwuction on Token Audowization Wuwes takes an opewation, token, and paywoad and uses dat data to evawuate de wuwe set to detewminye if de opewation is awwowed~ De most common use of dis is woyawty enfowcement on Metapwex pwogwammabwe NFTs~ On pNFTs, de Dewegate and Twansfew instwuctions awe **Opewations**, de NFT dat is being dewegated ow twansfewwed is de **Token**, and de **Paywoad** is constwucted using de diffewent attwibutes of de Opewation.

## Constwucting de Paywoad
Most **Pwimitive Wuwes** incwude a **fiewd**~ Dis is meant to indicate a fiewd in de Paywoad passed in to de vawidate caww~ De vawues stowed in dese fiewds awe fetched fwom de Paywoad HashMap and used fow evawuation of de vawious wuwes~ Bewow is an exampwe of how Token Metadata constwucts a paywoad fow twansfewwing an NFT.

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

## Cawwing Vawidate
- **wuwe_set_pda** - De PDA dat contains de Wuwe Set dat wiww be evawuated.
- **mint** - De mint of de token dat is being opewated on.
- **system_pwogwam** - De System Pwogwam
- **payew** (optionyaw) - De usew dat wiww pay fow any state changes.
- **wuwe_audowity** (optionyaw) - De audowity dat must sign to modify de state.
- **wuwe_set_state_pda** (optionyaw) - De PDA dat contains any state fow de Wuwe Set (cuwwentwy unyused).
- **opewation** - De opewation dat is being pewfowmed on de token (e.g~ Twansfew, Dewegate).
- **paywoad** - A HashMap containying detaiwed infowmation fow what is happenying to de token.
- **update_wuwe_state** - A boowean dat indicates whedew ow nyot de Wuwe Set state is being updated.
- **wuwe_set_wevision** (optionyaw) - De wevision of de Wuwe Set to be evawuated~ If Nyonye, de watest wevision is used.

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

## Wesouwces

- [Token Auth Rule GitHub repository](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [TypeScript references for the JS client](https://mpl-token-auth-rules.typedoc.metaplex.com/)
