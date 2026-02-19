---
# remember to update dates also in /components/products/guides/index.js
title: Turboを使用した決定論的メタデータの作成
metaTitle: Turboを使用した決定論的メタデータの作成 | 一般ガイド
description: Arweaveベースのアップロードを行うTurbo SDKを活用して決定論的メタデータを作成する方法を学習します。
created: '10-19-2024'
updated: '10-19-2024'
keywords:
  - deterministic metadata
  - Turbo SDK
  - Arweave upload
  - path manifest
  - NFT metadata
about:
  - deterministic metadata
  - Turbo SDK
  - Arweave uploads
  - path manifests
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
howToSteps:
  - Prepare metadata files in a folder with incremental naming (0.json, 1.json, etc.)
  - Install and configure the Turbo SDK with Solana as the payment token
  - Calculate the required lamports for uploading the metadata folder
  - Top up the wallet with Winc if needed using topUpWithTokens
  - Upload the metadata folder using uploadFolder to get a manifest ID
howToTools:
  - Turbo SDK
  - Arweave
---

MPL-Hybridプログラムでメタデータのランダム化機能を利用するには、オフチェーンメタデータのURIが一貫性があり、段階的な構造に従う必要があります。これを達成するために、ArweaveとTurbo SDKの[パスマニフェスト](https://cookbook.arweave.dev/concepts/manifests.html)機能を使用します。**このガイドでは、その設定方法をデモンストレーションします！**

{% callout title="Turboとは" %}

Turboは、Arweaveとの間でデータの資金調達、インデックス作成、送信を合理化する超高スループットのPermaweb サービスです。クレジットカードやデビットカードでの法定通貨による支払いオプション、およびETH、SOL、ARなどの暗号通貨のグラフィカルおよびプログラマティックインターフェースを提供します。

{% /callout %}

## 前提条件

### 必要なパッケージ

{% packagesUsed packages=[ "@ardrive/turbo-sdk" ] type="npm" /%}

このガイドに必要なパッケージをインストールしてください。

```js
npm i @ardrive/turbo-sdk
```

### メタデータフォルダ

この例では、決定論的な方法でメタデータをアップロードする方法を示します。そのためには、開始前にすべてのアセットを準備する必要があります。

メタデータを生成するには、[これらの方法のいずれか](/ja/smart-contracts/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine#image-and-metadata-generators)を使用し、0から始まる増分命名規則に従ってメタデータを保存します：

```
metadata/
├─ 0.json
├─ 1.json
├─ 2.json
├─ ...
```

**注意**: メタデータを作成する際は、[NFTの適切なJSONスキーマ](/ja/smart-contracts/token-metadata/token-standard#the-non-fungible-standard)に従うことを確認してください！

## Turboのセットアップ

Turboは複数のトークンとチェーンに対応しているため、このガイドではSolanaをトークンとして使用するようにTurboインスタンスを設定する必要があります。これは、`TurboFactory.authenticated()`メソッドを呼び出し、Solana固有の設定オプションを渡すことで行います。

```javascript
import { TurboFactory } from '@ardrive/turbo-sdk';

// アップロードの支払いに使用するkeypair.jsonファイルを
// ここでインポートします
import secretKey from "/path/to/your/keypair.json";

const turbo = TurboFactory.authenticated({
  privateKey: bs58.encode(Uint8Array.from(secretKey)),
  token: 'solana',
  gatewayUrl: `https://api.devnet.solana.com`,
  paymentServiceConfig: { url: "https://payment.ardrive.dev" },
  uploadServiceConfig: { url: "https://upload.ardrive.dev" },
});
```

**注意**: この例では、devnetで動作するように環境を設定したいため、`gatewayUrl`、`paymentServiceConfig`、`uploadServiceConfig`を明示的に提供しています。メインネットでの使用では、これらのフィールドを空のままにすることができ、Turboはデフォルトでメインネットのエンドポイントを使用します。

## メタデータのアップロード

Turboは、`TurboAuthenticatedClient.uploadFolder()`関数を使用してメタデータフォルダ全体をアップロードするプロセスを簡素化します。この関数はデフォルトでマニフェストをサポートしており、メタデータ作成とエスクローセットアップに使用できるマニフェストIDを`metadataUploadResponse.manifestResponse?.id`経由で返します。

プロセスを簡素化するために、このガイドでは全体のワークフローを処理する`uploadMetadata()`というヘルパー関数を提供します。

```javascript
const metadataUploadResponse = await uploadMetadata(turbo);
```

**`uploadMetadata()`ヘルパーのステップ**

1. `calculateRequiredLamportsForUpload()`を呼び出してアップロードに必要なlamportを決定します。これはアップロードコストをWinc（Turboのトークン）で計算し、`TurboAuthenticatedClient.getWincForToken()`を使用してlamportに変換します。

2. ウォレットに十分なWincがない場合、関数は`TurboAuthenticatedClient.topUpWithTokens()`を使用してlamportをWincに変換することで必要な金額をチャージします。

3. ウォレットに十分なWincがあれば、`TurboAuthenticatedClient.uploadFolder()`を使用してメタデータフォルダをアップロードし、メタデータのマニフェストIDを返します。

### 必要なLamportの計算

```javascript
const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
  turbo,
  calculateFolderSize(metadataFolderPath)
);
```

まず、フォルダの総サイズをバイト単位で計算します。次の関数は、フォルダ構造を再帰的に走査してすべてのファイルのサイズを合計します：

```javascript
function calculateFolderSize(folderPath: string): number {
  return fs.readdirSync(folderPath).reduce((totalSize, item) => {
    const fullPath = path.join(folderPath, item);
    
    const stats = fs.statSync(fullPath);

    return stats.isFile() 
        ? totalSize + stats.size 
        : totalSize + calculateFolderSize(fullPath);
  }, 0);
}
```

フォルダサイズが決定されたら、次のステップはアップロードに必要なlamportの数を計算することです。これは`calculateRequiredLamportsForUpload()`関数を使用して行われ、Wincコストを決定してlamportに変換します：

```javascript
async function calculateRequiredLamportsForUpload(turbo: TurboAuthenticatedClient, fileSize: number): Promise<number> {
    /// ファイルサイズが105 KiB未満の場合、支払う必要はありません
    if (fileSize < 107_520) { return 0; }

    /// ファイルをアップロードするのにどれくらいのwincがかかるかを確認
    const uploadPrice = new BigNumber((await turbo.getUploadCosts({ bytes: [fileSize]}))[0].winc);

    /// 現在のWinc残高を確認
    const currentBalance = new BigNumber((await turbo.getBalance()).winc);

    /// ファイルをアップロードするのに必要なWincを計算
    const requiredWinc = uploadPrice.isGreaterThan(currentBalance)
        ? uploadPrice.minus(currentBalance)
        : new BigNumber(0); // 残高が十分な場合、Wincは不要

    /// 必要なWincが0の場合、ファイルをアップロードするのに十分な量を既に持っています
    if (requiredWinc.isEqualTo(0)) { return 0; }

    /// 1 SOLがどれくらいのWincに相当するかを計算（1 SOL = 1_000_000_000 Lamports）
    const wincForOneSol = new BigNumber((await turbo.getWincForToken({ tokenAmount: 1_000_000_000 })).winc);

    /// ファイルをアップロードするのに必要なSOLを計算（SOLで返す）
    const requiredSol = requiredWinc.dividedBy(wincForOneSol).toNumber();

    /// 必要なSOLの量をLamportで返す
    return Math.floor(requiredSol * 1_000_000_000)
}
```

### ウォレットのチャージとメタデータのアップロード

ウォレットをチャージするために、前のステップで計算されたlamportの金額を指定して`TurboAuthenticatedClient.topUpWithTokens()`メソッドを使用します。この金額はアップロードプロセスに必要なWinc（Turboのトークン）に変換されます。

**注意**: チャージプロセスは条件付きです。ウォレットに既に十分なWincがある場合、`calculateRequiredLamportsForUpload()`関数は0を返し、チャージは不要になります。

```javascript
// 必要に応じてウォレットをチャージ
await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});
```

ウォレットに十分なWincがあることを確認した後、画像フォルダのアップロードを続行できます。これは`TurboAuthenticatedClient.uploadFolder()`メソッドを使用して行われます。アップロードは、アップロードされたファイルへのアクセスを可能にするマニフェストIDを返し、次のようにフォーマットされます：`https://arweave.net/${manifestID}/${nameOfTheFile.extension}`

