---
title: 初回ハイブリッドコレクションの作成
metaTitle: 初回ハイブリッドコレクションの作成 | Hybridガイド
description: ハイブリッドコレクションをエンドツーエンドで作成する方法を学びましょう！
# /components/guides/index.jsの日付も更新することを忘れずに
created: '09-17-2024'
updated: '09-17-2024'
---

このガイドでは、**ハイブリッドコレクション**を完全にエンドツーエンドで作成する方法を実演します。必要なすべてのアセットを作成する方法から、エスクローの作成、代替可能トークンから非代替可能トークンへのスワップ、およびその逆のパラメータ設定まで！

{% callout title="MPL-Hybridとは何ですか？" %}

MPL-Hybridは、デジタルアセット、web3ゲーム、オンチェーンコミュニティのための新しいモデルです。このモデルの中核は、固定数の代替可能アセットと非代替可能アセットを相互に取引するスワッププログラムです。

{% /callout %}

## 前提条件

- 任意のコードエディタ（**Visual Studio Code**推奨）
- Node **18.x.x**以上。

## 初期セットアップ

このガイドでは、Javascriptを使用してハイブリッドコレクションを作成する方法を教えます！あなたのニーズに合わせて機能を変更・移動する必要があるかもしれません。

### プロジェクトの初期化

任意のパッケージマネージャー（npm、yarn、pnpm、bun）で新しいプロジェクトを初期化し（オプション）、プロンプトが表示されたら必要な詳細を入力します。

```js
npm init
```

### 必要なパッケージ

このガイドに必要なパッケージをインストールします。

