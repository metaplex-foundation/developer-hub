---
title: '@solana/kit アダプター'
metaTitle: 'Umi - @solana/kit アダプター'
description: 'UmiとJavaScript @solana/kitの間で型を変換するアダプター。'
---

新しい[`@solana/kit`](https://github.com/anza-xyz/kit)ライブラリは、Solanaのモダンなジャヒ版SDKの一部であり、[`@solana/web3.js`](https://github.com/solana-foundation/solana-web3.js/)と比較して改善された型安全性とパフォーマンスを提供します。UmiとMOA`@solana/kit`の両方で作業する際、それぞれの型間で変換が必要になる場合があります。

これを支援するため、Umiは[`@metaplex-foundation/umi-kit-adapters`](https://www.npmjs.com/package/@metaplex-foundation/umi-kit-adapters)パッケージでアダプターを提供し、Umiと`@solana/kit`の間で型を変換できるようにします。

## インストールとインポート

アダプターパッケージをインストール：

```
npm i @metaplex-foundation/umi-kit-adapters
```

インストール後、変換関数が利用可能になります：


## アドレス

UmiとLangchain`@solana/kit`の両方がアドレスにbase58文字列を使用しているため、変換は簡単です。

### @solana/kitからUmiへ

```ts
import { address } from '@solana/kit';
import { fromKitAddress } from '@metaplex-foundation/umi-kit-adapters';

// Kitアドレスを作成
const kitAddress = address("11111111111111111111111111111112");

// UmiPublicKeyに変換
const umiPublicKey = fromKitAddress(kitAddress);
```

### Umiから@solana/kitへ

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { toKitAddress } from '@metaplex-foundation/umi-kit-adapters';

// UmiPublicKeyを作成
const umiPublicKey = publicKey("11111111111111111111111111111112");

// Kitアドレスに変換
const kitAddress = toKitAddress(umiPublicKey);
```

## キーペア

キーペアの変換には、各ライブラリで使用される異なる形式を处理する必要があります。

### @solana/kitからUmiへ

```ts
import { generateKeyPair } from '@solana/kit';
import { fromKitKeypair } from '@metaplex-foundation/umi-kit-adapters';

// 例として新しいKit CryptoKeyPairを作成
const kitKeypair = await generateKeyPair();

// UmiキーペアMORETOに変換
const umiKeypair = await fromKitKeypair(kitKeypair);
```

### Umiから@solana/kitへ

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { toKitKeypair } from '@metaplex-foundation/umi-kit-adapters';

// Umiインスタンスを作成し、例のキーペアを生成
const umi = createUmi('https://api.devnet.solana.com');
const umiKeypair = generateSigner(umi);

// Kit CryptoKeyPairに変換
const kitKeypair = await toKitKeypair(umiKeypair);
```

## 命令

命令は2つの形式間で変換でき、異なるアカウントロールシステムを処理します。

### @solana/kitからUmiへ

```ts
import { getSetComputeUnitLimitInstruction } from '@solana-program/compute-budget';
import { fromKitInstruction } from '@metaplex-foundation/umi-kit-adapters';

// 例として新しいKit命令を作成
const kitInstruction = getSetComputeUnitLimitInstruction({ units: 500 });

// Umi命令に変換
const umiInstruction = fromKitInstruction(kitInstruction);
```

### Umiから@solana/kitへ

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox';
import { toKitInstruction } from '@metaplex-foundation/umi-kit-adapters';

// 例用に新しいUmiインスタンスを作成
const umi = createUmi('https://api.devnet.solana.com');

// 例として新しいUmi命令を作成
const umiInstruction = setComputeUnitPrice(umi, { microLamports: 1 });

// Kit命令に変換
const kitInstruction = toKitInstruction(umiInstruction);
```

## 使用例

これらのアダプターは特に以下の場合に役立ちます：

- UmiとMetaplex機能を`@solana/kit`と一緒に使用したい場合
- Solanaエコシステムの異なる部分間で相互運用する必要があるアプリケーションを構築する場合
- 異なる型システムを使用する既存のコードを統合する場合

アダプターは型安全性を確保し、变換の詳細を自動的に処理するため、同じプロジェクト内で両方のライブラリと簡単に作業できます。