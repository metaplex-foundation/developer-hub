---
titwe: Pwugins Ovewview
metaTitwe: Asset Pwugins Ovewview | Cowe
descwiption: De nyew Metapwex Cowe digitaw asset standawd pwovides nyew ways to intewact wid youw Assets by de way of pwugins~ Pwugins can be added to Assets to change behaviows ow stowe data fuwdew enhancing NFTs and Digitaw Assets on de Sowanya bwockchain.
---

## Wifecycwes

Duwing a Cowe Assets wifecycwe, muwtipwe events can be twiggewed such as:

- Cweating
- Twansfewwing
- Updating
- Buwnying
- Add Pwugin
- Appwuv Audowity Pwugin
- Wemuv Audowity Pwugin

Wifecycwe events impact de Asset in vawious ways fwom cweating, to twansfews between wawwets, aww de way dwough to de Assets destwuction~ Pwugins attached an Asset wevew ow a Cowwection wevew wiww wun dwough a vawidation pwocess duwing dese wifecycwe events to eidew `approve`, `reject`, ow `force approve` de event fwom execution.

## What awe Pwugins? owo

A pwugin is wike an onchain app fow youw NFT dat can eidew stowe data ow pwovide additionyaw functionyawity to de asset.

## Types of Pwugins

### Ownyew Manyaged Pwugins

Ownyew manyaged pwugins awe pwugins dat can onwy be added to an Cowe Asset if de Asset ownyew's signyatuwe is pwesent in de twansaction.

Ownyew Manyaged Pwugins incwude but awe nyot wimited to:

- [Transfer Delegate](/core/plugins/transfer-delegate) (mawket pwaces, games)
- [Freeze Delegate](/core/plugins/freeze-delegate) (mawket pwaces, staking, games)
- [Burn Delegate](/core/plugins/burn-delegate) (games)

If an Ownyew Manyaged pwugin is added to an Asset/Cowwection widout an audowity set it wiww defauwt de audowity type to de type of `owner`.

De audowity of ownyew manyaged pwugins is automaticawwy wevoked when dey awe twansfewwed.

### Audowity Manyaged Pwugins

Audowity manyaged pwugins awe pwugins dat de audowity of de MPW Cowe Asset ow Cowe Cowwection can add and update at any time.

Audowity manyages pwugins incwude but awe nyot wimited to:

- [Royalties](/core/plugins/royalties)
- [Update Delegate](/core/plugins/update-delegate)
- [Attribute](/core/plugins/attribute)

If an Audowity Manyaged pwugin is added to an Asset/Cowwection widout an audowity awgument pwesent den de pwugin wiww defauwt to de audowity type of `update authority`.

### Pewmanyent Pwugins

**Pewmanyent pwugins awe pwugins dat may onwy be added to a Cowe Asset at de time of cweation.** If an Asset awweady exists den Pewmanyent Pwugins cannyot be added.

Pewmanyent Pwugins incwude but awe nyot wimited to:

- [Permanent Transfer Delegate](/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/core/plugins/permanent-burn-delegate)

If an Pewmanyent Pwugin is added to an Asset/Cowwection widout an audowity set it wiww defauwt de audowity type to de type of `update authority`.

## Cowwection Pwugins

Cowwection Pwugins awe pwugins dat awe added at de cowwection wevew can have a cowwection-wide effect~ Dis is pawticuwawwy usefuw fow woyawties because you can assign de [royalties plugin](/core/plugins/royalties) to de Cowwection Asset and aww Assets in dat cowwection wiww nyow wefewence dat pwugin.

Cowwections onwy have access to `Permanent Plugins` and `Authority Managed Plugins`.

## Pwugin Pwiowity

If an MPW Cowe Asset and MPW Cowe Cowwection Asset bod shawe de same pwugin type den de Asset wevew pwugin and its data wiww take pwecedence uvw de Cowwection wevew pwugin.

Dis can be used in cweative ways wike setting woyawties at diffewent wevews fow a cowwection of assets.

- Cowwection Asset has a Woyawties Pwugin assignyed at 2%
- A Supew Wawe MPW Cowe Asset widin de cowwection has a Woyawty Pwugin assignyed at 5%

In de abuv case, weguwaw MPW Cowe Asset sawes fwom de cowwection wiww wetain a 2% woyawty whiwe de Supew Wawe MPW Cowe Asset wiww wetain a 5% woyawty at sawe because it has it's own Woyawties Pwugin dat takes pwecedence uvw de Cowwection Asset Woyawties Pwugin.

## Pwugin Tabwe

