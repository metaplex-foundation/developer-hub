---
title: ボット対策のベストプラクティス
metaTitle: ボット対策のベストプラクティス | Core Candy Machine
description: 悪意のあるアクターを防ぎ、公平な配布を確保するためのCore Candy Machineミントに対するボット対策とセキュリティ対策の実装に関する包括的なガイド。
---

コミュニティへの公平な配布を確保するために、Core Candy Machineのローンチをボットや悪意のあるアクターから守ることは極めて重要です。このガイドでは、正当なユーザーに透明性を提供しながらミントの完全性を維持するために、成功したプロジェクトが使用する実績のある戦略と実装パターンを紹介します。{% .lead %}

## ボット対策が重要な理由

適切な保護がないと、ボットは以下のことができます：

- 一般ユーザーが参加する前に大量にミントする
- 予測可能なパターンを使用してレアアイテムを狙い撃ちする
- 自動化されたリクエストでインフラストラクチャを圧迫する
- 真のコミュニティメンバーに対して不公平な優位性を生む

このガイドで概説する戦略は連携して機能し、自動化されたシステムがミントを悪用することを極めて困難にする複数の保護層を作成しながら、正当なユーザーにとってスムーズな体験を維持します。

## メタデータの準備とアップロード戦略

#### 実際のメタデータの作成とアップロード

まず、予測可能なパターンではなく、トランザクションIDベースのURIで完全なコレクションメタデータを作成します。

##### 予測可能なURIの問題

多くのプロジェクトが、メタデータに対して予測可能で段階的なURIを使用するという間違いを犯します：

```
https://yourproject.com/metadata/0.json
https://yourproject.com/metadata/1.json
https://yourproject.com/metadata/2.json
```

このパターンにより、ボットは以下のことができます：

- ミント前にすべてのメタデータを事前取得する
- レアな特性を特定し、特定のインデックスをターゲットにする
- 既知のメタデータ配布に基づいて攻撃を計画する

##### 解決策：トランザクションIDベースのURIを持つアップロードサービス

ファイルをアップロードすると自動的にトランザクションIDベースのURIを生成するさまざまなアップロードサービスとSDKを使用できます。これにより、ランダムな識別子を手動で生成する必要がなくなり、真の予測不可能性が保証されます。

**UMI Uploaderの例（Irys/ArDrive Turboのラッパー）**
UMIの内蔵アップローダーは、**Irys**や**ArDrive Turbo**のようなサービスのラッパーです。これらのサービスと直接作業する複雑さを抽象化しながら、自動的にトランザクションIDベースのURIを生成します。

**UMI Uploaderを使用した例：**

```typescript
import fs from "fs";
import mime from "mime";
import { createGenericFile } from "@metaplex-foundation/umi";

const umi = // umiインスタンスをインポートまたは作成します。

// ファイルをアップロード - UMIが自動的に予測不可能なトランザクションIDを作成
async function uploadFiles(filePaths: string[]): Promise<string[]> {
  const files = filePaths.map((filePath) => {
    const file = fs.readFileSync(filePath);
    const mimeType = mime.getType(filePath);
    return createGenericFile(file, "file", {
      tags: mimeType ? [{ name: "content-type", value: mimeType }] : [],
    });
  });

  const uploadedUris = await umi.uploader.upload(files);
  
  // 追跡用に各アップロードされたURIをそのインデックスでログに記録
  uploadedUris.forEach((uri, index) => {
    console.log(`Uploaded file #${index} -> ${uri}`);
  });

  return uploadedUris;
}

// 重要：すべての返されたURIを保存する - リビールマッピングで必要になります！
const uploadedUris = await uploadFiles(allFilePaths);

// 結果：保存する必要がある自動的に予測不可能なURI
// uploadedUris[0] = "https://arweave.net/BrG44HdsEhzapvs8bEqzvkq4egwevS3fRE6kLuCyOdCd"
// uploadedUris[1] = "https://arweave.net/9jK3LpM7NqR5xY8vZ2BwC4tE6gH9sF1D3a7Q8eR2nM4K"  
// uploadedUris[2] = "https://arweave.net/5tH8GpN3MqL7wV9xB2CeD4yR6kJ1sK3F8gQ7eP5nL9M2"
// ... すべてのファイル用など

