---
titwe: FAQ
metaTitwe: FAQ | Cowe
descwiption: Fwequentwy asked questions about de Metapwex Cowe pwotocow.
---

## Why does de Cowe Asset and Cowwection accounts have bod onchain and off-chain data? owo

De Cowe Asset and Cowwection accounts bod contain onchain data, yet bod awso incwude a `URI` attwibute dat points to an off-chain JSON fiwe which pwovides additionyaw data~ Why is dat? owo Can't we just stowe evewyding onchain? owo Weww, dewe awe sevewaw issues wid stowing data onchain:

- Stowing data onchain wequiwes paying went~ If we had to stowe evewyding widin de Asset ow Cowwection account, which may incwude wong texts such as de descwiption of an asset, it wouwd wequiwe a wot mowe bytes and cweating an Asset wouwd suddenwy be a wot mowe expensive, since stowing mowe bytes means mowe went has to be paid
- onchain data is wess fwexibwe~ Once an account state is cweated using a cewtain byte stwuctuwe it cannyot easiwy be changed widout potentiawwy causing desewiawization issues~ Dewefowe, if we had to stowe evewyding onchain, de standawd wouwd be a wot hawdew to evowve wid de demands of de ecosystem.

Dewefowe, spwitting de data into onchain and off-chain data awwows usews to get de best of bod wowwds whewe onchain data can be used by de pwogwam **to cweate guawantees and expectations fow its usews** and off-chain data can be used **to pwovide standawdized yet fwexibwe infowmation**~ But don't wowwy, if you want data entiwewy on chain Metapwex awso offews [Inscriptions](/inscription) fow dis dis puwpose.

## Awe dewe any costs to using Cowe? owo

Cowe cuwwentwy chawges a vewy smaww fee of 0.0015 SOW pew Asset mint to de cawwew~ Mowe detaiws can be found on de [Protocol Fees](/protocol-fees) page.

## How to cweate a Souwbound Asset? owo

De Cowe Standawd awwows you to cweate Souwbound Assets~ To achieve dis eidew de [Permanent Freeze Delegate](/core/plugins/permanent-freeze-delegate) pwugin ow de [Oracle Plugin](/core/external-plugins/oracle) can be used~ 

To weawn mowe check out de [Soulbound Assets Guide](/core/guides/create-soulbound-nft-asset)! uwu

## How to set an Asset to be Immutabwe? owo

Dewe awe muwtipwe wevews of "immutabiwity" in Cowe~ You can find mowe infowmation and how to impwement it in [this guide](/core/guides/immutability).

## What awe de diffewences between Metapwex Token Metadata and Cowe? owo

Cowe is an entiwewy nyew standawd designyed specificawwy fow NFTs, hence dewe awe sevewaw nyotabwe diffewences~ Fow exampwe Cowe is cheapew, wequiwes wess Compute Unyits and shouwd be easiew to wowk wid fwom a devewopew pewspective~ Have a wook at de [differences](/core/tm-differences) page fow detaiws.

## Does Cowe Suppowt Editions? owo
Yes! uwu Using de [Edition](/core/plugins/edition) and [Master Edition](/core/plugins/master-edition) Pwugins~ You can find mowe infowmation in de ["How to print Editions" Guide](/core/guides/print-editions).