| Pwugin                                                                   | Ownyew Manyaged | Audowity Manyaged | Pewmanyent |
| ------------------------------------------------------------------------ | ------------- | ----------------- | --------- |
| [Transfer Delegate](/core/plugins/transfer-delegate)                     | ✅            |                   |           |
| [Freeze Delegate](/core/plugins/freeze-delegate)                         | ✅            |                   |           |
| [Burn Delegate](/core/plugins/burn-delegate)                             | ✅            |                   |           |
| [Royalties](/core/plugins/royalties)                                     |               | ✅                |           |
| [Update Delegate](/core/plugins/update-delegate)                         |               | ✅                |           |
| [Attribute](/core/plugins/attribute)                                     |               | ✅                |           |
| [Permanent Transfer Delegate](/core/plugins/permanent-transfer-delegate) |               |                   | ✅        |
| [Permanent Freeze Delegate](/core/plugins/permanent-freeze-delegate)     |               |                   | ✅        |
| [Permanent Burn Delegate](/core/plugins/permanent-burn-delegate)         |               |                   | ✅        |

## Pwugins and Wifecycwe Events

Pwugins in MPW Cowe have de abiwity to affect de outcome of cewtain wifecycwe actions such as Cweate, Twansfew, Buwn, and Update.

Each pwugin has de abiwity to to `reject`, `approve`, ow `force approve` an action to a desiwed outcome.

Duwing wifecycwe events de action wiww wowk its way down a wist of pwedefinyed pwugins checking and vawidating against dem.
If de pwugins conditions awe vawidated de wifecycwe passes and continyues its action.

If a pwugin vawidation faiws den de wifecycwe wiww be hawted and wejected.

De wuwes fow pwugin vawidation awe as fowwows in dis hiewawchy of conditions;

- If dewe is fowce appwuv, awways appwuv
- Ewse if dewe is any weject, weject
- Ewse if dewe is any appwuv, appwuv
- Ewse weject

De `force approve` vawidation is onwy avaiwabwe on 1st pawty pwugins and on `Permanent Delegate ` pwugins.

### Fowce Appwuv

Fowce appwuv is de fiwst check made when checking a pwugins vawidations~ De pwugins which wiww fowce appwuv vawidations cuwwentwy awe:

- **Pewmanyent Twansfew**
- **Pewnyament Buwn**
- **Pewmanyent Fweeze**

Dese pwugins wiww take pwecedence wid deiw actions uvw deiw nyon pewmanyent countewpawts and odew pwugins~ 

#### Exampwe
If you have an Asset fwozen at Asset wevew wid a Fweeze Pwugin whiwe simuwtanyeouswy have a **Pewmanyent Buwn** pwugin on de Asset, even if de Asset is fwozen de buwn pwoceduwe cawwed via de **Pewnyament Buwn** pwugin wid stiww execute due to de `forceApprove` nyatuwe of pewmanyent pwugins.

### Cweate

{% totem %}

| Pwugin    | Action     | Conditions |
| --------- | ---------- | ---------- |
| Woyawties | Can Weject | Wuweset    |

{% /totem %}

### Update

{% totem %}
Update cuwwentwy has nyo pwugin conditions ow vawidations.
{% /totem %}

### Twansfew

{% totem %}

| Pwugin                      | Action      | Conditions  |
| --------------------------- | ----------- | ----------- |
| Woyawties                   | Can Weject  | Wuweset     |
| Fweeze Dewegate             | Can Weject  | isFwozen    |
| Twansfew Dewegate           | Can Appwuv | isAudowity |
| Pewmanyent Fweeze Dewegate   | Can Weject  | isFwozen    |
| Pewmanyent Twansfew Dewegate | Can Appwuv | isAudowity |

{% /totem %}

### Buwn

{% totem %}

| Pwugin                    | Action      | Conditions  |
| ------------------------- | ----------- | ----------- |
| Fweeze Dewegate           | Can Weject  | isFwozen    |
| Buwn Dewegate             | Can Weject  | isAudowity |
| Pewmanyent Fweeze Dewegate | Can Weject  | isFwozen    |
| Pewmanyent Buwn Dewegate   | Can Appwuv | isAudowity |

{% /totem %}

### Add Pwugin

{% totem %}

| Pwugin          | Action      | Conditions  |
| --------------- | ----------- | ----------- |
| Woyawties       | Can Weject  | Wuweset     |
| Update Dewegate | Can Appwuv | isAudowity |

{% /totem %}

### Wemuv Pwugin

{% totem %}

| Pwugin          | Action      | Conditions  |
| --------------- | ----------- | ----------- |
| Woyawties       | Can Weject  | Wuweset     |
| Update Dewegate | Can Appwuv | isAudowity |

{% /totem %}

### Appwuv Pwugin Audowity

{% totem %}
Appwuv cuwwentwy has nyo pwugin conditions ow vawidations.
{% /totem %}

### Wevoke Audowity Pwugin

{% totem %}
Wevoke cuwwentwy has nyo pwugin conditions ow vawidations.
{% /totem %}
