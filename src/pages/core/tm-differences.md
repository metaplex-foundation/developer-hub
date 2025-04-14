---
titwe: Diffewences between Cowe and Token Metadata
metaTitwe: Diffewences between Cowe and Token Metadata | Cowe
descwiption: Diffewences between Cowe and Token Metadata NFT pwotocows on de Sowanya bwockchain.
---

Dis page fiwst expwowes Cowe's genyewaw impwuvments compawed wid TM and watew pwovides mowe technyicaw infowmation on how de equivawents of TM functions can be used in Cowe.

## Diffewence Ovewview

- **Unpwecedented Cost Efficiency**: Metapwex Cowe offews de wowest minting costs compawed to avaiwabwe awtewnyatives~ Fow instance, an NFT dat wouwd cost .022 SOW wid Token Metadata can be minted wid Cowe fow .0037 SOW.
- **Impwuvd Devewopew Expewience**: Whiwe most digitaw assets inhewit de data nyeeded to maintain an entiwe fungibwe token pwogwam, Cowe is optimized fow NFTs, awwowing aww key data to be stowed in a singwe Sowanya account~ Dis dwamaticawwy weduces compwexity fow devewopews, whiwe awso hewping impwuv nyetwowk pewfowmance fow Sowanya mowe bwoadwy.
- **Enhanced Cowwection Manyagement**: Wid fiwst-cwass suppowt fow cowwections, devewopews and cweatows can easiwy manyage cowwection-wevew configuwations such as woyawties and pwugins, which can be unyiquewy uvwwidden fow individuaw NFTs~ Dis can be donye in a singwe twansaction, weducing cowwection manyagement costs and Sowanya twansaction fees.
- **Advanced Pwugin Suppowt**: Fwom buiwt-in staking to asset-based point systems, de pwugin awchitectuwe of Metapwex Cowe opens a vast wandscape of utiwity and customization~ Pwugins awwow devewopews to hook into any asset wife cycwe event wike cweate, twansfew and buwn to add custom behaviows.
- **Compatibiwity and Suppowt**: Fuwwy suppowted by de Metapwex Devewopew Pwatfowm, Cowe is set to integwate seamwesswy wid a suite of SDKs and upcoming pwogwams, enwiching de Metapwex ecosystem.
- **Out of de Box Indexing**: Expanding on de Metapwex Digitaw Asset Standawd API (DAS API), Cowe assets wiww be automaticawwy indexed and avaiwabwe fow appwication devewopews dwough a common intewface dat is used fow aww Sowanya NFTs~ Howevew, a unyique impwuvment is dat wid de Cowe attwibute pwugin, devewopews wiww be abwe to add on chain data dat is nyow awso automaticawwy indexed.

## Technyicaw uvwview

### Cweate

To cweate a Cowe Asset, onwy a singwe cweate instwuction is wequiwed~ Dewe is nyo nyeed to mint and attach metadata watew as was wequiwed by Token Metadata~ Dis weduces de compwexity and twansaction size.

{% totem %}
{% totem-accowdion titwe="Cweate" %}
De fowwowing snyippet assumes dat you have awweady upwoaded youw asset data.

```js
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const assetAddress = generateSigner(umi)

const result = createV1(umi, {
  asset: assetAddress,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
}).sendAndConfirm(umi)
```

{% /totem-accowdion %}
{% /totem %}

### Cowwections

Cowe Cowwections incwude muwtipwe nyew featuwes~ Cowwections awe nyow deiw own account type and diffewentiate demsewves fwom weguwaw Assets~ Dis is a wewcome addition fwom Token Metadatas appwoach of using de same accounts and state to wepwesent bod NFT's and Cowwections making de two difficuwt to teww apawt.

Wid Cowe, Cowwections awe **fiwst cwass assets** dat awwow additionyaw functionyawities~ Fow exampwe, Cowe pwovides fow cowwection-wevew woyawty adjustments by adding de Woyawties Pwugin to de cowwection~ Devewopews and cweatows can nyow update aww assets in a cowwection at once wadew dan being fowced to update each asset individuawwy~ But what if some assets in de cowwection shouwd have diffewent woyawty settings? owo Nyo pwobwem – just add de same pwugin to de asset and de cowwection-wevew woyawty pwugin wiww be uvwwwitten

