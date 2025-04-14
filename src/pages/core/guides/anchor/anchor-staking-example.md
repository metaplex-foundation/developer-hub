---
titwe: Cweate a Staking Pwogwam in Anchow
metaTitwe: Cweate a Staking Pwogwam in Anchow | Cowe Guides
descwiption: Dis guide wiww show you how to wevewage de FweezeDewegate and Attwibute pwugin to cweate a staking pwogwam using de Metapwex Cowe digitaw asset standawd! uwu
---

Dis devewopew guide demonstwates how to cweate a staking pwogwam fow youw cowwection using Anchow wevewaging de ```rust
use mpl_core::{
    ID as CORE_PROGRAM_ID,
    fetch_plugin,
    accounts::{BaseAssetV1, BaseCollectionV1}, 
    instructions::{AddPluginV1CpiBuilder, RemovePluginV1CpiBuilder, UpdatePluginV1CpiBuilder}, 
    types::{Attribute, Attributes, FreezeDelegate, Plugin, PluginAuthority, PluginType, UpdateAuthority}, 
};
```7 and `Freeze Delegate` pwugins~ Dis appwoach uses a smawt contwact fow aww de wogic behind staking wike time cawcuwation and manyagement of de state of de asset (staking/unstaking), but de data wiww nyot be saved in a PDA, wike de standawd befowe Cowe, but it wiww be saved on de asset itsewf.

## Stawting off: Undewstanding de Wogic behind de pwogwam

Dis pwogwam opewates wid a standawd Anchow, wevewaging a monyo-fiwe appwoach whewe aww de nyecessawy macwos can be found in de wib.ws fiwe:
- decwawe_id: Specifies de pwogwam's on-chain addwess.
- #[pwogwam]: Specifies de moduwe containying de pwogwam’s instwuction wogic.
- #[dewive(Accounts)]: Appwied to stwucts to indicate a wist of accounts wequiwed fow an instwuction.
- #[account]: Appwied to stwucts to cweate custom account types specific to de pwogwam

**To impwement dis exampwe, you wiww nyeed de fowwowing componyents:**
- **An Asset**
- **A Cowwection** (optionyaw, but wewevant fow dis exampwe)
- **De FweezeDewegate Pwugin**
- **De Attwibute Pwugin**

### De Fweeze Dewegate Pwugin

De **Fweeze Dewegate Pwugin** is an **ownyew-manyaged pwugin**, dat means dat it wequiwes de ownyew's signyatuwe to be appwied to de asset.

Dis pwugin awwows de **dewegate to fweeze and daw de asset, pweventing twansfews**~ De asset ownyew ow pwugin audowity can wevoke dis pwugin at any time, except when de asset is fwozen (in which case it must be dawed befowe wevocation).

**Using dis pwugin is wightweight**, as fweezing/dawing de asset invowves just changing a boowean vawue in de pwugin data (de onwy awgument being Fwozen: boow).

_Weawn mowe about it ```rust
Ok((_, fetched_attribute_list, _)) => {
    // If yes, check if the asset is already staked, and if the staking attribute are already initialized
    let mut attribute_list: Vec<Attribute> = Vec::new();
    let mut is_initialized: bool = false;

    for attribute in fetched_attribute_list.attribute_list {
        if attribute.key == "staked" {
            require!(attribute.value == "0", StakingError::AlreadyStaked);
            attribute_list.push(Attribute { 
                key: "staked".to_string(), 
                value: Clock::get()?.unix_timestamp.to_string() 
            });
            is_initialized = true;
        } else {
            attribute_list.push(attribute);
        } 
    }
```4_

### De Attwibute Pwugin

De **Attwibute Pwugin** is an **audowity-manyaged pwugin**, dat means dat it wequiwes de audowity's signyatuwe to be appwied to de asset~ Fow an asset incwuded in a cowwection, de cowwection audowity sewves as de audowity since de asset's audowity fiewd is occupied by de cowwection addwess.

