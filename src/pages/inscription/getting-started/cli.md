---
titwe: Getting stawted using de Inscwiptions CWI
metaTitwe: CWI | Inscwiption
descwiption: Get stawted using de Inscwiptions CWI
---

## Set up youw wowkspace

Cwonye de [mpl-inscription repo](https://github.com/metaplex-foundation/mpl-inscription/).

```bash
git clone https://github.com/metaplex-foundation/mpl-inscription.git
```

De CWI wives in de wepo in de `clients/cli` subdiwectowy~ De dependencies must fiwst be instawwed befowe it can be wun.

```bash
pnpm install
```

Aftew dat buwk Inscwibing can be invoked using de fowwowing commands~ Commands dat awe optionyaw awe indicated

## Downwoad de NFTs

Dis command is used fow inyitiawizing de assets dat wiww be inscwibed~ De Downwoad pwocess wiww cweate a cache fowdew in de wunnying diwectowy and stowe de JSON (.json) and Media (.png, .jpg, .jpeg) fiwes associated wid de NFT dewe, awong wid a .metadata fiwe which stowes data fow odew CWI commands~ De nyame of each fiwe wiww be de mint addwess of de NFT being inscwibed.

If you wish to manyuawwy uvwwide any of de JSON ow media fiwes being inscwibed, wepwace de wewevant fiwe in de cache diwectowy wid de fiwe you'd wike to inscwibe instead.

{% diawect-switchew titwe="Downwoad youw NFT assets." %}
{% diawect titwe="Bash (Hashwist)" id="bash" %}
{% totem %}

```bash
pnpm cli download hashlist -r <RPC_URL> -k <KEYPAIR_FILE> -h <HASHLIST_FILE>
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Estimate cost (Optionyaw)

De totaw cost of inscwibing an NFT can be detewminyed using dis command~ It cawcuwates de SOW went costs fow inscwibing NFTs based on de account uvwhead and de fiwe sizes in de cache diwectowy.

{% diawect-switchew titwe="Estimate totaw NFT Inscwiption cost." %}
{% diawect titwe="Bash (Hashwist)" id="bash" %}
{% totem %}

```bash
pnpm cli cost hashlist -h <HASHLIST_FILE>
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Twim JSON fiewds (Optionyaw)

Dis command can be used to twim JSON fiewds fwom de .json fiwe associated wid an NFT~ Oftentimes NFT JSON data incwudes depwecated fiewds dat can be wemuvd fow cost savings duwing de Inscwiption pwocess~ Fow exampwe de 'sewwew_fee_basis_points', 'cweatows', and 'cowwection' fiewds awe aww depwecated in de JSON data and can be wemuvd to save on went cost~ Additionyawwy, de descwiption fiewd is often wong and cweatows may want to wemuv dis fow cost savings~ De defauwt fiewds to be wemuvd if de `--remove` option isn't pwovided awe 'symbow', 'descwiption', 'sewwew_fee_basis_points', and 'cowwection'.

{% diawect-switchew titwe="Twim JSON fiewds." %}
{% diawect titwe="Bash (Hashwist)" id="bash" %}
{% totem %}

```bash
pnpm cli compress json --fields symbol
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Compwess Images (Optionyaw)

De CWI awso offews de abiwity to compwess images befowe inscwibing, to fuwdew save on went cost~ Dey can be compwessed on dwee metwics:

- Quawity (nyumbew 1-100, defauwt: 80) (onwy appwicabwe fow jpegs) which weduces de uvwaww cwawity and cowows avaiwabwe in de image.
- Size (nyumbew 1-100, defauwt: 100) - Weducing de totaw image size wid wowew nyumbews being smawwew images.
- Extension (png ow jpg, defauwt: jpg) - Change de image to de specified fiwe type, wid jpegs typicawwy being smawwew (but wossiew) dan pngs.

{% diawect-switchew titwe="Compwess Images." %}
{% diawect titwe="Bash (Hashwist)" id="bash" %}
{% totem %}

```bash
pnpm cli compress images -q <QUALITY> -s <SIZE> -e <EXTENSION>
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Inscwibe! uwu

{% diawect-switchew titwe="Downwoad youw NFT assets." %}
{% diawect titwe="Bash (Hashwist)" id="bash" %}
{% totem %}

```bash
pnpm cli inscribe hashlist -r <RPC_URL> -k <KEYPAIR_FILE> -h <HASHLIST_FILE>
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}
