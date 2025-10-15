---
title: Auction Houseの管理
metaTitle: Auction Houseの管理 | Auction House
description: Auction Houseの管理方法について説明します。
---

## はじめに

[前のページ](/legacy-documentation/auction-house/settings)では、Auction Houseのさまざまな設定について説明しました。それでは、これらの設定を使用してAuction Houseを作成および更新する方法を見ていきましょう。

また、Auction Houseを取得するさまざまな方法についても説明します。最後に、Auction Houseの手数料と財務アカウントから資金を引き出す方法を見ていきます。

## Auction Houseの作成

Auction Houseは、前のページで説明したすべての設定で作成できます。作成されたAuction HouseアカウントはAuction House**インスタンス**と呼ばれます。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Metaplex JS SDKを使用してAuction Houseを作成する例を見ていきましょう。デフォルトでは、現在のアイデンティティがAuction Houseの権限として使用されることに注意してください。さらに、デフォルトでは`SOL`が`treasuryMint`として設定されます。最後に、前のページで説明したヘルパーアカウントはAuction Houseによって自動的に生成されますが、Auction House作成時に手動で設定することもできます。

```tsx
const auctionHouseSettings = await metaplex
    .auctionHouse()
    .create({
        sellerFeeBasisPoints: 500 // 5%手数料
        authority: metaplex.identity(),
        requireSignOff: true,
        canChangeSalePrice: true,
        hasAuctioneer: true, // オークショニアを有効にする
        auctioneerAuthority: metaplex.identity(),
    });
```

{% /dialect %}
{% /dialect-switcher %}


## Auction Houseアカウント

Auction Houseインスタンスを作成したので、その中にどのようなデータが保存されているかを見てみましょう。

まず、すでに説明したすべての設定が保存されます。これらの設定に加えて、Auction Houseアカウントには、Auction Houseインスタンスの作成に使用されたウォレットのアドレスを指す`creator`フィールドが保存されます。

最後に、Auction HouseインスタンスはPDAアカウントのアドレスを導出するために使用されるPDAバンプも保存します。