{% packagesUsed packages=["umi", "umiDefaults", "core", "@metaplex-foundation/mpl-hybrid", "tokenMetadata" ] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-core
```

```js
npm i @metaplex-foundation/mpl-hybrid
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

## 準備

代替可能トークンを非代替可能トークン（NFT）に交換したりその逆を促進するMPL-Hybridプログラムのエスクローを設定する前に、Core NFTのコレクションと代替可能トークンの両方が既にミントされている必要があります。

これらの前提条件のいずれかが不足している場合でも心配いりません！各ステップを進めるために必要なすべてのリソースを提供します。

**注意**: 動作するためには、エスクローにNFT、代替可能トークン、またはその両方の組み合わせで資金提供する必要があります。エスクローのバランスを維持する最も簡単な方法は、一方のタイプのアセットで完全に満たし、もう一方を配布することです！

### NFTコレクションの作成

MPL-Hybridプログラムでメタデータランダム化機能を利用するには、オフチェーンメタデータURIが一貫した増分構造に従う必要があります。このため、TurboSDKと組み合わせてArweaveの[パスマニフェスト](https://cookbook.arweave.dev/concepts/manifests.html)機能を使用します。

マニフェストにより、複数のトランザクションを単一のベーストランザクションID下でリンクし、人間が読める形式のファイル名を割り当てることができます：
- https://arweave.net/manifestID/0.json
- https://arweave.net/manifestID/1.json
- ...
- https://arweave.net/manifestID/9999.json

決定論的URIの作成に慣れていない場合は、詳細な手順について[このガイド](/ja/guides/general/create-deterministic-metadata-with-turbo)に従ってください。さらに、Hybridプログラムが機能するために必要な[コレクション](/ja/core/guides/javascript/how-to-create-a-core-collection-with-javascript)と[アセット](/ja/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)の作成手順を見つけることができます。

**注意**: 現在、MPL-Hybridプログラムは提供されたmin/maxURIインデックス間の数をランダムに選択し、URIが既に使用されているかをチェックしません。そのため、スワッピングは[誕生日パラドックス](https://betterexplained.com/articles/understanding-the-birthday-paradox/)の影響を受けます。プロジェクトが十分なスワップランダム化の恩恵を受けるため、ランダムに選択できる最低250kのアセットメタデータを準備してアップロードすることをお勧めします。利用可能な潜在的アセットが多いほど良いです！

### 代替可能トークンの作成

MPL-Hybridエスクローには、NFTのリリースを償還または支払うために使用できる関連代替可能トークンが必要です。これは、既にミントされて流通している既存のトークンでも、完全に新しいトークンでも構いません！

トークンの作成に慣れていない場合は、[このガイド](/ja/guides/javascript/how-to-create-a-solana-token)に従って、Solanaで独自の代替可能トークンをミントする方法を学ぶことができます。

## エスクローの作成

**NFTコレクションとトークンの両方を作成した後、ついにエスクローを作成してスワッピングを開始する準備が整いました！**

しかし、MPL-Hybridに関する関連情報に飛び込む前に、ガイド中に複数回実行することになるので、Umiインスタンスの設定方法を学ぶことをお勧めします。

### Umiの設定

Umiを設定する際、さまざまなソースからキーペア/ウォレットを使用または生成できます。テスト用に新しいウォレットを作成し、ファイルシステムから既存のウォレットをインポートするか、ウェブサイト/dAppを作成している場合は`walletAdapter`を使用できます。

**注意**: この例では`generatedSigner()`でUmiを設定しますが、以下のすべての可能な設定を見つけることができます！

{% totem %}

{% totem-accordion title="新しいウォレットで" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// これはテスト用にdevnetのみでSOLをエアドロップします。
console.log('アイデンティティに1 SOLをエアドロップしています')
umi.rpc.airdrop(umi.identity.publicKey, sol(1));
```

{% /totem-accordion %}

{% totem-accordion title="既存のウォレットで" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')

// 使用したいウォレットを読み込むためにfsを使用し、
// 相対パスでファイルシステムをナビゲートする必要があります。
const walletFile = fs.readFileSync('./keypair.json')
  

// walletFileをキーペアに変換します。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// キーペアをumiに読み込みます。
umi.use(keypairIdentity(keypair));
```

{% /totem-accordion %}

{% totem-accordion title="ウォレットアダプタで" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')
// ウォレットアダプタをUmiに登録
.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

**注意**: `walletAdapter`セクションは、`walletAdapter`を既にインストールして設定していることを前提として、Umiに接続するために必要なコードのみを提供しています。包括的なガイドについては、[これ](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)を参照してください

### パラメータの設定

Umiインスタンスを設定した後、次のステップはMPL-Hybridエスクローに必要なパラメータを設定することです。

エスクロー契約の一般設定を定義することから始めます：

```javascript
// エスクロー設定 - これらをあなたのニーズに変更してください
const name = "MPL-404 Hybrid Escrow";                       
const uri = "https://arweave.net/manifestId";               
const max = 15;                                             
const min = 0;                                              
const path = 0;                                             
```

| パラメータ     | 説明                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| **Name**      | エスクロー契約の名前（例："MPL-404 Hybrid Escrow"）。             |
| **URI**       | NFTコレクションのベースURI。これは決定論的メタデータ構造に従う必要があります。 |
| **Max & Min** | コレクションのメタデータの決定論的URIの範囲を定義します。 |
| **Path**      | 2つのパス間で選択：`0`はスワップ時にNFTメタデータを更新、`1`はスワップ後もメタデータを変更しません。 |

次に、エスクローに必要なキーアカウントを設定します：

```javascript
// エスクローアカウント - これらをあなたのニーズに変更してください
const collection = publicKey('<YOUR-COLLECTION-ADDRESS>'); 
const token = publicKey('<YOUR-TOKEN-ADDRESS>');           
const feeLocation = publicKey('<YOUR-FEE-ADDRESS>');        
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
]);                                                        
```

| アカウント           | 説明                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Collection**    | スワップされるコレクション。これはNFTコレクションのアドレスです。 |
| **Token**         | スワップされるトークン。これは代替可能トークンのアドレスです。 |
| **Fee Location**  | スワップからの手数料が送信されるアドレス。 |
| **Escrow**        | 派生エスクローアカウント。スワッププロセス中にNFTとトークンを保持する責任があります。 |

最後に、トークン関連のパラメータを定義し、小数点用にトークン量を調整する`addZeros()`ヘルパー関数を作成します：

```javascript
// トークンスワップ設定 - これらをあなたのニーズに変更してください
const tokenDecimals = 6;                                    
const amount = addZeros(100, tokenDecimals);                
const feeAmount = addZeros(1, tokenDecimals);               
const solFeeAmount = addZeros(0, 9);                       

// 数値にゼロを追加する関数、小数点の正しい数を追加するために必要
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros)
}
```

| パラメータ         | 説明                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Amount**         | スワップ中にユーザーが受け取るトークンの量、小数点で調整済み。 |
| **Fee Amount**     | NFTにスワップする際にユーザーが支払うトークン手数料の量。       |
| **Sol Fee Amount** | NFTにスワップする際に請求される追加手数料（SOL単位）、Solanaの9桁小数点で調整済み。 |

### エスクローの初期化

設定したすべてのパラメータと変数を渡して、`initEscrowV1()`メソッドを使用してエスクローを初期化できるようになりました。これにより独自のMPL-Hybridエスクローが作成されます。

```javascript
const initEscrowTx = await initEscrowV1(umi, {
  name,
  uri,
  max,
  min,
  path,
  escrow,
  collection,
  token,
  feeLocation,
  amount,
  feeAmount,
  solFeeAmount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(initEscrowTx.signature)[0]
console.log(`Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
```

**注意**: 前述の通り、単純にエスクローを作成するだけでは、スワッピングに「準備完了」にはなりません。エスクローにNFTまたはトークン（またはその両方）を投入する必要があります。**方法は次のとおりです**：

{% totem %}

{% totem-accordion title="エスクローへのアセットの送信" %}

```javascript
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import {
  MPL_HYBRID_PROGRAM_ID,
  mplHybrid,
} from "@metaplex-foundation/mpl-hybrid";
import { readFileSync } from "fs";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";
import { transfer } from "@metaplex-foundation/mpl-core";

(async () => {
  const collection = publicKey("<COLLECTION>"); // スワップ対象のコレクション
  const asset = publicKey("<NFT MINT>"); // 送信したいNFTのミントアドレス

  const umi = createUmi("<ENDPOINT>").use(mplHybrid()).use(mplTokenMetadata());

  const wallet = "<path to wallet>"; // ファイルシステムウォレットへのパス
  const secretKey = JSON.parse(readFileSync(wallet, "utf-8"));

  // 秘密鍵からキーペアを作成
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  );
  umi.use(keypairIdentity(keypair));

  // エスクローを派生
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(collection),
  ])[0];

  // アセットを転送
  const transferAssetTx = await transfer(umi, {
    asset,
    collection,
    newOwner: escrow,
  }).sendAndConfirm(umi);
})();

```

{% /totem-accordion %}

{% totem-accordion title="エスクローへの代替可能トークンの送信" %}

```javascript
import {
  keypairIdentity,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  transferTokens,
} from "@metaplex-foundation/mpl-toolbox";
import {
  MPL_HYBRID_PROGRAM_ID,
  mplHybrid,
} from "@metaplex-foundation/mpl-hybrid";
import { readFileSync } from "fs";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";

(async () => {
  const collection = publicKey("<COLLECTION>"); // スワップ対象のコレクション
  const token = publicKey("<TOKEN MINT>"); // スワップ対象のトークン

  const umi = createUmi("<ENDPOINT>").use(mplHybrid()).use(mplTokenMetadata());

  const wallet = "<path to wallet>"; // ファイルシステムウォレットへのパス
  const secretKey = JSON.parse(readFileSync(wallet, "utf-8"));

  // 秘密鍵からキーペアを作成
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  );
  umi.use(keypairIdentity(keypair));

  // エスクローを派生
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(collection),
  ])[0];

  // 代替可能トークンを転送（必要に応じてATAを作成後）
  const transferTokenTx = await transactionBuilder()
    .add(
      createTokenIfMissing(umi, {
        mint: token,
        owner: escrow,
      })
    )
    .add(
      transferTokens(umi, {
        source: findAssociatedTokenPda(umi, {
          mint: token,
          owner: umi.identity.publicKey,
        }),
        destination: findAssociatedTokenPda(umi, {
          mint: token,
          owner: escrow,
        }),
        amount: 300000000,
      })
    )
    .sendAndConfirm(umi);
})();

