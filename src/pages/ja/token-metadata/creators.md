---
title: 検証済み作成者
metaTitle: 検証済み作成者 | Token Metadata
description: Token Metadataでアセットの作成者を検証する方法を学習します
---

[コレクション](/jp/token-metadata/collections)と同様に、アセットの真正性を確保するために、アセットの作成者を検証する必要があります。 {% .lead %}

`verified`フラグが`false`の作成者は誰でも追加できるため、信頼できません。一方、`verified`フラグが`true`の作成者は、そのアセットの作成者として自分を検証するトランザクションに署名したことが保証されています。

以下のセクションでは、アセットの作成者を検証および未検証にする方法を学びます。作成者を検証する前に、それは既にアセットの**Metadata**アカウントの**Creators**配列の一部である必要があることに注意してください。これは[アセットをミント](/jp/token-metadata/mint)するときに行うことができますが、[アセットを更新](/jp/token-metadata/update)するときにも行うことができます。

## 作成者の検証

**Verify**命令を使用して、アセットの作成者を検証できます。同じ命令は、命令に異なる引数を渡すことで、コレクションの検証にも使用できることに注意してください。一部のSDKでは、より良い開発者体験を提供するために、これらの命令を`verifyCreatorV1`や`verifyCollectionV1`のような複数のヘルパーに分割しています。

作成者を検証する文脈で**Verify**命令が必要とする主な属性は以下の通りです：

- **Metadata**: アセットの**Metadata**アカウントのアドレス。
- **Authority**: 検証しようとしている作成者（署名者として）。

以下は、Token Metadataで作成者を検証するためのSDKの使用方法です。

{% dialect-switcher title="Verify a Creator" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { verifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata'

await verifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 作成者の未検証

相互に、**Unverify**命令を使用して、作成者の`verified`フラグを`false`に変更できます。**Verify**命令と同じ属性を受け取り、同じ方法で使用できます。

{% dialect-switcher title="Unverify a Creator" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { unverifyCreatorV1 } from '@metaplex-foundation/mpl-token-metadata'

await unverifyCreatorV1(umi, {
  metadata,
  authority: creator,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}