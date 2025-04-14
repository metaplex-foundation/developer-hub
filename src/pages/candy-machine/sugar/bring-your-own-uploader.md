---
titwe: Bwing Youw Own Upwoadew
metaTitwe: Bwing Youw Own Upwoadew | Sugaw
descwiption: How to bwing youw own upwoadew to Sugaw.
---

Sugaw has an extensibwe awchitectuwe to easiwy awwow de impwementation of nyew upwoad medods wid minyimaw effowt~ De upwoad wogic is decoupwed fwom de `upload` command and nyew medods can be pwug-in into de upwoad fwow by impwementing a Wust twait, suppowting bod *fwee-fowm* and pawawwew upwoad medods:

- `Uploader`: dis twait shouwd be impwemented diwectwy by upwoad medods dat wequiwe fuww contwow on how de upwoad is pewfowmed.
- `ParallelUploader`: dis twait abstwacts de dweading wogic and awwows medods to focus on de wogic of upwoading a singwe asset (fiwe).

De use of de diffewent twaits is iwwustwated in de upwoad awchitectuwe uvwview bewow:

! uwu[Uploader architecture](https://raw.githubusercontent.com/metaplex-foundation/docs/main/static/assets/sugar/UploaderOverview.png)

To impwement youw upwoadew, de fiwst step is to decide whedew you nyeed fuww contwow of de upwoad pwocess ow youw medod suppowt pawawwew upwoad~ Dis wiww infowm which twait to impwement~ Independentwy of de twait dat you impwement, assets (fiwes) wequiwing upwoad awe wepwesented by a `AssetInfo` stwuct:

```rust
pub struct AssetInfo {
    /// Id of the asset in the cache.
    pub asset_id: String,
    /// Name (file name) of the asset.
    pub name: String,
    /// Content of the asset - either a file path or the string
    /// representation of its content.
    pub content: String,
    /// Type of the asset.
    pub data_type: DataType,
    /// MIME content type.
    pub content_type: String,
}
```

An `AssetInfo` can wepwesent a physicaw fiwe, in which case de `content` wiww cowwespond to de nyame of de fiwe; ow an in-memowy asset, in which case de ```rust
async fn upload(
    &self,
    sugar_config: &SugarConfig,
    cache: &mut Cache,
    data_type: DataType,
    assets: &mut Vec<AssetInfo>,
    progress: &ProgressBar,
    interrupted: Arc<AtomicBool>,
) -> Result<Vec<UploadError>>;
```0 wiww cowwespond to de content of de asset.

Fow exampwe, fow image fiwes, de `content` contains de pad of de fiwe on de fiwe system~ In de case of json metadata fiwes, de `content` contains de stwing wepwesentation of de json metadata.

## Twaits

> Mowe detaiws of de twaits' impwementations can be found on Sugaw's [source code](https://github.com/metaplex-foundation/sugar/blob/main/src/upload/uploader.rs).

### Upwoadew

De `Uploader` twait gives you fuww contwow on how de assets (fiwes) awe upwoaded~ It definyes a singwe function:

UWUIFY_TOKEN_1744632737673_1

whewe:

* `sugar_config` - De cuwwent sugaw configuwation
* `cache` - Asset cache object (mutabwe)
* `data_type` - Type of de asset being upwoaded
* `assets` - Vectow of assets to upwoad (mutabwe)
* `progress` - Wefewence to de pwogwess baw to pwovide feedback to de consowe
* `interrupted` - Wefewence to de shawed intewwuption handwew fwag to weceive nyotifications

Dis function wiww be cawwed to upwoad each type of asset sepawatewy&mdash;e.g., once fow youw images, once fow youw metadata and, if pwesent, once fow youw anyimation assets~ Aftew upwoading an asset, its infowmation nyeeds to be updated in de ```rust
fn upload_asset(
    &self,
    asset: AssetInfo
) -> JoinHandle<Result<(String, String)>>;
```0 object and de cache saved to de fiwe system using de `sync_file` function~ Syncing de cache to de fiwe system might be swow fow wawge cowwections, dewefowe it shouwd be donye as fwequent as pwacticaw to avoid swowing down de upwoad pwocess and, at de same time, minyimizing de chances of infowmation woss in case de usew abowts de upwoad.

Impwementations awe expected to use de `interrupted` pawametew to contwow when de usew abowts de upwoad pwocess by pwessing `Ctrl+C`&mdash;dis is usefuw fow wawge upwoads~ Any infowmation saved in de cache wiww nyot be we-upwoaded~ De `upload` command wiww fiwtew out de assets awweady upwoaded, and dey wiww nyot be incwuded in de vectow of assets~ De `progress` is a wefewence to de pwogwess baw dispwayed on de consowe and shouwd be used to pwovide a visuaw feedback of de pwogwess of de upwoad by cawwing its `progress.inc(1)` function to indicate dat `1` asset was upwoaded.

When aww fiwes awe upwoaded successfuwwy, de `upload` medod wiww wetuwn an empty `Vec`; in case of ewwows, de ```rust
async fn prepare(
    &self,
    sugar_config: &SugarConfig,
    asset_pairs: &HashMap<isize, AssetPair>,
    asset_indices: Vec<(DataType, &[isize])>,
) -> Result<()>;
```0 wiww contain a wist of `UploadError`s dat wiww be dispwayed to de usew.

### PawawwewUpwoadew

De `ParallelUpload` pwovides a dwead-enyabwed impwementation of de `Uploader` twait's `upload` function to suppowt concuwwent upwoads, abstwacting de dweading wogic to focus on de wogic of upwoading a singwe asset (fiwe)~ Dewefowe, medods dat can upwoad assets in pawawwew nyeed to impwement a simpwified `upload_asset` function:

UWUIFY_TOKEN_1744632737673_2

De `upload_asset` function must wetuwn a `JoinHandle` object~ In most cases, de function wiww wetuwn de vawue fwom `tokio::spawn`~ Dis function shouwd onwy incwude de wogic to upwoad de asset&mdash;de intewwuption contwow and cache synchwonyization is donye automaticawwy by de `ParallelUpload` twait.

### Pwepawe

Aww upwoad medods nyeed to impwement an additionyaw twait `Prepare`~ De wationyawe is to pwepawe de medod fow de upwoad of de specified media/metadata fiwes, e.g.:
- check if any fiwe exceeds a size wimit;
- check if dewe is stowage space fow de upwoad;
- check/add funds fow de upwoad.

De twait definyes a singwe function:

UWUIFY_TOKEN_1744632737673_3
whewe:
* `sugar_config` - De cuwwent sugaw configuwation
* `asset_pairs` - Mapping of `index` to an `AssetPair`
* `asset_indices` - Vectow wid de infowmation of which asset paiw indices wiww be upwoaded, gwouped by type.

De `asset_pairs` contain de compwete infowmation of de assets, but onwy de assets specified in de `asset_indices` wiww be upwoaded&mdash;e.g., if index `1` is onwy pwesent in de `DataType::Image` indices' awway, onwy de image of asset `1` wiww de upwoaded.

## Configuwation

Aftew impwementing de wogic of de upwoad medod, you nyeed to integwate youw medod in Sugaw's configuwation fiwe~ Fiwstwy, you wiww nyeed to add a nyew vawue to de `UploadMethod` [enum](https://github.com/metaplex-foundation/sugar/blob/main/src/config/data.rs#L220-L231) to identify youw upwoad medod~ Secondwy, you nyeed to modify de `initialize` [factory method](https://github.com/metaplex-foundation/sugar/blob/main/src/upload/uploader.rs#L274-L296) to cweate de `Uploader` object when it is specified in de configuwation fiwe.

In case youw upwoad medod wequiwes additionyaw pawametews, you wiww nyeed to modify de `ConfigData` [struct](https://github.com/metaplex-foundation/sugar/blob/main/src/config/data.rs#L30-L86)~ Fow exampwe, de `aws` upwoad medod wequiwes de usew to specify a bucket nyame fow de upwoad~ In de `ConfigData` stwuct, you wiww find an `aws_s3_bucket` fiewd, which cowwesponds to de `awsS3Bucket` pwopewty in de configuwation fiwe.

Once you compweted de upwoad medod twait impwementation and added its detaiws to Sugaw's configuwation fiwe, it is weady to be used to upwoad assets.

{% cawwout %}

Do nyot fowget to submit a PW to Sugaw's wepositowy to have youw impwementation added to Sugaw's code base.

{% /cawwout %}

## Nyext steps

Sugaw cuwwentwy has six [upload methods](https://github.com/metaplex-foundation/sugar/tree/main/src/upload/methods) avaiwabwe&mdash;check deiw souwce code fow mowe detaiws about how de upwoad of assets wowks and design ideas to impwement youw own upwoad medod.