```
{% /totem-accordion %}

{% /totem %}

### 完全なコード例

エスクロー作成の完全なコードを単純にコピー＆ペーストしたい場合は、こちらです！

{% totem %}

{% totem-accordion title="完全なコード例" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey, signerIdentity, generateSigner, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, initEscrowV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { string, base58, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'

(async () => {
  /// ステップ1: Umiのセットアップ
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  /// ステップ2: エスクローのセットアップ

  // エスクロー設定 - これらをあなたのニーズに変更してください
  const name = "MPL-404 Hybrid Escrow";                       // エスクローの名前
  const uri = "https://arweave.net/manifestId";               // コレクションのベースURI
  const max = 15;                                             // 最大URI
  const min = 0;                                              // 最小URI
  const path = 0;                                             // 0: スワップ時にNftを更新、1: スワップ時にNftを更新しない

  // エスクローアカウント - これらをあなたのニーズに変更してください
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // スワップ対象のコレクション
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // スワップ対象のトークン
  const feeLocation = publicKey('<YOUR-FEE-ADDRESS>');        // 手数料が送信されるアドレス
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);                                                         // 派生エスクローアカウント

  // トークンスワップ設定 - これらをあなたのニーズに変更してください
  const tokenDecimals = 6;                                    // トークンの小数点以下桁数
  const amount = addZeros(100, tokenDecimals);                // スワップ時にユーザーが受け取る金額
  const feeAmount = addZeros(1, tokenDecimals);               // NFTにスワップする際にユーザーが支払う手数料金額
  const solFeeAmount = addZeros(0, 9);                        // NFTにスワップする際に支払う追加手数料（Solは9桁小数点）

  /// ステップ3: エスクローの作成
  const initEscrowTx = await initEscrowV1(umi, {
    name,
    uri,
    max,
    min,
    path,
    escrow,
    collection,
    token,
    feeLocation,
    amount,
    feeAmount,
    solFeeAmount,
  }).sendAndConfirm(umi);

  const signature = base58.deserialize(initEscrowTx.signature)[0]
  console.log(`Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
})()