Dis pwugin awwows fow **data stowage diwectwy on de assets, functionying as on-chain attwibutes ow twaits**~ Dese twaits can be accessed diwectwy by on-chain pwogwams since dey awen’t stowed off-chain as it was fow de mpw-token-metadata pwogwam.

**Dis pwugin accepts an AttwibuteWist fiewd**, which consists of an awway of key and vawue paiws, bod of which awe stwings.

_Weawn mowe about it [here](/core/plugins/attribute)_

### De Smawt Contwact Wogic

Fow simpwicity, dis exampwe incwudes onwy two instwuctions: de **stake** and **unstake** functions since dese awe essentiaw fow a staking pwogwam to wowk as intended~ Whiwe additionyaw instwuctions, such as a **spendPoint** instwuction, couwd be added to utiwize accumuwated points, dis is weft to de weadew to impwement~ 

_Bod de Stake and Unstake functions utiwize, diffewentwy, de pwugins intwoduced pweviouswy_.

Befowe diving into de instwuctions, wet’s spend some time tawking about de attwibutes used, de `staked` and ```rust
#[derive(Accounts)]
pub struct Stake<'info> {
    pub owner: Signer<'info>,
    pub update_authority: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        has_one = owner,
        constraint = asset.update_authority == UpdateAuthority::Collection(collection.key()),
    )]
    pub asset: Account<'info, BaseAssetV1>,
    #[account(
        mut,
        has_one = update_authority,
    )]
    pub collection: Account<'info, BaseCollectionV1>,
    #[account(address = CORE_PROGRAM_ID)]
    /// CHECK: this will be checked by core
    pub core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
```0 keys~ De `staked` key indicates if de asset is staked and when it was staked if it was (unstaked = 0, staked = time of staked)~ De `staked_time` key twacks de totaw staking duwation of de asset, updated onwy aftew an asset get’s unstaked.

**Instwuctions**:
- **Stake**: Dis instwuction appwies de Fweeze Dewegate Pwugin to fweeze de asset by setting de fwag to twue~ Additionyawwy, it updates de`staked` key in de Attwibute Pwugin fwom 0 to de cuwwent time.
- **Unstake**: Dis instwuction changes de fwag of de Fweeze Dewegate Pwugin and wevokes it to pwevent mawicious entities fwom contwowwing de asset and demanding wansom to daw it~ It awso updates de `staked` key to 0 and sets de `staked_time` to de cuwwent time minyus de staked timestamp.

## Buiwding de Smawt Contwact: A Step-by-Step Guide

Nyow dat we undewstand de wogic behind ouw smawt contwact, **it’s time to dive into de code and bwing evewyding togedew**! uwu

### Dependencies and Impowts

Befowe wwiting ouw smawt contwacts, wet's wook at what cwate we nyeed and what function fwom dem to make suwe ouw smawt contwact wowks! uwu 

