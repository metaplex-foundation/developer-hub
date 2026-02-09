---
title: Freeze Sol Payment Guard
metaTitle: Freeze Sol Payment Guard | Candy Machine
description: 'フリーズ期間付きでSOLでミント価格を設定します。'
---

## 概要

**Freeze Sol Payment**ガードは、支払者にSOLの金額を請求することで、フリーズされたNFTのミントを許可します。フリーズされたNFTは、解凍されるまで転送したり、マーケットプレイスに出品したりすることはできません。

フリーズされたNFTは、以下の条件のいずれかが満たされる限り、誰でも解凍できます：

- Candy Machineがミントアウトした場合。
- Candy Machineが削除された場合。
- 設定されたフリーズ期間（最大30日間）が経過した場合。

資金は「Freeze Escrow」アカウントに転送され、ミントが開始される前にCandy Guard権限によって初期化される必要があります。すべてのフリーズされたNFTが解凍されると、資金のロックを解除し、Candy Guard権限によって設定された宛先アカウントに転送できます。

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
## ガード設定

Freeze Sol Paymentガードには以下の設定が含まれます：

- **Lamports**: 支払者に請求するSOL（またはlamports）の金額。
- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。

{% dialect-switcher title="Freeze Sol Paymentガードを使用してCandy Machineを設定する" %}
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

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [FreezeSolPayment](https://mpl-candy-machine.typedoc.metaplex.com/types/FreezeSolPayment.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

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

Freeze Sol Paymentガードには以下のミント設定が含まれます：

- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。
- **NFT Rule Set** (オプション): Rule Setを持つプログラマブルNFTをミントする場合、ミントされたNFTのRule Set。

注意：SDK の助けなしで命令を構築する予定の場合、これらのミント設定およびそれ以外を命令引数と残りのアカウントの組み合わせとして提供する必要があります。詳細については、[Candy GuardのプログラムドキュメントAtion](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#freezesolpayment)を参照してください。

{% dialect-switcher title="Freeze Sol Paymentガードでミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`mintArgs`引数を使用してFreeze Sol Paymentガードのミント設定を渡すことができます。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    freezeSolPayment: some({ destination: umi.identity.publicKey }),
  },
})
```

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [FreezeSolPaymentMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

Freeze Sol Paymentルート命令は以下の機能をサポートします。

- [概要](#overview)
- [ガード設定](#guard-settings)
- [ミント設定](#mint-settings)
- [ルート命令](#route-instruction)
  - [Freeze Escrowの初期化](#initialize-the-freeze-escrow)
  - [フリーズされたNFTを解凍](#thaw-a-frozen-nft)
  - [資金のロック解除](#unlock-funds)
- [NFTのフリーズを停止](#stop-freezing-nfts)
- [Freeze EscrowsとGuard Groups](#freeze-escrows-and-guard-groups)

### Freeze Escrowの初期化

_パス: `initialize`_

Freeze Sol Paymentガードを使用する場合、ミントが開始される前にFreeze Escrowアカウントを初期化する必要があります。これにより、ガード設定のDestination属性から派生したPDAアカウントが作成されます。

Freeze Escrow PDAアカウントは、以下のようないくつかのパラメータを追跡します：

- このガードを通じてミントされたフリーズされたNFTの数。
- このガードを介して最初のフリーズされたNFTがミントされた時刻（フリーズ期間はその後からカウントを開始するため）。

このFreeze Escrowアカウントを初期化する際、ガードのルート命令に以下の引数を提供する必要があります：

- **Path** = `initialize`: ルート命令で実行するパスを選択します。
- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。
- **Period**: フリーズ期間が持続すべき秒単位の時間。これは最大30日間（2,592,000秒）であり、このガードを介してミントされた最初のフリーズされたNFTから開始されます。フリーズ期間は、Candy Machineが決してミントアウトしなくても、フリーズされたNFTが最終的に解凍されることを保証する安全メカニズムを提供します。
- **Candy Guard Authority**: SignerとしてのCandy GuardアカウントのAuthority。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}

Owner: Candy Machine Core Program {% .whitespace-nowrap %}

{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="- Amount"  /%}
{% node #destination label="- Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="415" %}
  {% node #candy-guard-route theme="pink" %}
    Route with Path {% .whitespace-nowrap %}

    = *Initialize*
  {% /node %}
  {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="-4" theme="transparent" %}
  Initialize Freeze Escrow
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

最後に、Freeze Escrow PDAアカウントは、このガードを通じてミントされたすべてのフリーズされたNFTの資金を受け取ります。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
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
  Access Control
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
  Mint Logic
{% /node %}

{% edge from="mint-candy-machine" to="frozen-NFT" path="straight" /%}
{% node #frozen-NFT parent="mint-candy-machine" y="120" x="29" theme="slate" %}
  Frozen NFT
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

‎

{% dialect-switcher title="Freeze Escrowを初期化する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下の例では、最大15日間のフリーズ期間でFreeze Escrowアカウントを初期化し、現在のIDをCandy Guard権限として使用しています。

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'initialize',
    destination: umi.identity.publicKey,
    period: 15 * 24 * 60 * 60, // 15 days.
    candyGuardAuthority: umi.identity,
  },
})
```