// 安全に保存 - これらを再生成することはできません！
// これらのURIは、UMI経由で基盤となるサービス（Irys/ArDrive Turbo）からのものです
fs.writeFileSync("./uploaded-uris.json", JSON.stringify(uploadedUris, null, 2));
await securelyStoreUris(uploadedUris);
```

**探索する他のアップロードサービス：**

- **Irys**：トランザクションIDを持つArweaveアップロード用の直接SDK
- **ArDrive**：組み込みのトランザクションID生成を持つArweaveベースのストレージ
- **IPFS**：Pinata、Infura、またはWeb3.Storageのようなサービス
- **AWS S3**：カスタムトランザクションID生成付き
- **カスタムソリューション**：ランダムID生成で独自のアップロードサービスを構築

{% callout %}
**UMIアップローダー機能についてのより詳細な情報については、[UMI Storage Documentation](/ja/dev-tools/umi/storage)を参照してください。**
{% /callout %}

#### プレースホルダーメタデータの作成

すべてのミントに最初に使用される単一のプレースホルダーメタデータファイルを作成します：

```json
{
  "name": "Mystery Asset",
  "description": "このアセットはミント完了後にリビールされます。各アセットは独特であり、その真の特性と希少性がまもなく公開されます！",
  "image": "https://yourproject.com/images/mystery-box.png",
  "attributes": [
    {
      "trait_type": "Status",
      "value": "Unrevealed"
    },
    {
      "trait_type": "Collection",
      "value": "Your Project Name"
    }
  ]
}
```

これを単一の予測可能なURIにアップロードします（任意のアップロードサービスを使用できます）：

```
https://yourproject.com/metadata/placeholder.json
```

**任意のアップロードソリューションの主要要件：**

- **トランザクションIDベースのURI**：予測不可能で非順次の識別子を確保
- **永続ストレージ**：不変ストレージを提供するサービスの使用（Arweave、IPFSなど）
- **URI保存**：リビールマッピング用に返されたURIを順番に常に保存
- **バッチ機能**：複数ファイルの効率的なアップロードをサポート

{% callout type="warning" %}
**重要な保存要件：** リビールメタデータをアップロードするときは、メタデータファイルに対応する正確な順序ですべての返されたURIを保存する必要があります。これらのURIは再生成できず、リビールマッピングプロセスに必須です。これらがなければ、アセットをリビールできません！
{% /callout %}

## セキュアマッピングの生成

#### ランダム化されたマッピングの作成

Candy Machineを設定する前に、どのミントインデックスがどの最終メタデータに対応するかを決定するセキュアマッピングを生成します。これが公平な配布を確保する重要なステップです。

```typescript
// Candy Machineを作成する前にセキュアマッピングを生成
function generateSecureMapping(totalSupply: number): number[] {
  // インデックスの配列を作成 [0, 1, 2, ..., totalSupply-1]
  const indices = Array.from({ length: totalSupply }, (_, i) => i);
  
  // 暗号的にセキュアなシャッフル（Fisher-Yates）を使用
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (2**32) * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  return indices;
}

// 例：4000 NFTコレクションの場合
const secureMapping = generateSecureMapping(4000);
// 結果：[2847, 91, 3756, 128, 2904, 567, ...]
// これは以下を意味します：
// - ミントインデックス0はメタデータインデックス2847としてリビールされる
// - ミントインデックス1はメタデータインデックス91としてリビールされる
// - ミントインデックス2はメタデータインデックス3756としてリビールされる
// など

// このマッピングを安全に保存 - これがリビールのキーです！
await storeMapping(secureMapping);
```

#### マッピングのセキュリティ要件

- **ミントローンチ前に生成** - これは後で変更できません
- **リビール時まで完全に秘密を保つ** マッピング
- **保存に暗号化を使用**（データベース暗号化、環境変数）
- **マッピング取得に厳格なアクセス制御を実装**
- **複数の場所にセキュアバックアップを作成**
- **監査目的でアクセスをログに記録**

{% callout type="warning" %}
**重要**：マッピングはミントローンチ前に生成して保護する必要があります。このマッピングが漏洩または紛失した場合、リビールプロセス全体が危険にさらされます。
{% /callout %}

## 透明な検証設定

#### ローンチ前のハッシュ生成

ローンチ前に、マッピングを明らかにすることなくその公平性を証明する検証ハッシュを生成します：

```typescript
// ミントローンチ前に検証ハッシュを生成
async function generateVerificationHashes(
  mapping: number[], 
  metadataFiles: string[], 
  uploadedUris: string[]
): Promise<{masterHash: string, metadataHashes: string[]}> {
  
  // 1. 各個別のメタデータファイルをハッシュ化
  const metadataHashes = metadataFiles.map(metadata => 
    crypto.createHash('sha256').update(metadata).digest('hex')
  );
  
  // 2. アップロードされたURIからトランザクションIDを抽出
  const transactionIds = uploadedUris.map(uri => {
    // URIからトランザクションIDを抽出（例：https://arweave.net/[ID]）
    return uri.split('/').pop();
  });
  
  // 3. 検証データ構造を作成
  const verificationData = mapping.map((finalIndex, mintIndex) => ({
    mintIndex,
    finalIndex,
    transactionId: transactionIds[finalIndex],
    metadataUri: uploadedUris[finalIndex],
    metadataHash: metadataHashes[finalIndex],
  }));
  
  // 4. 全体のマッピングのマスターハッシュを生成
  const masterHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(verificationData))
    .digest('hex');
    
  return { masterHash, metadataHashes };
}

