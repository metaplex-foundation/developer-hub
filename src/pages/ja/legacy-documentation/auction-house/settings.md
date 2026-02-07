---
title: 設定
metaTitle: 設定 | Auction House
description: Auction House設定について詳しく説明します。
---

## はじめに

このページでは、Auction Houseで利用可能な設定について説明します。これらの設定には、Auction Houseの動作を定義する一般的な設定、Auction Houseの操作をサポートするアカウント（PDA）の定義、Auction Houseプログラムにさらなる設定可能性を提供するより具体的な設定が含まれます。

## 権限

権限は、アカウント、この場合はAuction Houseインスタンスの使用を制御するウォレットです。権限アドレスは、Auction Houseを作成するときに指定できます。指定されていない場合、Auction Houseの作成に使用されているウォレットがデフォルトで権限になります。

権限は、Auction Houseの作成後に別のウォレットに転送することもでき、Auction Houseの制御が転送されます。このアクションは慎重に実行する必要があります。

権限ウォレットは、マーケットプレイスでリストできるアセットと入札できるビッドを保護するという別の重要な役割も果たします。[`requireSignOff`](#requiresignoff)について説明するときに、権限のこの機能についてさらに詳しく説明します。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

JS SDKを使用する場合、Auction Houseの権限は常にAuction Houseの作成に使用されているウォレットにデフォルト設定されます。authorityプロパティに有効な署名者を提供することで、この権限を明示的に設定できます。

```tsx
import { Keypair } from "@solana/web3.js";

const myCustomAuthority = Keypair.generate();
const auctionHouseSettings = {
  authority: myCustomAuthority,
};
```

{% /dialect %}
{% /dialect-switcher %}

## 取引設定

これらは、Auction Houseで設定できる取引固有の設定です。これらの設定は、ユーザーがマーケットプレイスとどのように対話するかを定義するのに役立ちます：

1. `treasuryMint`: これは、マーケットプレイスで交換通貨として使用されるSPL-tokenのミントアカウントを定義します。Solanaのほとんどのマーケットプレイスは通常、交換通貨として、またアセットの取引にSOLを使用します。この設定を使用して、Auction Houseの権限は、特定のマーケットプレイスでアセットの売買に使用される任意のSPL-tokenを設定できます。

2. `sellerFeeBasisPoints`: これは、マーケットプレイスが特定のマーケットプレイスでのすべてのアセットの各販売で受け取るセカンダリセールロイヤリティを定義します。`250`は`2.5%`のロイヤリティシェアを意味します。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

このスニペットでは、spl-tokenを作成し、それをAuction Houseの`treasuryMint`として設定しています。また、`sellerFeeBasisPoints`を使用してマーケットプレイスロイヤリティを設定しています。

```tsx
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const myKeypair = Keypair.generate();
const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed',
);
const myCustomToken = splToken.Token.createMint(connection, myKeypair, myKeypair.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID)
const auctionHouseSettings = {
    treasuryMint: myCustomToken,
    sellerFeeBasisPoints: 150
};
```

{% /dialect %}
{% /dialect-switcher %}

## ヘルパーアカウント

Auction Houseが適切に機能するために必要ないくつかのアカウントがあります。Auction Houseによって設定されると、権限はこれらのアカウントをリセットして、好みに応じて設定できます。

Auction Houseプログラムによって作成および制御されるアカウントがいくつかあります。これらのアカウントはプログラム派生アドレス（PDA）であり、[こちら](https://solanacookbook.com/core-concepts/pdas.html)で詳しく読むことができます。これらは、これらのアカウントを設定するために使用できる2つの設定です：

1. `auctionHouseFeeAccount`: ユーザーに代わってAuction House関連のトランザクションの支払いに資金を保存する手数料アカウントの公開鍵。

2. `auctionHouseTreasury`: マーケットプレイスロイヤリティとして、すべての販売で受け取った資金を保存する財務アカウントの公開鍵。

Auction Houseプログラムによって作成されたものではなく、Auction Houseからさまざまなタイプの資金を権限に引き出すために不可欠な他のアカウントがあります：

1. `feeWithdrawalDestination`: 手数料アカウントから資金を引き出すことができるアカウントの公開鍵。

2. `treasuryWithdrawalDestination`: 財務アカウントから資金を引き出すことができるアカウントの公開鍵。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下のコードスニペットは、上記で説明した4つのアカウントに対応する4つの異なるkeypairを構築し、それらを設定します。

```tsx
import { Keypair } from "@solana/web3.js";

const feeAccount = Keypair.generate();
const treasuryAccount = Keypair.generate();
const feeWithdrawalDestination = Keypair.generate();
const treasuryWithdrawalDestination = Keypair.generate();
const auctionHouseSettings = {
    auctionHouseFeeAccount: feeAccount,
    auctionHouseTreasury: treasuryAccount,
    feeWithdrawalDestination: feeWithdrawalDestination,
    treasuryWithdrawalDestination: treasuryWithdrawalDestination,
};
```

{% /dialect %}
{% /dialect-switcher %}

## サインオフを要求

この設定により、マーケットプレイスはアセットリストと販売をゲートできます。権限セクションで説明したように、Auction House権限はアセットのゲートに役割を果たします。この検閲または集中制御は、`requireSignOff = true`の場合にのみ発生します。

これが発生すると、マーケットプレイスでのすべてのトランザクション：リスティング、入札、販売の実行は、Auction House権限によって署名される必要があります。完全に分散化されたマーケットプレイスは、そのマーケットプレイスでのアクションの検閲または集中制御を避けるために、`requireSignOff`設定を`false`のままにすることを選択できます。

`requireSignOff = true`を設定すると、他の力もあります：マーケットプレイスが独自のカスタムオーダーマッチングアルゴリズムを実装できるようになります。これについては次のセクションで詳しく説明します。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下のコードスニペットは、`requireSignOff`を`true`に設定します。

```tsx
const auctionHouseSettings = {
    requireSignOff: true
};
```

{% /dialect %}
{% /dialect-switcher %}

## 販売価格の変更可能性

`canChangeSalePrice`により、マーケットプレイスは、ユーザーが意図的にアセットを無料で、または0 SOL（または他のSPL-token）でリストしたときに、アセットの販売価格を変更できます。アセットを0 SOLでリストすることにより、ユーザーはマーケットプレイスがカスタムマッチングアルゴリズムを適用して、「無料で」リストされたアセットに最適な価格マッチを見つけることを許可します。

ここで注意すべき重要な点は、`canChangeSalePrice`は、`requireSignOff`も`true`に設定されている場合にのみ`true`に設定できることです。これは、パーミッションレスのリストと入札の場合、カスタムマッチングは不可能だからです。Auction Houseは、一致するビッドに「サインオフ」してアセットの販売を実行できる必要があります。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下のコードスニペットは、`canChangeSalePrice`を`true`に設定し、同時に`requireSignOff`も`true`であることを確認します

```tsx
const auctionHouseSettings = {
    requireSignOff: true,
    canChangeSalePrice: true
};
```

{% /dialect %}
{% /dialect-switcher %}

## オークショニア設定

`Auctioneer`アカウントは、Auction HouseプログラムのコンポーザビリティパターンをAuction Houseインスタンスを制御するために使用するPDAです。

オークショニアは、オークショニアガイド（*近日公開*）で説明する`DelegateAuctioneer`命令を使用して、Auction Houseインスタンスに制御または委任を与えることができます。

Auction Houseで設定できるオークショニアに関連する3つの設定があります：

1. `hasAuctioneer`: 特定のAuction Houseインスタンスに`Auctioneer`インスタンスが存在する場合はTrue。
2. `auctioneerAuthority`: オークショニア権限キー。Auction Houseでオークショニアを有効にする場合に必要です。
3. `auctioneerScopes`: オークショニアでユーザーが利用できるスコープのリスト、例：Bid、List、Execute Sale。Auction Houseでオークショニアが有効になっている場合にのみ適用されます。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下のコードスニペットは、`hasAuctioneer`を`true`に設定します。また、`auctioneerAuthority`を生成された公開鍵に向け、`auctioneerScopes`を設定して、オークショニアがAuction Houseに代わって購入、販売、販売の実行を許可します。

```tsx
import { Keypair } from "@solana/web3.js";
import { AuthorityScope } from '@metaplex-foundation/mpl-auction-house';

const newAuthority = Keypair.generate();
const auctionHouseSettings = {
    hasAuctioneer: true,
    auctioneerAuthority: newAuthority,
    auctioneerScopes: [
        AuthorityScope.Buy,
        AuthorityScope.Sell,
        AuthorityScope.ExecuteSale,
    ]
};
```

{% /dialect %}
{% /dialect-switcher %}

## まとめ
Auction House設定について理解したので、[次のページ](/legacy-documentation/auction-house/manage)では、それらを使用して独自のAuction Houseを作成および更新する方法を見ていきます。
