---
title: Javascriptを使用してCoreステーキングを作成する
metaTitle: Javascriptを使用してCoreステーキングを作成する | Coreガイド
description: このガイドでは、FreezeDelegateとAttributeプラグインを活用して、バックエンドサーバーを使用したweb2プラクティスでステーキングプラットフォームを作成する方法を示します。
updated: '01-31-2026'
keywords:
  - NFT staking
  - TypeScript staking
  - freeze delegate
  - web2 staking
about:
  - Staking mechanics
  - Backend integration
  - Plugin usage
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - UmiとauthorityキーペアでTypeScriptバックエンドをセットアップ
  - ステーキングAssetsにFreeze DelegateとAttributeプラグインを追加
  - Assetをフリーズしステーキングタイムスタンプを書き込むstakeエンドポイントを作成
  - Assetを解凍しステーキング期間を計算するunstakeエンドポイントを作成
howToTools:
  - Node.js
  - Umiフレームワーク
  - mpl-core SDK
  - Expressまたは類似のバックエンド
---
この開発者ガイドでは、attributeプラグインとfreeze delegateを活用して、TypeScriptのみを使用してコレクションのステーキングプログラムを作成する方法を示します。**このアプローチにより、ステーキング時間の追跡やステーキング/アンステーキングの管理にスマートコントラクトが不要**になり、Web2開発者にとってよりアクセスしやすくなります。
## はじめに：プログラムのロジックを理解する
このプログラムは標準的なTypeScriptバックエンドで動作し、シークレット内のアセットキーペアauthorityを使用してattribute変更に署名します。
**この例を実装するには、以下のコンポーネントが必要です：**
- **Asset**
- **Collection**（オプション、この例では関連性があります）
- **FreezeDelegateプラグイン**
- **Attributeプラグイン**
### Freeze Delegateプラグイン
**Freeze Delegateプラグイン**は**オーナー管理プラグイン**であり、アセットに適用するにはオーナーの署名が必要です。
このプラグインにより、**delegateがアセットをフリーズおよび解凍し、転送を防止**できます。アセットオーナーまたはプラグインauthorityは、アセットがフリーズされている場合を除き、いつでもこのプラグインを取り消すことができます（フリーズされている場合は、取り消す前に解凍する必要があります）。
**このプラグインの使用は軽量**で、アセットのフリーズ/解凍はプラグインデータ内のブール値を変更するだけです（唯一の引数はFrozen: boolです）。
_詳細は[Freeze Delegateプラグインページ](/smart-contracts/core/plugins/freeze-delegate)をご覧ください_
### Attributeプラグイン
**Attributeプラグイン**は**authority管理プラグイン**であり、アセットに適用するにはauthorityの署名が必要です。コレクションに含まれるアセットの場合、アセットのauthorityフィールドはコレクションアドレスで占有されているため、コレクションauthorityがauthorityとして機能します。
このプラグインにより、**データをアセットに直接保存でき、オンチェーンのattributesやtraitsとして機能**します。これらのtraitsは、mpl-programのようにオフチェーンに保存されないため、オンチェーンプログラムから直接アクセスできます。
**このプラグインはAttributeListフィールドを受け入れ**、keyとvalueのペアの配列で構成され、両方とも文字列です。
_詳細は[Attributeプラグインページ](/smart-contracts/core/plugins/attribute)をご覧ください_
### プログラムロジック
簡単にするため、この例にはステーキングプログラムが意図したとおりに動作するために不可欠な**stake**と**unstake**関数の2つの命令のみが含まれています。蓄積されたポイントを利用するための**spendPoint**命令などの追加命令を追加することもできますが、これは読者の実装に委ねます。
_StakeとUnstake関数の両方が、前述のプラグインを異なる方法で利用します_。
命令に入る前に、使用されるattributesである`staked`と`staked_time`キーについて説明しましょう。`staked`キーはアセットがステーキングされているかどうか、ステーキングされている場合はいつステーキングされたかを示します（unstaked = 0、staked = ステーキング時刻）。`staked_time`キーはアセットの総ステーキング期間を追跡し、アセットがアンステーキングされた後にのみ更新されます。
**命令**：
- **Stake**：この命令はFreeze Delegateプラグインを適用してフラグをtrueに設定してアセットをフリーズします。さらに、Attributeプラグインの`staked`キーを0から現在時刻に更新します。
- **Unstake**：この命令はFreeze Delegateプラグインのフラグを変更し、悪意のあるエンティティがアセットを制御して解凍のために身代金を要求することを防ぐために取り消します。また、`staked`キーを0に更新し、`staked_time`を現在時刻からステーキングタイムスタンプを引いた値に設定します。
## プログラムの構築：ステップバイステップガイド
プログラムのロジックを理解したので、**コードに飛び込んですべてをまとめましょう**！
### 依存関係とインポート
プログラムを書く前に、プログラムが動作するために必要なパッケージとそれらの関数を見てみましょう！
この例で使用する異なるパッケージを見てみましょう：
```json
"dependencies": {
    "@metaplex-foundation/mpl-core": "1.1.0-alpha.0",
    "@metaplex-foundation/mpl-token-metadata": "^3.2.1",
    "@metaplex-foundation/umi-bundle-defaults": "^0.9.1",
    "bs58": "^5.0.0",
    "typescript": "^5.4.5"
}
```
それらのパッケージからの異なる関数は以下の通りです：
```typescript
import { createSignerFromKeypair, signerIdentity, publicKey, transactionBuilder, Transaction } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { addPlugin, updatePlugin, fetchAsset, removePlugin } from '@metaplex-foundation/mpl-core'
import { base58 } from '@metaplex-foundation/umi/serializers';
```
### UmiとCore SDKの概要
このガイドでは、**Umi**と**Core SDK**の両方を使用して必要なすべての命令を作成します。
**UmiはSolanaプログラム用のJavaScriptクライアントを構築および使用するためのモジュラーフレームワーク**です。コアインターフェースのセットを定義するゼロ依存ライブラリを提供し、ライブラリが特定の実装から独立して動作できるようにします。
_詳細については、[Umi入門ガイド](/dev-tools/umi/getting-started)で概要を確認できます_
**この例の基本的なUmiセットアップは次のようになります**：
```typescript
const umi = createUmi("https://api.devnet.solana.com", "finalized")
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
```
このセットアップには以下が含まれます：
- **Umiプロバイダー用のDevnetへの接続確立**
- **authorityとpayerの両方として使用するキーペアのセットアップ**（umi.use(signerIdentity(...))）
**注意**：この例で新しいキーペアを使用したい場合は、generateSigner()関数を使用していつでも作成できます。
### AssetとCollectionへの追加の作成
ステーキングとアンステーキングのロジックに入る前に、**アセットをゼロから作成してコレクションに追加する方法**を学ぶ必要があります。
**Collectionの作成**：
```typescript
(async () => {
   // CollectionキーペアをJ生成
   const collection = generateSigner(umi)
   console.log("\nCollection Address: ", collection.publicKey.toString())
   // コレクションを生成
   const tx = await createCollection(umi, {
       collection: collection,
       name: 'My Collection',
       uri: 'https://example.com/my-collection.json',
   }).sendAndConfirm(umi)
   // トランザクションから署名をデシリアライズ
   const signature = base58.deserialize(tx.signature)[0];
   console.log(`\nCollection Created: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
})();
```
**AssetをCollectionに作成および追加：**
```typescript
(async () => {
   // AssetキーペアをJ生成
   const asset = generateSigner(umi)
   console.log("\nAsset Address: ", asset.publicKey.toString())
   // Collectionを渡してフェッチ
   const collection = publicKey("<collection_pubkey>")
   const fetchedCollection = await fetchCollection(umi, collection);
   // Assetを生成
   const tx = await create(umi, {
       name: 'My NFT',
       uri: 'https://example.com/my-nft.json',
       asset,
       collection: fetchedCollection,
   }).sendAndConfirm(umi)
   // トランザクションから署名をデシリアライズ
   const signature = base58.deserialize(tx.signature)[0];
   console.log(`Asset added to the Collection: https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
})();
```
### ステーキング命令
完全な**ステーキング命令**は以下の通りです
mpl-core SDKの`fetchAsset(...)`命令を使用して、アセットに関する情報（attributeプラグインがあるかどうか、ある場合はどのattributesが含まれているかなど）を取得することから始めます。
```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```
1. **Attributeプラグインのチェック**
アセットにattributeプラグインがない場合は、追加して`staked`と`stakedTime`キーを設定します。
```typescript
if (!fetchedAsset.attributes) {
    tx = await transactionBuilder().add(addPlugin(umi, {
        asset,
        collection,
        plugin: {
        type: "Attributes",
        attributeList: [
            { key: "staked", value: currentTime },
            { key: "stakedTime", value: "0" },
        ],
        },
    })).add(
        [...]
    )
} else {
```
2. **ステーキングAttributesのチェック**：
アセットにステーキングattributeがある場合、ステーキング命令に必要なステーキングattributesが含まれていることを確認します。
```typescript
} else {
    const assetAttribute = fetchedAsset.attributes.attributeList;
    const isInitialized = assetAttribute.some(
        (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
    );
```
含まれている場合、アセットがすでにステーキングされているかどうかをチェックし、`staked`キーを現在のタイムスタンプの文字列として更新します：
```typescript
if (isInitialized) {
    const stakedAttribute = assetAttribute.find(
        (attr) => attr.key === "staked"
    );
    if (stakedAttribute && stakedAttribute.value !== "0") {
        throw new Error("Asset is already staked");
    } else {
        assetAttribute.forEach((attr) => {
            if (attr.key === "staked") {
                attr.value = currentTime;
            }
        });
    }
} else {
```
含まれていない場合は、既存のattributeリストに追加します。
```typescript
} else {
    assetAttribute.push({ key: "staked", value: currentTime });
    assetAttribute.push({ key: "stakedTime", value: "0" });
}
```
3. **Attributeプラグインの更新**：
新しいまたは変更されたattributesでattributeプラグインを更新します。
```typescript
tx = await transactionBuilder().add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "Attributes",
        attributeList: assetAttribute,
    },
})).add(
    [...]
)
```
4. **Assetのフリーズ**
アセットにすでにattributeプラグインがあったかどうかに関係なく、アセットをフリーズして取引できないようにします
```typescript
tx = await transactionBuilder().add(
    [...]
).add(addPlugin(umi, {
    asset,
    collection,
    plugin: {
        type: "FreezeDelegate",
        frozen: true,
        authority: { type: "UpdateAuthority" }
    }
})).buildAndSign(umi);
```
**完全な命令は以下の通りです**：
```typescript
(async () => {
    // AssetとCollectionを渡す
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")
    // Asset Attributesをフェッチ
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("\nThis is the current state of your Asset Attribute Plugin: ", fetchedAsset.attributes);
    const currentTime = new Date().getTime().toString();
    let tx: Transaction;
    // アセットにAttributeプラグインがアタッチされているかチェック、なければ追加
    if (!fetchedAsset.attributes) {
        tx = await transactionBuilder().add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
            type: "Attributes",
            attributeList: [
                { key: "staked", value: currentTime },
                { key: "stakedTime", value: "0" },
            ],
            },
        })).add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
                type: "FreezeDelegate",
                frozen: true,
                authority: { type: "UpdateAuthority" }
            }
        })).buildAndSign(umi);
    } else {
        // ある場合、Asset Attribute PluginのattributeListをフェッチ
        const assetAttribute = fetchedAsset.attributes.attributeList;
        // アセットがすでにステーキングされているかチェック
        const isInitialized = assetAttribute.some(
            (attribute) => attribute.key === "staked" || attribute.key === "stakedTime"
        );
        // されている場合、すでにステーキングされているかチェックし、されていなければstaked attributeを更新
        if (isInitialized) {
            const stakedAttribute = assetAttribute.find(
                (attr) => attr.key === "staked"
            );
            if (stakedAttribute && stakedAttribute.value !== "0") {
                throw new Error("Asset is already staked");
            } else {
                assetAttribute.forEach((attr) => {
                    if (attr.key === "staked") {
                        attr.value = currentTime;
                    }
                });
            }
        } else {
            // されていない場合、staked & stakedTime attributeを追加
            assetAttribute.push({ key: "staked", value: currentTime });
            assetAttribute.push({ key: "stakedTime", value: "0" });
        }
        // Asset Attribute Pluginを更新し、FreezeDelegate Pluginを追加
        tx = await transactionBuilder().add(updatePlugin(umi, {
            asset,
            collection,
            plugin: {
            type: "Attributes",
                attributeList: assetAttribute,
            },
        })).add(addPlugin(umi, {
            asset,
            collection,
            plugin: {
                type: "FreezeDelegate",
                frozen: true,
                authority: { type: "UpdateAuthority" }
            }
        })).buildAndSign(umi);
    }
    // トランザクションから署名をデシリアライズ
    console.log(`Asset Staked: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=devnet-alpha`);
})();
```
### アンステーキング命令
アンステーキング命令はさらに簡単です。アンステーキング命令はステーキング命令の後にのみ呼び出すことができるため、多くのチェックはステーキング命令自体で本質的にカバーされています。
`fetchAsset(...)`命令を呼び出してアセットに関するすべての情報を取得することから始めます。
```typescript
const fetchedAsset = await fetchAsset(umi, asset);
```
1. **Attributeプラグインのすべてのチェックを実行**
アセットがすでにステーキング命令を通過したかどうかを確認するために、**命令は以下のattributeプラグインをチェックします**：
- **アセットにattributeプラグインは存在するか？**
- **stakedキーはあるか？**
- **stakedTimeキーはあるか？**
これらのチェックのいずれかが欠けている場合、アセットはステーキング命令を通過していません。
```typescript
if (!fetchedAsset.attributes) {
    throw new Error(
        "Asset has no Attribute Plugin attached to it. Please go through the stake instruction before."
    );
}
const assetAttribute = fetchedAsset.attributes.attributeList;
const stakedTimeAttribute = assetAttribute.find((attr) => attr.key === "stakedTime");
if (!stakedTimeAttribute) {
    throw new Error(
        "Asset has no stakedTime attribute attached to it. Please go through the stake instruction before."
    );
}
const stakedAttribute = assetAttribute.find((attr) => attr.key === "staked");
if (!stakedAttribute) {
    throw new Error(
        "Asset has no staked attribute attached to it. Please go through the stake instruction before."
    );
}
```
アセットにステーキングattributesがあることを確認したら、**アセットが現在ステーキングされているかどうかをチェック**します。ステーキングされている場合、ステーキングattributesを次のように更新します：
- `Staked`フィールドをゼロに設定
- `stakedTime`を`stakedTime` + (現在のタイムスタンプ - ステーキングタイムスタンプ)に更新
```typescript
if (stakedAttribute.value === "0") {
    throw new Error("Asset is not staked");
} else {
    const stakedTimeValue = parseInt(stakedTimeAttribute.value);
    const stakedValue = parseInt(stakedAttribute.value);
    const elapsedTime = new Date().getTime() - stakedValue;
    assetAttribute.forEach((attr) => {
        if (attr.key === "stakedTime") {
            attr.value = (stakedTimeValue + elapsedTime).toString();
        }
        if (attr.key === "staked") {
            attr.value = "0";
        }
    });
}
```
2. **Attributeプラグインの更新**
新しいまたは変更されたattributesでattributeプラグインを更新します。
```typescript
tx = await transactionBuilder().add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
        type: "Attributes",
        attributeList: assetAttribute,
    },
})).add(
    [...]
).add(
    [...]
).buildAndSign(umi);
```
3. **FreezeDelegateプラグインの解凍と削除**
命令の最後に、アセットを解凍し、FreezeDelegateプラグインを削除して、アセットが「自由」になり、`update_authority`によって制御されないようにします
```typescript
tx = await transactionBuilder().add(
    [...]
).add(updatePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "FreezeDelegate",
    frozen: false,
    },
})).add(removePlugin(umi, {
    asset,
    collection,
    plugin: {
    type: "FreezeDelegate",
    },
})).buildAndSign(umi);
```
**完全な命令は以下の通りです**：
```typescript
(async () => {
    // AssetとCollectionを渡す
    const asset = publicKey("6AWm5uyhmHQXygeJV7iVotjvs2gVZbDXaGUQ8YGVtnJo");
    const collection = publicKey("CYKbtF2Y56QwQLYHUmpAPeiMJTz1DbBZGvXGgbB6VdNQ")
    let tx: Transaction;
    // Asset Attributesをフェッチ
    const fetchedAsset = await fetchAsset(umi, asset);
    console.log("This is the current state of your Asset Attribute Plugin", fetchedAsset.attributes);
    // アセットにattributeプラグインがアタッチされていない場合はエラーをスロー
    if (!fetchedAsset.attributes) {
      throw new Error(
        "Asset has no Attribute Plugin attached to it. Please go through the stake instruction before."
      );
    }

    const assetAttribute = fetchedAsset.attributes.attributeList;
    // アセットにstakedTime attributeがアタッチされているかチェック、なければエラーをスロー
    const stakedTimeAttribute = assetAttribute.find((attr) => attr.key === "stakedTime");
    if (!stakedTimeAttribute) {
      throw new Error(
        "Asset has no stakedTime attribute attached to it. Please go through the stake instruction before."
      );
    }
    // アセットにstaked attributeがアタッチされているかチェック、なければエラーをスロー
    const stakedAttribute = assetAttribute.find((attr) => attr.key === "staked");
    if (!stakedAttribute) {
      throw new Error(
        "Asset has no staked attribute attached to it. Please go through the stake instruction before."
      );
    }
    // アセットがすでにステーキングされているか(!0)をチェック、されていなければエラーをスロー
    if (stakedAttribute.value === "0") {
      throw new Error("Asset is not staked");
    } else {
      const stakedTimeValue = parseInt(stakedTimeAttribute.value);
      const stakedValue = parseInt(stakedAttribute.value);
      const elapsedTime = new Date().getTime() - stakedValue;
      // stakedTime attributeを新しい値に、staked attributeを0に更新
      assetAttribute.forEach((attr) => {
        if (attr.key === "stakedTime") {
          attr.value = (stakedTimeValue + elapsedTime).toString();
        }
        if (attr.key === "staked") {
          attr.value = "0";
        }
      });
    }
    // 新しいattributeListでAsset Attribute Pluginを更新
    // 次にアセットを解凍するためにAsset FreezeDelegate Pluginを更新
    // その後アセットからFreezeDelegateプラグインを削除
    tx = await transactionBuilder().add(updatePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "Attributes",
        attributeList: assetAttribute,
      },
    })).add(updatePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "FreezeDelegate",
        frozen: false,
      },
    })).add(removePlugin(umi, {
      asset,
      collection,
      plugin: {
        type: "FreezeDelegate",
      },
    })).buildAndSign(umi);
     // トランザクションから署名をデシリアライズ
     console.log(`Asset Unstaked: https://solana.fm/tx/${base58.deserialize(await umi.rpc.sendTransaction(tx))[0]}?cluster=devnet-alpha`);
})();
```
## 結論
おめでとうございます！これでNFTコレクションのステーキングソリューションを作成する準備が整いました！CoreとMetaplexについてさらに学びたい場合は、[開発者ハブ](/smart-contracts/core/getting-started)をご覧ください。
