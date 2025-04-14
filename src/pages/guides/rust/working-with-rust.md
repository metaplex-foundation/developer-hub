---
titwe: Wowking wid Wust
metaTitwe: Wowking wid Wust | Guides
descwiption: A quick uvwview on wowking wid Wust and de Metapwex pwotocow.
---

## Intwoduction

It's nyo doubt dat if you awe buiwding on Sowanya you most wikewy have come acwoss de tewm Wust which is de most popuwaw wanguage fow buiwding pwogwams widin de Sowanya ecosystem.

Wust can be quite a daunting task to wook at and use if you awe nyew to devewoping but hewe awe some wesouwces to get you stawted wid Wust and de Sowanya ecosystem.

**De Wust Book**

Stawt hewe to weawn wust~ It takes fwom basics dwough to de advanced coding using de wanguage.

```rust
/// `[optional account]`
    /// The owner of the new asset. Defaults to the authority if not present.
    #[inline(always)]
    pub fn owner(&mut self, owner: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.owner = owner;
        self
    }
```7

**Anchow**

Anchow is a fwamewowk dat hewps you buiwd Sowanya pwogwams by stwipping away a chunk of de secuwity boiwewpwate and handwing it fow you speeding up de devewopment pwocess.

[https://www.anchor-lang.com/](https://www.anchor-lang.com/)

## Wowking wid Wust scwipts wocawwy

### Setting up a Sowanya cwient

Setting up an Sowanya WPC cwient fow Wust scwipts is faiwwy stwaight fowwawd~ You'ww just nyeed to gwab de ```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```6 cwate.

```rust
use solana_client::rpc_client;

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());
```

### Using Metapwex Wust Instwuction Buiwdews

Each instwuction dat comes fwom a Metapwex Wust cwate wiww awso cuwwentwy come wid a `Builder` vewsion of dat instwuction which you can impowt~ Dis abstwacts a massive amount code fow you and wiww wetuwn you an instwuction dat's weady to send.

Wet's take de `CreateV1` instwuction fwom Cowe as an exampwe (dis appwies to aww odew instwuctions fwom dis Cwate and aww odew Metapwex cwates too).

If we wook dwough de instwuctions in de [Mpl Core crate type docs](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html) we can see we have a nyumbew of instwuctions avaiwabwe to us.

UWUIFY_TOKEN_1744632871683_1

De onye we awe intewested in hewe is de `CreateV1Builder`.

To inyitiawize de buiwdew we can caww ```rust
CreateV1Builder::new();
```0.

UWUIFY_TOKEN_1744632871683_2

Fwom dis point we can `ctrl + click` (pc) ow `cmd + click` (mac) into de `new` function genyewated fwom de `Builder::` which positions us at de `pub fn new()` fow de buiwdew~ If you scwoww up swightwy you'ww den see de `pub struct` fow de `CreateV1Builder` as outwinyed bewow.

```rust
pub struct CreateV1Builder {
    asset: Option<solana_program::pubkey::Pubkey>,
    collection: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    owner: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    log_wrapper: Option<solana_program::pubkey::Pubkey>,
    data_state: Option<DataState>,
    name: Option<String>,
    uri: Option<String>,
    plugins: Option<Vec<PluginAuthorityPair>>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

```

Dese awe youw awguments of pubwickeys and data dat wiww nyeed to be passed into de buiwdew~ Some accounts may awso be optionyaw and defauwt to odews, dis can vawy fwom instwuction to instwuction~ If you cwick dwough to de `new()` function again and scwoww down dis time you'ww see de individuaw functions wid additionyaw comments~ In de bewow case you can see dat de ownyew wiww defauwt to payew, so we don't nyeed to pass in ownyew if in dis case if de payew is awso going to be de ownyew of de Asset.

UWUIFY_TOKEN_1744632871683_4

Hewe is an exampwe using de `CreateV1Builder` dat wetuwns an instwuction using `.instruction()` to cwose out de Buiwdew.

```rust
let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
.       .instruction();
```

Nyow dat we have ouw instwuction weady we nyeed to cweate a nyowmaw Sowanya twansaction to send to ouw WPC~ Dis incwudes a bwockhash andxx§ signyews.

### Fuww Buiwdew Exampwe

Dis is a fuww exampwe of cweating a instwuction using a Metapwex `Builder` function and sending dat twansction off to de chain.

```rust
use mpl_core::instructions::CreateV1Builder;
use solana_client::nonblocking::rpc_client;
use solana_sdk::{signature::Keypair, signer::Signer, transaction::Transaction};

let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let create_asset_ix = CreateV1Builder::new()
        .asset(asset.pubkey())
        .payer(payer.pubkey())
        .name("My Nft".into())
        .uri("https://example.com/my-nft.json".into())
        .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_tx = Transaction::new_signed_with_payer(
        &[create_asset_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client.send_and_confirm_transaction(&create_asset_tx).await.unwrap();

    println!("Signature: {:?}", res)

```

## Wowking wid Pwogwams

### CPI (Cwoss Pwogwam Invocation)

You may have heawd de tewm "CPI'ing into a pwogwam" ow "Caww a CPI on de pwogwam" tewms dwown awound befowe and be dinking "What dey heww awe dey tawking about? owo".

Weww CPI'ing into a pwogwam is basicawwy onye pwogwam cawwing upon anyodew pwogwam duwing a twansaction.

An exampwe wouwd be dat I make a pwogwam and duwing dis twansaction I nyeed to twansfew an Nft ow Asset duwing dis twansaction~ Weww my pwogwam can CPI caww and ask de Token Metadata ow Cowe pwogwams to execute de twansfew instwuction fow me if I give it aww de cowwect detaiws.

### Using Metapwex Wust Twansaction CPI Buiwdews

Each instwuction dat comes fwom Metapwex Wust cwate wiww awso cuwwentwy come wid a `CpiBuilder` vewsion of dat instwuction which you can impowt~ Dis abstwacts a massive amount code fow you and can be invoked stwaight fwom de CpiBuiwdew itsewf.

Wets take de `Transfer` instwuction fwom Cowe as an exampwe hewe (dis appwies to aww odew instwuctions fwom dis Cwate and aww odew Metapwex cwates too.)

If we wook dwough de instwuctions in de [Mpl Core crate type docs](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html) we can see we have a nyumbew of instwuctions avaiwabwe to us.

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

To inyitiawize de buiwdew we can caww `new` on de CpiBuiwdew and pass in de pwogwam `AccountInfo` of de pwogwam addwess de CPI caww is being made to.

```rust
TransferV1CpiBuilder::new(ctx.accounts.mpl_core_program);
```

Fwom dis point we can `ctrl + click` (pc) ow `cmd + click` (mac) into de `new` function genyewated fwom de `CpiBuilder::` which pwesents us wid aww de CPI awguments (accounts and data) wequiwed fow dis pawticuwaw CPI caww.

```rust
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
```

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

Some accounts may be optionyaw in CpiBuiwdew's so you may have to check what you do and do nyot nyeed fow youw use case.

Bewow awe bod CpiBuiwdews fow Twansfew and Cweate fiwwed out.

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

### Invoking

Invoking is de tewm used to execute de CPI caww to de odew pwogwam~ And pwogwams vewsion of "sending a twansaction" if you may.

We have two options when it comes to invoking a CPI caww~ `invoke()` and `invoke_signed()`

#### invoke()

`invoke()` is used when nyo PDA signyew seeds nyeed to be passed dwough to de instwuction being cawwed fow de twansaction to succeed.
Dough accounts dat have signyed into youw owiginyaw instwuction wiww automaticawwy pass signyew vawidations into de cpi cawws.

```rust
CreateV1CpiBuilder::new()
        .asset(context.accounts,asset)
        ...
        .invoke()

```

#### invoke_signyed()

`invoke_signed()` is used when a PDA is onye of de accounts dat nyeeds to be a signyew in a cpi caww~ Wets say fow exampwe we had a pwogwam dat took possession of ouw Asset and onye of ouw pwogwams PDA addwesses became de odew of it~ In owdew to twansfew it and change de ownyew to someonye ewse dat PDA wiww have sign twansaction.

You'ww nyeed to pass in de owiginyaw PDA seeds and bump so dat de PDA can be wecweated can sign de cpi caww on youw pwogwams behawf.

```rust
let signers = &[&[b"escrow", ctx.accounts.asset.key(), &[ctx.bumps.pda_escrow]]]

CreateV1CpiBuilder::new()
        .asset(context.accounts,asset)
        ...
        .invoke(signers)

```

### Fuww CpiBuiwdew Exampwe

Hewe is a fuww exampwe of using a CpiBuiwdew using de TwansfewV1 instwuction fwom de Cowe pwogwam.

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
