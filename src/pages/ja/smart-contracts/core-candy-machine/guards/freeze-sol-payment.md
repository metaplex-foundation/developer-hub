---
title: 'Freeze Sol Payment ガード'
metaTitle: "Freeze Sol Paymentガード - SOLを課金しミント済みアセットを凍結 | Core Candy Machine"
description: "Freeze Sol Paymentガードは、支払者にSOLを課金し、ミントされたCore Assetを設定可能な期間凍結します。凍結されたアセットはルート命令で解凍されるまで転送できません。"
keywords:
  - freeze sol payment
  - Core Candy Machine
  - candy guard
  - frozen assets
  - freeze escrow
  - SOL payment
  - thaw NFT
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - SOL payment with asset freezing
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Freeze Sol Payment** ガードは、支払者にSOLを課金し、ミントされたCore Assetを設定可能な期間凍結し、アセットが解凍されるまで転送を防止します。 {% .lead %}

## 概要

**Freeze Sol Payment** ガードは、支払者から SOL で料金を徴収することで凍結された Asset のミントを可能にします。凍結された Asset は解凍されるまで転送やマーケットプレイスへの出品ができません。

凍結された Asset は、以下のいずれかの条件が満たされていれば誰でも解凍できます:

- Core Candy Machine がミントアウト(完売)した。
- Core Candy Machine が削除された。
- 設定された凍結期間(最大30日間)が経過した。

資金は「Freeze Escrow」アカウントに転送されます。このアカウントは、ミントを開始する前に Candy Guard 権限者によって初期化される必要があります。すべての凍結された Asset が解凍されると、Candy Guard 権限者によって資金のロックが解除され、設定された宛先アカウントに転送されます。

