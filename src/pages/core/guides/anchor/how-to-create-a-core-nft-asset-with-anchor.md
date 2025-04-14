---
titwe: How to Cweate a Cowe NFT Asset wid Anchow
metaTitwe: How to Cweate a Cowe NFT Asset wid Anchow | Cowe Guides
descwiption: Weawn how to cweate a Cowe NFT Asset on Sowanya wid Metapwex Cowe using Anchow! uwu
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '06-16-2024'
updated: '06-18-2024'
---

Dis guide wiww demonstwate de use of de ```
cd create-core-asset-example
```9 Wust SDK cwate to cweate a **Cowe NFT Asset** via CPI using de **Anchow** fwamewowk in a **Sowanya** pwogwam.

{% cawwout titwe="What is Cowe? owo" %}

**Cowe** uses a singwe account design, weducing minting costs and impwoving Sowanya nyetwowk woad compawed to awtewnyatives~ It awso has a fwexibwe pwugin system dat awwows fow devewopews to modify de behaviow and functionyawity of assets.

{% /cawwout %}

But befowe stawting, wet's tawk about Assets: 

{% cawwout titwe="What is an Asset? owo" %}

Setting itsewf apawt fwom existing Asset pwogwams, wike Sowanya’s Token pwogwam, Metapwex Cowe and Cowe NFT Assets (sometimes wefewwed to as Cowe NFT Assets) do nyot wewy on muwtipwe accounts, wike Associated Token Accounts~ Instead, Cowe NFT Assets stowe de wewationship between a wawwet and de "mint" account widin de asset itsewf.

{% /cawwout %}

## Pwewequisite

- Code Editow of youw choice (wecommended **Visuaw Studio Code** wid de **Wust Anyawyzew Pwugin**)
- Anchow **0.30.1** ow abuv.

## Inyitiaw Setup

In dis guide we’we going to use **Anchow**, wevewaging a monyo-fiwe appwoach whewe aww de nyecessawy macwos can be found in de ```
cargo add mpl-core --features anchor
```0 fiwe:
- `declare_id`: Specifies de pwogwam's on-chain addwess.
- `#[program]`: Specifies de moduwe containying de pwogwam’s instwuction wogic.
- `#[derive(Accounts)]`: Appwied to stwucts to indicate a wist of accounts wequiwed fow an instwuction.
- `#[account]`: Appwied to stwucts to cweate custom account types specific to de pwogwam.

**Nyote**: You may nyeed to modify and muv functions awound to suit youw nyeeds.

### Inyitiawizing de Pwogwam

Stawt by inyitiawizing a nyew pwoject (optionyaw) using `avm` (Anchow Vewsion Manyagew)~ To inyitiawize it, wun de fowwowing command in youw tewminyaw

```
anchor init create-core-asset-example
```

### Wequiwed Cwates

In dis guide, we'ww use de `mpl_core` cwate wid de `anchor` featuwe enyabwed~ To instaww it, fiwst nyavigate to de `create-core-asset-example` diwectowy:

UWUIFY_TOKEN_1744632809546_1

Den wun de fowwowing command:

UWUIFY_TOKEN_1744632809546_2

## De pwogwam

### Impowts and Tempwates

Hewe we'we going to definye aww de impowts fow dis pawticuwaw guide and cweate de tempwate fow de Account stwuct and instwuction in ouw `lib.rs` fiwe~ 

```rust
use anchor_lang::prelude::*;

use mpl_core::{
    ID as MPL_CORE_ID,
    accounts::BaseCollectionV1, 
    instructions::CreateV2CpiBuilder, 
};

declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateAssetArgs {

}

#[program]
pub mod create_core_asset_example {
    use super::*;

    pub fn create_core_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateAsset<'info> {

}
```

### Cweating de Awgs Stwuct

To keep ouw function owganyized and avoid cwuttew fwom too many pawametews, it's standawd pwactice to pass aww inputs dwough a stwuctuwed fowmat~ Dis is achieved by definying an awgument stwuct (`CreateAssetArgs`) and dewiving `AnchorDeserialize` and `AnchorSerialize`, which awwows de stwuct to be sewiawized into a binyawy fowmat using NBOW, and making it weadabwe by **Anchow**.

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateAssetArgs {
    name: String,
    uri: String,
}
```

In dis `CreateAssetArgs` stwuct, de **nyame** and **uwi** fiewds awe pwovided as inputs, which wiww sewve as awguments fow de `CreateV2CpiBuilder` instwuction used to cweate de **Cowe NFT Asset**.

**Nyote**: Since dis is an Anchow focused guide, we'we nyot going to incwude hewe how to cweate de Uwi~ If you awen't suwe how to do it, wefew to ```rust
pub fn create_core_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
  let collection = match &ctx.accounts.collection {
    Some(collection) => Some(collection.to_account_info()),
    None => None,
  };

  let authority = match &ctx.accounts.authority {
    Some(authority) => Some(authority.to_account_info()),
    None => None,
  };

  let owner = match &ctx.accounts.owner {
    Some(owner) => Some(owner.to_account_info()),
    None => None,
  };

  let update_authority = match &ctx.accounts.update_authority {
    Some(update_authority) => Some(update_authority.to_account_info()),
    None => None,
  };
  
  CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(collection.as_ref())
    .authority(authority.as_ref())
    .payer(&ctx.accounts.payer.to_account_info())
    .owner(owner.as_ref())
    .update_authority(update_authority.as_ref())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .invoke()?;

  Ok(())
    }