// 数値にゼロを追加する関数、小数点の正しい数を追加するために必要
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros)
}
```

{% /totem-accordion %}

{% /totem %}

## キャプチャ & リリース

### アカウントの設定

Umiを設定した後（[前のセクション](#umiの設定)で行ったように）、次のステップは`キャプチャ` & `リリース`プロセスに必要なアカウントを設定することです。これらのアカウントは以前に使用したものと似ており親しみやすく、両方の指示で同じです：

```javascript
// ステップ2: エスクローアカウント - これらをあなたのニーズに変更してください
const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');
const token = publicKey('<YOUR-TOKEN-ADDRESS>');
const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
]);
```

**注意**: `feeProjectAccount`は最後のスクリプトの`feeLocation`フィールドと同じです。

### キャプチャ/リリースするアセットの選択

キャプチャおよびリリースするアセットの選択方法は、エスクロー作成時に選択したパスによります：
- **パス0**: パスが`0`に設定されている場合、NFTメタデータはスワップ中に更新されるため、これは関係ないのでエスクローからランダムなアセットを取得できます。
- **パス1**: パスが`1`に設定されている場合、NFTメタデータはスワップ後も同じままなので、ユーザーにスワップしたい特定のNFTを選択させることができます。

**キャプチャの場合**

NFTをキャプチャしている場合、エスクローが所有するランダムなアセットを選択する方法は次のとおりです：

```javascript
// コレクション内のすべてのアセットを取得
const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
})

