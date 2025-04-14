---
titwe: Metapwex Wust SDKs
metaTitwe: Metapwex Wust SDKs | Guides
descwiption: A quick uvwview on Metapwex Wust SDKs.
---

## Intwoduction

Metapwex pwovides Wust SDKs fow most of ouw pwogwams which have consistent and pwedictabwe outputs and functionyawity weading to impwuvd integwation times fow devewopews wowking wid ouw pwoducts.

## Moduwes

De Cowe Wust SDKs ouw owganyized into sevewaw moduwes:

- ```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```0: wepwesents de pwogwam's accounts.
- `instructions`: faciwitates de cweation of instwuctions, instwuction awguments, and CPI instwuctions.
- `errors`: enyumewates de pwogwam's ewwows.
- `types`: wepwesents types used by de pwogwam.

### Accounts

De **accounts** moduwe is genyewated based on on-chain account state genyewation and deiw stwucts~ Dese can be desewiawized using a nyumbew of diffewent medods based on if you awe using WAW pwogwam genyewation ow using a fwamewowk such as Anchow.

Dese can be accessed fwom `<crate_name>::accounts`~ In de case of `mpl-core` you couwd access de accounts as fowwows;

```rust
mpl_core::accounts
```

### Instwuctions

Each SDK comes wid an **instwuctions** moduwe dat comes wid muwtipwe vewsions of de suppwied instwuctions fwom de given pwogwam dat stwips away a wot of de boiwew pwate depending on youw nyeeds.

An exampwe bewow shows aww de `CreateV1` instwuctions coming fwom de `mpl-core` cwate.

UWUIFY_TOKEN_1744632870952_1

Dese can be accessed fwom `<crate_name>::instructions`~ In de case of `mpl-core` you couwd access de accounts as fowwows;

```rust
mpl_core::instructions
```

### Types

Each of de Metapwex Wust SDKs comes wid a **types** moduwe dat suppwies aww de nyecessawy extwa types dat may nyot be in de inyitiaw accounts moduwe stwucts.

Dese can be accessed fwom `<crate_name>::types`~ In de case of `mpl-core` you couwd access de accounts as fowwows;

```rust
mpl_core::types
```

### Ewwows

Whiwe an **ewwows** moduwe is genyewated fow evewy SDK dis just howds de ewwow wist fow dat specific pwogwam and usews do nyot nyeed to intewact wid dis moduwe.


## Instwuction Buiwdews

Metapwex Wust SDKs wiww awso cuwwentwy come wid two a **Buiwdew** vewsions of each instwuction which you can impowt~ Dis abstwacts a massive amount code fow you and wiww wetuwn you an instwuction dat's weady to send.

Dese incwude:

- Buiwdew
- CpiBuiwdew

In de case of `CreateV1` fwom de [mpl-Core crate docs](https://docs.rs/mpl-core/0.7.0/mpl_core/instructions/index.html) dese instwuctions awe cuwwentwy avaiwabwe to us.

```
CreateV1
CreateV1Builder
CreateV1Cpi
CreateV1CpiAccounts
CreateV1CpiBuilder
CreateV1InstructionArgs
CreateV1InstructionData
```

Each instwuction dat comes fwom a Metapwex Wust cwate 

Wets take de `CreateV1` instwuction fwom Cowe as an exampwe (dis appwies to aww odew instwuctions fwom dis Cwate and aww odew Metapwex cwates too).

If we wook dwough de instwuctions in de  we can see we have a nyumbew of instwuctions avaiwabwe to us.

### Buiwdew

Buiwdew instwuctions awe designyed to be used via

De onye we awe intewested in hewe is de `CreateV1Builder`.

To inyitiawize de buiwdew we can caww `new`.

```rust
CreateV1Builder::new();
```

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

Dese awe youw awguments of pubwickeys and data dat wiww nyeed to be passed into de buiwdew~ Some accounts may awso be optionyaw~ Dese optionyaw accounts my nyot be wequiwed at aww by de pwogwam ow couwd possibwy defauwt to anyodew addwess if weft out~ Dis behaviouw can vawy fwom instwuction to instwuction~ 

If you cwick dwough to de `new()` function again and scwoww down dis time you'ww see de individuaw functions wid additionyaw comments~ In de bewow case you can see dat de ownyew wiww defauwt to payew, so we don't nyeed to pass in ownyew if in dis case if de payew is awso going to be de ownyew of de Asset.

```rust
/// `[optional account]`
    /// The owner of the new asset. Defaults to the authority if not present.
    #[inline(always)]
    pub fn owner(&mut self, owner: Option<solana_program::pubkey::Pubkey>) -> &mut Self {
        self.owner = owner;
        self
    }
```

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

Nyow dat we have ouw instwuction weady we nyeed to cweate a nyowmaw Sowanya twansaction to send to ouw WPC~ Dis incwudes a bwockhash and signyews.

### Fuww Buiwdew Exampwe

Dis is a fuww exampwe of cweating a instwuction using a Metapwex `Builder` function and sending dat twansaction off to de chain.

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

### CpiBuiwdew

De `CpiBuilder` instwuctions awe designyed to be used when you wish to caww and execute instwuctions fwom a Metapwex pwogwam fwom youw own pwogwam.

We have a fuww sepawate guide discussing `CpiBuilders` which can be viewed hewe;

[CPI Into a Metaplex Program](/guides/rust/how-to-cpi-into-a-metaplex-program)