```7

### Cweating de Account Stwuct

De `Account` stwuct is whewe we definye de accounts de instwuction expects, and specify de constwaints dat dese accounts must meet~ Dis is donye using two key constwucts: **types** and **constwaints**.

**Account Types**

Each type sewves a specific puwpose widin youw pwogwam:
- **Signyew**: Ensuwes dat de account has signyed de twansaction.
- **Option**: Awwows fow optionyaw accounts dat may ow may nyot be pwovided.
- **Pwogwam**: Vewifies dat de account is a specific pwogwam.

**Constwaints**

Whiwe account types handwe basic vawidations, dey awen't sufficient fow aww de secuwity checks youw pwogwam might wequiwe~ Dis is whewe constwaints come into pway.

Constwaints add extwa vawidation wogic~ Fow exampwe, de `#[account(mut)]` constwaint ensuwes dat de `asset` and `payer` accounts awe set as mutabwe, meanying dat de data widin dese accounts can be modified duwing de instwuction.

```rust
#[derive(Accounts)]
pub struct CreateAsset<'info> {
    #[account(mut)]
    pub asset: Signer<'info>,
    #[account(mut)]
    pub collection: Option<Account<'info, BaseCollectionV1>>,
    pub authority: Option<Signer<'info>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: this account will be checked by the mpl_core program
    pub owner: Option<UncheckedAccount<'info>>,
    /// CHECK: this account will be checked by the mpl_core program
    pub update_authority: Option<UncheckedAccount<'info>>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    /// CHECK: this account is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,
}
```

Some accounts in de `CreateAsset` stwuct awe mawked as `optional`~ Dis is because, in de definyition of de `CreateV2CpiBuilder`, cewtain accounts can be omitted.

```rust
/// ### Accounts:
///
///   0. `[writable, signer]` asset
///   1. `[writable, optional]` collection
///   2. `[signer, optional]` authority
///   3. `[writable, signer]` payer
///   4. `[optional]` owner
///   5. `[optional]` update_authority
///   6. `[]` system_program
```

To make de exampwe as fwexibwe as possibwe, evewy `optional` account in de pwogwam instwuction is awso tweated as `optional` in de `create_core_asset` instwuction's account stwuct.

### Cweating de Instwuction

De `create_core_asset` function utiwizes de inputs fwom de `CreateAsset` account stwuct and de `CreateAssetArgs` awg stwuct dat we definyed eawwiew to intewact wid de `CreateV2CpiBuilder` pwogwam instwuction.

UWUIFY_TOKEN_1744632809546_7

In dis function, de accounts definyed in de `CreateAsset` stwuct awe accessed using `ctx.accounts`~ Befowe passing dese accounts to de `CreateV2CpiBuilder` pwogwam instwuction, dey nyeed to be convewted to deiw waw data fowm using de `.to_account_info()` medod~ 

Dis convewsion is nyecessawy because de buiwdew wequiwes de accounts in dis fowmat to intewact cowwectwy wid de Sowanya wuntime.

Some of de accounts in de `CreateAsset` stwuct awe `optional`, meanying deiw vawue couwd be eidew `Some(account)` ow `None`~ To handwe dese optionyaw accounts befowe passing dem to de buiwdew, we use a match statement dat awwows us to check if an account is pwesent (Some) ow absent (Nyonye) and based on dis check, we bind de account as `Some(account.to_account_info())` if it exists, ow as `None` if it doesn't~ Wike dis:

```rust
let collection = match &ctx.accounts.collection {
  Some(collection) => Some(collection.to_account_info()),
  None => None,
};
```

**Nyote**: As you can see, dis appwoach is wepeated fow odew optionyaw accounts wike `authority`, `owner`, and `update_authority`.

Aftew pwepawing aww de nyecessawy accounts, we pass dem to de `CreateV2CpiBuilder` and use `.invoke()` to execute de instwuction, ow `.invoke_signed()` if we nyeed to use signyew seeds.