// エスクローが所有するアセットを検索
const asset = assetsListByCollection.filter(
    (a) => a.owner === publicKey(escrow)
)[0].publicKey
```

**リリースの場合**

NFTをリリースしている場合、通常はリリースしたいNFTをユーザーが選択します。しかし、この例では、ユーザーが所有するランダムなアセットを選択します：

```javascript
// コレクション内のすべてのアセットを取得
const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
})

// 通常はユーザーが交換対象を選択します
const asset = assetsListByCollection.filter(
    (a) => a.owner === umi.identity.publicKey
)[0].publicKey
```

### キャプチャ（代替可能から非代替可能）

最後に、キャプチャ指示について話しましょう。これは代替可能トークンをNFTにスワップするプロセスです（スワップに必要なトークン量はエスクロー作成時に設定されます）。

```javascript
// 代替可能トークンをスワップしてNFTをキャプチャ
const captureTx = await captureV1(umi, {
  owner: umi.identity.publicKey,
  escrow,
  asset,
  collection,
  token,
  feeProjectAccount,
  amount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(captureTx.signature)[0];
console.log(`Captured! Check it out: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

### リリース（非代替可能から代替可能）

リリースはキャプチャの反対です—ここではNFTを代替可能トークンにスワップします：

```javascript
// NFTをリリースして代替可能トークンを受け取る
const releaseTx = await releaseV1(umi, {
  owner: umi.payer,
  escrow,
  asset,
  collection,
  token,
  feeProjectAccount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(releaseTx.signature)[0];
console.log(`Released! Check it out: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

### 完全なコード例

`キャプチャ`と`リリース`の完全なコードは次のとおりです

{% totem %}

{% totem-accordion title="キャプチャ" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, captureV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58, string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'

(async () => {
  /// ステップ1: Umiのセットアップ
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  // ステップ2: エスクローアカウント - これらをあなたのニーズに変更してください
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // スワップ対象のコレクション
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // スワップ対象のトークン
  const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');  // 手数料が送信されるアドレス
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);                    

  // コレクション内のすべてのアセットを取得
  const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
  })

  // エスクローが所有するアセットを検索
  const asset = assetsListByCollection.filter(
    (a) => a.owner === publicKey(escrow)
  )[0].publicKey

  /// ステップ3: アセットを"キャプチャ"（代替可能から非代替可能にスワップ）
  const captureTx = await captureV1(umi, {
    owner: umi.payer,
    escrow,
    asset,
    collection,
    token,
    feeProjectAccount,
  }).sendAndConfirm(umi)
  const signature = base58.deserialize(captureTx.signature)[0]
  console.log(`Captured! https://explorer.solana.com/tx/${signature}?cluster=devnet`)})();
```

{% /totem-accordion %}

{% totem-accordion title="リリース" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, releaseV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58, string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'

import walletFile from "/Users/leo/.config/solana/id.json";

(async () => {
  /// ステップ1: Umiのセットアップ
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  // ステップ2: エスクローアカウント - これらをあなたのニーズに変更してください
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // スワップ対象のコレクション
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // スワップ対象のトークン
  const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');  // 手数料が送信されるアドレス
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);                  

  // コレクション内のすべてのアセットを取得
  const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
  })

  // 通常はユーザーが交換対象を選択します
  const asset = assetsListByCollection.filter(
    (a) => a.owner === umi.identity.publicKey
  )[0].publicKey

  /// ステップ3: アセットを"リリース"（非代替可能から代替可能にスワップ）
  const releaseTx = await releaseV1(umi, {
    owner: umi.payer,
    escrow,
    asset,
    collection,
    token,
    feeProjectAccount,
  }).sendAndConfirm(umi)
  
  const signature = base58.deserialize(releaseTx.signature)[0]
  console.log(`Released! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
})();
```

{% /totem-accordion %}

{% /totem %}