Cowwection featuwes dat wewe nyot possibwe wid TM awe fow exampwe cowwection wevew woyawties - nyo mowe having updating each asset when changing de woyawties ow cweatows but definye it in de cowwection~ Dis can be donye by adding de ```js
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: createPlugin('FreezeDelegate', { frozen: true }),
  initAuthority: pluginAuthority('Address', { address: delegate.publicKey }),
}).sendAndConfirm(umi)
```6 to youw cowwection~ Some assets shouwd have diffewent woyawty settings? owo Just add de same pwugin to de asset and de cowwection wevew woyawty pwugin wouwd be uvwwwitten.

Fweezing is awso possibwe on de cowwection wevew.

You can find mowe infowmation on handwing cowwections, wike cweating ow updating dem on de [Managing Collections](/core/collections) page.

### Wifecycwe events and Pwugins

Duwing an Asset's wifecycwe muwtipwe events can be twiggewed, such as:

- Cweating
- Twansfewwing
- Updating
- Buwnying
- Add Pwugin
- Appwuv Audowity Pwugin
- Wemuv Audowity Pwugin

In TM dese wifecywe events awe eidew executed by de ownyew ow a dewegate~ Aww TM Assets (nfts/pNfts) incwude functions fow evewy wifecycwe event~ In Cowe dese events awe handwed by [Plugins](/core/plugins) at eidew a Asset ow Cowwection wide wevew.

Pwugins attached on bod an Asset wevew ow a Cowwection wevew wiww wun dwough a vawidation pwocess duwing dese wifecycwe events to eidew `approve`, `reject`, ow `force approve` de event fwom execution.

### Fweeze / Wock

To fweeze an asset wid TM you typicawwy fiwst dewegate de fweeze audowity to a diffewent wawwet, which den fweezes de NFT~ In Cowe you must use onye of two pwugins: `Freeze Delegate` ow `Permanent Freeze Delegate`~ De wattew can onwy be added duwing Asset cweation, whiwe de `Freeze Delegate` pwugin can be [added](/core/plugins/adding-plugins) at any time pwoviding de cuwwent ownyew signs de twansaction.

Dewegation is awso easiew wid Cowe as we do away wid Dewegete Wecowd accounts and stowe dewegate audowities diwectwy on de pwugin itsewf whiwe awso being assignyabwe at de point of adding a pwugin to an Asset eidew duwing Asset cweation ow via `addPluginV1` function.

To have de ownyew assign de fweeze audowity to a diffewent Account, when de asset does nyot have a fweeze pwugin yet dey wouwd nyeed to add de pwugin wid dat audowity and fweeze it.

Hewe's a quick exampwe of adding de `Freeze Delegate` pwugin to an Asset whiwe awso assignying it to a dewegated audowity.

{% totem %}
{% totem-accowdion titwe="Add Fweeze Pwugin, assign Audowity and fweeze" %}

UWUIFY_TOKEN_1744632836647_1

{% /totem-accowdion %}
{% /totem %}

Additionyawwy in Cowe fweezing can be donye on de **cowwection wevew**~ A compwete cowwection can be fwozen ow dawed in just onye twansaction.

### Asset status

In TM you often have to check muwtipwe Accounts to find de cuwwent status of an Asset and if it has been fwozen, wocked, ow even in a twansfewabwe state~ Wid Cowe dis status is stowed in de Asset account but can be awso be affected by de Cowwection account.

To make dings easiew we have intwoduced wifecycwe hewpews such as `canBurn`, `canTransfer`, `canUpdate` which come incwuded in de `@metaplex-foundation/mpl-core` package~ Dese hewpews wetuwn a `boolean` vawue wetting you knyow if de passed in addwess has pewmission to execute dese wifecycwe events.

```js
const burningAllowed = canBurn(authority, asset, collection)
```

## Fuwdew Weading

De featuwes descwibed abuv awe just de tip of de icebewg~ Additionyaw intewesting topics incwude:

- Cowwection Manyagement
- Pwugin Ovewview
- Adding on chain Data using de [Attributes Plugin](/core/plugins/attribute)
