---
title: 隠し設定を持つCore Candy Machineを作成する
metaTitle: 隠し設定を持つCore Candy Machineを作成する | Core Candy Machine
description: 隠し設定を使用してCore Candy Machineを作成し、隠蔽とリビールのNFTドロップを作成する方法。
keywords:
  - hidden settings
  - hide and reveal
  - NFT reveal
  - placeholder metadata
  - candy machine reveal
  - hidden NFT
  - reveal mechanism
  - Core Candy Machine hidden settings
  - NFT drop
about:
  - Hidden settings
  - Reveal mechanism
  - NFT drops
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Core Candy Machineの隠し設定とは何ですか？
    a: 隠し設定により、ミントされたすべてのNFTが最初は同じプレースホルダーメタデータ（名前とURI）を共有し、後のリビールプロセスで各NFTの固有の特性を表示するように更新されます。
  - q: 隠し設定のハッシュはどのように機能しますか？
    a: ハッシュは、リビールデータ配列のSHA-256チェックサムです。リビール後、ユーザーは更新されたメタデータからハッシュを再計算して、NFTが改ざんされていないことを確認できます。
  - q: 隠し設定とConfig Line Settingsを併用できますか？
    a: いいえ。隠し設定とConfig Line Settingsは相互排他的です。Candy Machineを作成する際にいずれか一方を選択する必要があります。
---

## Summary

このガイドでは、隠蔽とリビールのNFTドロップのための隠し設定を持つ[Core Candy Machine](/ja/smart-contracts/core-candy-machine)の作成方法を説明します。ミントされたすべてのアセットは、ミント後のリビールで各NFTに固有の名前とURIが更新されるまで、プレースホルダーメタデータを共有します。 {% .lead %}

- プレースホルダーの名前、URI、およびリビールデータのSHA-256ハッシュで隠し設定を構成
- [Coreコレクション](/ja/smart-contracts/core/collections)と`hiddenSettings`フィールドを持つCandy Machineを作成
- すべてのアセットをミント -- リビールステップまで各アセットは同じプレースホルダーメタデータを受け取る
- リビールと検証プロセスはこのガイドのパート2でカバー

隠蔽とリビールのNFTドロップは、ミント後にすべてのNFTをリビールしたい場合に便利です。

仕組みは、Core Candy Machineをセットアップする際に、隠し設定フィールドを設定します。このフィールドには、リビール前にミントされたすべてのNFTに適用されるプレースホルダーメタデータ（汎用の名前とURI）が含まれます。さらに、メタデータの事前計算されたハッシュも含まれます。
リビール前にミントされるすべてのNFTは、同じ名前とURIを持ちます。コレクションがミントされた後、アセットは正しい名前とURI（メタデータ）で更新されます。

コレクションをミントした後、適切なメタデータでアセットを更新するリビールプロセスを実行する必要があります。

アセットが正しく更新されたことを確認するために、検証ステップが実行されます。これには、リビールされたアセットの更新されたメタデータ（名前とURI）をハッシュ化し、隠し設定に保存されている元のハッシュと比較することが含まれます。これにより、すべてのNFTが正確に更新されたことが保証されます。

リビールと検証のステップの両方は、このガイドのパート2で取り上げます。

## 必要なパッケージ

Core Candy Machineと対話するために、以下のパッケージをインストールする必要があります:

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore", "mpl-toolbox"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## Umiのセットアップ

[Umi](/ja/dev-tools/umi)はMetaplexのJavaScriptクライアントフレームワークで、Solanaプログラムと対話するための統一インターフェースを提供します。Umiをセットアップする際、テスト用に新しいウォレットを作成したり、ファイルシステムからウォレットをインポートしたり、UI/フロントエンドで`walletAdapter`を使用したりすることもできます。
この例では、秘密鍵を含むjsonファイル(wallet.json)からKeypairを作成します。