APIリファレンス: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [FreezeSolPaymentRouteArgsInitialize](https://mpl-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentRouteArgsInitialize.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

以下のコマンドを実行してFreeze Escrowアカウントを初期化します

```sh
sugar freeze initialize
```

以下のパラメータを使用できます

```
    -c, --config <CONFIG>
            Path to the config file [default: config.json]

        --cache <CACHE>
            Path to the cache file, defaults to "cache.json" [default: cache.json]

        --candy-guard <CANDY_GUARD>
            Address of candy guard to update [defaults to cache value]

        --candy-machine <CANDY_MACHINE>
            Address of candy machine to update [defaults to cache value]

        --destination <DESTINATION>
            Address of the destination (treasury) account

    -h, --help
            Print help information

    -k, --keypair <KEYPAIR>
            Path to the keypair file, uses Sol config or defaults to "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            Log level: trace, debug, info, warn, error, off

        --label <LABEL>
            Candy guard group label

    -r, --rpc-url <RPC_URL>
            RPC Url
```

ガードグループを持つcandy machineを使用する場合、`--label`パラメータを使用する必要があります。
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### フリーズされたNFTを解凍

_パス: `thaw`_

フリーズされたNFTは、以下の条件のいずれかが満たされる限り、誰でも解凍できます：

- Candy Machineがミントアウトした場合。
- Candy Machineが削除された場合。
- 設定されたフリーズ期間（最大30日間）が経過した場合。

Freeze Escrow内の資金はすべてのNFTが解凍されるまで転送できないため、これにより宝庫ができるだけ早くすべてのNFTを解凍するインセンティブが生まれます。

フリーズされたNFTを解凍するには、ガードのルート命令に以下の引数を提供する必要があります：

- **Path** = `thaw`: ルート命令で実行するパスを選択します。
- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。
- **NFT Mint**: 解凍するフリーズされたNFTのミントアドレス。
- **NFT Owner**: 解凍するフリーズされたNFTの所有者のアドレス。
- **NFT Token Standard**: 解凍するフリーズされたNFTのトークン標準。
- **NFT Rule Set** (オプション): Rule Setを持つプログラマブルNFTを解凍する場合、解凍するフリーズされたNFTのRule Set。

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
  Thaw a Frozen NFT
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="218" y="15" label="Freeze Escrow PDA" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="candy-machine" to="candy-guard-route" theme="pink" /%}
{% edge from="candy-guard" to="candy-guard-route" theme="pink" toPosition="left" /%}
{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}

{% edge from="candy-guard-route" to="freezeEscrow-PDA5" theme="pink" path="straight" /%}

