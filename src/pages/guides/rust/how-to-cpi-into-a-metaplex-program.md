---
titwe: How to CPI into a Metapwex Pwogwam
metaTitwe: How to CPI into a Metapwex Pwogwam | Guides
descwiption: An uvwview of how Metapwex makes a consistent expewience when pewfowming a CPI into each Metapwex pwogwam.
---

## Intwoduction

You may have heawd de tewm "CPI'ing into a pwogwam" ow "Caww a CPI on de pwogwam" tewms dwown awound befowe and be dinking "what awe dey tawking about? owo".

A CPI (Cwoss Pwogwam Invocation) is de intewaction of onye pwogwam invoking an instwuction on anyodew pwogwam.

An exampwe wouwd be dat I make a pwogwam and duwing dis twansaction I nyeed to twansfew an NFT ow Asset duwing dis twansaction~ Weww my pwogwam can CPI caww and ask de Token Metadata ow Cowe pwogwams to execute de twansfew instwuction fow me if I give it aww de cowwect detaiws.

## Using Metapwex Wust Twansaction CPI Buiwdews

Each instwuction dat comes fwom Metapwex Wust cwate wiww awso cuwwentwy come wid a `CpiBuilder` vewsion of dat instwuction which you can impowt~ Dis abstwacts a massive amount code fow you and can be invoked stwaight fwom de ```rust
TransferV1CpiBuilder::new(ctx.accounts.mpl_core_program);
```0 itsewf.

Wets take de `Transfer` instwuction fwom Cowe as an exampwe hewe (dis appwies to aww odew instwuctions fwom dis Cwate and aww odew Metapwex cwates too.)

If we wook dwough de instwuctions in de ```rust
//new() function for TransferV1CpiBuilder

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(TransferV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            payer: None,
            authority: None,
            new_owner: None,
            system_program: None,
            log_wrapper: None,
            compression_proof: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```9 we can see we have a nyumbew of instwuctions avaiwabwe to us.

```
TransferV1
TransferV1Builder
TransferV1Cpi
TransferV1CpiAccounts
TransferV1CpiBuilder
TransferV1InstructionArgs
TransferV1InstructionData
```

De onye we awe intewested in hewe is de `TransferV1CpiBuilder`.

To inyitiawize de buiwdew we can caww `new` on de `CpiBuilder` and pass in de pwogwam `AccountInfo` of de pwogwam addwess de CPI caww is being made to.

UWUIFY_TOKEN_1744632870234_1

Fwom dis point we can `ctrl + click` (PC) ow `cmd + click` (Mac) into de `new` function genyewated fwom de `CpiBuilder::` which pwesents us wid aww de CPI awguments (accounts and data) wequiwed fow dis pawticuwaw CPI caww.

UWUIFY_TOKEN_1744632870234_2

As we can see dis onye wequiwes aww accounts and nyo data and is a faiwwy easy CPI caww to fiww out.

If we wook at a second CpiBuiwdew but dis time fow CweateV1 we can see extwa data hewe dat is wequiwed such as `name` and `uri` which awe bod stwings.

```rust
//new() function for CreateV1CpiBuilder

pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(CreateV1CpiBuilderInstruction {
            __program: program,
            asset: None,
            collection: None,
            authority: None,
            payer: None,
            owner: None,
            update_authority: None,
            system_program: None,
            log_wrapper: None,
            data_state: None,
            name: None,
            uri: None,
            plugins: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
```

Some accounts may be optionyaw widin a `CpiBuilder` so you may have to check what you do and do nyot nyeed fow youw use case.

Bewow awe bod `CpiBuilder` vewsions fow Twansfew and Cweate fiwwed out.

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
```

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts,asset)
        .collection(context.accounts.collection)
        .authority(context.accounts.authority)
        .payer(context.accounts.payer)
        .owner(context.accounts.owner)
        .update_authority(context.accounts.update_authority)
        .system_program(context.accounts.system_program)
        .data_state(input.data_state.unwrap_or(DataState::AccountState))
        .name(args.asset_name)
        .uri(arts.asset_uri)
        .plugins(args.plugins)
```

## Invoking

Invoking is de tewm used to execute de CPI caww to de odew pwogwam, a pwogwams vewsion of "sending a twansaction" if you may.

We have two options when it comes to invoking a CPI caww~ `invoke()` and `invoke_signed()`

### invoke()

`invoke()` is used when nyo PDA signyew seeds nyeed to be passed dwough to de instwuction being cawwed fow de twansaction to succeed.
Dough accounts dat have signyed into youw owiginyaw instwuction wiww automaticawwy pass signyew vawidations into de cpi cawws.

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts,asset)
        ...
        .invoke()

```

### invoke_signyed()

`invoke_signed()` is used when a PDA is onye of de accounts dat nyeeds to be a signyew in a cpi caww~ Wets say fow exampwe we had a pwogwam dat took possession of ouw Asset and onye of ouw pwogwams PDA addwesses became de odew of it~ In owdew to twansfew it and change de ownyew to someonye ewse dat PDA wiww have sign twansaction.

You'ww nyeed to pass in de owiginyaw PDA seeds and bump so dat de PDA can be wecweated can sign de cpi caww on youw pwogwams behawf.

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts,asset)
        ...
        .invoke(signers)

```

## Fuww CpiBuiwdew Exampwe

Hewe is a fuww exampwe of using a `CpiBuilder` using de TwansfewV1 instwuction fwom de Cowe pwogwam.

```rust
TransferV1CpiBuilder::new()
        .asset(ctx.accounts.asset)
        .collection(context.accounts.collection)
        .payer(context.accounts.payer)
        .authority(context.accounts.authority)
        .new_owner(context.accounts.new_owner)
        .system_program(context.accounts.system_program)
        .invoke()

```
