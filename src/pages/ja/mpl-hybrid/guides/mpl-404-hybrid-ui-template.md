---
title: Metaplex MPL-404 Hybrid Solana NextJs Tailwindテンプレート
metaTitle: Metaplex MPL-404 Hybrid NextJs Tailwindテンプレート | Web UIテンプレート
description: Nextjs、Tailwind、Metaplex Umi、Solana WalletAdapter、Zustandを使用したMetaplex MPL-404 Hybrid用のWeb UIテンプレート。
created: 2024-12-16
---

Metaplex MPL-404 Hybrid UIテンプレートは、開発者とユーザーに開発の出発点を提供するために構築されています。このテンプレートには、`.env`の例ファイル、機能的なUIコンポーネント、ハイブリッドコレクションのフロントエンドUIを作成する際の開発を促進するトランザクション呼び出しが事前設定されています。

{% image src="/images/hybrid-ui-template-image.jpg" classes="m-auto" /%}

## 機能

- Nextjs Reactフレームワーク
- Tailwind
- Shadcn
- Solana WalletAdapter
- Metaplex Umi
- Zustand
- ダーク/ライトモード
- Umiヘルパー

このUIテンプレートは、ベースとなるMetaplex UIテンプレートを使用して作成されています。追加のドキュメントは以下で見つけることができます

ベーステンプレートGithubリポジトリ - [https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template](https://github.com/metaplex-foundation/metaplex-nextjs-tailwind-template)

## インストール

```shell
git clone https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn.git
```

Githubリポジトリ - [https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn](https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn)


## セットアップ

### .envファイル

`.env.example`を`.env`にリネームします

正しい詳細で以下を記入します。

```
// エスクローアカウント
NEXT_PUBLIC_ESCROW="11111111111111111111111111111111"
NEXT_PUBLIC_COLLECTION="11111111111111111111111111111111"
NEXT_PUBLIC_TOKEN="11111111111111111111111111111111"

// RPC URL
NEXT_PUBLIC_RPC="https://myrpc.com/?api-key="
```


### 画像の置換
src/assets/images/には置換する2つの画像があります：

- collectionImage.jpg
- token.jpg

これらの画像はどちらも、画像uriにアクセスするためだけにコレクションとトークンメタデータを取得することを省略するために使用されます。

### RPCの変更

以下のいずれかの方法を使用して、プロジェクトのRPC URLを好みに応じて設定できます：

- .env
- constants.tsファイル
- umiに直接ハードコード

この例では、RPC urlは`src/store/useUmiStore.ts`の21行目の`umiStore` umiステート内にハードコードされています。

```ts
const useUmiStore = create<UmiState>()((set) => ({
  // ここに独自のRPCを追加
  umi: createUmi('http://api.devnet.solana.com').use(
    signerIdentity(
      createNoopSigner(publicKey('11111111111111111111111111111111'))
    )
  ),
  ...
}))
```
## 追加ドキュメント

このテンプレートが構築されているヘルパーと機能を理解するために、ベーステンプレートのドキュメントをさらに読むことをお勧めします

Githubリポジトリ - [https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn](https://github.com/metaplex-foundation/mpl-hybrid-404-ui-template-nextjs-tailwind-shadcn)