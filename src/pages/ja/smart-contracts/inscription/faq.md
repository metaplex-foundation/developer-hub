---
title: よくある質問
metaTitle: よくある質問 | Inscription
description: Metaplex Inscriptionsについてよくある質問
---

## Inscriptionの意義は何ですか？

一般的な認識に反して、Inscriptionはバリデーターを困らせる以上のことに使用できます。任意のデータをオンチェーンに書き込む能力は、Solanaプログラムの統合において大きな利益をもたらします。初期段階では、この主な使用例はNFTになり、すべてのNFTデータをSolana上に保存する方法を提供します。これにより、プログラムのオンチェーン特性ベースのゲーティング、カスタムプログラムを書かずに追加のNFTメタデータを保存する方法（例：ゲーム統計ブロック、NFT履歴、追加情報など）、およびSolanaプログラム内での動的画像生成などの多くの使用例が可能になります。

## どこでinscribeしますか？

- [Metaplex Inscription UI](https://inscriptions.metaplex.com)は、Solana上の既存のNFTをInscribingするためのノーコードリファレンス実装です。このUIを使用すると、クリエイターは更新権限を持つすべてのNFTを表示し、NFTのJSONと画像をSolana上に保存するためのInscriptionフローを案内できます。

  {% callout type="note" %}

  ブラウザウォレットの制限により、UIを大量Inscriptionに使用することはお勧めしません。数百のトランザクション承認を節約するために、代わりにCLIを使用してください。

  {% /callout %}

- [Inscription CLI](https://github.com/metaplex-foundation/mpl-inscription/tree/main/clients/cli)は、NFTの大量Inscribingを処理するためのコマンドラインツールです。

## いくらかかりますか？

Inscriptionのコストは、基本的にアカウントレント用の0.003306 SOLのオーバーヘッドと、実際に刻印されるデータの0.00000696 SOL/バイトのスペースに帰着します。この費用計算を簡単にするためのいくつかのツールが存在します：

- 画像とJSONサイズを入力して総コストを計算できる[Inscription calculator](https://www.sackerberg.dev/tools/inscriptionCalculator)。
- Inscription UIには高度な圧縮スイートが含まれており、各NFTを動的にリサイズし圧縮して、品質とコストのトレードオフを測定できます。
- Inscription CLIには、大量Inscriptionの総コストを測定するツールが含まれています。

## 新しいNFTをinscribeするにはどうすればよいですか？

新しいNFTは、最初に作成ツールを通じてミントすることでinscribeできます（推奨ツールは[Truffle](https://truffle.wtf/)と[Sol Tools](https://sol-tools.io/)です）。ミント後、これらの新しいNFTはInscription UIとCLIツールを通じてリストに表示されます。