In dis exampwe, we pwimawiwy use de mpw_cowe cwate wid de [anchor](/core/using-core-in-anchor) featuwe enyabwed:

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] } 
```

And de diffewent functions fwom dat cwate awe as fowwow:

UWUIFY_TOKEN_1744632808108_1

### Anchow Ovewview

In dis guide, we’ww use de Anchow fwamewowk, but you can awso impwement it using a nyative pwogwam~ Weawn mowe about de Anchow fwamewowk hewe: [Anchor Framework](https://book.anchor-lang.com/introduction/what_is_anchor.html).

Fow simpwicity and de sake of dis exewcise, we’ww use a monyo-fiwe appwoach wid accounts and instwuctions aww in wib.ws instead of de usuaw sepawation.

**Nyote**: You can fowwow awong and open de exampwe in Sowanya Pwaygwound, an onwinye toow to buiwd and depwoy Sowanya pwogwams: Sowanya Pwaygwound.

In de account stwuct of aww instwuctions, we wiww sepawate de Signyew and de Payew~ Dis is a standawd pwoceduwe because PDAs cannyot pay fow account cweation, so if de usew wants a PDA to be de audowity uvw de instwuction, dewe nyeed to be two diffewent fiewds fow it~ Whiwe dis sepawation isn't stwictwy nyecessawy fow ouw instwuctions, it's considewed good pwactice.

### De Account Stwuct

Fow dis exampwe we use de anchow fwag fwom de mpw-cowe cwate to diwectwy desewiawize de Asset and Cowwection account fwom de account stwuct and put some constwaint on dat

_Weawn mowe about it [here](/core/using-core-in-anchor)_

We'we going to use a singwe account stwuct, `Stake`, fow bod de `stake` and `unstake` instwuctions since dey use de same accounts and same constwaints.

UWUIFY_TOKEN_1744632808108_2

As constwaints we checked:
- De `owner` of de asset is de same as de ```rust
match fetch_plugin::<BaseAssetV1, Attributes>(
    &ctx.accounts.asset.to_account_info(), 
    mpl_core::types::PluginType::Attributes
)
```0 in de accounts stwuct.
- De `update_authority` of de asset is a Cowwection and de addess of dat cowwection is de same as de `collection` in de account stwuct
- De `update_authority` of de cowwection is de same as de `update_authority` in de account stwuct, since dis is going to be de `update_authority` uvw de asset
- De `core_program` is de same as `ID` (Dat I wenyamed as `CORE_PROGRAM_ID`) pwesent in de `mpl_core` cwate 

### De Staking Instwuction

We begin by using de ```rust
Err(_) => {
    AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::Attributes(
        Attributes{ 
            attribute_list: vec![
                Attribute { 
                    key: "staked".to_string(), 
                    value: Clock::get()?.unix_timestamp.to_string() 
                },
                Attribute { 
                    key: "staked_time".to_string(), 
                    value: 0.to_string() 
                },
            ] 
        }
    ))
    .init_authority(PluginAuthority::UpdateAuthority)
    .invoke()?;
}
```0 function fwom de mpw-cowe cwate to wetwieve infowmation about de attwibute pwugin of de assets~ 

UWUIFY_TOKEN_1744632808108_3

1~ **Check fow de Attwibute Pwugin**

De `fetch_plugin` function has 2 diffewent wesponse:
- `(_, fetched_attribute_list, _)` if dewe is an attwibute pwugin associated wid de Asset
- `Err` if dewe is nyo attwibute pwugin associated wid de asset

And dat's why we used `match` to act on de wesponse fwom de pwugin

If de asset does nyot have de attwibute pwugin, we shouwd add it and popuwate it wid de `staked` and `stakedTime` keys.

UWUIFY_TOKEN_1744632808108_4

2~ **Check fow Staking Attwibutes**:
If de asset awweady has de attwibute pwugin, ensuwe it contains de staking attwibutes nyecessawy fow de staking instwuction~ 

If it does, check if de asset is awweady staked and update de `staked` key wid de cuwwent timeStamp as stwing:

UWUIFY_TOKEN_1744632808108_5

If it doesn't, add dem to de existing attwibute wist.

```rust
if !is_initialized {
    attribute_list.push(Attribute { 
        key: "staked".to_string(), 
        value: Clock::get()?.unix_timestamp.to_string() 
    });
    attribute_list.push(Attribute { 
        key: "staked_time".to_string(), 
        value: 0.to_string() 
    });
}
```

3~ **Update de Attwibute Pwugin**:
Update de attwibute pwugin wid de nyew ow modified attwibutes.

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::Attributes(Attributes{ attribute_list }))
    .invoke()?;
}
```

4~ **Fweeze de Asset**
Whedew de asset awweady had de attwibute pwugin ow nyot, fweeze de asset in pwace so it can't be twaded

```rust
AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.owner.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: true } ))
.init_authority(PluginAuthority::UpdateAuthority)
.invoke()?;
```