Solana Devnetエンドポイントを使用します。

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, some, none, createSignerFromKeypair, signerIdentity, transactionBuilder, dateTime } from "@metaplex-foundation/umi";
import { mplCandyMachine as mplCoreCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import * as fs from 'fs';

// We will be using Solana Devnet as the endpoint while also loading the `mplCoreCandyMachine()` plugin.
const umi = createUmi("https://api.devnet.solana.com")
            .use(mplCoreCandyMachine());

// Let's create a Keypair from our wallet json file that contains a secret key, and create a signer based on the created keypair
const walletFile = fs.readFileSync('./wallet.json');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
const signer = createSignerFromKeypair(umi, keypair);
console.log("Signer: ", signer.publicKey);

// Set the identity and the payer to the given signer
umi.use(signerIdentity(signer));
```

UMIのセットアップの詳細については、[Core NFTアセット作成ガイド](/ja/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#setting-up-umi)をご覧ください。

## リビールデータとハッシュの準備

リビールデータは、コレクション内の各NFTに対応する`{ name, uri }`オブジェクトの配列であり、ミント後にプレースホルダーメタデータを置き換えるために使用されます。リビールデータのハッシュも生成します。このハッシュは、Core Candy Machineの隠し設定に保存され、検証ステップでメタデータが正しく更新されたことを確認するために使用されます。

このメタデータは各アセットにアップロードされ、結果として得られるURIを使用します。

リビールデータは自分でアップロードする必要があることに注意してください。
このプロセスはデフォルトでは決定論的ではない可能性があります。決定論的な方法で行うには、[turbo](/ja/guides/general/create-deterministic-metadata-with-turbo)を使用できます。

この例では、5つのアセットのコレクションを扱うため、リビールデータには5つのオブジェクトの配列が含まれ、それぞれが個々のNFTの名前とURIを表します。

```ts
import crypto from 'crypto';

// Reveal data of our assets, to be used during the reveal process
const revealData = [
      { name: 'Nft #1', uri: 'http://example.com/1.json' },
      { name: 'Nft #2', uri: 'http://example.com/2.json' },
      { name: 'Nft #3', uri: 'http://example.com/3.json' },
      { name: 'Nft #4', uri: 'http://example.com/4.json' },
      { name: 'Nft #5', uri: 'http://example.com/5.json' },
    ]

let string = JSON.stringify(revealData)
let hash = crypto.createHash('sha256').update(string).digest()
```

## Coreコレクションの作成

[Coreコレクション](/ja/smart-contracts/core/collections)アセットは、Candy MachineからミントされるすべてのNFTの親として必要です。`mpl-core`ライブラリの`createCollection`メソッドは、単一の命令で作成を処理します。

コレクションの詳細については、[コレクションページ](/ja/smart-contracts/core/collections)をご覧ください。

```ts
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core';

const collectionMint = generateSigner(umi);

const creator1 = generateSigner(umi).publicKey;
const creator2 = generateSigner(umi).publicKey;

console.log("collection update authority: ", collectionUpdateAuthority.publicKey);
await createCollection(umi, {
    collection: collectionMint,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    plugins: [
        {
            type: 'Royalties',
            basisPoints: 500,
            creators: [
            {
                address: creator1,
                percentage: 20,
            },
            {
                address: creator2,
                percentage: 80,
            },
        ],
        ruleSet: ruleSet('None'),
        },
    ],
}).sendAndConfirm(umi)
```

`Royalties`タイプのプラグインを追加し、これらのロイヤルティを共有する2人の異なるクリエイターを追加しました。

次に、作成したコレクションを取得して、その詳細を出力しましょう。

```ts
import { fetchCollection } from '@metaplex-foundation/mpl-core';

const collection = await fetchCollection(umi, collectionMint.publicKey);

console.log("Collection Details: \n", collection);
```

## 隠し設定を持つCore Candy Machineの作成

`mpl-core-candy-machine`ライブラリの`create`メソッドは、`configLineSettings`を置き換える`hiddenSettings`フィールドを受け入れます。プレースホルダーの名前、URI、および事前計算されたハッシュを渡して、隠蔽とリビールフローのためにCandy Machineを設定します。

Core Candy Machineの作成とguardsの詳細については、[Core Candy Machine作成ページ](/ja/smart-contracts/core-candy-machine/create)をご覧ください。

さらに、ミントがいつ始まるかを決定するstartDate guardを設定します。これは利用可能な多くの[ガード](/ja/smart-contracts/core-candy-machine/guards)の1つに過ぎず、利用可能なすべてのガードのリストは[Guardsページ](/ja/smart-contracts/core-candy-machine/guards)で見つけることができます。

{% callout type="note" %}
隠し設定とConfig Line Settingsは相互排他的です。`hiddenSettings`を使用する場合は`configLineSettings: none()`を設定し、その逆も同様です。
{% /callout %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine';

const candyMachine = generateSigner(umi);

const res = await create(umi, {
    candyMachine,
    collection: collectionMint.publicKey,
    collectionUpdateAuthority: umi.identity,
    itemsAvailable: 5,
    configLineSettings: none(),
    hiddenSettings: some({
        name: 'My Hidden NFT Project',
        uri: 'https://example.com/path/to/teaser.json',
        hash: hash,
    }),
    guards: {
        startDate: some({ date: dateTime('2024-01-01T16:00:00Z') }),
    }
});
let tx = await res.sendAndConfirm(umi);
```

次に、作成したcandy machineを取得して、その詳細を出力しましょう。
これを実現するために、mpl-core-candy-machineライブラリの`fetchCandyMachine`メソッドを使用します。

```ts
import { fetchCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';

let candyMachineDetails = await fetchCandyMachine(umi, candyMachine.publicKey);

console.log("Candy Machine Details: \n", candyMachineDetails);
```

これは以下のようなCandy Machineデータを返します:

```json
{
  "publicKey": "FVQYpQxtT4ZqCmq3MNiWY1mZcEJsVA6DaaW6bMhERoVY",
  "header": {
    "executable": false,
    "owner": "CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J",
    "lamports": { "basisPoints": 5428800, "identifier": "SOL", "decimals": 9 },
    "rentEpoch": 18446744073709551616,
    "exists": true
  },
  "discriminator": [
    51, 173, 177, 113,
    25, 241, 109, 189
  ],
  "authority": "Cce2qGViiD1SqAiJMDJVJQrGfxcb3DMyLgyhaqYB8uZr",
  "mintAuthority": "4P6VhHmNi9Qt5eRuQsE9SaE5bYWoLxpdPwmfNZeiU2mv",
  "collectionMint": "3RLCk7G2ckGHt7XPNfzUYKLriME2BmMoumF8N4H5LvsS",
  "itemsRedeemed": 0,
  "data": {
    "itemsAvailable": 5,
    "maxEditionSupply": 0,
    "isMutable": true,
    "configLineSettings": { "__option": "None" },
    "hiddenSettings": { "__option": "Some", "value": "[Object]" }
  },
  "items": [],
  "itemsLoaded": 0
}
"Candy Guard Account":
 {
  "publicKey": "4P6VhHmNi9Qt5eRuQsE9SaE5bYWoLxpdPwmfNZeiU2mv",
  "header": {
    "executable": false,
    "owner": "CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ",
    "lamports": { "basisPoints": 1538160, "identifier": "SOL", "decimals": 9 },
    "rentEpoch": 18446744073709551616,
    "exists": true
  },
  "discriminator": [
     44, 207, 199, 184,
    112, 103,  34, 181
  ],
  "base": "FVQYpQxtT4ZqCmq3MNiWY1mZcEJsVA6DaaW6bMhERoVY",
  "bump": 251,
  "authority": "Cce2qGViiD1SqAiJMDJVJQrGfxcb3DMyLgyhaqYB8uZr",
  "guards": {
    "botTax": { "__option": "None" },
    "solPayment": { "__option": "None" },
    "tokenPayment": { "__option": "None" },
    "startDate": { "__option": "Some", "value": "[Object]" },
    "thirdPartySigner": { "__option": "None" },
    "tokenGate": { "__option": "None" },
    "gatekeeper": { "__option": "None" },
    "endDate": { "__option": "None" },
    "allowList": { "__option": "None" },
    "mintLimit": { "__option": "None" },
    "nftPayment": { "__option": "None" },
    "redeemedAmount": { "__option": "None" },
    "addressGate": { "__option": "None" },
    "nftGate": { "__option": "None" },
    "nftBurn": { "__option": "None" },
    "tokenBurn": { "__option": "None" },
    "freezeSolPayment": { "__option": "None" },
    "freezeTokenPayment": { "__option": "None" },
    "programGate": { "__option": "None" },
    "allocation": { "__option": "None" },
    "token2022Payment": { "__option": "None" },
    "solFixedFee": { "__option": "None" },
    "nftMintLimit": { "__option": "None" },
    "edition": { "__option": "None" },
    "assetPayment": { "__option": "None" },
    "assetBurn": { "__option": "None" },
    "assetMintLimit": { "__option": "None" },
    "assetBurnMulti": { "__option": "None" },
    "assetPaymentMulti": { "__option": "None" },
    "assetGate": { "__option": "None" },
    "vanityMint": { "__option": "None" },
  },
  "groups": []
}
```

ご覧のとおり、意図したとおり、実際には`startDate`のみが設定されているCandy Guard Accountも出力されます。

## コレクションのミント

各`mintV1`呼び出しは、隠し設定からプレースホルダーの名前とURIを受け取る1つのアセットをミントします。ミントされたこれらのアセットはすべて、作成したCore Candy Machineの`hiddenSettings`フィールドに設定したプレースホルダーの名前とURIを持ちます。

これらのプレースホルダー要素は、リビールプロセス中に更新されます。

```ts
import { mintV1 } from '@metaplex-foundation/mpl-core-candy-machine';

const nftMint = [
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
    generateSigner(umi),
];

for(let i = 0; i < nftMint.length; i++) {
    let mintNFT = await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
        mintV1(umi, {
            candyMachine: candyMachine.publicKey,
            asset: nftMint[i],
            collection: collectionMint.publicKey,
        })
    ).sendAndConfirm(umi);

    console.log("NFT minted!");
};
```

## Notes

- **隠し設定とConfig Line Settingsは相互排他的です。** Core Candy Machineを作成する際、`hiddenSettings`または`configLineSettings`のいずれかを選択する必要があります。両方を使用することはできません。使用しないオプションは`none()`に設定してください。
- **ハッシュはリビールの整合性を検証します。** 隠し設定に保存されるSHA-256ハッシュは、リビールデータ配列から計算されます。リビール後、誰でもオンチェーンメタデータからハッシュを再計算して、NFTが改ざんされていないことを確認できます。
- **リビール前にミントされたすべてのNFTは同じメタデータを共有します。** リビールプロセスの前にミントされたすべてのアセットは、隠し設定で設定された同一のプレースホルダー名とURIを表示します。個別のメタデータは、パート2でカバーされるリビールステップ中にのみ適用されます。

## まとめ

このガイドのパート1を完了し、隠し設定を持つCore Candy Machineのセットアップに成功しました。

これまでに行ったことを振り返りましょう:
- まずUMIをセットアップしました。
- UMIをセットアップした後、最初のミント後にアセットを更新するために使用されるメタデータ（名前とURI）を含む配列を作成しました。これには、検証目的でハッシュを計算することが含まれます。
- ミントされたアセットが属するCollectionアセットを作成しました。
- 隠し設定、5つの利用可能なアイテム、および開始時間guardを持つCore Candy Machineを作成しました。
- Core Candy Machineの隠し設定に保存されているプレースホルダー値を使用して、すべてのアセットをミントしました。

パート2では、アセットをリビールし、そのメタデータを検証する手順を取り上げます。これには以下が含まれます:
- コレクションアセットを取得し、準備されたリビールデータでそのメタデータを更新します。
- リビールされたアセットのメタデータ（名前とURI）をハッシュ化し、期待されるハッシュと比較することで、リビールプロセスが成功したことを確認します。

## FAQ

### Core Candy Machineの隠し設定とは何ですか？

隠し設定により、ミントされたすべてのNFTが最初は同じプレースホルダーメタデータ（名前とURI）を共有し、後のリビールプロセスで各NFTの固有の特性を表示するように更新されます。

### 隠し設定のハッシュはどのように機能しますか？

ハッシュは、リビールデータ配列のSHA-256チェックサムです。リビール後、ユーザーは更新されたメタデータからハッシュを再計算して、NFTが改ざんされていないことを確認できます。

### 隠し設定とConfig Line Settingsを併用できますか？

いいえ。隠し設定とConfig Line Settingsは相互排他的です。Candy Machineを作成する際にいずれか一方を選択する必要があります。

*Metaplex Foundationによりメンテナンス。最終確認 2026年3月。`@metaplex-foundation/mpl-core-candy-machine`に適用。*