const { masterHash, metadataHashes } = await generateVerificationHashes(
  secureMapping, 
  allMetadataFiles, 
  uploadedUris
);
```

#### 検証データの公開

**ミント開始前に**、この検証データを公開します：

```json
{
  "projectName": "Your Project",
  "totalSupply": 4000,
  "masterMappingHash": "a7b9c3d2e8f4g5h6i1j0k9l8m7n6o5p4q3r2s1t0u9v8w7x6y5z4",
  "metadataHashes": [
    "b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6",
    "c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7",
    // ... 4000のメタデータハッシュすべて
  ],
  "publishedAt": "2024-01-15T10:00:00Z",
  "verificationInstructions": "リビール後、メタデータハッシュがリビールされたインデックスに対して公開されたハッシュと一致することを検証してください"
}
```

以下で公開：

- あなたのウェブサイト
- 永続保存のためのIPFS
- 透明性のためのソーシャルメディア
- Discord/コミュニティチャンネル

## プレースホルダーによるConfig Line Settings

#### Candy Machineデータが公開され表示される理由

{% callout type="warning" %}
**重要なセキュリティ洞察：** すべてのCandy Machineデータはブロックチェーン上で公開表示されます。誰でもあなたのCandy Machineをクエリして、読み込んだすべてのメタデータURIを見ることができます。これが、プレースホルダーメタデータの使用がセキュリティに絶対に不可欠である理由です。
{% /callout %}

Candy Machineにアイテムを読み込むとき：

- **すべてのメタデータURIは**オンチェーンデータをクエリする誰にでも**即座に表示されます**
- **ボットは**実際のメタデータを直接読み込むと**即座にスクレイピング**できます
- **特性分析は**悪意のあるアクターにとって**簡単**になります
- **希少性狙い撃ち**がミント開始前でも可能になります

この公開の可視性こそが、プレースホルダー戦略が保護に重要である理由です。

#### Config Lines vs Hidden Settings

Candy Machineにアイテムを読み込む方法は2つあり、正しい方法を選ぶことがセキュリティに影響します：

**Hidden Settings：**

- 順次ミント：インデックス0、次に1、次に2など
- ユーザーは予測可能なプレースホルダーミント順序を得る
- マッピングは最終リビールをランダム化できるが、ミント順序自体は予測可能

**Config Lines（推奨）：**

- 予測不可能なプレースホルダーミントインデックス結果でより良いユーザー体験

#### プレースホルダーメタデータでのConfig Linesの使用

初期ミントフェーズ中にプレースホルダーメタデータを使用するようCore Candy Machineを設定し、潜在的に事前ランダム化された順序で：

```typescript
// オプション1：シンプルなプレースホルダーアプローチ
const items = Array.from({ length: 4000 }, (_, index) => ({
  name: `Mystery Asset #${index + 1}`,
  uri: "https://yourproject.com/placeholder.json"
}));

// オプション2：追加の予測不可能性のための事前ランダム化されたプレースホルダー順序
function createRandomizedPlaceholders(totalSupply: number): ConfigLine[] {
  const indices = Array.from({ length: totalSupply }, (_, i) => i);
  
  // ランダムなミント順序のためにインデックスをシャッフル
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  return indices.map((randomIndex, position) => ({
    name: `Mystery Asset #${position + 1}`,
    uri: "https://yourproject.com/placeholder.json"
  }));
}

const randomizedItems = createRandomizedPlaceholders(4000);