> PDAで構築する場合、アカウントデータ自体にバンプシードを保存するのが一般的です。これにより、開発者はバンプを命令引数として渡すことなく、PDAを簡単に検証できます。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Auction Houseアカウントモデルは、[`AuctionHouse`モデルのAPIリファレンス](https://metaplex-foundation.github.io/js/types/js.AuctionHouse.html)で調べることができます。

以下は、Auction Houseの属性のいくつかを示す小さなコード例です。

```tsx
const { auctionHouse } = await metaplex.auctionHouse().create({...});

auctionHouse.address;                   // Auction Houseアカウントの公開鍵
auctionHouse.auctionHouseFeeAccount;    // Auction House手数料アカウントの公開鍵
auctionHouse.feeWithdrawalDestination;  // Auction House手数料アカウントから資金を引き出すアカウントの公開鍵
auctionHouse.treasuryMint;              // Auction House通貨として使用されるトークンのミントアドレス
auctionHouse.authority;                 // Auction House権限の公開鍵
auctionHouse.creator;                   // Auction Houseインスタンスの作成に使用されたアカウントの公開鍵
auctionHouse.bump;                      // Auction Houseインスタンスの`Bump`
auctionHouse.feePayerBump;              // 手数料アカウントの`Bump`
auctionHouse.treasuryBump;              // 財務アカウントの`Bump`
auctionHouse.auctioneerAddress;         // `Auctioneer`アカウントの公開鍵
```

{% /dialect %}
{% /dialect-switcher %}

## Auction Houseの取得

作成されると、Auction Houseインスタンスを取得できます。Auction Houseは、そのPDAアカウントアドレスまたはクリエーターアドレスと財務ミントアドレスの組み合わせによって一意に識別できます。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Auction Houseは2つの方法で取得できます：

1. **アドレスで**: Auction Houseアドレスを使用
2. **クリエーターとミントで**: `creator`アドレスと財務ミントの組み合わせを使用。Auction Houseでオークショニアが有効になっている場合、クリエーターとミントに加えて`auctioneerAuthority`も必要であることに注意してください。

```tsx
// アドレスで
const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({ address: new PublicKey("Gjwc...thJS") });

// クリエーターとミントで
// この例では、Auction Houseで
// オークショニアが有効になっていないと仮定します
const auctionHouse = await metaplex
    .auctionHouse()
    .findByCreatorAndMint({
        creator: new PublicKey("Gjwc...thJS"),
        treasuryMint: new PublicKey("DUST...23df")
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 設定の更新

Candy Machineの場合と同様に、Auction Houseインスタンスを作成したら、Auction Houseインスタンスの権限である限り、ほとんどの設定を後で更新できます。以下の設定を更新できます：`authority`、`sellerFeeBasisPoints`、`requiresSignOff`、`canChangeSalePrice`、`feeWithdrawalDestination`、`treasuryWithdrawalDestination`、`auctioneerScopes`。

すでに説明したように、Auction Houseの権限は更新できる設定の1つであり、現在の権限が署名者であり、新しい権限のアドレスが記載されている限りです。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

設定を更新するには、現在のデータと提供されたデータを比較するために完全なモデルが必要です。たとえば、`feeWithdrawalDestination`のみを更新したい場合は、他のすべてのプロパティを同じに保ちながらデータを更新する命令を送信する必要があります。

また、デフォルトでは、`feeWithdrawalDestination`と`treasuryWithdrawalDestination`は`metaplex.identity()`、つまり、デフォルトで権限とクリエーターとして設定されているのと同じウォレットに設定されます。

```tsx
import { Keypair } from "@solana/web3.js";

const currentAuthority = Keypair.generate();
const newAuthority = Keypair.generate();
const newFeeWithdrawalDestination = Keypair.generate();
const newTreasuryWithdrawalDestination = Keypair.generate();
const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({...});

const updatedAuctionHouse = await metaplex
    .auctionHouse()
    .update({
        auctionHouse,
        authority: currentAuthority,
        newAuthority: newAuthority.address,
        sellerFeeBasisPoints: 100,
        requiresSignOff: true,
        canChangeSalePrice: true,
        feeWithdrawalDestination: newFeeWithdrawalDestination,
        treasuryWithdrawalDestination: newTreasuryWithdrawalDestination
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 資金の引き出し

前のページでAuction Houseのさまざまなヘルパーアカウントについて説明しました。これらは**手数料アカウント**と**財務アカウント**です。

これらのアカウントの両方から、資金を「宛先」ウォレットに戻すことができます。これらの引き出し先アカウントは、Auction House権限によって設定できます。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下は、資金を転送するコードスニペットです。

1. Auction House手数料ウォレットから手数料引き出し先ウォレットへ。
2. Auction House財務ウォレットから財務引き出し先ウォレットへ資金を転送します。

どちらの場合も、資金が転送されるAuction Houseと引き出される資金の額を指定する必要があります。この額は、SOLまたはAuction Houseが通貨として使用するSPLトークンのいずれかになります。

```tsx
// 手数料アカウントから資金を引き出す
await metaplex
    .auctionHouse()
    .withdrawFromFeeAccount({
        auctionHouse,
        amount: 5
    });

// 財務アカウントから資金を引き出す
await metaplex
    .auctionHouse()
    .withdrawFromTreasuryAccount({
        auctionHouse,
        amount: 10
    });
```

{% /dialect %}
{% /dialect-switcher %}

## まとめ

この時点で、Auction Houseの設定、Auction Houseインスタンスが保存するデータ、このデータを作成および更新する方法について説明しました。ただし、Auction Houseでアセットがどのように取引されるかはまだわかっていません。これについては[次のページ](/legacy-documentation/auction-house/trading-assets)で説明します。
