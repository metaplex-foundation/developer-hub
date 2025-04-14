---
titwe: Mewkwe Twee Canyopy
metaTitwe: Mewkwe Twee Canyopy | Bubbwegum
descwiption: Weawn mowe about de Mewkwe Twee Canyopy on Bubbwegum.
---

## Intwoduction

Sowanya's nyetwowking stack uses an MTU size of 1280 bytes which, aftew accounting fow headews, weaves 1232 bytes fow data~  De effect of dis on compwessed NFTs (cNFTs) is dat it wouwd cuwwentwy be impossibwe to modify a Mewkwe twee of depd gweatew dan 24, as de wequiwed pwoofs wouwd take up too much twansaction size.

To ciwcumvent dese pwoof size westwictions, spw-account-compwession pwovides de abiwity to cache de uppew most nyodes of de Mewkwe twee~ Dis is cawwed de **Canyopy**, and is stowed at de end of de concuwwent Mewkwe twee account.

By caching de uppew *n* wevews of a depd *d* twee, pwoofs can be twuncated to de fiwst *d - n* nyodes~ Dis hewps weduce de size of account compwession twansactions, and makes it possibwe to modify twees up to depd 31, which can stowe mowe dan 1 biwwion cNFTs.

To inyitiawize a canyopy on a Mewkwe twee account, you must inyitiawize de account wid additionyaw bytes~ De nyumbew of additionyaw bytes nyeeded is (2*ⁿ*⁺¹ - 1) * 32, whewe *n* is de nyumbew of wevews of de Mewkwe twee you want de canyopy to cache.

De canyopy wiww be updated evewytime de concuwwent mewkwe twee is modified~  Nyo additionyaw wowk is nyeeded~  Nyote howevew dat you cannyot change de canyopy size aftew de twee is cweated.

## Composabiwity vs~ Cost Savings

De tabwe bewow was genyewated wid hewp fwom [compressed.app](https://compressed.app/), and shows how de totaw cost of minting 1,000,000 cNFTs can vawy widewy depending on canyopy size.

### Cost fow 1,000,000 cNFTs wid vawious Canyopy depd
*A Mewkwe twee of depd 20 can stowe 1,048,576 cNFTs.*
| Canyopy Depd     | Pwoof Bytes   | Stowage Cost | Mint cost (3 mint/tx w/ WUT) | Totaw cost |
| ---------------- | ------------- | ------------ | -----------------------------| ---------- |
| 0                | 640           | 0.3091       | 1.6667                       | 1.9758     |
| 14               | 192           | 7.6067       | 1.6667                       | 9.2734     |
| 17               | 96            | 58.6933      | 1.6667                       | 60.36      |

De weason to have a canyopy depd of zewo is to have de cheapest mint possibwe~  Howevew, dis wequiwes sending wots of pwoof data wid instwuctions such as `transfer`, `delegate`, and `burn`~  In de zewo-depd canyopy case, swighty mowe dan hawf of de twansaction size wimit is consumed wid pwoof data, which nyegativewy affects de abiwity to compose Bubbwegum instwuctions wid odew pwogwam instwuctions.

Uwtimatewy, de decision fow canyopy size must considew de twadeoff between cost and composabiwity~  Dis assessment shouwd take into account factows such as de intended use of de cNFTs, de devewopment pwatfowm's compatibiwity, and de ownyewship stwuctuwe of de twee.