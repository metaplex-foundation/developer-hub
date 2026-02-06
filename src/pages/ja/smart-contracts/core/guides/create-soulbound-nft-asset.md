---
title: MPL CoreでのSoulbound Assets
metaTitle: MPL CoreでのSoulbound Assets | Coreガイド
description: このガイドでは、MPL CoreでのSoulbound Assetsのさまざまなオプションを探ります
updated: '01-31-2026'
keywords:
  - soulbound NFT
  - non-transferable NFT
  - bound token
  - SBT
about:
  - Soulbound tokens
  - Non-transferable NFTs
  - Identity tokens
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - Permanent Freeze DelegateまたはOracle Pluginアプローチを選択
  - コレクションレベルでsoulboundプラグインを持つCollectionを作成
  - frozenステートをtrue、authorityをNoneに設定してプラグインを追加
  - CollectionにAssetsをミント - soulbound動作を継承
howToTools:
  - Node.js
  - Umiフレームワーク
  - mpl-core SDK
---
Soulbound NFTは、特定のウォレットアドレスに永続的にバインドされ、別のオーナーに転送できない非代替性トークンです。特定のアイデンティティに紐づけるべき実績、資格、メンバーシップを表すのに便利です。 {% .lead %}
## 概要
このガイドでは、MPL CoreとUmiフレームワークを使用してSoulbound Assetsを作成する方法を探ります。TypeScriptでSoulbound NFTを実装したい開発者でも、単にその仕組みを理解したい方でも、基本的な概念から実践的な実装まですべてをカバーします。アセットをsoulboundにするさまざまなアプローチを検討し、コレクション内で最初のsoulbound NFTを作成する方法を説明します。
MPL Coreでは、soulbound NFTを作成する主に2つのアプローチがあります：
### 1. Permanent Freeze Delegateプラグイン
- アセットを完全に転送不可・バーン不可にする
- 以下のいずれかに適用可能：
  - 個別のアセットレベル
  - コレクションレベル（レント効率が良い）
- コレクションレベルの実装により、単一のトランザクションですべてのアセットを解凍可能
### 2. Oracleプラグイン
- アセットを転送不可にするが、バーンは可能
- 以下のいずれかに適用可能：
  - 個別のアセットレベル
  - コレクションレベル（レント効率が良い）
