---
title: 概要
metaTitle: 概要 | ツール
description: SolanaのNative Programに必要な機能のセットを提供することで、Umiを補完するように設計されたパッケージ。
---

**mpl-toolbox**パッケージは、SolanaのNative Programsに必要な機能のセットを提供することで、Umiを補完するように設計されています。

{% quick-links %}

{% quick-link title="APIリファレンス" icon="CodeBracketSquare" target="_blank" href="https://mpl-toolbox.typedoc.metaplex.com/" description="特定の何かをお探しですか？APIリファレンスをご覧になり、答えを見つけてください。" /%}

{% /quick-links %}

## インストール

{% packagesUsed packages=["toolbox"] type="npm" /%}

パッケージはUmiパッケージを使用する際にデフォルトで含まれていないため、インストールして使用を開始するには、以下のコマンドを実行する必要があります

```
npm i @metaplex-foundation/mpl-toolbox
```

## 含まれるプログラム

Umiや他のMetaplex製品は、開始に必要なすべての基本的な機能を含む包括的なパッケージを既に提供していますが、特にSolanaのネイティブプログラムを扱う際の低レベルでありながら重要なタスクに必要なヘルパーや機能は含まれていません。たとえば、Umiだけでは、SPL System Programを使用してアカウントを作成したり、SPL Address Lookup TableプログラムからLookup Tableを拡張することはできません。

そこで、これらの低レベルタスクを簡素化するSolanaのNativeに必要なヘルパーのセットを提供する**mpl-toolbox**を作成しました。

**mpl-toolboxパッケージには以下のプログラムからのヘルパーが含まれています:**

| プログラム                                                                                | 説明                                                                                                                 |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **SPL System**                                                                          | アカウント作成のためのSolanaのネイティブプログラム。                                                                               |
| **SPL Token and SPL Associated Token**                                                 | トークン管理のためのSolanaのネイティブプログラム。                                                                               |
| **SPL Memo**                                                                            | トランザクションにメモを添付するためのSolanaのネイティブプログラム。                                                                |
| **SPL Address Lookup Table**                                                            | ルックアップテーブル管理のためのSolanaのネイティブプログラム。                                                                         |
| **SPL Compute Budget**                                                                  | コンピュートユニット管理のためのSolanaのネイティブプログラム。                                                                         |
| **MPL System Extras**                                                                   | SPL Systemに加えて追加の低レベル機能を提供するMetaplexプログラム。                                             |
| **MPL Token Extras**                                                                    | SPL Tokenに加えて追加の低レベル機能を提供するMetaplexプログラム。                                              |
