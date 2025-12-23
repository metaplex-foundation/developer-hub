---
title: プログラマブルNFT
metaTitle: プログラマブルNFT | Candy Machine
description: Candy MachineからプログラマブルNFTをミントする方法を説明します。
---

Token Metadataのバージョン`1.7`では、特にクリエイターがセカンダリセールでロイヤルティを執行できる[プログラマブルNFTと呼ばれる新しいアセットクラス](/ja/smart-contracts/token-metadata/pnfts)が導入されました。

Candy Machine Coreのバージョン`1.0`とCandy Guardのバージョン`1.0`以降、**Candy MachineからプログラマブルNFTをミント**することが可能になり、既存のCandy Machineのトークン標準を更新することもできます。

## 新しいCandy Machineの場合

`initializeV2`と呼ばれる新しい命令がCandy Machine Coreプログラムに追加されました。この命令は`initialize`命令に似ていますが、Candy Machineで使用したいトークン標準を指定できます。この命令は、新しく作成されたCandy Machineを`V2`とマークして、トークン標準を保存しない`V1` Candy Machineと区別します。これらの新しいフィールドは、Candy Machineのシリアライゼーションロジックでの破壊的変更を避けるために、Candy Machineアカウントデータの既存のパディングを使用しています。

`initializeV2`命令は、通常のNFTをミントするCandy Machineを作成するためにも使用でき、したがって`initialize`命令は非推奨になりました。NFTをミントする際にCandy Machine Coreに委譲するため、Candy Guardプログラムでは変更が不要であることに注意してください。

また、選択したトークン標準によっては、いくつかのオプションアカウントが必要になる場合があることに注意してください。例えば、すべてのミントされたプログラマブルNFTに特定のルールセットを割り当てるために`ruleSet`アカウントが提供される場合があります。`ruleSet`アカウントが提供されない場合、コレクションNFTのルールセット（存在する場合）を使用します。それ以外の場合、ミントされたプログラマブルNFTには単純にルールセットが割り当てられません。一方、通常のNFTをミントする際は`ruleSet`アカウントは無視されます。

さらに、`collectionDelegateRecord`アカウントは、Token Metadataの新しい[メタデータ委譲記録](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/accounts/struct.MetadataDelegateRecord.html)を参照するようになります。

詳細については、このドキュメントの「[Candy Machineの作成](/ja/smart-contracts/candy-machine/manage#create-candy-machines)」セクションを読むことをお勧めしますが、プログラマブルNFTをミントする新しいCandy Machineを作成するためにSDKを使用する方法の例を以下に示します。

{% dialect-switcher title="新しいPNFT Candy Machineの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { create } from '@metaplex-foundation/mpl-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)

{% /dialect %}
{% /dialect-switcher %}

## 既存のCandy Machineの場合

新しい`setTokenStandard`命令を使用して、既存のCandy Machineのトークン標準を更新することが可能です。Candy Machine `V1`でこの命令を呼び出すと、Candy Machineも`V2`にアップグレードし、トークン標準をアカウントデータに保存します。

詳細については、このドキュメントの「[トークン標準の更新](/ja/smart-contracts/candy-machine/manage#update-token-standard)」セクションを読むことをお勧めしますが、既存のCandy Machineのトークン標準をプログラマブルNFTに更新するためにSDKを使用する方法の例を以下に示します。

{% dialect-switcher title="Candy Machineのトークン標準の変更" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setTokenStandard } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

APIリファレンス: [setTokenStandard](https://mpl-candy-machine.typedoc.metaplex.com/functions/setTokenStandard.html)

{% /dialect %}
{% /dialect-switcher %}

さらに、プログラマブルNFTと互換性のあるコレクションの設定をサポートするために、新しい`setCollectionV2`命令が追加されました。この命令は通常のNFTでも動作し、`setCollection`命令を非推奨にします。

ここでも、詳細についてはこのドキュメントの「[コレクションの更新](/ja/smart-contracts/candy-machine/manage#update-collection)」セクションで読むことができます。

{% dialect-switcher title="Candy Machineのコレクションの更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { setCollectionV2 } from '@metaplex-foundation/mpl-candy-machine'

await setCollectionV2(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
  newCollectionMint: newCollectionMint.publicKey,
  newCollectionUpdateAuthority,
}).sendAndConfirm(umi)
```

APIリファレンス: [setCollectionV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCollectionV2.html)

{% /dialect %}
{% /dialect-switcher %}

## 新しいミント命令

Candy Machine CoreとCandy Guardプログラムの両方の`mint`命令は、プログラマブルNFTのミントをサポートするように更新されました。この新しい命令は`mintV2`と呼ばれ、`mint`命令に似ていますが、追加のアカウントが渡される必要があります。ここでも、新しい`mintV2`命令は通常のNFTをミントするために使用でき、したがって既存の`mint`命令を非推奨にします。

「[ミント](/ja/smart-contracts/candy-machine/mint)」ページ全体が新しい`mintV2`命令を使用するように更新されましたが、プログラマブルNFTでの使用方法の簡単な例を以下に示します。

{% dialect-switcher title="Candy Machineからのミント" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)

{% /dialect %}
{% /dialect-switcher %}

Candy Guardプログラムが提供するガードのいくつかは、プログラマブルNFTをサポートするように更新されていることに注意してください。更新は通常のNFTをミントする際に破壊的変更を導入しませんが、トークン標準によってはミント時により多くの残りのアカウントが必要になる場合があります。

これらの変更の影響を受けるガードは以下のとおりです：

- `nftBurn`と`nftPayment`ガードは、燃焼/送信されるNFTがプログラマブルNFTである場合を許可するようになりました。
- `FreezeSolPayment`と`FreezeTokenPayment`ガード。プログラマブルNFTは定義上常に凍結されているため、Utilityデリゲートを介してミントされた場合はロックされ、解凍条件が満たされた場合はアンロックされます。

## 追加の読み物

プログラマブルNFTとCandy Machineに関する以下のリソースが役立つ場合があります：

- [プログラマブルNFTガイド](/ja/smart-contracts/token-metadata/pnfts)
- [Candy Machine Coreプログラム](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core)
- [Candy Guardプログラム](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard)