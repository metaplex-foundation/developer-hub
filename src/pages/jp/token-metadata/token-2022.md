---
title: Token MetadataでのSPL Token-2022
metaTitle: SPL Token-2022 | Token Metadata
description: SPL Token-2022がToken Metadataとどのように統合されているかを学習します
---

SPL Token-2022は、Solanaブロックチェーン上でfungibleおよびnon-fungibleトークンを作成するために使用できる最新のトークンプログラムです。SPL Tokenプログラムと同じ機能と構造をサポートしていますが、新しい機能を追加する拡張機能セットも含まれています。

Token-2022 Mintアカウントにメタデータ情報を追加することをサポートするために、Token Metadataの一連の命令が更新され、希望するトークンプログラムを指定できるようになりました。例えば、Token MetadataはToken-2022 Mintを初期化し、`Create`および`Mint`命令を使用してメタデータを作成し、トークンをミントし、使用するトークンプログラムとしてSPL Token-2022を指定できます。

{% totem %}

{% dialect-switcher title="Specifying token program on Create and Mint" %}
{% dialect title="JavaScript" id="js" %}

{% totem-accordion title="Create Metadata" %}

```ts
import {
  generateSigner,
  percentAmount,
  publicKey,
  PublicKey,
} from '@metaplex-foundation/umi'
import {
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
)

const mint = generateSigner(umi)
await createV1(umi, {
  mint,
  authority,
  name: 'My NFT',
  uri,
  sellerFeeBasisPoints: percentAmount(5.5),
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Mint a token" %}

```ts
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'
import { mintV1 } from '@metaplex-foundation/mpl-token-metadata'

// Token-2022用のassociated token accountを見つける
const token = findAssociatedTokenPda(umi, {
  mint: mint.publicKey,
  owner: umi.identity.publicKey,
  tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
})

await mintV1(umi, {
  mint: mint.publicKey,
  token,
  tokenOwner: umi.identity.publicKey,
  amount: 1,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /dialect %}
{% /dialect-switcher %}

{% /totem %}

## Token-2022拡張機能

SPL Token-2022プログラムは、従来のSPL Tokenプログラムにはない追加機能を提供する様々な拡張機能をサポートしています：

### 転送不可拡張機能

転送不可拡張機能により、作成者はSoulbound Token（転送不可能なトークン）を作成できます：

```ts
import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeNonTransferableMintInstruction,
} from '@solana/spl-token';

// 転送不可拡張機能付きでToken-2022 Mintを作成
const extensions = [ExtensionType.NonTransferable];
const space = getMintLen(extensions);

// Mintアカウント作成および初期化の手順が必要です
```

### その他の拡張機能

Token-2022は以下を含む多くの他の拡張機能をサポートしています：

- **Interest Bearing**: 時間の経過とともに利息を蓄積するトークン
- **Transfer Fee**: 転送に手数料を課すトークン  
- **Close Authority**: Mintアカウントを閉じる権限
- **Permanent Delegate**: 永続的な委任権限
- **Transfer Hook**: 転送時にカスタムロジックを実行

## Token-2022とToken Metadataの統合

Token Metadataを使用する際、Token-2022のサポートは主に`splTokenProgram`パラメーターを指定することで実現されます：

```ts
// 通常のSPL Token（デフォルト）
await createV1(umi, {
  // ... 他のパラメーター
  // splTokenProgram は指定しない（デフォルト値を使用）
})

// SPL Token-2022
await createV1(umi, {
  // ... 他のパラメーター
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
})
```

この統合により、開発者はToken-2022の拡張機能を活用しながら、Token Metadataの豊富なメタデータおよびNFT機能を使用できます。