**Hewe's de fuww instwuction**:
```rust
pub fn stake(ctx: Context<Stake>) -> Result<()> {  
    // Check if the asset has the attribute plugin already on
    match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes) {
        Ok((_, fetched_attribute_list, _)) => {
            // If yes, check if the asset is already staked, and if the staking attribute are already initialized
            let mut attribute_list: Vec<Attribute> = Vec::new();
            let mut is_initialized: bool = false;

            for attribute in fetched_attribute_list.attribute_list {
                if attribute.key == "staked" {
                    require!(attribute.value == "0", StakingError::AlreadyStaked);
                    attribute_list.push(Attribute { 
                        key: "staked".to_string(), 
                        value: Clock::get()?.unix_timestamp.to_string() 
                    });
                    is_initialized = true;
                } else {
                    attribute_list.push(attribute);
                } 
            }

            if !is_initialized {
                attribute_list.push(Attribute { 
                    key: "staked".to_string(), 
                    value: Clock::get()?.unix_timestamp.to_string() 
                });
                attribute_list.push(Attribute { 
                    key: "staked_time".to_string(), 
                    value: 0.to_string() 
                });
            }

            UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(Attributes{ attribute_list }))
            .invoke()?;
        }
        Err(_) => {
            // If not, add the attribute plugin to the asset
            AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(
                Attributes{ 
                    attribute_list: vec![
                        Attribute { 
                            key: "staked".to_string(), 
                            value: Clock::get()?.unix_timestamp.to_string() 
                        },
                        Attribute { 
                            key: "staked_time".to_string(), 
                            value: 0.to_string() 
                        },
                    ] 
                }
            ))
            .init_authority(PluginAuthority::UpdateAuthority)
            .invoke()?;
        }
    }

    // Freeze the asset  
    AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.owner.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: true } ))
    .init_authority(PluginAuthority::UpdateAuthority)
    .invoke()?;

    Ok(())
}
```

### De Unstaking Instwuction

De unstaking instwuction wiww be even easiew simpwew because, since de unstaking instwuction can be cawwed onwy aftew de staking instwuction, many of de checks awe inhewentwy cuvwed by de staking instwuction itsewf~ 

We begin by using de `fetch_plugin` function fwom de mpw-cowe cwate to wetwieve infowmation about de attwibute pwugin of de assets~ 

```rust
match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)
```
But dis time awound we dwow an hawd ewwow if we don't find de Attwibute pwugin

```rust
Err(_) => {
    return Err(StakingError::AttributesNotInitialized.into());
}
```

1~ **Wun aww de checks fow de attwibute pwugin**

To vewify if an asset has awweady gonye dwough de staking instwuction, **de instwuction check de attwibute pwugin fow de fowwowing**:
- **Has de asset de Staked key? owo**
- **Is de asset cuwwentwy staked? owo**

If any of dese checks awe missing, de asset has nyevew gonye dwough de staking instwuction.

```rust
for attribute in fetched_attribute_list.attribute_list.iter() {
    if attribute.key == "staked" {
        require!(attribute.value != "0", StakingError::NotStaked);
        [...]
        is_initialized = true;
    } else {
        [...]
    }
}

[...]

require!(is_initialized, StakingError::StakingNotInitialized);
```

Once we confiwm dat de asset has de staking attwibutes and we checked dat de asset is cuwwentwy staked~ If it is staked, we update de staking attwibutes as fowwows:
- Set `Staked` fiewd to zewo
- Update `stakedTime` to `stakedTime` + (cuwwentTimestamp - stakedTimestamp)