- コレクションレベルの実装により、単一のトランザクションですべてのアセットを解凍可能
## Permanent Freeze DelegateプラグインでSoulbound NFTを作成
Permanent Freeze Delegateプラグインは、アセットをフリーズして転送不可にする機能を提供します。soulboundアセットを作成する場合：
1. アセット作成時にPermanent Freezeプラグインを含める
2. 初期状態をfrozenに設定
3. authorityをNoneに設定し、frozen状態を永続的で不変にする
これにより、転送も解凍もできない永続的なsoulboundアセットが効果的に作成されます。以下のコードスニペットは、これら3つのオプションを追加する場所を示しています：
```js
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        type: 'PermanentFreezeDelegate', // Permanent Freezeプラグインを含める
        frozen: true, // 初期状態をfrozenに設定
        authority: { type: "None" }, // authorityをNoneに設定
      },
    ],
  })
```
### アセットレベルの実装
Permanent Freeze Delegateプラグインは、個々のアセットにアタッチしてsoulboundにできます。これはより細かい制御を提供しますが、より多くのレントと、将来soulboundでなくなる必要がある場合にアセットごとに個別の解凍トランザクションが必要です。
{% totem %}
{% totem-accordion title="コード例" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
// 転送制限をテストするためのダミー宛先ウォレットを定義
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
(async () => {
  // ステップ1: devnet RPCエンドポイントでUmiを初期化
  const umi = createUmi(
    "https://api.devnet.solana.com"
  ).use(mplCore());
  // ステップ2: テストウォレットを作成し資金を供給
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));
  console.log("テストウォレットにdevnet SOLを供給中...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));
  // ステップ3: フリーズされたアセットを保持する新しいコレクションを作成
  console.log("親コレクションを作成中...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);

  // トランザクション確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // コレクションが作成されたことを取得して確認
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("コレクションが正常に作成されました:", collectionSigner.publicKey);
  // ステップ4: コレクション内にフリーズされたアセットを作成
  console.log("フリーズされたアセットを作成中...");
  const assetSigner = generateSigner(umi);

  // PermanentFreezeDelegateプラグインを使用してパーマネントフリーズ付きでアセットを作成
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // PermanentFreezeDelegateプラグインはアセットを永続的にフリーズ
        type: 'PermanentFreezeDelegate',
        frozen: true, // アセットをフリーズに設定
        authority: { type: "None" }, // 解凍できるauthorityなし
      },
    ],
  }).sendAndConfirm(umi);

  // トランザクション確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // アセットが作成されたことを取得して確認
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("フリーズされたアセットが正常に作成されました:", assetSigner.publicKey);
  // ステップ5: アセットが本当にフリーズされていることを実証
  console.log(
    "転送を試みてフリーズプロパティをテスト中（これは失敗するはず）..."
  );

  // アセットの転送を試みる（フリーズにより失敗する）
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  // 失敗した転送試行の署名をログ出力
  console.log(
    "転送試行の署名:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();
```
{% /totem-accordion  %}
{% /totem %}
### コレクションレベルの実装
すべてのアセットがsoulboundであるべきコレクションの場合、コレクションレベルでプラグインを適用する方が効率的です。レントが少なく、1つのトランザクションでコレクション全体を解凍できます。
{% totem %}
{% totem-accordion title="コード例" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
// 転送制限をテストするためのダミー宛先ウォレットを定義
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
(async () => {
  // ステップ1: devnet RPCエンドポイントでUmiを初期化
  const umi = createUmi(
    "https://api.devnet.solana.com"
  ).use(mplCore());
  // ステップ2: テストウォレットを作成し資金を供給
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));
  console.log("テストウォレットにdevnet SOLを供給中...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // エアドロップ確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // ステップ3: 新しいフリーズされたコレクションを作成
  console.log("フリーズされたコレクションを作成中...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Frozen Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // PermanentFreezeDelegateプラグインはコレクションを永続的にフリーズ
        type: 'PermanentFreezeDelegate',
        frozen: true, // コレクションをフリーズに設定
        authority: { type: "None" }, // 解凍できるauthorityなし
      },
    ],
  }).sendAndConfirm(umi);
  // コレクション作成確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // コレクションが作成されたことを取得して確認
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("フリーズされたコレクションが正常に作成されました:", collectionSigner.publicKey);
  // ステップ4: フリーズされたコレクション内にアセットを作成
  console.log("フリーズされたコレクション内にアセットを作成中...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Frozen Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);
  // アセット作成確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // アセットが作成されたことを取得して確認
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("フリーズされたコレクション内にアセットが正常に作成されました:", assetSigner.publicKey);
  // ステップ5: アセットがコレクションによってフリーズされていることを実証
  console.log(
    "転送を試みてフリーズプロパティをテスト中（これは失敗するはず）..."
  );

  // アセットの転送を試みる（コレクションフリーズにより失敗する）
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  // 失敗した転送試行の署名をログ出力
  console.log(
    "転送試行の署名:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();
```
{% /totem-accordion  %}
{% /totem %}
## OracleプラグインでSoulbound NFTを作成
Oracleプラグインは、アセットのさまざまなライフサイクルイベントを承認または拒否する方法を提供します。soulbound NFTを作成するために、バーンなどの他の操作を許可しながら転送イベントを常に拒否する特別なOracleを使用できます。これはPermanent Freeze Delegateプラグインアプローチとは異なり、アセットは転送できなくてもバーン可能です。
Oracleプラグインを使用してsoulboundアセットを作成する場合、プラグインをアセットにアタッチします。これは作成時または後から行えます。この例では、Metaplexによってデプロイされた常に拒否する[デフォルトOracle](/smart-contracts/core/external-plugins/oracle#default-oracles-deployed-by-metaplex)を使用しています。
これにより、転送できないがバーン可能な永続的なsoulboundアセットが効果的に作成されます。以下のコードスニペットはその方法を示しています：
```js
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);
await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: "My Soulbound Asset",
  uri: "https://example.com/my-asset.json",
  plugins: [
    {
      // Oracleプラグインで転送権限を制御
      type: "Oracle",
      resultsOffset: {
        type: "Anchor",
      },
      baseAddress: ORACLE_ACCOUNT,
      lifecycleChecks: {
        // Oracleをすべての転送試行を拒否するように設定
        transfer: [CheckResult.CAN_REJECT],
      },
      baseAddressConfig: undefined,
    },
  ],
})
```
### アセットレベルの実装
Oracleプラグインは、個々のアセットを転送不可にしながらバーン機能を保持できます。これは、アセットを破棄する必要があるケースに柔軟性を提供します。
{% totem %}
{% totem-accordion title="コード例" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  CheckResult,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
// 転送権限を制御するOracleアカウントを定義
// これはMetaplexによってデプロイされた常に転送を拒否するOracle
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);
// 転送制限をテストするためのダミー宛先ウォレットを定義
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
(async () => {
  // ステップ1: devnet RPCエンドポイントでUmiを初期化
  const umi = createUmi(
    "https://api.devnet.solana.com"
  ).use(mplCore());
  // ステップ2: テストウォレットを作成し資金を供給
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));
  console.log("テストウォレットにdevnet SOLを供給中...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));
  // ステップ3: soulboundアセットを保持する新しいコレクションを作成
  console.log("親コレクションを作成中...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-collection.json",
  }).sendAndConfirm(umi);

  // トランザクション確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // コレクションが作成されたことを取得して確認
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("コレクションが正常に作成されました:", collectionSigner.publicKey);
  // ステップ4: コレクション内にsoulboundアセットを作成
  console.log("soulboundアセットを作成中...");
  const assetSigner = generateSigner(umi);

  // Oracleプラグインを使用して転送制限付きでアセットを作成
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Soulbound Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        // Oracleプラグインで転送権限を制御
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // Oracleをすべての転送試行を拒否するように設定
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);

  // トランザクション確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // アセットが作成されたことを取得して確認
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("soulboundアセットが正常に作成されました:", assetSigner.publicKey);
  // ステップ5: アセットが本当にsoulboundであることを実証
  console.log(
    "転送を試みてsoulboundプロパティをテスト中（これは失敗するはず）..."
  );

  // アセットの転送を試みる（Oracle制限により失敗する）
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  // 失敗した転送試行の署名をログ出力
  console.log(
    "転送試行の署名:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();
```
{% /totem-accordion  %}
{% /totem %}
### コレクションレベルの実装
コレクションレベルでOracleプラグインを適用すると、コレクション内のすべてのアセットが転送不可だがバーン可能になります。これはよりレント効率が良く、コレクション全体の権限を一度に管理できます。
{% totem %}
{% totem-accordion title="コード例" %}
```js
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCore } from "@metaplex-foundation/mpl-core";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
  sol,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  create,
  fetchCollection,
  CheckResult,
  transfer,
  fetchAssetV1,
} from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
// 転送権限を制御するOracleアカウントを定義
// これはMetaplexによってデプロイされた常に転送を拒否するOracle
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);
// 転送制限をテストするためのダミー宛先ウォレットを定義
const DESTINATION_WALLET = publicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
(async () => {
  // ステップ1: devnet RPCエンドポイントでUmiを初期化
  const umi = createUmi(
    "https://api.devnet.solana.com"
  ).use(mplCore());
  // ステップ2: テストウォレットを作成し資金を供給
  const walletSigner = generateSigner(umi);
  umi.use(keypairIdentity(walletSigner));
  console.log("テストウォレットにdevnet SOLを供給中...");
  await umi.rpc.airdrop(walletSigner.publicKey, sol(0.1));

  // エアドロップ確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // ステップ3: 転送制限付きの新しいコレクションを作成
  console.log("soulboundコレクションを作成中...");
  const collectionSigner = generateSigner(umi);
  await createCollection(umi, {
    collection: collectionSigner,
    name: "Soulbound Collection",
    uri: "https://example.com/my-collection.json",
    plugins: [
      {
        // Oracleプラグインで転送権限を制御
        type: "Oracle",
        resultsOffset: {
          type: "Anchor",
        },
        baseAddress: ORACLE_ACCOUNT,
        lifecycleChecks: {
          // Oracleをすべての転送試行を拒否するように設定
          transfer: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  }).sendAndConfirm(umi);
  // コレクション作成確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // コレクションが作成されたことを取得して確認
  const collection = await fetchCollection(umi, collectionSigner.publicKey);
  console.log("soulboundコレクションが正常に作成されました:", collectionSigner.publicKey);
  // ステップ4: コレクション内にsoulboundアセットを作成
  console.log("soulboundアセットを作成中...");
  const assetSigner = generateSigner(umi);
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "Soulbound Asset",
    uri: "https://example.com/my-asset.json",
  }).sendAndConfirm(umi);
  // アセット作成確認を待機
  await new Promise(resolve => setTimeout(resolve, 15000));
  // アセットが作成されたことを取得して確認
  const asset = await fetchAssetV1(umi, assetSigner.publicKey);
  console.log("soulboundアセットが正常に作成されました:", assetSigner.publicKey);
  // ステップ5: アセットが本当にsoulboundであることを実証
  console.log(
    "転送を試みてsoulboundプロパティをテスト中（これは失敗するはず）..."
  );

  // アセットの転送を試みる（Oracle制限により失敗する）
  const transferResponse = await transfer(umi, {
    asset: asset,
    newOwner: DESTINATION_WALLET,
    collection,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  // 失敗した転送試行の署名をログ出力
  console.log(
    "転送試行の署名:",
    base58.deserialize(transferResponse.signature)[0]
  );
})();
```
{% /totem-accordion  %}
{% /totem %}