// プレースホルダーアイテムをCandy Machineに挿入
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: randomizedItems,
}).sendAndConfirm(umi);
```

**プレースホルダーメタデータ構造：**

```json
{
  "name": "Mystery Asset",
  "description": "このアセットはミント完了後にリビールされます。各アセットは独特であり、その真の特性と希少性がまもなく公開されます！",
  "image": "https://yourproject.com/images/mystery-box.png",
  "attributes": [
    {
      "trait_type": "Status", 
      "value": "Unrevealed"
    },
    {
      "trait_type": "Collection",
      "value": "Your Project Name"
    }
  ]
}
```

#### このアプローチの利点

1. **完全なメタデータプライバシー**：実際のメタデータURIはCandy Machineに決して現れません
2. **ボット保護**：ボットがリビール前に特性を分析する方法がありません
3. **公平な配布**：ミント順序さえもランダム化できます
4. **公開検証可能性**：プレースホルダーメタデータはプロジェクトが正当であることを示します
5. **コミュニティの興奮**：ミステリー要素が期待を構築します

{% callout %}
**注意：** プレースホルダーは信頼を構築するために魅力的で専門的である必要がありますが、最終的な特性、希少性、または実際のアセットの識別特性について一切の情報を含んではいけません。
{% /callout %}

## バックエンド制御によるミントトランザクション

#### Third-Party Signer戦略

フロントエンドクライアントが独自のミントトランザクションを生成することは決して許可しません。代わりに、必須のガードを持つすべてのミントトランザクションを作成し部分的に署名するバックエンドサービスを実装します。

#### バックエンドサービスのプラットフォーム推奨事項

**Next.js（ほとんどのプロジェクトに推奨）：**
Next.jsは、単一のフレームワークでフロントエンドとバックエンドの両方の機能を提供するため、NFTミントサイト作成で最も人気のあるプラットフォームです。組み込みのAPIルートにより、セキュアなミントエンドポイントを実装することが非常に簡単になります。

```typescript
// pages/api/mint.ts or app/api/mint/route.ts
// 組み込みバックエンド - 別のサーバーは不要！
```

**他のプラットフォームオプション：**

- **AWS Lambda**：インフラストラクチャ管理なしでミントバーストを処理するのに最適なサーバーレス関数
- **Vercel Functions**：Next.jsデプロイメントとシームレスに統合
- **Netlify Functions**：小規模プロジェクト用のシンプルなサーバーレスオプション
- **Railway/Render**：簡単なデプロイメントによるフルスタックホスティング
- **VPSでのExpress.js**：最大の制御のための従来のサーバーアプローチ
- **Cloudflare Workers**：グローバル低遅延ミント用のエッジコンピューティング

**ミントサイトにNext.jsが理想的な理由：**

- **統合バックエンド**：APIルートが組み込み、別のサーバー不要
- **簡単デプロイメント**：Vercel、Netlifyなどへのワンクリックデプロイメント
- **Reactフロントエンド**：ウォレット接続とミントUIに最適
- **大きなコミュニティ**：豊富なNFTプロジェクト例とリソース
- **パフォーマンス**：高速読み込みミントページのための組み込み最適化

##### セキュリティ用の必須ガード

バックエンドが生成したトランザクションに常に含める必要があるガード：

**1. Third Party Signer Guard**：バックエンドのみがミントを承認できることを保証

```typescript
const guards = {
  thirdPartySigner: {
    signerKey: backendSignerWallet.publicKey,
  },
  botTax: {
    lamports: sol(0.01), // 失敗した試行への税金
    lastInstruction: true,
  },
  solPayment: {
    lamports: sol(0.1), // ミント価格
    destination: treasuryWallet.publicKey,
  },
};
```

**2. Bot Tax Guard**：失敗したトランザクションに課金することでスパムの試行を阻止

##### バックエンドミントエンドポイントの実装

**Next.js APIルートの例：**

```typescript
// pages/api/mint.ts (Pages Router) or app/api/mint/route.ts (App Router)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. ユーザーを検証（レート制限、キャプチャなど）
    const { userWallet } = req.body;

    // 2. 必須ガードでミントトランザクションを生成
    // フロントエンドから追加のガード引数を提供する必要がある場合があります
    const mintTransaction = await mintV1(umi, {
      candyMachine: candyMachine.publicKey,
      asset: generateSigner(umi),
      minter: createNoopSigner(userWallet),
      mintArgs: {
        thirdPartySigner: {
          signer: backendSigner,
        },
      },
    }).buildWithLatestBlockhash(umi);;

    // 3. バックエンドサイナーで部分的に署名
    const signedTransaction = await backendSigner.signTransaction(mintTransaction);
    
    // 4. ユーザーがフロントエンドで署名するためのトランザクションを返す
    res.json({
      transaction: base64.encode(signedTransaction.serialize()),
      asset: mintTransaction.asset.publicKey.toString(),
    });

  } catch (error) {
    res.status(500).json({ error: 'Mint failed' });
  }
}
```

**代替：Express.js/AWS Lambda例：**

```typescript
// 従来のExpressまたはサーバーレス関数
app.post('/api/mint', async (req, res) => {
  try {
    // 1. ユーザーを検証（レート制限、キャプチャなど）
    const { userWallet, captchaToken } = req.body;

    // 2. 必須ガードでミントトランザクションを生成
    const mintTransaction = await mintV1(umi, {
      candyMachine: candyMachine.publicKey,
      asset: generateSigner(umi),
      minter: createNoopSigner(userWallet),
      mintArgs: {
        thirdPartySigner: {
          signer: backendSigner,
        },
      },
    }).buildWithLatestBlockhash(umi);

    // 3. バックエンドサイナーで部分的に署名
    const signedTransaction = await backendSigner.signTransaction(mintTransaction);
    
    // 4. ユーザーが完了するためのトランザクションを返す
    res.json({
      transaction: base64.encode(signedTransaction.serialize()),
      asset: mintTransaction.asset.publicKey.toString(),
    });

  } catch (error) {
    res.status(500).json({ error: 'Mint failed' });
  }
});
```

#### プラットフォーム別のデプロイメント考慮事項

**Next.jsデプロイメント：**

- **Vercel**：ゼロ設定デプロイメント、Next.jsに最適
- **Netlify**：同様の使いやすさを持つ素晴らしい代替案
- **Railway**：データベースを含むフルスタックホスティング

**サーバーレスデプロイメント：**

- **AWS Lambda**：Serverless FrameworkまたはAWS CDKを使用
- **Cloudflare Workers**：グローバルエッジデプロイメント
- **Vercel Functions**：Next.jsデプロイメントと自動統合

**従来のサーバー：**

- **Railway/Render**：簡単なコンテナデプロイメント
- **DigitalOcean/Linode**：DockerでのVPS
- **AWS EC2**：完全な制御だがより多くのセットアップが必要

{% callout type="warning" %}
**重要なセキュリティ注意**：トランザクションが署名されると、それを変更することはできません。third-party signerガードは、バックエンドの制御外で誰も有効なミントトランザクションを生成できないことを保証します。
{% /callout %}

## ミント後のメタデータ更新（リビール）

#### リビールプロセス

ミント完了後、セキュアマッピングを使用して各アセットのメタデータをプレースホルダーから最終メタデータに更新するリビールメカニズムを実装します。リビールプロセスを処理する主な戦略は3つあります：

##### 戦略1：インスタントリビール

インスタントリビールでは、各NFTはミントトランザクション完了直後に最終メタデータに更新されます。これにより、ユーザーに即座の満足感を提供しますが、より複雑なバックエンドインフラストラクチャが必要です。

**プロセス：**

1. ユーザーがアセットをミント（プレースホルダーメタデータを取得）
2. バックエンドが即座にセキュアマッピングでミントインデックスを検索
3. バックエンドが保存されたアップロードリストから最終メタデータURIでアセットを更新
4. ユーザーがリビールされたアセットを即座に受け取り

**長所：**

- 即座のユーザー満足
- リビールの待機期間なし
- よりシンプルなユーザー体験

**短所：**

- より複雑なバックエンド実装
- 失敗したリビールに対する堅牢なエラー処理が必要

##### 戦略2：イベントリビール（プロジェクト制御）

イベントリビールでは、すべてのアセットがミント後もプレースホルダーのまま残り、プロジェクトが予め決められた時刻にすべてのNFTを一度にリビールします。これにより、ユーザーの操作を必要としないコミュニティ全体のリビールイベントが作成されます。

**プロセス：**

1. ユーザーがアセットをミント（プレースホルダーメタデータを取得）
2. アセットはプロジェクトリビールイベントまでプレースホルダーのまま
3. プロジェクトバックエンドが予定された時刻にセキュアマッピングを使用してすべてのアセットを処理
4. すべてのアセットが同時に最終メタデータに更新される

**長所：**

- よりシンプルなミントプロセス
- コミュニティ全体のリビール興奮を創造
- 最適なタイミングでスケジュール可能（例：コミュニティイベント中）
- ユーザーの操作不要

**短所：**

- ユーザーはリビールを待つ必要がある
- 別のリビールインフラストラクチャが必要
- リビール期待の管理が必要

##### 戦略3：ユーザートリガーリビール

ユーザートリガーリビールでは、ユーザーがインタラクティブUIを通じて自分のNFTをリビールできます。各ユーザーが自分のアセットがいつリビールされるかを制御しますが、リビールは依然としてセキュアマッピングを使用します。

**プロセス：**

1. ユーザーがアセットをミント（プレースホルダーメタデータを取得）
2. ユーザーがリビールを選択するまでアセットはプレースホルダーのまま
3. ユーザーがリビールウェブサイトを訪問し、特定のアセットのリビールをトリガー
4. バックエンドがセキュアマッピングでアセットのミントインデックスを検索
5. アセットが最終メタデータに更新される

**長所：**

- ユーザーが自分のリビールタイミングを制御
- インタラクティブなコミュニティエンゲージメントを作成
- ユーザーに選択権を与えながら期待を構築
- より低い即時のトランザクション費用

**短所：**

- より複雑なUI/UX実装
- リビール完了にユーザーの行動が必要
- ユーザーが参加しない場合、不完全なリビールの可能性

##### 戦略の選択

**以下の場合はインスタントリビールを選択：**

- 即座のユーザー満足を望む
- バックエンドが複雑さを処理できる
- リビール関連のサポート問題を避けたい

**以下の場合はイベントリビールを選択：**

- コミュニティ全体のリビール興奮を作りたい
- よりシンプルなミントインフラストラクチャを好む
- リビールタイミングを制御したい
- コミュニティイベント中にリビールをスケジュールしたい

**以下の場合はユーザートリガーリビールを選択：**

- ユーザーにリビールタイミングの制御を与えたい
- インタラクティブなコミュニティエンゲージメントを作りたい
- リビールUI/UXのリソースがある
- ユーザーに選択権を与えながら期待を構築したい

3つの戦略すべてが同じセキュリティ利点を提供します - 主な違いは、ユーザー体験、実装の複雑さ、コミュニティエンゲージメントアプローチです。

##### 実装リファレンス

実際のアセット更新実装については、UMIを使用してアセットメタデータ、名前、URIを更新する方法を説明する[Core Asset Update documentation](/ja/smart-contracts/core/update)を参照してください。

リビールプロセスは、セキュアマッピングを使用してどの最終メタデータURIが各ミントされたアセットに対応するかを決定し、その後Coreのアップデートファンクションaﾘﾃｨーｷﾍﾅｱｾｯﾄを更新します。

##### リビール後の検証

リビール完了後、完全なマッピングを公開して、コミュニティがプロセスの公平性を検証できるようにします：

```typescript
// リビール後に完全なマッピングを公開
const fullMappingData = {
  projectName: "Your Project",
  totalSupply: 4000,
  revealDate: "2024-01-20T15:30:00Z",
  mapping: secureMapping.map((finalIndex, mintIndex) => ({
    mintIndex,
    finalIndex,
    transactionId: uploadedUris[finalIndex].split('/').pop(),
    metadataUri: uploadedUris[finalIndex]
  })),
  masterHash: masterHash, // ローンチ前検証から
  verificationInstructions: "以下の検証関数を使用してアセットを確認してください"
};

