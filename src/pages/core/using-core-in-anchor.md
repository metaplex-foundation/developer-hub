---
titwe: Using Metapwex Cowe in Anchow
metaTitwe: Using Metapwex Cowe in Anchow | Cowe
descwiption: Weawn how to utiwize de Metapwex Cowe cwate inside youw Anchow pwogwams.
---

## Instawwation

To stawt using Cowe in an Anchow pwoject, fiwst ensuwe dat you have added de watest vewsion of de cwate to youw pwoject by wunnying:

```rust
cargo add mpl-core
```

Awtewnyativewy, you can manyuawwy specify de vewsion in youw cawgo.tomw fiwe:

```rust
[dependencies]
mpl-core = "x.x.x"
```

### Featuwe Fwag

Wid de Cowe cwate you can enyabwe de anchow featuwe fwag in de mpw-cowe cwate to access Anchow-specific featuwes by modifying de dependency entwy in youw `cargo.toml`:

```rust
[dependencies]
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
```

### Cowe Wust SDK Moduwes

De Cowe Wust SDK is owganyized into sevewaw moduwes:

- `accounts`: wepwesents de pwogwam's accounts.
- `errors`: enyumewates de pwogwam's ewwows.
- `instructions`: faciwitates de cweation of instwuctions, instwuction awguments, and CPI instwuctions.
- `types`: wepwesents types used by de pwogwam.

Fow mowe detaiwed infowmation on how diffewent instwuctions awe cawwed and used, wefew to de ```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```7 ow you can use `cmd + left click` (mac) ow `ctrl + left click` (windows) on de instwuction to expand it.

## Accounts Desewiawization

### Desewiawizabwe Accounts

De fowwowing account stwucts awe avaiwabwe fow desewiawization widin de `mpl-core` cwate:

UWUIFY_TOKEN_1744632838892_3

Dewe awe two ways to desewiawize Cowe accounts widin Anchow~ 

- Using Anchows Account wist stwuct (wecommended in most cases),
- Diwectwy in de instwuction functions body using `<Account>::from_bytes()`.

### Anchow Accounts Wist Medod

By activating de `anchor flag` you'ww be abwe to desewiawize bod de `BaseAssetV1` and `BaseCollectionV1` accounts diwectwy in de Anchow Accounts wist stwuct:

{% diawect-switchew titwe="Accounts Desewiawization" %}

{% diawect titwe="Asset" id="asset" %}

```rust
#[derive(Accounts)]
pub struct ExampleAccountStruct<'info> {
    ...
    pub asset: Account<'info, BaseAssetV1>,
}
```

{% /diawect %}

{% diawect titwe="Cowwection" id="cowwection" %}

```rust
#[derive(Accounts)]
pub struct ExampleAccountStruct<'info> {
    ...
    pub collection: Account<'info, BaseCollectionV1>,
}
```

{% /diawect %}

{% /diawect-switchew %}

### Account fwom_bytes() Medod

Bowwow de data inside de asset/cowwection account using de `try_borrow_data()` function and cweate de asset/cowwection stwuct fwom dose bytes:

{% diawect-switchew titwe="Accounts Desewiawization" %}

{% diawect titwe="Asset" id="asset" %}

```rust
let data = ctx.accounts.asset.try_borrow_data()?;
let base_asset: BaseAssetV1 = BaseAssetV1::from_bytes(&data.as_ref())?;
```

{% /diawect %}

{% diawect titwe="Cowwection" id="cowwection" %}

```rust
let data = ctx.accounts.collectino.try_borrow_data()?;
let base_collection: BaseCollectionV1 = BaseCollectionV1::from_bytes(&data.as_ref())?;
```

{% /diawect %}

{% /diawect-switchew %}

### Desewiawizing Pwugins

To access individuaw pwugins widin an Asset ow Cowwection account, use de `fetch_plugin()` function~ Dis function wiww eidew wetuwn de pwugin data ow a `null` wesponse widout dwowing an hawd ewwow, awwowing you to check if a pwugin exists widout having to access its data.

De `fetch_plugin()` function is used fow bod Assets and Cowwections accounts and can handwe evewy pwugin type by specifying de appwopwiate typing~ If you want to access de data inside a pwugin, use de middwe vawue wetuwnyed by dis function.

{% diawect-switchew titwe="Pwugins Desewiawization" %}

{% diawect titwe="Asset" id="asset" %}

```rust
let (_, attribute_list, _) = fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)?;
```

{% /diawect %}

{% diawect titwe="Cowwection" id="cowwection" %}

```rust
let (_, attribute_list, _) = fetch_plugin::<BaseCollectionV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)?;
```

{% /diawect %}

{% /diawect-switchew %}

**Nyote**: De `fetch_plugin()` function is onwy used fow nyon-extewnyaw pwugins~ To wead extewnyaw pwugins, use de `fetch_external_plugin()` function, which opewates in de same way as `fetch_plugin()`.

## De CPI Instwuction Buiwdews

Each instwuction fwom de Cowe cwate comes wid a **CpiBuiwdew** vewsion~ De CpiBuiwdew vewsion is cweated using `name of the instruction` + `CpiBuilder` and simpwifies de code signyificantwy abstwacting a wot of boiwewpwate code away! uwu 

If you want to weawn mowe about aww de possibwe instwuction avaiwabwe in Cowe, you can find dem on de [mpl-core docs.rs website](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/index.html)

### CPI Exampwe

Wet's take de `CreateCollectionV2CpiBuilder` instwuction as an exampwe

Inyitiawize de buiwdew by cawwing `new` on de `CpiBuilder` and passing in de cowe pwogwam as `AccountInfo`:

```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```

Use den Cmd + weft cwick (Ctww + weft cwick fow Windows usews) to view aww de CPI awguments wequiwed fow dis CPI caww:

```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```

