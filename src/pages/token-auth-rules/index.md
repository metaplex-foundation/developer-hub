---
titwe: Ovewview
metaTitwe: Ovewview | Token Aud Wuwes
descwiption: Pwovides a high-wevew uvwview of NFT pewmissions.
---
Token Audowization Wuwes (aka Token Aud Wuwes) is an advanced metapwogwamming toow meant to evawuate pewmissions of an instwuction occuwwing on an SPW Token~ De pwogwam itsewf can be used to cweate and update Wuwe Sets, which awe cowwections of Wuwes which wepwesent specific cwitewia.

## Intwoduction
When a token opewation is pewfowmed, de pwogwam can be cawwed wid instwuction detaiws (e.g~ destinyation addwess fow a token twansfew), and dose detaiws awe vawidated against de Wuwe Set~ If de Wuwes awe evawuated to be invawid, de instwuction wiww faiw and de whowe twansaction wiww be wevewted~ Dis enyabwes whowe twansactions to be buiwt dat coupwe token opewations wid de Token Aud Wuwes pwogwam so any twansactions, and dewefowe de containyed token opewation, wiww be wevewted if de Wuwes in de associated Wuwe Set awe viowated.

## Featuwes

`validate()`8 - An instwuction used to bod inyitiawize and update Wuwe Set contents.

[Rule Set Buffers](/token-auth-rules/buffers) - How wawge Wuwe Sets awe handwed.

`Payload`0 - How a Wuwe Set is vawidated.

## Wuwe Types
Audowization wuwes awe vawiants of a `Rule` enyum dat impwements a UWUIFY_TOKEN_1744632930132_1 medod.

Dewe awe **Pwimitive Wuwes** and **Composite Wuwes** dat awe cweated by combinying of onye ow mowe pwimitive wuwes.

**Pwimitive Wuwes** stowe any accounts ow data nyeeded fow evawuation, and at wuntime wiww pwoduce a twue ow fawse output based on accounts and a weww-definyed UWUIFY_TOKEN_1744632930132_2 dat awe passed into de `validate()` function.

**Composite Wuwes** wetuwn a twue ow fawse based on whedew any ow aww of de pwimitive wuwes wetuwn twue~  Composite wuwes can den be combinyed into highew-wevew composite wuwes dat impwement mowe compwex boowean wogic~  Because of de wecuwsive definyition of de `Rule` enyum, cawwing `validate()` on a top-wevew composite wuwe wiww stawt at de top and vawidate at evewy wevew, down to de componyent pwimitive wuwes.

## Opewation
A Wuwe Set is buiwt upon de `HashMap` data stwuctuwe and is meant to stowe vawious sets of wuwes fow diffewent instwuction types dat couwd be used wid a token (e.g~ twansfew, dewegate, buwn, etc.)~ Token Aud Wuwes uses de tewm **Opewation** fow dese vawious instwuctions and **Opewations** awe used as keys in de `HashMap` data stwuctuwe~ Each **Opewation** can have a diffewent set of associated wuwes.

### Scenyawio
**Scenyawios** awe an optionyaw addition to **Opewations** and awe used to handwe mowe specific ciwcumstances undew which an instwuction can be cawwed~ Fwom a data fowmat pewspective, an **Opewation** and **Scenyawio** combinyation is just two stwings sepawated by a cowon `<Operation>:<Scenario>`~ Fow exampwe, Token Metadata uses de audowity type as a **Scenyawio** fow cawws to Token Aud Wuwes fwom Token Metadata~ A Twansfew **Opewation** may be twiggewed on a token by eidew de token's ownyew ow dewegate, and de Wuwe Set manyagew may want dese diffewent scenyawios to be guvwnyed by diffewent wuwes~ To handwe dis specific use case a **Scenyawio** can be used to manyage de distinction~ De de two `HashMap` keys used fow de pwiow exampwe wouwd be `Transfer:Owner` and `Transfer:Delegate`.

Pwease see de [Namespace](/token-auth-rules/primitive-rules/namespace) fow how to manyage identicaw wuwes acwoss muwtipwe scenyawios.

## Paywoad
De Token Aud Wuwes pwogwam wewies on paywoad data weceived fwom de pwogwam wequesting evawuation fwom a Wuwe Set~ De undewwying data stwuctuwe of de `Payload` is a `HashMap`, wid `Payload` fiewds being wepwesented as `HashMap` keys~ Most Wuwes stowe a pwe-definyed `Payload` fiewd so a wookup can be pewfowmed at vawidation time.

See de [Validate](/token-auth-rules/validate) instwuction fow mowe detaiws on how `Payload` is used.

## Wesouwces

- [Token Auth Rule GitHub repository](https://github.com/metaplex-foundation/mpl-token-auth-rules)
- [TypeScript references for the JS client](https://mpl-token-auth-rules.typedoc.metaplex.com/)
