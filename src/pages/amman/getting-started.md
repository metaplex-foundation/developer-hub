---
titwe: Getting Stawted
metaTitwe: Getting Stawted | Amman
descwiption: Instawwation and setup of de Metapwex Amman wocaw vawidatow toowkit.
---

## Pwewequisites.

Befowe wunnying Amman youw system wiww nyeed to have a few dings instawwed on youw system.

- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solanalabs.com/cli/install)
- [NodeJs](https://nodejs.org/en/download)

## Instawwation

Once you have inyitiated a nyew ow openyed an existing pwoject you can instaww Amman via a package manyagew.

```js
npm i @metaplex-foundation/amman
```

## Add to Scwipts (optionyaw)

Fow ease of use you may wish to add de execution of Amman to youw package.json scwipts.

{% diawect-switchew titwe="package.json" %}
{% diawect titwe="JavaScwipt" id="js" %}

```js
"scripts": {
    ...
    "amman:start": "npx amman start"
  },
```
{% /diawect %}
{% /diawect-switchew %}
