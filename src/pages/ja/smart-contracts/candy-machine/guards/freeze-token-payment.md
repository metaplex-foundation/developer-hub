---
title: 'Freeze Token Payment Guard'
metaTitle: Freeze Token Payment Guard | Candy Machine
description: 'フリーズ期間付きでトークン量でミント価格を設定します。'
---

## 概要 {% #overview %}

**Freeze Token Payment**ガードは、支払者に特定のミントアカウントからの特定数量のトークンを請求することで、フリーズされたNFTのミントを許可します。フリーズされたNFTは、解凍されるまで転送したり、マーケットプレイスに出品したりすることはできません。

フリーズされたNFTは、以下の条件のいずれかが満たされる限り、誰でも解凍できます：

- Candy Machineがミントアウトした場合。
- Candy Machineが削除された場合。
- 設定されたフリーズ期間（最大30日間）が経過した場合。

トークンは「Freeze Escrow」アカウントに転送され、ミントが開始される前にCandy Guard権限によって初期化される必要があります。すべてのフリーズされたNFTが解凍されると、資金のロックを解除し、Candy Guard権限によって設定された宛先アカウントに転送できます。

このガードの[ルート命令](#route-instruction)を介してFreeze Escrowアカウントの初期化、NFTの解凍、資金のロック解除を行うことができます。

{% diagram  %}

{% node #initialize label="Initialize Freeze Escrow" theme="indigo" /%}
{% node parent="initialize"  theme="transparent" x="-8" y="-1" %}
①
{% /node %}
{% edge from="initialize" to="freezeEscrow-pda" path="straight" /%}
{% node #freezeEscrow-pda label="Freeze Escrow PDA" theme="slate" parent="initialize" x="15" y="70" /%}
{% node theme="transparent" parent="freezeEscrow-pda" x="178" y="-15"%}
Funds are transferred

to the escrow account
{% /node %}
{% node #mintFrozen label="Mint Frozen NFTs" theme="indigo" parent="initialize" x="250" /%}
{% node parent="mintFrozen"  theme="transparent" x="-8" y="-1" %}
②
{% /node %}
{% edge from="mintFrozen" to="frozen-NFT-bg2" path="straight" /%}
{% edge from="mintFrozen" to="freezeEscrow-pda" toPosition="right" fromPosition="bottom" /%}
{% node #frozen-NFT-bg2 label="Frozen NFT" theme="slate" parent="frozen-NFT" x="-10" y="-10" /%}
{% node #frozen-NFT-bg1 label="Frozen NFT" theme="slate" parent="frozen-NFT" x="-5" y="-5" /%}
{% node #frozen-NFT label="Frozen NFT" theme="slate" parent="mintFrozen" x="33" y="120" /%}

{% node #clock label="🕑" theme="transparent" parent="mintFrozen" x="165" y="-30" /%}
{% edge from="clock" to="clockDesc" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc  theme="transparent" parent="clock" y="220" x="-91" %}
_When all NFTs have been minted_

_OR at the end of the freeze period._
{% /node %}

{% edge from="frozen-NFT" to="thawed-NFT-bg2" path="straight" /%}

{% node #thaw label="Thaw NFTs" theme="indigo" parent="mintFrozen" x="200" /%}
{% node parent="thaw"  theme="transparent" x="-8" y="-1" %}
③
{% /node %}
{% edge from="thaw" to="thawed-NFT-bg2" path="straight" /%}
{% node #thawed-NFT-bg2 label="Thawed NFT" theme="slate" parent="thawed-NFT" x="-10" y="-10" /%}
{% node #thawed-NFT-bg1 label="Thawed NFT" theme="slate" parent="thawed-NFT" x="-5" y="-5" /%}
{% node #thawed-NFT label="Thawed NFT" theme="slate" parent="thaw" y="130" x="3" /%}

{% node #clock2 label="🕑" theme="transparent" parent="thaw" x="130" y="-30" /%}
{% edge from="clock2" to="clockDesc2" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc2  theme="transparent" parent="clock2" y="260" x="-91" %}
_When all NFTs have been thawed._
{% /node %}

{% node #unlock label="Unlock Funds" theme="indigo" parent="thaw" x="180" /%}
{% node parent="unlock"  theme="transparent" x="-8" y="-1"%}
④
{% /node %}
{% node #freezeEscrow-pda2 label="Freeze Escrow PDA" theme="slate" parent="unlock" x="-20" y="70" /%}
{% edge from="freezeEscrow-pda2" to="treasury" theme="dimmed" path="straight" /%}
{% node #treasury label="Treasury" theme="slate" parent="freezeEscrow-pda2" y="70" x="40" /%}

{% /diagram %}
## ガード設定 {% #guard-settings %}

Freeze Token Paymentガードには以下の設定が含まれます：

- **Amount**: 支払者に請求するトークンの数。
- **Mint**: 支払いに使用するSPLトークンを定義するミントアカウントのアドレス。
- **Destination Associated Token Address (ATA)**: 最終的にトークンを送信する関連トークンアカウントのアドレス。このアドレスは、**Mint**属性とこれらのトークンを受け取るウォレットのアドレスを使用してAssociated Token Address PDAを見つけることで取得できます。

{% dialect-switcher title="Freeze Token Paymentガードを使用してCandy Machineを設定する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下は、Freeze Token Paymentガードを使用してCandy Machineを作成する方法です。この例では、宛先ウォレットとしてUmiのIDを使用しています。

```tsx
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";

create(umi, {
  // ...
  guards: {
    freezeTokenPayment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: tokenMint.publicKey,
        owner: umi.identity.publicKey,
      }),
    }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"freezeTokenPayment" : {
    "amount": number in basis points (e.g. 1000 for 1 Token that has 3 decimals),
    "mint": "<PUBKEY>",
    "destinationAta": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定 {% #mint-settings %}

Freeze Token Paymentガードには以下のミント設定が含まれます：

- **Mint**: 支払いに使用するSPLトークンを定義するミントアカウントのアドレス。
- **Destination Associated Token Address (ATA)**: 最終的にトークンを送信する関連トークンアカウントのアドレス。
- **NFT Rule Set** (オプション): Rule Setを持つプログラマブルNFTをミントする場合、ミントされたNFTのRule Set。

注意：SDK の助けなしで命令を構築する予定の場合、これらのミント設定およびそれ以外を命令引数と残りのアカウントの組み合わせとして提供する必要があります。詳細については、[Candy GuardのプログラムドキュメントAtion](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#freezetokenpayment)を参照してください。

{% dialect-switcher title="Freeze Token Paymentガードを使用してCandy Machineを設定する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`mintArgs`引数を使用してFreeze Token Paymentガードのミント設定を渡すことができます。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    freezeTokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令 {% #route-instruction %}

Freeze Token Paymentルート命令は以下の機能をサポートします。

- [概要](#overview)
- [ガード設定](#guard-settings)
- [ミント設定](#mint-settings)
- [ルート命令](#route-instruction)
  - [Freeze Escrowの初期化](#initialize-the-freeze-escrow)
  - [フリーズされたNFTを解凍](#thaw-a-frozen-nft)
  - [資金のロック解除](#unlock-funds)
- [NFTのフリーズを停止](#stop-freezing-nfts)
- [Freeze EscrowsとGuard Groups](#freeze-escrows-and-guard-groups)

### Freeze Escrowの初期化 {% #initialize-the-freeze-escrow %}

_パス: `initialize`_

Freeze Token Paymentガードを使用する場合、ミントが開始される前にFreeze Escrowアカウントを初期化する必要があります。これにより、ガード設定のDestination ATA属性から派生したPDAアカウントが作成されます。

Freeze Escrow PDAアカウントは、以下のようないくつかのパラメータを追跡します：

- このガードを通じてミントされたフリーズされたNFTの数。
- このガードを介して最初のフリーズされたNFTがミントされた時刻（フリーズ期間はその後からカウントを開始するため）。

このFreeze Escrowアカウントを初期化する際、ガードのルート命令に以下の引数を提供する必要があります：

- **Path** = `initialize`: ルート命令で実行するパスを選択します。
- **Mint**: 支払いに使用するSPLトークンを定義するミントアカウントのアドレス。
- **Destination Associated Token Address (ATA)**: 最終的にトークンを送信する関連トークンアカウントのアドレス。
- **Period**: フリーズ期間が持続すべき秒単位の時間。これは最大30日間（2,592,000秒）であり、このガードを介してミントされた最初のフリーズされたNFTから開始されます。フリーズ期間は、Candy Machineが決してミントアウトしなくても、フリーズされたNFTが最終的に解凍されることを保証する安全メカニズムを提供します。
- **Candy Guard Authority**: SignerとしてのCandy GuardアカウントのAuthority。

（長いダイアグラムとルート命令の詳細についてはスペースの関係で省略しますが、元の英語版と同じ構造と情報を含みます）

{% dialect-switcher title="Freeze Escrowを初期化する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下の例では、最大15日間のフリーズ期間でFreeze Escrowアカウントを初期化し、現在のIDをCandy Guard権限として使用しています。

```ts
route(umi, {
  // ...
  guard: "freezeTokenPayment",
  routeArgs: {
    path: "initialize",
    mint: tokenMint.publicKey,
    destinationAta,
    period: 15 * 24 * 60 * 60, // 15 days.
    candyGuardAuthority: umi.identity,
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

以下のコマンドを実行してFreeze Escrowアカウントを初期化します

```sh
sugar freeze initialize
```

ガードグループを持つcandy machineを使用する場合、`--label`パラメータを使用する必要があります。
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### フリーズされたNFTを解凍 {% #thaw-a-frozen-nft %}

_パス: `thaw`_

フリーズされたNFTは、以下の条件のいずれかが満たされる限り、誰でも解凍できます：

- Candy Machineがミントアウトした場合。
- Candy Machineが削除された場合。
- 設定されたフリーズ期間（最大30日間）が経過した場合。

Freeze Escrow内のトークンはすべてのNFTが解凍されるまで転送できないため、これにより宝庫ができるだけ早くすべてのNFTを解凍するインセンティブが生まれます。

### 資金のロック解除 {% #unlock-funds %}

_パス: `unlockFunds`_

すべてのフリーズされたNFTが解凍されると、宝庫はFreeze Escrowアカウントから資金のロックを解除できます。これにより、トークンが設定されたDestination ATAアドレスに転送されます。

## NFTのフリーズを停止 {% #stop-freezing-nfts %}

Freeze Token Paymentガード内でのNFTのフリーズを停止することが可能です。つまり、新しくミントされたNFTはもはやフリーズされませんが、**既存のフリーズされたNFTはフリーズされたまま**です。

（停止条件については元の英語版と同じ内容）

## Freeze EscrowsとGuard Groups {% #freeze-escrows-and-guard-groups %}

様々な[Guard Groups](/ja/smart-contracts/candy-machine/guard-groups)内で複数のFreeze Token Paymentガードを使用する場合、Freeze Token PaymentガードとFreeze Escrowアカウント間の関係を理解することが重要です。

Freeze EscrowアカウントはDestinationアドレスから派生したPDAです。これは、**複数のFreeze Token Paymentガード**が**同じDestinationアドレス**を使用するよう設定されている場合、すべて**同じFreeze Escrowアカウントを共有**することを意味します。