{% node #frozen-NFT parent="candy-guard-route" y="-100" x="29" label="Frozen NFT" /%}
{% edge from="frozen-NFT" to="candy-guard-route" path="straight" /%}

{% node #freezeEscrow-PDA5 parent="candy-guard-route" x="25" y="150" label="Thawed NFT" /%}
{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

‎

{% dialect-switcher title="フリーズされたNFTを解凍する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下の例では、現在のIDに属するフリーズされたNFTを解凍します。

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

APIリファレンス: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [FreezeSolPaymentRouteArgsThaw](https://mpl-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentRouteArgsThaw.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

以下のコマンドを実行してNFTを解凍します：

```sh
sugar freeze thaw 
```

以下のパラメータを使用できます

```
ARGS:
    <NFT_MINT>    Address of the NFT to thaw

OPTIONS:
        --all
            Unthaw all NFTs in the candy machine

    -c, --config <CONFIG>
            Path to the config file [default: config.json]

        --cache <CACHE>
            Path to the cache file, defaults to "cache.json" [default: cache.json]

        --candy-guard <CANDY_GUARD>
            Address of candy guard to update [defaults to cache value]

        --candy-machine <CANDY_MACHINE>
            Address of candy machine to update [defaults to cache value]

        --destination <DESTINATION>
            Address of the destination (treaury) account

    -h, --help
            Print help information

    -k, --keypair <KEYPAIR>
            Path to the keypair file, uses Sol config or defaults to "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            Log level: trace, debug, info, warn, error, off

        --label <LABEL>
            Candy guard group label

    -r, --rpc-url <RPC_URL>
            RPC Url

    -t, --timeout <TIMEOUT>
            RPC timeout to retrieve the mint list (in seconds)

        --use-cache
            Indicates to create/use a cache file for mint list
```

ガードグループを持つcandy machineを使用する場合、`--label`パラメータを使用する必要があります。
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 資金のロック解除

_パス: `unlockFunds`_

すべてのフリーズされたNFTが解凍されると、宝庫はFreeze Escrowアカウントから資金のロックを解除できます。これにより、資金が設定されたDestinationアドレスに転送されます。

資金のロックを解除するには、ガードのルート命令に以下の引数を提供する必要があります：

- **Path** = `unlockFunds`: ルート命令で実行するパスを選択します。
- **Destination**: このガードに関連するすべての支払いを最終的に受け取るウォレットのアドレス。
- **Candy Guard Authority**: SignerとしてのCandy GuardアカウントのAuthority。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program
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
  Unlock funds from the escrow
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="220" y="15" label="Freeze Escrow PDA" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}

{% node parent="candy-guard-route" y="209" x="-18" %}
{% node #destination-wallet label="Destination Wallet" theme="indigo" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program
{% /node %}
{% /node %}
{% edge from="destination-wallet" to="destination" arrow="none" dashed=true /%}
{% edge from="candy-guard-route" to="destination-wallet" theme="pink" path="straight" %}
Transfer all funds from

the Freeze Escrow Account
{% /edge %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}

{% /diagram %}

‎

{% dialect-switcher title="資金のロック解除" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

以下の例では、現在のIDをCandy Guard権限として使用してFreeze Escrowアカウントから資金のロックを解除します。

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

APIリファレンス: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [FreezeSolPaymentRouteArgsUnlockFunds](https://mpl-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentRouteArgsUnlockFunds.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

以下のコマンドを実行してFreeze Escrowアカウントから資金のロックを解除します

```sh
sugar freeze unlock-funds
```

以下のパラメータを使用できます

```
    -c, --config <CONFIG>
            Path to the config file [default: config.json]

        --cache <CACHE>
            Path to the cache file, defaults to "cache.json" [default: cache.json]

        --candy-guard <CANDY_GUARD>
            Address of candy guard to update [defaults to cache value]

        --candy-machine <CANDY_MACHINE>
            Address of candy machine to update [defaults to cache value]

        --destination <DESTINATION>
            Address of the destination (treasury) account

    -h, --help
            Print help information

    -k, --keypair <KEYPAIR>
            Path to the keypair file, uses Sol config or defaults to "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            Log level: trace, debug, info, warn, error, off

        --label <LABEL>
            Candy guard group label

    -r, --rpc-url <RPC_URL>
            RPC Url
```

ガードグループを持つcandy machineを使用する場合、`--label`パラメータを使用する必要があります。
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## NFTのフリーズを停止

Freeze Sol Paymentガード内でのNFTのフリーズを停止することが可能です。つまり、新しくミントされたNFTはもはやフリーズされませんが、**既存のフリーズされたNFTはフリーズされたまま**です。

これを達成するにはいくつかの方法があり、2つのカテゴリに分けることができます：

- ☀️ **解凍可能**: 既存のフリーズされたNFTは、ルート命令の`thaw`パスを使用して誰でも解凍できます。
- ❄️ **解凍不可**: 既存のフリーズされたNFTはまだ解凍できないため、"解凍可能"条件のいずれかが満たされるまで待つ必要があります。

これを踏まえて、NFTのフリーズを停止する方法の網羅的なリストと、それぞれが既存のフリーズされたNFTの解凍を許可するかどうかを以下に示します：

- Candy Machineがミントアウトした → ☀️ **解凍可能**。
- 設定されたフリーズ期間（最大30日間）が経過した → ☀️ **解凍可能**。
- Candy Machineアカウントが削除された → ☀️ **解凍可能**。
- Candy Guardアカウントが削除された → ❄️ **解凍不可**。
- Freeze Sol Paymentガードが設定から削除された → ❄️ **解凍不可**。

## Freeze EscrowsとGuard Groups

様々な[Guard Groups](/ja/smart-contracts/candy-machine/guard-groups)内で複数のFreeze Sol Paymentガードを使用する場合、Freeze Sol PaymentガードとFreeze Escrowアカウント間の関係を理解することが重要です。

Freeze EscrowアカウントはDestinationアドレスから派生したPDAです。これは、**複数のFreeze Sol Paymentガード**が**同じDestinationアドレス**を使用するよう設定されている場合、すべて**同じFreeze Escrowアカウントを共有**することを意味します。

したがって、それらは同じフリーズ期間も共有し、すべての資金が同じエスクローアカウントによって収集されます。これはまた、設定されたDestinationアドレスごとに`initialize`ルート命令を一度だけ呼び出す必要があることも意味します。これは、ルート命令が設定されたDestinationアドレスごとに一度だけ必要であることを意味します。`unlockFunds`についても同様です。`thaw`については、同じエスクローアカウントを共有していれば、どのラベルでも使用できます。

また、異なるDestinationアドレスを持つ複数のFreeze Sol Paymentガードを使用することも可能です。この場合、各Freeze Sol Paymentガードは独自のFreeze Escrowアカウントと独自のフリーズ期間を持ちます。

以下の例は、3つのグループに3つのFreeze Sol Paymentガードを持つCandy Machineを示しており、次のような構成になっています：

- グループ1と2は同じDestinationアドレスを共有し、したがって同じFreeze Escrowアカウントを共有します。
- グループ3は独自のDestinationアドレスを持ち、したがって独自のFreeze Escrowアカウントを持ちます。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
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

  For Destination A
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
  Initialize Freeze Escrow
{% /node %}
{% edge from="route-init-a" to="freezeEscrow-PDA-A" theme="pink" path="straight" /%}

{% node #freeze-period-a parent="route-init-a" x="240" y="15" theme="slate" %}
  Freeze Period A
{% /node %}
{% edge from="freeze-period-a" to="route-init-a" theme="pink" path="straight" /%}

{% node #freezeEscrow-PDA-B parent="destination-3" x="420" y="-22" %}
  Freeze Escrow PDA

  For Destination B
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
  Initialize Freeze Escrow
{% /node %}
{% edge from="route-init-b" to="freezeEscrow-PDA-B" theme="pink" path="straight" /%}

{% node #freeze-period-b parent="route-init-b" x="240" y="15" theme="slate" %}
  Freeze Period B
{% /node %}
{% edge from="freeze-period-b" to="route-init-b" theme="pink" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}

{% /diagram %}
