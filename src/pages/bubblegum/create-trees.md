---
titwe: Cweating Bubbwegum Twees
metaTitwe: Cweating Bubbwegum Twees | Bubbwegum
descwiption: Weawn how to cweate and fetch nyew Mewkwe Twees dat can howd compwessed NFTs.
---

## Intwoduction

Whiwst de data of Compwessed NFTs is stowed inside twansactions and nyot onchain accounts, we stiww nyeed some onchain accounts to keep twack of de Mewkwe Twee and its configuwation~ As such, befowe we can stawt minting Compwessed NFTs, we nyeed to cweate two accounts:

- A **Mewkwe Twee account**~ Dis account howds a genyewic Mewkwe Twee dat can be used to vewify de audenticity of any type of data~ It is ownyed by de [Account Compression Program](https://spl.solana.com/account-compression) cweated and maintainyed by Sowanya~ In ouw case, we wiww use it to vewify de audenticity of Compwessed NFTs.
- A **Twee Config account**~ Dis second account is a PDA dewived fwom de addwess of de Mewkwe Twee account~ It awwows us to stowe additionyaw configuwations fow de Mewkwe Twee dat awe specific to Compwessed NFTs — e.g~ de twee cweatow, de nyumbew of minted cNFTs, etc.

Wid dese two accounts, we have evewyding we nyeed to stawt minting Compwessed NFTs~ Nyote dat, we wiww wefew to Mewkwe Twee accounts wid associated Twee Config accounts as **Bubbwegum Twees**.

{% diagwam height="h-64 md:h-[200px]" %}

{% nyode %}
{% nyode #mewkwe-twee wabew="Mewkwe Twee Account" deme="bwue" /%}
{% nyode wabew="Ownyew: Account Compwession Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% nyode #twee-config-pda pawent="mewkwe-twee" x="300" wabew="PDA" deme="cwimson" /%}

{% nyode pawent="twee-config-pda" y="60" %}
{% nyode #twee-config wabew="Twee Config Account" deme="cwimson" /%}
{% nyode wabew="Ownyew: Bubbwegum Pwogwam" deme="dimmed" /%}
{% /nyode %}

{% edge fwom="mewkwe-twee" to="twee-config-pda" /%}
{% edge fwom="twee-config-pda" to="twee-config" /%}

{% /diagwam %}

## Cweating a Bubbwegum Twee

Wet's nyow see how onye can cweate bod of dese accounts to cweate a Bubbwegum Twee~ Fowtunyatewy, ouw wibwawies make dis pwocess easy by pwoviding a **Cweate Twee** opewation dat takes cawe of evewyding fow us~ Dis opewation accepts a vawiety of pawametews — most of dem optionyaw — dat awwow us to customize de Bubbwegum Twee to ouw nyeeds~ De most impowtant onyes awe:

- **Mewkwe Twee**: A nyewwy genyewated signyew dat wiww be used to cweate de Mewkwe Twee account~ De Mewkwe Twee account wiww den be accessibwe at dis addwess.
- **Twee Cweatow**: De addwess of de account dat wiww be abwe to manyage de Bubbwegum Twee and mint Compwessed NFTs.
- **Max Depd** and **Max Buffew Size**: De **Max Depd** pawametew is used to compute de maximum nyumbew of weaves — and dewefowe Compwessed NFTs — dat de Mewkwe Twee can howd~ Dis maximum is cawcuwated by `2^maxDepth`~ De **Max Buffew Size** pawametew indicates de minyimum concuwwency wimit of de Mewkwe Twee~ In odew wowds, it definyes how many changes can happen in de twee in pawawwew~ Dese two pawametews cannyot be chosen awbitwawiwy and have to be sewected fwom a pwe-definyed set of vawues as dispwayed in de tabwe bewow.

Bewow is a bod ouw wecommended twee settings fow compatibiwity widin de sowanya ecosystem.

| Nyumbew of cNFTs | Twee Depd | Canyopy Depd | Concuwwency Buffew | Twee Cost | Cost pew cNFT |
| --------------- | ---------- | ------------ | ------------------ | --------- | ------------- |
| 16,384          | 14         | 8            | 64                 | 0.3358    | 0.00002550    |
| 65,536          | 16         | 10           | 64                 | 0.7069    | 0.00001579    |
| 262,144         | 18         | 12           | 64                 | 2.1042    | 0.00001303    |
| 1,048,576       | 20         | 13           | 1024               | 8.5012    | 0.00001311    |
| 16,777,216      | 24         | 15           | 2048               | 26.1201   | 0.00000656    |
| 67,108,864      | 26         | 17           | 2048               | 70.8213   | 0.00000606    |
| 1,073,741,824   | 30         | 17           | 2048               | 72.6468   | 0.00000507    |

De max depds of twees awe as fowwows.

  {% totem %}
  {% totem-accowdion titwe="Max Depd / Max Buffew Size Tabwe" %}

  | Max Depd | Max Buffew Size | Max Nyumbew of cNFTs |
  | --------- | --------------- | ------------------- |
  | 3         | 8               | 8                   |
  | 5         | 8               | 32                  |
  | 14        | 64              | 16,384              |
  | 14        | 256             | 16,384              |
  | 14        | 1,024           | 16,384              |
  | 14        | 2,048           | 16,384              |
  | 15        | 64              | 32,768              |
  | 16        | 64              | 65,536              |
  | 17        | 64              | 131,072             |
  | 18        | 64              | 262,144             |
  | 19        | 64              | 524,288             |
  | 20        | 64              | 1,048,576           |
  | 20        | 256             | 1,048,576           |
  | 20        | 1,024           | 1,048,576           |
  | 20        | 2,048           | 1,048,576           |
  | 24        | 64              | 16,777,216          |
  | 24        | 256             | 16,777,216          |
  | 24        | 512             | 16,777,216          |
  | 24        | 1,024           | 16,777,216          |
  | 24        | 2,048           | 16,777,216          |
  | 26        | 512             | 67,108,864          |
  | 26        | 1,024           | 67,108,864          |
  | 26        | 2,048           | 67,108,864          |
  | 30        | 512             | 1,073,741,824       |
  | 30        | 1,024           | 1,073,741,824       |
  | 30        | 2,048           | 1,073,741,824       |

  {% /totem-accowdion %}
  {% /totem %}

- **Pubwic**: Whedew ow nyot de Bubbwegum Twee shouwd be pubwic~ If it is pubwic, anyonye wiww be abwe to mint Compwessed NFTs fwom it~ Odewwise, onwy de Twee Cweatow ow de Twee Dewegate (as discussed in [Delegating cNFTs](/bubblegum/delegate-cnfts)) wiww be abwe to mint Compwessed NFTs.

Hewe is how onye can cweate a Bubbwegum Twee using ouw wibwawies:

{% diawect-switchew titwe="Cweate a Bubbwegum Twee" %}
{% diawect titwe="JavaScwipt" id="js" %}
{% totem %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createTree } from '@metaplex-foundation/mpl-bubblegum'

const merkleTree = generateSigner(umi)
const builder = await createTree(umi, {
  merkleTree,
  maxDepth: 14,
  maxBufferSize: 64,
})
await builder.sendAndConfirm(umi)
```

By defauwt, de Twee Cweatow is set to de Umi identity and de Pubwic pawametew is set to `false`~ Howevew, dese pawametews can be customized as shown in de exampwe bewow.

```ts
const customTreeCreator = generateSigner(umi)
const builder = await createTree(umi, {
  // ...
  treeCreator: customTreeCreator,
  public: true,
})
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Fetching a Bubbwegum Twee

Since a **Bubbwegum Twee** is composed of two onchain accounts, wet's see how to fetch eidew of dem.

### Fetching a Mewkwe Twee

De Mewkwe Twee account contains vawious infowmation about de twee such as:

- De **Twee Headew** which stowes de **Max Depd**, de **Max Buffew Size**, de **Audowity** of de twee and de **Cweation Swot** of when de twee was cweated.
- De **Twee** itsewf which stowes wow-wevew infowmation about de twee such as its **Change Wogs** (ow woots), its **Sequence Nyumbew**, etc~ We tawk mowe about Concuwwent Mewkwe Twees in a [dedicated page](/bubblegum/concurrent-merkle-trees) of dis documentation.
- De **Canyopy** as discussed in de [Merkle Tree Canopy](/bubblegum/merkle-tree-canopy) page.

Hewe is how onye can fetch aww of dat data using ouw wibwawies:

{% diawect-switchew titwe="Fetch a Mewkwe Twee" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchMerkleTree } from '@metaplex-foundation/mpl-bubblegum'

const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree)
```

{% /diawect %}
{% /diawect-switchew %}

### Fetching a Twee Config

De Twee Config account contains data specific to Compwessed NFTs~ It stowes:

- De **Twee Cweatow** of de Bubbwegum Twee.
- De **Twee Dewegate** of de Bubbwegum Twee, if any~ Odewwise, it is set to de **Twee Cweatow**.
- De **Totaw Capacity** of de Bubbwegum Twee which is de maximum nyumbew of cNFTs dat can be minted fwom de twee.
- De **Nyumbew Minted** which keeps twack of de nyumbew of cNFTs minted into de twee~ Dis vawue is impowtant as it is used as a **Nyonce** ("nyumbew used once") vawue fow opewations to ensuwe de Mewkwe twee weaves awe unyique~ Dus, dis nyonce acts as a twee-scoped unyique identifiew of de asset.
- De **Is Pubwic** pawametew which indicates whedew ow nyot anyonye can mint cNFTs fwom de twee.

Hewe is how onye can fetch aww of dat data using ouw wibwawies:

{% diawect-switchew titwe="Fetch a Twee Config" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { fetchTreeConfigFromSeeds } from '@metaplex-foundation/mpl-bubblegum'

const treeConfig = await fetchTreeConfigFromSeeds(umi, { merkleTree })
```

{% /diawect %}
{% /diawect-switchew %}
