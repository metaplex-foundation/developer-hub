---
title: Core Candy Machineの更新
metaTitle: Core Candy Machineの更新 | Core Candy Machine
description: Core Candy Machineの設定更新、権限の再割り当て、ガードの変更、Candy Guardアカウントの手動ラップとアンラップの方法を学びます。
keywords:
  - core candy machine
  - update candy machine
  - candy machine settings
  - candy guard update
  - set mint authority
  - solana NFT
  - metaplex
  - mpl-core-candy-machine
  - wrap candy guard
  - unwrap candy guard
  - guard configuration
  - candy machine authority
about:
  - Core Candy Machine configuration updates
  - Candy Guard management on Solana
  - Metaplex mpl-core-candy-machine SDK
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: ミント開始後にitemsAvailableの数を変更できますか？
    a: いいえ。itemsAvailableを含むいくつかのCore Candy Machine設定は、最初のアイテムがミントされた後にロックされます。ミントが発生する前にこれらのフィールドを更新してください。
  - q: Candy Guardsを更新すると既存のガード設定はすべて置き換えられますか？
    a: はい。updateCandyGuard関数はguardsオブジェクト全体を上書きします。設定が変更されていないガードも含めて、保持したいすべてのガードを含める必要があります。最初に現在のガードアカウントを取得し、その値を更新呼び出しにスプレッドしてください。
  - q: Candy Machine権限を再割り当てする際にコレクション権限も更新する必要がありますか？
    a: はい。Core Candy Machine権限とコレクションアセット更新権限は一致する必要があります。setMintAuthorityを呼び出した後、コレクションアセットも同じ新しい権限を使用するように更新してください。
  - q: Candy Guardのラップとアンラップの違いは何ですか？
    a: ラップはCandy GuardアカウントをCore Candy Machineに関連付け、ミント中にガードルールが強制されるようにします。アンラップはそれらを切り離し、ガードの強制を解除します。ほとんどのプロジェクトはガードを常にラップされた状態に保ちます。
---

## 概要

`updateCandyMachine`関数は、初期作成後にCore Candy Machineのオンチェーン設定を変更し、`updateCandyGuard`はミントアクセスを制御する[ガード](/ja/smart-contracts/core-candy-machine/guards)を変更できます。