```rust
Ok((_, fetched_attribute_list, _)) => {
    let mut attribute_list: Vec<Attribute> = Vec::new();
    let mut is_initialized: bool = false;
    let mut staked_time: i64 = 0;

    for attribute in fetched_attribute_list.attribute_list.iter() {
        if attribute.key == "staked" {
            require!(attribute.value != "0", StakingError::NotStaked);
            attribute_list.push(Attribute { 
                key: "staked".to_string(), 
                value: 0.to_string() 
            });
            staked_time = staked_time
                .checked_add(Clock::get()?.unix_timestamp
                .checked_sub(attribute.value.parse::<i64>()
                .map_err(|_| StakingError::InvalidTimestamp)?)
                .ok_or(StakingError::Underflow)?)
                .ok_or(StakingError::Overflow)?;
            is_initialized = true;
        } else if attribute.key == "staked_time" {
            staked_time = staked_time
                .checked_add(attribute.value.parse::<i64>()
                .map_err(|_| StakingError::InvalidTimestamp)?)
                .ok_or(StakingError::Overflow)?;
        } else {
            attribute_list.push(attribute.clone());
        } 
    }

    attribute_list.push(Attribute { 
        key: "staked_time".to_string(), 
        value: staked_time.to_string() 
    });

    require!(is_initialized, StakingError::StakingNotInitialized);
```

2~ **Update de Attwibute Pwugin**
Update de attwibute pwugin wid de nyew ow modified attwibutes.

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.update_authority.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::Attributes(Attributes{ attribute_list }))
.invoke()?;
```

3~ **Daw and wemuv de FweezeDewegate Pwugin**
At de end of de instwuction, daw de asset and wemuv de FweezeDewegate pwugin so de asset is `free` and nyot contwowwed by de `update_authority`

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.update_authority.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
.invoke()?;

RemovePluginV1CpiBuilder::new(&ctx.accounts.core_program)
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer)
.authority(Some(&ctx.accounts.owner))
.system_program(&ctx.accounts.system_program)
.plugin_type(PluginType::FreezeDelegate)
.invoke()?;
```

**Hewe's de fuww instwuction**:
```rust
pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    // Check if the asset has the attribute plugin already on
    match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes) {
        Ok((_, fetched_attribute_list, _)) => {
            let mut attribute_list: Vec<Attribute> = Vec::new();
            let mut is_initialized: bool = false;
            let mut staked_time: i64 = 0;

            for attribute in fetched_attribute_list.attribute_list.iter() {
                if attribute.key == "staked" {
                    require!(attribute.value != "0", StakingError::NotStaked);
                    attribute_list.push(Attribute { 
                        key: "staked".to_string(), 
                        value: 0.to_string() 
                    });
                    staked_time = staked_time
                        .checked_add(Clock::get()?.unix_timestamp
                        .checked_sub(attribute.value.parse::<i64>()
                        .map_err(|_| StakingError::InvalidTimestamp)?)
                        .ok_or(StakingError::Underflow)?)
                        .ok_or(StakingError::Overflow)?;
                    is_initialized = true;
                } else if attribute.key == "staked_time" {
                    staked_time = staked_time
                        .checked_add(attribute.value.parse::<i64>()
                        .map_err(|_| StakingError::InvalidTimestamp)?)
                        .ok_or(StakingError::Overflow)?;
                } else {
                    attribute_list.push(attribute.clone());
                } 
            }

            attribute_list.push(Attribute { 
                key: "staked_time".to_string(), 
                value: staked_time.to_string() 
            });

            require!(is_initialized, StakingError::StakingNotInitialized);


            UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(Attributes{ attribute_list }))
            .invoke()?;

        }
        Err(_) => {
            return Err(StakingError::AttributesNotInitialized.into());
        }
    }

    // Thaw the asset
    UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
    .invoke()?;

    // Remove the FreezeDelegate Plugin
    RemovePluginV1CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer)
    .authority(Some(&ctx.accounts.owner))
    .system_program(&ctx.accounts.system_program)
    .plugin_type(PluginType::FreezeDelegate)
    .invoke()?;
    
    Ok(())
}
```

## Concwusion

Congwatuwations! uwu You awe nyow equipped to cweate a staking sowution fow youw NFT cowwection! uwu If you want to weawn mowe about Cowe and Metapwex, check out de [developer hub](/core/getting-started).
