---
title: 隠し設定を持つCore Candy Machineを作成する
metaTitle: 隠し設定を持つCore Candy Machineを作成する | Core Candy Machine
description: 隠し設定を使用してCore Candy Machineを作成し、隠蔽とリビールのNFTドロップを作成する方法。
---

隠蔽とリビールのNFTドロップを作成したい場合は、Core Candy Machineを使用してその目標を達成できます。このガイドは、プロセス全体の包括的なウォークスルーを確実にするために2つの部分に分かれています。

このガイド(パート1)では、Core Candy Machineを使用して隠蔽とリビールのNFTドロップをセットアップしてミントするステップバイステップのプロセスをご案内します。経験豊富な開発者であれ、NFTドロップに初めて触れる方であれ、このガイドは始めるために必要なすべてを提供します。NFTドロップのリビールと検証については、パート2で取り上げます。

隠蔽とリビールのNFTドロップは、ミント後にすべてのNFTをリビールしたい場合に便利です。

仕組みは、Core Candy Machineをセットアップする際に、隠し設定フィールドを設定します。このフィールドには、リビール前にミントされたすべてのNFTに適用されるプレースホルダーメタデータ(汎用の名前とURI)が含まれます。さらに、メタデータの事前計算されたハッシュも含まれます。
リビール前にミントされるすべてのNFTは、同じ名前とURIを持ちます。コレクションがミントされた後、アセットは正しい名前とURI(メタデータ)で更新されます。

コレクションをミントした後、適切なメタデータでアセットを更新するリビールプロセスを実行する必要があります。

アセットが正しく更新されたことを確認するために、検証ステップが実行されます。これには、リビールされたアセットの更新されたメタデータ(名前とURI)をハッシュ化し、隠し設定に保存されている元のハッシュと比較することが含まれます。これにより、すべてのNFTが正確に更新されたことが保証されます。

リビールと検証のステップの両方は、このガイドのパート2で取り上げます。

## 必要なパッケージ

Core Candy Machineと対話するために、以下のパッケージをインストールする必要があります:

{% packagesUsed packages=["umi", "umiDefaults", "core", "candyMachineCore", "mpl-toolbox"] type="npm" /%}

```ts
npm i @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-core-candy-machine
```

## umiのセットアップ

環境をセットアップした後、umiのセットアップから始めましょう。

Umiをセットアップする際、テスト用に新しいウォレットを作成したり、ファイルシステムからウォレットをインポートしたり、UI/フロントエンドで`walletAdapter`を使用したりすることもできます。
この例では、秘密鍵を含むjsonファイル(wallet.json)からKeypairを作成します。

devnet Auraエンドポイントを使用します。
SolanaおよびEclipseブロックチェーン上のMetaplex Auraネットワークへのアクセスは、[こちら](https://aura-app.metaplex.com/)のAura AppでエンドポイントとAPIキーを入手できます。

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, some, none, createSignerFromKeypair, signerIdentity, transactionBuilder, dateTime } from "@metaplex-foundation/umi";
import { mplCandyMachine as mplCoreCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import * as fs from 'fs';

// Metaplex AuraデータネットワークからSolana Devnetをエンドポイントとして使用し、`mplCoreCandyMachine()`プラグインも読み込みます。
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
            .use(mplCoreCandyMachine());

// 秘密鍵を含むwallet jsonファイルからKeypairを作成し、作成されたkeypairに基づいて署名者を作成しましょう
const walletFile = fs.readFileSync('./wallet.json');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
const signer = createSignerFromKeypair(umi, keypair);
console.log("Signer: ", signer.publicKey);

// 指定された署名者にアイデンティティとペイヤーを設定します
umi.use(signerIdentity(signer));
```

UMIのセットアップの詳細については、[こちら](https://developers.metaplex.com/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#setting-up-umi)をご覧ください。

## リビールデータの準備
次に、最終的にリビールされるNFTのメタデータを含むリビールデータを準備しましょう。このデータには、コレクション内の各NFTの名前とURIが含まれ、ミント後にプレースホルダーメタデータを更新するために使用されます。
このメタデータは各アセットにアップロードされ、結果として得られるURIを使用します。

リビールデータは自分でアップロードする必要があることに注意してください。
このプロセスはデフォルトでは決定論的ではない可能性があります。決定論的な方法で行うには、[turbo](https://developers.metaplex.com/guides/general/create-deterministic-metadata-with-turbo)を使用できます。

この例では、5つのアセットのコレクションを扱うため、リビールデータには5つのオブジェクトの配列が含まれ、それぞれが個々のNFTの名前とURIを表します。

また、リビールデータのハッシュも生成します。このハッシュは、Core Candy Machineの隠し設定に保存され、検証ステップでメタデータが正しく更新されたことを確認するために使用されます。

```ts
import crypto from 'crypto';

// リビールプロセス中に使用するアセットのリビールデータ
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

## コレクションの作成

次にCollectionアセットを作成しましょう。
そのために、mpl-coreライブラリは、そのアクションを実行するのに役立つ`createCollection`メソッドを提供します。

コレクションの詳細については、[こちら](https://developers.metaplex.com/core/collections)をご覧ください。

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

## 隠し設定を持つCore Candy Machineを作成する

次のステップは、隠し設定を持つCore Candy Machineを作成することです。

これを実現するために、mpl-core-candy-machineライブラリの`create`メソッドを使用し、プレースホルダーの名前、URI、および`revealData`から事前計算されたハッシュを使用して`hiddenSettings`を設定します。

Core Candy Machineの作成とguardsの詳細については、[こちら](https://developers.metaplex.com/core-candy-machine/create)をご覧ください。

さらに、ミントがいつ始まるかを決定するstartDate guardを設定します。これは利用可能な多くのguardの1つに過ぎず、利用可能なすべてのguardのリストは[こちら](https://developers.metaplex.com/candy-machine/guards)で見つけることができます。

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

## コレクションをミントする

次に、Core Candy Machineから5つのNFTをミントしましょう。

ミントされたこれらのアセットはすべて、作成したCore Candy Machineの`hiddenSettings`フィールドに設定したプレースホルダーの名前とURIを持ちます。

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

## まとめ
おめでとうございます！ガイドのパート1を完了し、隠し設定を持つCore Candy Machineのセットアップに成功しました。

これまでに行ったことを振り返りましょう:
- まずUMIをセットアップしました。
- UMIをセットアップした後、最初のミント後にアセットを更新するために使用されるメタデータ(名前とURI)を含む配列を作成しました。これには、検証目的でハッシュを計算することが含まれます。
- ミントされたアセットが属するCollectionアセットを作成しました。
- 隠し設定、5つの利用可能なアイテム、および開始時間guardを持つCore Candy Machineを作成しました。
- Core Candy Machineの隠し設定に保存されているプレースホルダー値を使用して、すべてのアセットをミントしました。

パート2では、アセットをリビールし、そのメタデータを検証する手順を取り上げます。これには以下が含まれます:
- コレクションアセットを取得し、準備されたリビールデータでそのメタデータを更新します。
- リビールされたアセットのメタデータ(名前とURI)をハッシュ化し、期待されるハッシュと比較することで、リビールプロセスが成功したことを確認します。