- `itemsAvailable`、`isMutable`、[Config Line Settings](/ja/smart-contracts/core-candy-machine/create#config-line-settings)、[Hidden Settings](/ja/smart-contracts/core-candy-machine/create#hidden-settings)などのCandy Machineデータフィールドを更新
- `setMintAuthority`を使用してミント権限を新しいウォレットに再割り当て
- `updateCandyGuard`でガードルールを変更 -- guardsオブジェクト全体が各更新で置き換えられることに注意
- `wrap`と`unwrap`を使用してCandy Guardアカウントを手動で関連付けまたは切り離し
{.lead}

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

## 更新関数の引数

`updateCandyMachine`関数は、Candy Machineのパブリックキーと変更するフィールドを含む`data`オブジェクトを受け取ります。

{% dialect-switcher title="Core Candy Machine更新引数" %}
{% dialect title="JavaScript" id="js" %}

| 名前         | タイプ      | 説明                                   |
| ------------ | --------- | --------------------------------------------- |
| candyMachine | publicKey | 更新するCandy Machineのパブリックキー  |
| data         | data      | 更新された設定を含むオブジェクト         |

{% /dialect %}
{% /dialect-switcher %}

{% callout type="warning" %}
一部の設定はミントが開始された後では変更できません。最初のミントが発生する前に設定を確定してください。
{% /callout %}

### Candy Machineデータオブジェクト

`data`オブジェクトはCore Candy Machineの可変設定を定義します。変更したいフィールドを含むこのオブジェクトを`updateCandyMachine`に渡します。

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

- [ConfigLineSettingsArgs](/ja/smart-contracts/core-candy-machine/create#config-line-settings)
- [HiddenSettingsArgs](/ja/smart-contracts/core-candy-machine/create#hidden-settings)

{% /dialect %}
{% /dialect-switcher %}

## 新しい権限の割り当て

`setMintAuthority`関数は、Core Candy Machineのミント権限を新しいウォレットアドレスに転送します。現在の権限と新しい権限の両方がトランザクションに署名する必要があります。

export declare type SetMintAuthorityInstructionAccounts = {
/**Candy Machineアカウント。 \*/
candyMachine: PublicKey | Pda;
/** Candy Machine権限 _/
authority?: Signer;
/\*\* 新しいCandy Machine権限_/
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

{% callout type="warning" %}
Core Candy Machineに新しい権限を割り当てる場合、コレクションアセットも同じ更新権限に更新する必要があります。Candy Machine権限とコレクション更新権限が一致しないとミントが失敗します。
{% /callout %}

## ガードの更新

`updateCandyGuard`関数は、Candy Guardアカウントの[ガード](/ja/smart-contracts/core-candy-machine/guards)設定全体を置き換えます。ミント価格の変更、開始日の調整、新しいガードの有効化、既存ガードの無効化に使用します。

設定を提供することで新しいガードを有効にしたり、空の設定を与えることで現在のガードを無効にしたりできます。

{% dialect-switcher title="ガードの更新" %}
{% dialect title="JavaScript" id="js" %}

Core Candy Machineのガードは、作成したのと同じ方法で更新できます。つまり、`updateCandyGuard`関数の`guards`オブジェクト内で設定を提供することです。`none()`に設定されているか提供されていないガードは無効になります。

{% callout type="warning" %}
`guards`オブジェクト全体が更新されることに注意してください。つまり、**既存のすべてのガードを上書きします**。設定が変更されていない場合でも、有効にしたいすべてのガードの設定を提供するようにしてください。現在のガードにフォールバックするために、最初にCandy Guardアカウントを取得してください。
{% /callout %}

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

## Candy Guardアカウントのラップとアンラップ

ラップはCandy GuardをCore Candy Machineに関連付け、ミント中にガードルールが強制されるようにします。アンラップはそれらを切り離します。ほとんどのプロジェクトは両方のアカウントを一緒に作成しますが、必要に応じて独立して管理できます。

最初に2つのアカウントを個別に作成し、手動で関連付け/関連付け解除する必要があります。

{% dialect-switcher title="Candy Machineからガードの関連付けと解除" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリの`create`関数は、作成されたすべてのCandy Machineアカウントに対して新しいCandy Guardアカウントを作成・関連付けることを既に処理しています。

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

## 注意事項

- `itemsAvailable`を含むいくつかのCandy Machine設定は、最初のアイテムがミントされた後にロックされます。ミント開始前にすべてのデータフィールドを確定してください。
- `updateCandyGuard`を呼び出すと`guards`オブジェクト**全体**が置き換えられます。変更を適用する前に常に現在のガード状態を取得し、既存の値をスプレッドしてください。そうしないと、意図せずアクティブなガードが無効になります。
- Core Candy Machine権限とコレクションアセット更新権限は一致する必要があります。`setMintAuthority`で権限を再割り当てした場合、コレクションアセットの権限も更新してください。
- ラップとアンラップはガードの作成とは別の操作です。Candy Guardは、Candy Machineにラップ（関連付け）されるまでミントに影響を与えません。

## FAQ

### ミント開始後にitemsAvailableの数を変更できますか？

いいえ。`itemsAvailable`を含むいくつかのCore Candy Machine設定は、最初のアイテムがミントされた後にロックされます。ミントが発生する前にこれらのフィールドを更新してください。

### Candy Guardsを更新すると既存のガード設定はすべて置き換えられますか？

はい。`updateCandyGuard`関数は`guards`オブジェクト全体を上書きします。設定が変更されていないガードも含めて、保持したいすべてのガードを含める必要があります。最初に現在のガードアカウントを取得し、その値を更新呼び出しにスプレッドしてください。

### Candy Machine権限を再割り当てする際にコレクション権限も更新する必要がありますか？

はい。Core Candy Machine権限とコレクションアセット更新権限は一致する必要があります。`setMintAuthority`を呼び出した後、コレクションアセットも同じ新しい権限を使用するように更新してください。

### Candy Guardのラップとアンラップの違いは何ですか？

ラップはCandy GuardアカウントをCore Candy Machineに関連付け、ミント中にガードルールが強制されるようにします。アンラップはそれらを切り離し、ガードの強制を解除します。ほとんどのプロジェクトはガードを常にラップされた状態に保ちます。

