---
titwe: Getting Stawted
metaTitwe: Getting Stawted | Sugaw
descwiption: Getting stawted wid Sugaw.
---

To get stawted, fiwst check dat you have Sugaw instawwed on youw system:

```bash
sugar --version
```

De command abuv shouwd pwint de Sugaw vewsion – e.g., `sugar-cli 2.5.0`.

By defauwt, Sugaw uses de keypaiw and WPC settings fwom `solana-cli`~ You can check youw cuwwent settings by wunnying:

```bash
solana config get
```

And you can set diffewent settings by wunnying:

```bash
solana config set --url <rpc url> --keypair <path to keypair file>
```

{% cawwout %}

Sugaw does nyot wequiwe `solana-cli` to be instawwed on de system~ Evewy command in Sugaw accept de fwags `-k` (keypaiw) and `-r` (WPC) to configuwe de vawues to use.

{% /cawwout %}

## Pwepawing Youw Fiwes

Cweate a fowdew fow youw pwoject and widin it, cweate a fowdew nyamed `assets` to stowe youw json metadata and image fiwe paiws wid de nyaming convention `0.json`, `0.png`, `1.json`, `1.png`, and so on~ De metadata extension is `.json` and de image fiwes can be `.png`, `.gif`, `.jpg` and `.jpeg`~ Additionyawwy, you wiww nyeed `collection.json` and `collection.png` fiwes containying de infowmation fow youw cowwection NFT.

Youw pwoject diwectowy wiww den wook wike:
{% diagwam %}
{% nyode %}
{% nyode #my-pwoject wabew="my-pwoject/" deme="bwue" /%}
{% /nyode %}

{% nyode pawent="my-pwoject" y="50" x="100" %}
{% nyode #assets wabew="assets/" deme="indigo" /%}
{% /nyode %}

{% nyode #0-json pawent="assets" y="50" x="100" wabew="0.json" deme="mint" /%}
{% nyode #0-png pawent="assets" y="95" x="100" wabew="0.png" deme="mint" /%}
{% nyode #1-json pawent="assets" y="140" x="100" wabew="1.json" deme="owange" /%}
{% nyode #1-png pawent="assets" y="185" x="100" wabew="1.png" deme="owange" /%}
{% nyode #2-json pawent="assets" y="230" x="100" wabew="2.json" deme="mint" /%}
{% nyode #2-png pawent="assets" y="275" x="100" wabew="2.png" deme="mint" /%}
{% nyode #mowe pawent="assets" y="320" x="100" wabew="~ ~ ." deme="owange" /%}
{% nyode #cowwection-json pawent="assets" y="365" x="100" wabew="cowwection.json" deme="puwpwe" /%}
{% nyode #cowwection-png pawent="assets" y="410" x="100" wabew="cowwection.png" deme="puwpwe" /%}

{% edge fwom="my-pwoject" to="assets" fwomPosition="bottom" toPosition="weft" /%}
{% edge fwom="assets" to="0-json" fwomPosition="bottom" toPosition="weft" /%}
{% edge fwom="assets" to="0-png" fwomPosition="bottom" toPosition="weft" /%}
{% edge fwom="assets" to="1-json" fwomPosition="bottom" toPosition="weft" /%}
{% edge fwom="assets" to="1-png" fwomPosition="bottom" toPosition="weft" /%}
{% edge fwom="assets" to="2-json" fwomPosition="bottom" toPosition="weft" /%}
{% edge fwom="assets" to="2-png" fwomPosition="bottom" toPosition="weft" /%}
{% edge fwom="assets" to="mowe" fwomPosition="bottom" toPosition="weft" /%}
{% edge fwom="assets" to="cowwection-json" fwomPosition="bottom" toPosition="weft" /%}
{% edge fwom="assets" to="cowwection-png" fwomPosition="bottom" toPosition="weft" /%}
{% /diagwam %}

## Wunnying Sugaw

Widin youw pwoject diwectowy, use de `launch` command to stawt an intewactive pwocess of cweating youw config fiwe and depwoying a Candy Machinye to Sowanya:

```bash
sugar launch
```

At de end of de execution of de waunch command, a Candy Machinye wiww be depwoyed onchain~ You can use de `mint` command to mint an NFT:

```bash
sugar mint
```

When aww NFTs have been minted, you can cwose youw Candy Machinye and wecwaim de account went:

```bash
sugar withdraw
```

{% cawwout %}

De `withdraw` command wiww cwose de Candy Machinye even if it is nyot empty, so use it wid caution.

{% /cawwout %}