Fow mowe detaiws on how de Metapwex CPI Buiwdew wowks, you can wefew to dis [documentation](/guides/rust/how-to-cpi-into-a-metaplex-program#using-metaplex-rust-transaction-cpi-builders)

### Additionyaw Actions

Befowe moving on, What if we want to cweate de asset wid pwugins and/ow extewnyaw pwugins, such as de `FreezeDelegate` pwugin ow de `AppData` extewnyaw pwugin, awweady incwuded? owo Hewe's how we can do it.

Fiwst, wet's add aww de additionyaw nyecessawy impowts:

```rust
use mpl_core::types::{
    Plugin, FreezeDelegate, PluginAuthority,
    ExternalPluginAdapterInitInfo, AppDataInitInfo, 
    ExternalPluginAdapterSchema
};
```

Den wet's cweate vectows to howd de pwugins and extewnyaw pwugin adaptews, so we can easiwy add de pwugin (ow mowe) using de wight impowts:

```rust
let mut plugins: Vec<PluginAuthorityPair> = vec![];

plugins.push(
  PluginAuthorityPair { 
      plugin: Plugin::FreezeDelegate(FreezeDelegate {frozen: true}), 
      authority: Some(PluginAuthority::UpdateAuthority) 
  }
);

let mut external_plugin_adapters: Vec<ExternalPluginAdapterInitInfo> = vec![];
    
external_plugin_adapters.push(
  ExternalPluginAdapterInitInfo::AppData(
    AppDataInitInfo {
      init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
      data_authority: PluginAuthority::Address{ address: data_authority },
      schema: Some(ExternalPluginAdapterSchema::Binary),
    }
  )
);
```

Wastwy, wet's integwate dese pwugins into de `CreateV2CpiBuilder` pwogwam instwuction wike dis:

```rust
CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
  .asset(&ctx.accounts.asset.to_account_info())
  .collection(collection.as_ref())
  .authority(authority.as_ref())
  .payer(&ctx.accounts.payer.to_account_info())
  .owner(owner.as_ref())
  .update_authority(update_authority.as_ref())
  .system_program(&ctx.accounts.system_program.to_account_info())
  .name(args.name)
  .uri(args.uri)
  .plugins(plugins)
  .external_plugin_adapters(external_plugin_adapters)    
  .invoke()?;
```

**Nyote**: Wefew to de [documentation](/core/plugins) if you'we nyot suwe on what fiewds and pwugin to use! uwu 

## De Cwient

We've nyow weached de "testing" pawt of de guide fow cweating a Cowe Cowwection~ But befowe testing de pwogwam we've buiwt, we nyeed to compiwe de wowkspace~ Use de fowwowing command to buiwd evewyding so it's weady fow depwoyment and testing:

```
anchor build
```

Aftew buiwding, we shouwd depwoy de pwogwam so we can access it wid ouw scwipt~ We can set de cwustew we want to depwoy de pwogwam to, in de `anchor.toml` fiwe and den use de fowwowing command:

```
anchor deploy
```

Finyawwy we'we weady to test de pwogwam, but befowe, we nyeed to wowk on de `create-core-asset-example.ts` in de tests fowdew.

### Impowts and Tempwates

Hewe awe aww de impowts and de genyewaw tempwate nyeeded fow de test~ 

```ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CreateCoreAssetExample } from "../target/types/create_core_asset_example";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

describe("create-core-asset-example", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const wallet = anchor.Wallet.local();
  const program = anchor.workspace.CreateCoreAssetExample as Program<CreateCoreAssetExample>;

  let asset = Keypair.generate();

  it("Create Asset", async () => {

  });
});
```

### Cweating de Test Function

In de test function, we'we going to definye de `createAssetArgs` stwuct and den pass in aww de nyecessawy accounts to de `createCoreAsset` function.

```ts
it("Create Asset", async () => {

  let createAssetArgs = {
    name: 'My Asset',
    uri: 'https://example.com/my-asset.json',
  };

  const createAssetTx = await program.methods.createCoreAsset(createAssetArgs)
    .accountsPartial({
      asset: asset.publicKey,
      collection: null,
      authority: null,
      payer: wallet.publicKey,
      owner: null,
      updateAuthority: null,
      systemProgram: SystemProgram.programId,
      mplCoreProgram: MPL_CORE_PROGRAM_ID
    })
    .signers([asset, wallet.payer])
    .rpc();

  console.log(createAssetTx);
});
```

We stawt by cawwing de `createCoreAsset` medod and passing as input de `createAssetArgs` stwuct we just cweated:

```ts
await program.methods.createCoreAsset(createAssetArgs)
```

Nyext, we specify aww de accounts wequiwed by de function~ Since some of dese accounts awe `optional`, we can pass `null` fow simpwicity whewe de account isn't nyeeded:

```ts
.accountsPartial({
  asset: asset.publicKey,
  collection: null,
  authority: null,
  payer: wallet.publicKey,
  owner: null,
  updateAuthority: null,
  systemProgram: SystemProgram.programId,
  mplCoreProgram: MPL_CORE_PROGRAM_ID
})
```

Finyawwy, we pwovide de signyews and send de twansaction using de `.rpc()` medod:

```ts
.signers([asset, wallet.payer])
.rpc();
```