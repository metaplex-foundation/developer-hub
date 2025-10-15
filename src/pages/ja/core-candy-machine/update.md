---
title: Core Candy Machineの更新
metaTitle: Core Candy Machineの更新 | Core Candy Machine
description: Core Candy Machineとその様々な設定を更新する方法を学びます。
---

{% dialect-switcher title="Core Candy Machineの更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  updateCandyMachine
} from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

await updateCandyMachine(umi, {
  candyMachine,
  data: {
    itemsAvailable: 3333;
    isMutable: true;
    configLineSettings: none();
    hiddenSettings: none();
}
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 引数

{% dialect-switcher title="Core Candy Machine更新引数" %}
{% dialect title="JavaScript" id="js" %}

updateCandyMachine関数に渡すことができる利用可能な引数。

| 名前         | タイプ      |
| ------------ | --------- |
| candyMachine | publicKey |
| data         | data      |

{% /dialect %}
{% /dialect-switcher %}

一部の設定は、ミントが開始された後では変更/更新できません。

### data

{% dialect-switcher title="Candy Machineデータオブジェクト" %}
{% dialect title="JavaScript" id="js" %}

```ts
data =  {
    itemsAvailable: number | bigint;
    isMutable: boolean;
    configLineSettings: OptionOrNullable<ConfigLineSettingsArgs>;
    hiddenSettings: OptionOrNullable<HiddenSettingsArgs>;
}
```

- [ConfigLineSettingsArgs](/jp/core-candy-machine/create#config-line-settings)
- [HiddenSettingsArgs](/jp/core-candy-machine/create#hidden-settings)

{% /dialect %}
{% /dialect-switcher %}

## Candy Machineに新しい権限の割り当て

Candy Machineの権限を新しいアドレスに転送したいシナリオがある場合があります。これは`setMintAuthority`関数で実現できます。

export declare type SetMintAuthorityInstructionAccounts = {
/** Candy Machineアカウント。 \*/
candyMachine: PublicKey | Pda;
/** Candy Machine権限 _/
authority?: Signer;
/\*\* 新しいCandy Machine権限 _/
mintAuthority: Signer;
};

{% dialect-switcher title="Core Candy Machineに新しい権限を割り当て" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { setMintAuthority } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = publicKey('11111111111111111111111111111111')
const newAuthority = publicKey('22222222222222222222222222222222')

await setMintAuthority(umi, {
  candyMachine,
  mintAuthority: newAuthority,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

Core Candy Machineに新しい権限を割り当てる場合、コレクションアセットも同じ更新権限に更新する必要があります。

## ガードの更新

ガードで何か間違って設定しましたか？ミント価格について考えを変えましたか？ミントの開始を少し遅らせる必要がありますか？心配いりません。ガードは作成時に使用したのと同じ設定を使って簡単に更新できます。

設定を提供することで新しいガードを有効にしたり、空の設定を与えることで現在のガードを無効にしたりできます。

{% dialect-switcher title="ガードの更新" %}
{% dialect title="JavaScript" id="js" %}

Core Candy Machineのガードは、作成したのと同じ方法で更新できます。つまり、`updateCandyGuard`関数の`guards`オブジェクト内で設定を提供することです。`none()`に設定されているか提供されていないガードは無効になります。

`guards`オブジェクト全体が更新されることに注意してください。つまり、**既存のすべてのガードを上書きします**！

したがって、設定が変更されていない場合でも、有効にしたいすべてのガードの設定を提供するようにしてください。現在のガードにフォールバックするために、最初にCandy Guardアカウントを取得したい場合があります。

```tsx
import { some, none, sol } from '@metaplex-foundation/umi'

const candyGuard = await fetchCandyGuard(umi, candyGuardId)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: {
    ...candyGuard.guards,
    botTax: none(),
    solPayment: some({ lamports: sol(3), destination: treasury }),
  },
  groups: [
    // 空、またはグループを使用している場合はここにデータを追加
  ]
})
```

APIリファレンス: [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Candy Guardアカウントの手動ラップとアンラップ

これまで、ほとんどのプロジェクトで最も理にかなっているため、Core Candy MachineとCore Candy Guardアカウントを一緒に管理してきました。

しかし、Core Candy MachineとCore Candy Guardは、SDKを使用しても異なるステップで作成・関連付けできることを理解することが重要です。

最初に2つのアカウントを個別に作成し、手動で関連付け/関連付け解除する必要があります。

{% dialect-switcher title="Candy MachineからガードのAssociateとdissociate" %}
{% dialect title="JavaScript" id="js" %}

UmiライブラリーShopify`create`関数は、作成されたすべてのCandy Machineアカウントに対して新しいCandy Guardアカウントを作成・関連付けることを既に処理しています。

しかし、それらを別々に作成して手動で関連付け/関連付け解除したい場合は、以下のようにします。

```ts
import {
  some,
  percentAmount,
  sol,
  dateTime
} from '@metaplex-foundation/umi'
import {
  createCandyMachine,
  createCandyGuard,
  findCandyGuardPda,
  wrap,
  unwrap
} from '@metaplex-foundation/mpl-core-candy-machine'

// Candy GuardなしでCandy Machineを作成します。
const candyMachine = generateSigner(umi)
await createCandyMachine({
  candyMachine,
  tokenStandard: TokenStandard.NonFungible,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  sellerFeeBasisPoints: percentAmount(1.23),
  creators: [
    {
      address: umi.identity.publicKey,
      verified: false,
      percentageShare: 100
    },
  ],
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 3,
    prefixUri: 'https://example.com/',
    uriLength: 20,
    isSequential: false,
  }),
}).sendAndConfirm(umi)

// Candy Guardを作成します。
const base = generateSigner(umi)
const candyGuard = findCandyGuardPda(umi, { base: base.publicKey })
await createCandyGuard({
  base,
  guards: {
    botTax: { lamports: sol(0.01), lastInstruction: false },
    solPayment: { lamports: sol(1.5), destination: treasury },
    startDate: { date: dateTime('2022-10-17T16:00:00Z') },
  },
}).sendAndConfirm(umi)

// Candy GuardをCandy Machineに関連付けます。
await wrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)

// それらの関連付けを解除します。
await unwrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)
```

APIリファレンス: [createCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyMachine.html), [createCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyGuard.html), [wrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/wrap.html), [unwrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/unwrap.html)

{% /dialect %}
{% /dialect-switcher %}