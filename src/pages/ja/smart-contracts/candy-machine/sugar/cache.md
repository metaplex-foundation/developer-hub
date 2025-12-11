---
title: キャッシュファイル
metaTitle: キャッシュファイル | Sugar
description: Sugarキャッシュファイル。
---

Sugarは、キャッシュファイルを使用してCandy Machineと作成されたアセットを追跡します。これにより、Sugarはすべてのアセットを再アップロードすることなく、アセットのアップロードを再開できます。また、コレクションやCandy Machineクリエイターなど、Candy Machineアカウントに関する情報も提供します。

キャッシュファイルを直接手動で変更する必要はありません – このファイルはSugarコマンドによって操作されます。上記で説明したように、そのような特定の状況があります。

{% callout %}

キャッシュファイルのコピーを保持してください。すべてのアセット情報と作成されたアカウントのアドレスが含まれています。

{% /callout %}

## 構造

キャッシュファイルは以下の構造を持つJSONドキュメントです：

```json
{
  "program": {
    "candyMachine": "<PUBLIC KEY>",
    "candyGuard": "<PUBLIC KEY>",
    "candyMachineCreator": "<PUBLIC KEY>",
    "collectionMint": "<PUBLIC KEY>"
  },
  "items": {
    "-1": {
      "name": "My Collection",
      "image_hash": "6500707cb13044b7d133abb5ad68e0af660b154499229af49419c86a251a2b4d",
      "image_link": "https://arweave.net/KplI7R59EE24-mavSgai7WVJmkfvYQKhtTnqxXPlPdE?ext=png",
      "metadata_hash": "2009eda578d1196356abcfdfbba252ec3318fc6ffe42cc764a624b0c791d8471",
      "metadata_link": "https://arweave.net/K75J8IG1HcTYJyr1eC0KksYfpxuFMkPONJMpUNDmCuA",
      "onChain": true
    },
    "0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "https://arweave.net/6DRibEPNjLQKA90v3qa-JsYPPT5a6--VsgKumUnX3_0",
      "onChain": true
    },
    ...
  }
}
```

### `program`

`"program"`セクションには、Candy Machine、Candy Guardアカウント、およびCandy Machineクリエイターとコレクションミントのアドレスに関する情報が含まれます。これらの詳細は、Candy Machineがデプロイされると入力されます。Candy Guardアドレスは、Candy Machineでガードを有効にした場合にのみ存在します。

### `items`

`"items"`セクションには、Candy Machineのアセットに関する情報が含まれます。このリストは、Sugarがアセットフォルダを検証すると作成されます。この時点で、すべての`"name"`、`"image_hash"`、`"metadata_hash"`がキャッシュファイルに追加されます。アセットがアップロードされると、`"image_link"`と`"metadata_link"`の情報が最終的な値で更新されます。最後に、Candy Machineがデプロイされると、`"onChain"`の値が`true`に設定されます。

Sugar `upload`は、対応する「link」値が入力されていないアセットのみをアップロードします – 例：以下のアイテムを含むキャッシュファイルで`sugar upload`を実行する場合：

```json
"0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "",
      "onChain": false
},
```

メタデータファイルのみがアップロードされます。なぜなら、画像リンクは既に存在するからです。

Sugarは画像とメタデータファイルの両方の「ハッシュ」を保存するため、対応するファイルを変更した結果としてハッシュ値が変更されると、`sugar upload`を実行することで新しいファイルがアップロードされます。この時点で、`"onChain"`の値は`false`に設定され、`sugar deploy`を実行した後でのみ変更が有効（オンチェーン）になります。

## 「高度な」キャッシュ管理

ほとんどの場合、キャッシュファイルを手動で変更する必要はありません。しかし、そのような状況もあります。

### 同じアイテムで新しいCandy Machineをデプロイする

キャッシュファイルから同じアイテムを再利用して、Candy Machineを新しいアドレスにデプロイしたい場合は、キャッシュファイルから`"candyMachine"`公開鍵の値を削除するだけです：

{% totem %}
{% totem-accordion title="例" %}

```json
{
  "program": {
    "candyMachine": "",
    "candyGuard": "",
    "candyMachineCreator": "6DwuXCUnGEE2NktwQub22Ejt2EQUexGmGADZURN1RF6J",
    "collectionMint": "5TM8a74oX6HgyAtVnKaUaGuwu44hxMhWF5QT5i7PkuZY"
  },
  "items": {
    "-1": {
      "name": "My Collection",
      "image_hash": "6500707cb13044b7d133abb5ad68e0af660b154499229af49419c86a251a2b4d",
      "image_link": "https://arweave.net/KplI7R59EE24-mavSgai7WVJmkfvYQKhtTnqxXPlPdE?ext=png",
      "metadata_hash": "2009eda578d1196356abcfdfbba252ec3318fc6ffe42cc764a624b0c791d8471",
      "metadata_link": "https://arweave.net/K75J8IG1HcTYJyr1eC0KksYfpxuFMkPONJMpUNDmCuA",
      "onChain": true
    },
    "0": {
      "name": "My First NFT #1",
      "image_hash": "209a200ebea39be9e9e7882da2bc5e652fb690e612abecb094dc13e06db84e54",
      "image_link": "https://arweave.net/-qSoAFO7GWTm_js1eHDyoljgB3D_vszlXspVXBM7HyA?ext=png",
      "metadata_hash": "cfc45ba94da81c8d21f763ce8bb6bbb845ad598e23e44d5c8db1590672b7653f",
      "metadata_link": "https://arweave.net/6DRibEPNjLQKA90v3qa-JsYPPT5a6--VsgKumUnX3_0",
      "onChain": true
    },
    ...
  }
}
```

{% /totem-accordion %}
{% /totem %}

### 既存のリンクを使用する

アセットへのリンクが既にある場合、Sugarが再度アップロードしないように、その情報をキャッシュファイルに手動で追加できます。この場合、対応するリンクで`"image_link"`と`"metadata_link"`を完了する必要があります。