// IPFS、ウェブサイト、コミュニティチャンネルに公開
await publishMapping(fullMappingData);
```

**コミュニティ用の検証関数：**

```typescript
// ユーザーがアセットを検証するために実行できる検証関数
function verifyAssetMapping(
  mintIndex: number,
  finalIndex: number,
  receivedMetadata: string,
  publishedHashes: string[]
): boolean {
  // 1. 受信したメタデータをハッシュ化
  const metadataHash = crypto
    .createHash('sha256')
    .update(receivedMetadata)
    .digest('hex');
  
  // 2. 公開されたハッシュと照合
  const expectedHash = publishedHashes[finalIndex];
  
  // 3. マッピングが正しいことを検証
  return metadataHash === expectedHash;
}

// ユーザー用の使用例
const isValid = verifyAssetMapping(
  0, // 彼らのミントインデックス
  2847, // リビールされた最終インデックス
  theirMetadataJson, // 彼らが受け取ったメタデータ
  publishedMetadataHashes // ミント前に公開されたハッシュ
);

console.log(`Asset verification: ${isValid ? 'VALID' : 'INVALID'}`);
```

## 追加のセキュリティ考慮事項

#### レート制限と監視

```typescript
// ウォレットごとのレート制限を実装
const mintAttempts = new Map<string, number>();

