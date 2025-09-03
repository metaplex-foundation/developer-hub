---
title: MPL Hybrid 404エスクローの設定の更新
metaTitle: MPL Hybrid 404エスクローの設定の更新 | MPL-Hybrid
description: MPL 404 Hybridエスクローアカウントの設定を更新する方法を学びましょう。
---

エスクロー設定は、`updateEscrowV1`プラグインを通じて更新可能です。

作業を簡単にするため、`mpl-hybrid`パッケージの`fetchEscrowV1()`を使用してエスクローアカウントを取得し、スプレッド演算子を使用して更新指示にすべての現在のフィールド値を提供し、変更したいフィールドのみを調整できます。元の変更されていない値はスプレッド演算子によって処理されます。

## エスクローの更新

```ts
const escrowConfigurationAddress = publicKey("11111111111111111111111111111111");

// エスクロー設定アカウントを取得。
const escrowConfigurationData = await fetchEscrowV1(umi, escrowConfigurationAddress);

// スプレッド演算子`...`を使用して`escrowConfigurationData`フィールドをオブジェクトに展開し、
// 更新したいフィールドを調整。
const res = await updateEscrowV1(umi, {
    ...escrowConfigurationData,
    // エスクロー設定アドレス。
    escrow: escrowConfigurationAddress,
    authority: umi.identity,
    // 変更・更新したいフィールドを以下に追加。
    feeAmount: 100000,
}).sendAndConfirm(umi);

```

## 更新可能フィールド

`updateEscrowV1`の引数オブジェクトに渡すことができる更新可能フィールド。

```ts
{
    name,
    uri,
    max,
    min,
    amount,
    feeAmount,
    solFeeAmount,
    path
}

```

### name

エスクローの名前。

```ts
name: "My Test Escrow"
```

### uri

これはメタデータプールのベースuriです。これは、メタデータjsonファイルを連続する宛先に含む静的uriである必要があります。例：
```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

```ts
uri: "https://shdw-drive.genesysgo.net/<bucket-id>/"
```

### token

MPL Hybrid 404プロジェクトで使用されているトークンミントアドレス。

```ts
token: publicKey("11111111111111111111111111111111")
```

### feeLocation

スワップからの手数料を受け取るウォレットアドレス。

```ts
feeLocation: publicKey("11111111111111111111111111111111")
```

### feeAta

トークンを受け取るウォレットのトークンアカウント。

```ts
feeAta: findAssociatedTokenPda(umi, {
    mint: publicKey("111111111111111111111111111111111"),
    owner: publicKey("22222222222222222222222222222222"),
  });
```

### min and max

minとmaxは、メタデータプールで利用可能な最小および最大インデックスを表します。

```
最低インデックス: 0.json
...
最高インデックス: 4999.json
```

これは次のminとmax引数に変換されます。
```ts
min: 0,
max: 4999
```

### fees

更新可能な3つの別々の手数料があります。

```ts
// NFTをトークンにスワップする際に受け取るトークンの量。
// この値はラムポートであり、トークンが持つ
// 小数点以下桁数を考慮する必要があります。トークンが5桁の小数点を持ち、
// 1つの完全なトークンを請求したい場合、feeAmountは`100000`になります

amount: 100000,
```

```ts
// トークンをNFTにスワップする際に支払う手数料金額。
// この値はラムポートであり、トークンが持つ小数点以下桁数を
// 考慮する必要があります。
// トークンが5桁の小数点を持ち、1つの完全なトークンを請求したい場合、
// feeAmountは`100000`になります

feeAmount: 100000,
```

```ts
// トークンからNFTにスワップする際に支払うオプション手数料。
// これはラムポートなので、ラムポートを計算するために
// `sol()`を使用できます。

solFeeAmount: sol(0.5).basisPoints,
```

### path

`path`引数は、mpl-hybridプログラムでメタデータリロール機能を有効または無効にします。

```ts
// スワップ時にメタデータをリロール 0 = true、1 = false
path: 0,
```