Freeze Escrow アカウントの初期化、Asset の解凍、資金のロック解除は、このガードの[ルート命令](#route-instruction)を介して行うことができます。

{% diagram  %}

{% node #initialize label="Initialize Freeze Escrow" theme="indigo" /%}
{% node parent="initialize"  theme="transparent" x="-8" y="-1" %}
①
{% /node %}
{% edge from="initialize" to="freezeEscrow-pda" path="straight" /%}
{% node #freezeEscrow-pda label="Freeze Escrow PDA" theme="slate" parent="initialize" x="15" y="70" /%}
{% node theme="transparent" parent="freezeEscrow-pda" x="178" y="-15"%}
資金はエスクローアカウント

に転送されます
{% /node %}
{% node #mintFrozen label="凍結された Asset をミント" theme="indigo" parent="initialize" x="250" /%}
{% node parent="mintFrozen"  theme="transparent" x="-8" y="-1" %}
②
{% /node %}
{% edge from="mintFrozen" to="frozen-NFT-bg2" path="straight" /%}
{% edge from="mintFrozen" to="freezeEscrow-pda" toPosition="right" fromPosition="bottom" /%}
{% node #frozen-NFT-bg2 label="凍結された Asset" theme="slate" parent="frozen-NFT" x="-10" y="-10" /%}
{% node #frozen-NFT-bg1 label="凍結された Asset" theme="slate" parent="frozen-NFT" x="-5" y="-5" /%}
{% node #frozen-NFT label="凍結された Asset" theme="slate" parent="mintFrozen" x="33" y="120" /%}

{% node #clock label="🕑" theme="transparent" parent="mintFrozen" x="165" y="-30" /%}
{% edge from="clock" to="clockDesc" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc  theme="transparent" parent="clock" y="220" x="-91" %}
_すべての Asset がミントされた場合_

_または凍結期間の終了時。_
{% /node %}

{% edge from="frozen-NFT" to="thawed-NFT-bg2" path="straight" /%}

{% node #thaw label="Asset を解凍" theme="indigo" parent="mintFrozen" x="200" /%}
{% node parent="thaw"  theme="transparent" x="-8" y="-1" %}
③
{% /node %}
{% edge from="thaw" to="thawed-NFT-bg2" path="straight" /%}
{% node #thawed-NFT-bg2 label="解凍された Asset" theme="slate" parent="thawed-NFT" x="-10" y="-10" /%}
{% node #thawed-NFT-bg1 label="解凍された Asset" theme="slate" parent="thawed-NFT" x="-5" y="-5" /%}
{% node #thawed-NFT label="解凍された Asset" theme="slate" parent="thaw" y="130" x="3" /%}

{% node #clock2 label="🕑" theme="transparent" parent="thaw" x="130" y="-30" /%}
{% edge from="clock2" to="clockDesc2" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc2  theme="transparent" parent="clock2" y="260" x="-91" %}
_すべての Asset が解凍された場合。_
{% /node %}

{% node #unlock label="資金のロックを解除" theme="indigo" parent="thaw" x="180" /%}
{% node parent="unlock"  theme="transparent" x="-8" y="-1"%}
④
{% /node %}
{% node #freezeEscrow-pda2 label="Freeze Escrow PDA" theme="slate" parent="unlock" x="-20" y="70" /%}
{% edge from="freezeEscrow-pda2" to="treasury" theme="dimmed" path="straight" /%}
{% node #treasury label="Treasury" theme="slate" parent="freezeEscrow-pda2" y="70" x="40" /%}

{% /diagram %}
## ガード設定

Freeze Sol Payment ガードには以下の設定が含まれます:

- **Lamports**: 支払者に請求する SOL(またはlamports)の金額。
- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。

{% dialect-switcher title="Freeze Sol Payment ガードを使用して Candy Machine を設定" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```tsx
create(umi, {
  // ...
  guards: {
    freezeSolPayment: some({
      lamports: sol(1.5),
      destination: umi.identity.publicKey,
    }),
  },
})
```

API リファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [FreezeSolPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPayment.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
config.json ファイルの guard セクションに、このオブジェクトを追加します:

```json
"freezeSolPayment" : {
    "value": SOL value,
    "destination": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Freeze Sol Payment ガードには以下のミント設定が含まれます:

- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。

注意: SDK の助けを借りずに命令を構築する場合は、これらのミント設定とその他を命令引数と残りアカウントの組み合わせとして提供する必要があります。詳細については、[Candy Guard のプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#freezesolpayment)を参照してください。

{% dialect-switcher title="Freeze Sol Payment ガードを使用してミント" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下のように `mintArgs` 引数を使用して、Freeze Sol Payment ガードのミント設定を渡すことができます。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    freezeSolPayment: some({ destination: umi.identity.publicKey }),
  },
})
```

API リファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [FreezeSolPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに sugar を使用してミントすることはできません - そのため、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

Freeze Sol Payment ルート命令は以下の機能をサポートしています。

- [概要](#概要)
- [ガード設定](#ガード設定)
- [ミント設定](#ミント設定)
- [ルート命令](#ルート命令)
  - [Freeze Escrow の初期化](#freeze-escrow-の初期化)
  - [凍結された Asset の解凍](#凍結された-asset-の解凍)
  - [資金のロック解除](#資金のロック解除)
- [Asset の凍結を停止](#asset-の凍結を停止)
- [Freeze Escrow とガードグループ](#freeze-escrow-とガードグループ)

### Freeze Escrow の初期化

_パス: `initialize`_

Freeze Sol Payment ガードを使用する場合、ミントを開始する前に Freeze Escrow アカウントを初期化する必要があります。これにより、ガードの設定の Destination 属性から派生した PDA アカウントが作成されます。

Freeze Escrow PDA アカウントは、以下のような複数のパラメータを追跡します:

- このガードを通じて何枚の凍結された Asset がミントされたか。
- 凍結期間はその後からカウントされるため、このガードを介して最初の凍結された Asset がいつミントされたか。

この Freeze Escrow アカウントを初期化する際は、ガードのルート命令に以下の引数を提供する必要があります:

- **Path** = `initialize`: ルート命令で実行するパスを選択します。
- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。
- **Period**: 凍結期間が継続すべき秒数での時間。これは最大30日間(2,592,000秒)で、このガードを介してミントされた最初の凍結された Asset から開始されます。凍結期間は、Candy Machine が完売しなくても、凍結された Asset が最終的に解凍されることを保証する安全機構を提供します。
- **Candy Guard Authority**: 署名者としての Candy Guard アカウントの権限。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}

所有者: Candy Machine Core Program {% .whitespace-nowrap %}

{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="所有者: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="- Amount"  /%}
{% node #destination label="- Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="415" %}
  {% node #candy-guard-route theme="pink" %}
    Path を使用したルート {% .whitespace-nowrap %}

    = *Initialize*
  {% /node %}
  {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="-4" theme="transparent" %}
  Freeze Escrow の初期化
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="220" y="13" label="Freeze Period" theme="slate" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}

{% edge from="candy-guard-route" to="freezeEscrow-PDA3" theme="pink" path="straight" y="-10" /%}

{% node #freezeEscrow-PDA3 parent="destination" x="390" y="-10" %}
  Freeze Escrow PDA
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="destination" to="freezeEscrow-PDA3" arrow="none" dashed=true path="straight" /%}

{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

最後に、Freeze Escrow PDA アカウントは、このガードを通じてミントされたすべての凍結された Asset の資金を受け取ります。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="所有者: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount"  /%}
{% node #destination label="Destination" /%}
{% node label="..." /%}
{% /node %}

{% node #freezeEscrow-PDA4 parent="destination" x="300" y="-8" theme="slate" %}
  Freeze Escrow PDA
{% /node %}
{% edge from="destination" to="freezeEscrow-PDA4" arrow="none" dashed=true path="straight" /%}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Route with

    Path = *Initialize*
  {% /node %}
    {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}
{% edge from="mint-candy-guard" to="freezeEscrow-PDA4" theme="pink" /%}

{% node parent="mint-candy-guard" y="150" x="2" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Core Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="130" theme="transparent" %}
  ミントロジック
{% /node %}

{% edge from="mint-candy-machine" to="frozen-NFT" path="straight" /%}
{% node #frozen-NFT parent="mint-candy-machine" y="120" x="29" theme="slate" %}
  凍結された Asset
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="Freeze Escrow を初期化" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下の例では、最大凍結期間を15日間として Freeze Escrow アカウントを初期化し、現在の identity を Candy Guard 権限として使用しています。

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'initialize',
    destination: umi.identity.publicKey,
    period: 15 * 24 * 60 * 60, // 15日間。
    candyGuardAuthority: umi.identity,
  },
})
```

API リファレンス: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [FreezeSolPaymentRouteArgsInitialize](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentRouteArgsInitialize.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 凍結された Asset の解凍

_パス: `thaw`_

凍結された Asset は、以下のいずれかの条件が満たされていれば誰でも解凍できます:

- Candy Machine がミントアウトした。
- Candy Machine が削除された。
- 設定された凍結期間(最大30日間)が経過した。

Freeze Escrow 内の資金はすべての Asset が解凍されるまで転送不可能であるため、これにより treasury はできるだけ早くすべての Asset を解凍するインセンティブが生まれます。

凍結された Asset を解凍するには、ガードのルート命令に以下の引数を提供する必要があります:

- **Path** = `thaw`: ルート命令で実行するパスを選択します。
- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。
- **Asset Address**: 解凍する凍結された Asset のミントアドレス。
- **Asset Owner**: 解凍する凍結された Asset の所有者のアドレス。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
  Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="-4" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Candy Machine Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount"  /%}
{% node #destination label="Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="427" y="-14" %}
  {% node #candy-guard-route theme="pink" %}
    Route with

    Path = *thaw*
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Core Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="80" theme="transparent" %}
  凍結された Asset を解凍
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="218" y="15" label="Freeze Escrow PDA" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="candy-machine" to="candy-guard-route" theme="pink" /%}
{% edge from="candy-guard" to="candy-guard-route" theme="pink" toPosition="left" /%}
{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}

{% edge from="candy-guard-route" to="freezeEscrow-PDA5" theme="pink" path="straight" /%}

{% node #frozen-NFT parent="candy-guard-route" y="-100" x="29" label="凍結された Asset" /%}
{% edge from="frozen-NFT" to="candy-guard-route" path="straight" /%}

{% node #freezeEscrow-PDA5 parent="candy-guard-route" x="25" y="150" label="解凍された Asset" /%}
{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="凍結された Asset を解凍" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下の例では、現在の identity に属する凍結された Asset を解凍しています。

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'thaw',
    destination,
    nftMint: nftMint.publicKey,
    nftOwner: umi.identity.publicKey,
    nftTokenStandard: candyMachine.tokenStandard,
  },
})
```

API リファレンス: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [FreezeSolPaymentRouteArgsThaw](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentRouteArgsThaw.html)

{% /totem %}
{% /dialect %}

{% /dialect-switcher %}

### 資金のロック解除

_パス: `unlockFunds`_

すべての凍結された Asset が解凍されると、treasury は Freeze Escrow アカウントから資金のロックを解除できます。これにより、資金が設定された Destination アドレスに転送されます。

資金のロックを解除するには、ガードのルート命令に以下の引数を提供する必要があります:

- **Path** = `unlockFunds`: ルート命令で実行するパスを選択します。
- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。
- **Candy Guard Authority**: 署名者としての Candy Guard アカウントの権限。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Candy Machine Core Program
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="19" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Candy Machine Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #guards label="Guards" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount"  /%}
{% node #destination label="Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="431" %}
  {% node #candy-guard-route theme="pink" %}
    Route with

    Path = *unlockFunds*
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}

{% node parent="candy-guard-route" y="-20" x="10" theme="transparent" %}
  エスクローから資金のロックを解除
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="220" y="15" label="Freeze Escrow PDA" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}

{% node parent="candy-guard-route" y="209" x="-18" %}
{% node #destination-wallet label="Destination Wallet" theme="indigo" /%}
{% node theme="dimmed" %}
所有者: Candy Machine Core Program
{% /node %}
{% /node %}
{% edge from="destination-wallet" to="destination" arrow="none" dashed=true /%}
{% edge from="candy-guard-route" to="destination-wallet" theme="pink" path="straight" %}
Freeze Escrow Account から

すべての資金を転送
{% /edge %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}

{% /diagram %}

{% separator h="6" /%}

{% dialect-switcher title="資金のロック解除" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下の例では、現在の identity を Candy Guard 権限として使用し、Freeze Escrow アカウントから資金のロックを解除しています。

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'unlockFunds',
    destination,
    candyGuardAuthority: umi.identity,
  },
})
```

API リファレンス: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [FreezeSolPaymentRouteArgsUnlockFunds](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentRouteArgsUnlockFunds.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Asset の凍結を停止

Freeze Sol Payment ガード内で Asset の凍結を停止することが可能です。つまり、新しくミントされる Asset は凍結されなくなりますが、**既存の凍結された Asset は凍結されたまま**です。

これを実現するにはいくつかの方法があり、2つのカテゴリに分けることができます:

- ☀️ **解凍可能**: 既存の凍結された Asset は、ルート命令の `thaw` パスを使用して誰でも解凍できます。
- ❄️ **解凍不可**: 既存の凍結された Asset はまだ解凍できず、「解凍可能」の条件の1つが満たされるまで待つ必要があります。

これを念頭に置いて、Asset の凍結を停止する方法と、それぞれが既存の凍結された Asset の解凍を許可するかどうかの完全なリストは以下の通りです:

- Candy Machine がミントアウトした → ☀️ **解凍可能**。
- 設定された凍結期間(最大30日間)が経過した → ☀️ **解凍可能**。
- Candy Machine アカウントが削除された → ☀️ **解凍可能**。
- Candy Guard アカウントが削除された → ❄️ **解凍不可**。
- Freeze Sol Payment ガードが設定から削除された → ❄️ **解凍不可**。

## Freeze Escrow とガードグループ

様々な[ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)内で複数の Freeze Sol Payment ガードを使用する場合、Freeze Sol Payment ガードと Freeze Escrow アカウントの関係を理解することが重要です。

Freeze Escrow アカウントは Destination アドレスから派生した PDA です。つまり、**複数の Freeze Sol Payment ガード**が**同じ Destination アドレス**を使用するように設定されている場合、それらはすべて**同じ Freeze Escrow アカウントを共有**します。

したがって、それらは同じ凍結期間を共有し、すべての資金は同じエスクローアカウントによって収集されます。これはまた、設定された Destination アドレスごとに `initialize` ルート命令を1回だけ呼び出す必要があることを意味します。これは、ルート命令が設定された Destination アドレスごとに1回だけ必要であることを意味します。`unlockFunds` についても同様です。`thaw` するには、同じエスクローアカウントを共有している限り、どのラベルでも使用できます。

異なる Destination アドレスを持つ複数の Freeze Sol Payment ガードを使用することも可能です。この場合、各 Freeze Sol Payment ガードは独自の Freeze Escrow アカウントと独自の凍結期間を持ちます。

以下の例は、3つのグループに3つの Freeze Sol Payment ガードを持つ Candy Machine を示しています:

- グループ1と2は同じ Destination アドレスを共有しているため、同じ Freeze Escrow アカウントを共有します。
- グループ3は独自の Destination アドレスを持っているため、独自の Freeze Escrow アカウントを持ちます。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="所有者: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guard Group 1" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount = 1 SOL" /%}
{% node #destination label="Destination A" /%}
{% node label="..." /%}
{% node #guards-2 label="Guard Group 2" theme="mint" z=1/%}
{% node #freezeSolPayment-2 label="Freeze Sol Payment" /%}
{% node #amount-2 label="Amount = 2 SOL" /%}
{% node #destination-2 label="Destination A" /%}
{% node label="..." /%}
{% node #guards-3 label="Guard Group 3" theme="mint" z=1/%}
{% node #freezeSolPayment-3 label="Freeze Sol Payment" /%}
{% node #amount-3 label="Amount = 3 SOL" /%}
{% node #destination-3 label="Destination B" /%}
{% node label="..." /%}
{% /node %}
{% /node %}

{% node #freezeEscrow-PDA-A parent="destination" x="220" y="-22" %}
  Freeze Escrow PDA

  Destination A 用
{% /node %}
{% edge from="destination" to="freezeEscrow-PDA-A" arrow="none" dashed=true path="straight" /%}
{% edge from="destination-2" to="freezeEscrow-PDA-A" arrow="none" dashed=true toPosition="bottom" /%}

{% node parent="freezeEscrow-PDA-A" y="-125" x="-4" %}
  {% node #route-init-a theme="pink" %}
    Route with

    Path = *Initialize*
  {% /node %}
  {% node theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="route-init-a" y="-20" x="50" theme="transparent" %}
  Freeze Escrow の初期化
{% /node %}
{% edge from="route-init-a" to="freezeEscrow-PDA-A" theme="pink" path="straight" /%}

{% node #freeze-period-a parent="route-init-a" x="240" y="15" theme="slate" %}
  Freeze Period A
{% /node %}
{% edge from="freeze-period-a" to="route-init-a" theme="pink" path="straight" /%}

{% node #freezeEscrow-PDA-B parent="destination-3" x="420" y="-22" %}
  Freeze Escrow PDA

  Destination B 用
{% /node %}
{% edge from="destination-3" to="freezeEscrow-PDA-B" arrow="none" dashed=true path="straight" /%}

{% node parent="freezeEscrow-PDA-B" y="-125" x="-4" %}
  {% node #route-init-b theme="pink" %}
    Route with

    Path = *Initialize*
  {% /node %}
  {% node theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="route-init-b" y="-20" x="50" theme="transparent" %}
  Freeze Escrow の初期化
{% /node %}
{% edge from="route-init-b" to="freezeEscrow-PDA-B" theme="pink" path="straight" /%}

{% node #freeze-period-b parent="route-init-b" x="240" y="15" theme="slate" %}
  Freeze Period B
{% /node %}
{% edge from="freeze-period-b" to="route-init-b" theme="pink" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}

{% /diagram %}

## 注意事項

- Freeze Escrowアカウントは、ミントが開始される前に`initialize`ルート命令を介して初期化する必要があります。
- 最大凍結期間は30日間（2,592,000秒）です。期間は初期化時ではなく、最初の凍結されたアセットがミントされた時点から開始されます。
- Freeze Escrow内の資金は、すべての凍結されたアセットが解凍されるまでロック解除できません。
- 凍結されたアセットが存在する状態でCandy Guardアカウントを削除すると、別の解凍条件が満たされるまでそれらのアセットは永久に凍結されます。
- 複数のガードグループが同じDestinationアドレスを共有する場合、単一のFreeze EscrowとFreeze Periodを共有します。