function checkRateLimit(wallet: string): boolean {
  const attempts = mintAttempts.get(wallet) || 0;
  return attempts < MAX_ATTEMPTS_PER_HOUR;
}

// 疑わしいパターンを監視
function detectSuspiciousActivity(requests: MintRequest[]): boolean {
  // 同一のタイミングパターンをチェック
  // 複数ウォレットからの連続リクエストを検出
  // 同一メタデータでのリクエストにフラグ
  return false; // 検出ロジックを実装
}
```

#### インフラストラクチャ保護

- **メタデータエンドポイントにCDN保護を使用**
- **すべてのミントリクエストにCAPTCHAを実装**（hCaptcha、reCAPTCHA）
- **バックエンドサービスにDDoS保護を設定**
- **異常な活動のトランザクションパターンを監視**
- **高トラフィックイベント用のバックアップインフラストラクチャを準備**
- **すべての機密キーとエンドポイントに環境変数を使用**
- **APIエンドポイント用の適切なCORSポリシーを実装**

#### プラットフォーム固有のセキュリティヒント

**Next.jsセキュリティ：**

```typescript
// express-rate-limitでレート制限を実装
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // 各IPをwindowMsごとに5リクエストに制限
});

// APIルート用のミドルウェアを使用
export default limiter(handler);
```

**サーバーレスセキュリティ：**

- **AWS Lambda**：ハードコードされた認証情報ではなくIAMロールを使用
- **Vercel**：環境変数とエッジ設定を使用
- **Cloudflare Workers**：レート制限にKVストレージを活用

{% callout type="warning" %}
**記憶**：単一のセキュリティ対策が万全というものはありません。これらすべての戦略の組み合わせが、コミュニティにとって公平な体験を維持しながら、自動化された悪用に対する堅牢な防御を作成します。
{% /callout %}

## 完全なプロセスの概要

順序通りの完全なボット対策ワークフローを示します：

1. **📁 メタデータ準備**：実際のメタデータファイルを作成し、トランザクションID URIで選択したサービス経由でアップロード + プレースホルダーメタデータを作成
2. **🎯 マッピング生成**：ミントインデックスを最終メタデータインデックスに接続するセキュアランダムマッピングを生成
3. **🔒 検証設定**：マッピングを明かすことなく公平性を証明するハッシュを作成・公開
4. **⚙️ Candy Machine設定**：config linesでプレースホルダーメタデータを使用してデプロイ
5. **🛡️ バックエンド保護**：必須のthird-party signerとbot taxガードによりバックエンド経由ですべてのミントを制御
6. **🎭 リビールプロセス**：セキュアマッピングを使用してすべてのアセットをプレースホルダーから実際のメタデータに更新
7. **✅ コミュニティ検証**：完全なマッピングを公開し、ユーザーがアセットを検証するためのツールを提供

## 結論

包括的なボット対策の実装には、ミントインフラストラクチャの複数の層にわたる慎重な計画と実行が必要です。このガイドで概説された時系列アプローチにより、各ステップが前のステップに基づいて構築され、堅牢な防御システムを作成することが保証されます。

**主な成功要因：**

- **準備が全て**：ローンチ前にマッピングと検証ハッシュを生成
- **バックエンド制御が重要**：クライアントに独自のミントトランザクションを生成させることは決してありません
- **透明性が信頼を築く**：ミント前に検証データを公開し、リビール後に完全なマッピングを公開
- **徹底的にテスト**：メインネットローンチ前にdevnetで全体フローを検証

この構造化されたアプローチに従うことで、正当なコミュニティメンバーにとって完全な透明性と公平性を維持しながら、自動化されたシステムがミントを悪用することを極めて困難にする複数の保護層を作成します。

決意のある攻撃者は常に弱点を探すことを覚えておいてください。新しい攻撃ベクトルについて情報を得て、継続的に防御を改善することが長期的な成功には不可欠です。
