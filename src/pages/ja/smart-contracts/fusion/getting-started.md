---
title: はじめに
metaTitle: はじめに | Fusion
description: Metaplex Fusionの使用方法。
---

## Fusionとは何ですか？

FusionはMetaplexのコンポーザブルNFTへの回答です。Fusion自体は、プロジェクト、アーティスト、またはコレクターが完全に動的なNFTを作成できるようにする複数のMetaplexプログラムの組み合わせです。コントラクトレベルでは、FusionはNFTのオンチェーン追跡とルールベースの合成/分解操作を管理するTrifleによって支えられています。

## セットアップの手順

### 親NFTの作成

Fusionは、構成されるすべての属性を所有する単一のNFT（Fusion Parent）として構造化されています。Fusion Parentは、そのオンチェーンTrifleアカウントで追跡されるすべての属性トークンのレイヤリングを反映するように、メタデータと画像を動的に再レンダリングします。メタデータのシームレスな再構成を可能にするため、決定論的フォーマットを使用して静的URIが作成されます。

`https://shdw-drive.genesysgo.net/<METAPLEX_BUCKET>/<TRIFLE_ADDRESS>`

動的メタデータと画像は、GenesysGoのShadow Drive技術でホストされ、分散データホスティングと更新可能ストレージフォーマットの利点を活用しています。この静的URIにより、NFTのMetadataアカウントの実際の更新を必要とせずにすべてのデータのバックエンド更新が可能になります。MetadataアカウントはUpdate Authorityのみが更新を許可するように権限が設定されています。これにより、Fusionユーザーは秘密鍵を共有することなく動的メタデータを持つことができます。Fusion Parent作成の例を以下に示します：

```tsx
const findTriflePda = async (mint: PublicKey, authority: PublicKey) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from('trifle'), mint.toBuffer(), authority.toBuffer()],
    new PublicKey(PROGRAM_ADDRESS)
  )
}

const METAPLEX_BUCKET = 'Jf27xwhv6bH1aaPYtvJxvHvKRHoDe3DyQVqe4CJyxsP'
let nftMint = Keypair.generate()
let trifleAddress = await findTriflePda(nftMint.publicKey, updateAuthority)
let result
result = await metaplex!.nfts().create({
  uri:
    'https://shdw-drive.genesysgo.net/' +
    METAPLEX_BUCKET +
    '/' +
    trifleAddress[0].toString() +
    '.json',
  name: 'Fusion NFT',
  sellerFeeBasisPoints: 0,
  useNewMint: nftMint,
})
```

### レンダリングスキーマの記述

Fusionは制約モデルアカウントの`schema`フィールドを活用して、属性をレンダリングするレイヤー順序を決定します。

```json
{
  "type": "layering",
  "layers": ["base", "neck", "mouth", "nose"],
  "defaults": {
    "metadata": "https://shdw-drive.genesysgo.net/G6yhKwkApJr1YCCmrusFibbsvrXZa4Q3GRThSHFiRJQW/default.json"
  }
}
```

`type`：これが表すスキーマの種類を定義し、したがってバックエンドサーバーがFusion Parentの画像をどのようにレンダリングすべきかを定義します。
`layers`：Trifleアカウント上のスロット名の配列。配列の順序はレイヤーをレンダリングする順序を定義します。すべてのレイヤーを使用する必要はなく、非表示の属性を可能にします。
`defaults`：Fusion Parentのメタデータを組み合わせる際にベースラインとして使用するデフォルトメタデータ。`external_url`などのメタデータフィールドをこの方法でメタデータに含めることができます。

### Trifleのセットアップ

最後に、制約モデルとTrifleアカウントを[これらの手順](/ja/fusion/getting-started)に従ってセットアップする必要があります。

上記の手順の後、Fusion Parentは`transfer_in`または`transfer_out`操作の度に再レンダリングされるはずです。