**注意**: アップロード中に各ファイルに正しい[MIMEタイプ](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)を設定することが重要です。MIMEタイプが正しく設定されていない場合、URI経由でアクセスした際にファイルが適切に表示されない可能性があります。

```javascript
// 画像フォルダをアップロード
const metadataUploadResponse = await turbo.uploadFolder({
    folderPath: metadataFolderPath,
    dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
});
```

## 完全なコード例

簡単に使用するためにコピー&ペーストできる完全なコード例を以下に示します。

{% totem %}

{% totem-accordion title="完全なコード例" %}

```javascript
import { 
    TurboFactory, 
    TurboAuthenticatedClient, 
    lamportToTokenAmount, 
    TurboUploadFolderResponse 
} from '@ardrive/turbo-sdk';

import bs58 from 'bs58';
import path from 'path';
import fs from 'fs';
import BigNumber from 'bignumber.js';

import secretKey from "/path/to/your/keypair.json";

const imageFolderPath = path.join(__dirname, './assets');
const metadataFolderPath = path.join(__dirname, './metadata');

(async () => {
    try {
        /// ステップ 1: Turboのセットアップ
        const turbo = TurboFactory.authenticated({
            privateKey: bs58.encode(Uint8Array.from(secretKey)),
            token: 'solana',
            gatewayUrl: `https://api.devnet.solana.com`,
            paymentServiceConfig: { url: "https://payment.ardrive.dev" },
            uploadServiceConfig: { url: "https://upload.ardrive.dev" },
        });

        /// ステップ 2: メタデータのアップロード
        const metadataUploadResponse = await uploadMetadata(turbo);
    } catch (error) {
        console.error("実行中にエラーが発生しました:", error);
    }
})();

async function uploadMetadata(turbo: TurboAuthenticatedClient): Promise<TurboUploadFolderResponse> {
    // メタデータフォルダの計算とアップロード
    const requiredLamportsForMetadata = await calculateRequiredLamportsForUpload(
        turbo,
        calculateFolderSize(metadataFolderPath)
    );

    // 必要に応じてウォレットをチャージ
    await turbo.topUpWithTokens({tokenAmount: lamportToTokenAmount(requiredLamportsForMetadata)});

    // メタデータフォルダをアップロード
    const metadataUploadResponse = await turbo.uploadFolder({
        folderPath: metadataFolderPath,
        dataItemOpts: { tags: [{ name: 'Content-Type', value: 'application/json' }] },
    });

    console.log('メタデータマニフェストID:', metadataUploadResponse.manifestResponse?.id);
    return metadataUploadResponse;
}

function calculateFolderSize(folderPath: string): number {
  return fs.readdirSync(folderPath).reduce((totalSize, item) => {
    const fullPath = path.join(folderPath, item);
    
    const stats = fs.statSync(fullPath);

    return stats.isFile() 
        ? totalSize + stats.size 
        : totalSize + calculateFolderSize(fullPath);
  }, 0);
}

async function calculateRequiredLamportsForUpload(turbo: TurboAuthenticatedClient, fileSize: number): Promise<number> {
    /// ファイルサイズが105 KiB未満の場合、支払う必要はありません
    if (fileSize < 107_520) { return 0; }

    /// ファイルをアップロードするのにどれくらいのwincがかかるかを確認
    const uploadPrice = new BigNumber((await turbo.getUploadCosts({ bytes: [fileSize]}))[0].winc);

    /// 現在のWinc残高を確認
    const currentBalance = new BigNumber((await turbo.getBalance()).winc);

    /// ファイルをアップロードするのに必要なWincを計算
    const requiredWinc = uploadPrice.isGreaterThan(currentBalance)
        ? uploadPrice.minus(currentBalance)
        : new BigNumber(0); // 残高が十分な場合、Wincは不要

    /// 必要なWincが0の場合、ファイルをアップロードするのに十分な量を既に持っています
    if (requiredWinc.isEqualTo(0)) { return 0; }

    /// 1 SOLがどれくらいのWincに相当するかを計算（1 SOL = 1_000_000_000 Lamports）
    const wincForOneSol = new BigNumber((await turbo.getWincForToken({ tokenAmount: 1_000_000_000 })).winc);

    /// ファイルをアップロードするのに必要なSOLを計算（SOLで返す）
    const requiredSol = requiredWinc.dividedBy(wincForOneSol).toNumber();

    /// 必要なSOLの量をLamportで返す
    return Math.floor(requiredSol * 1_000_000_000)
}
```

{% /totem %}

{% /totem-accordion %}
