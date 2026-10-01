---
title: 'Freeze Token Payment Guard'
metaTitle: Freeze Token Payment Guard | Candy Machine
description: '토큰 금액으로 가격을 설정하고 동결 기간을 적용합니다.'
---

## 개요 {% #overview %}

**Freeze Token Payment** 가드는 지불자에게 특정 민트 계정의 특정 토큰 금액을 청구하여 동결된 NFT를 민팅할 수 있게 합니다. 동결된 NFT는 해동될 때까지 전송하거나 마켓플레이스에 등록할 수 없습니다.

동결된 NFT는 다음 조건 중 하나가 충족되면 누구나 해동할 수 있습니다:

- Candy Machine이 모두 민팅되었습니다.
- Candy Machine이 삭제되었습니다.
- 구성된 동결 기간(최대 30일)이 지났습니다.

토큰은 "Freeze Escrow" 계정으로 이전되며, 이 계정은 민팅이 시작되기 전에 Candy Guard 권한에 의해 초기화되어야 합니다. 모든 동결된 NFT가 해동되면 Candy Guard 권한에 의해 자금을 잠금 해제하고 구성된 대상 계정으로 이전할 수 있습니다.

이 가드의 [라우트 명령어](#route-instruction)를 통해 Freeze Escrow 계정을 초기화하고, NFT를 해동하며, 자금을 잠금 해제할 수 있습니다.

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
## 가드 설정 {% #guard-settings %}

Freeze Token Payment 가드는 다음 설정을 포함합니다:

- **Amount**: 지불자에게 청구할 토큰 수입니다.
- **Mint**: 지불에 사용할 SPL 토큰을 정의하는 민트 계정의 주소입니다.
- **Destination Associated Token Address (ATA)**: 토큰을 최종적으로 보낼 연결 토큰 계정의 주소입니다. **Mint** 속성과 이러한 토큰을 받을 지갑의 주소를 사용하여 Associated Token Address PDA를 찾아 이 주소를 얻을 수 있습니다.

{% dialect-switcher title="Freeze Token Payment 가드를 사용하여 Candy Machine 설정하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음은 Freeze Token Payment 가드를 사용하여 Candy Machine을 생성하는 방법입니다. 이 예시에서는 Umi의 identity를 대상 지갑으로 사용합니다.

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
config.json 파일의 guard 섹션에 다음 객체를 추가하세요:

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

## 민트 설정 {% #mint-settings %}

Freeze Token Payment 가드는 다음 민트 설정을 포함합니다:

- **Mint**: 지불에 사용할 SPL 토큰을 정의하는 민트 계정의 주소입니다.
- **Destination Associated Token Address (ATA)**: 토큰을 최종적으로 보낼 연결 토큰 계정의 주소입니다.
- **NFT Rule Set** (선택사항): Programmable NFT를 Rule Set과 함께 민팅하는 경우, 민팅된 NFT의 Rule Set입니다.

SDK의 도움 없이 명령어를 직접 구성하려는 경우, 이러한 민트 설정 등을 명령어 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#freezetokenpayment)를 참조하세요.

{% dialect-switcher title="Freeze Token Payment 가드를 사용하여 Candy Machine 설정하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Freeze Token Payment 가드의 민트 설정을 전달할 수 있습니다.

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

_가드가 할당되면 sugar를 사용하여 민팅할 수 없으므로 특정 민트 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 라우트 명령어 {% #route-instruction %}

Freeze Token Payment 라우트 명령어는 다음 기능을 지원합니다.

- [개요](#overview)
- [가드 설정](#guard-settings)
- [민트 설정](#mint-settings)
- [라우트 명령어](#route-instruction)
  - [Freeze Escrow 초기화](#initialize-the-freeze-escrow)
  - [동결된 NFT 해동](#thaw-a-frozen-nft)
  - [자금 잠금 해제](#unlock-funds)
- [NFT 동결 중지](#stop-freezing-nfts)
- [Freeze Escrow와 가드 그룹](#freeze-escrows-and-guard-groups)

### Freeze Escrow 초기화 {% #initialize-the-freeze-escrow %}

_경로: `initialize`_

Freeze Token Payment 가드를 사용할 때, 민팅이 시작되기 전에 Freeze Escrow 계정을 초기화해야 합니다. 이는 가드 설정의 Destination ATA 속성에서 파생된 PDA 계정을 생성합니다.

Freeze Escrow PDA 계정은 다음과 같은 여러 매개변수를 추적합니다:

- 이 가드를 통해 몇 개의 동결된 NFT가 민팅되었는지
- 동결 기간이 그 시점부터 시작되므로 이 가드를 통해 첫 번째 동결된 NFT가 언제 민팅되었는지

이 Freeze Escrow 계정을 초기화할 때 가드의 라우트 명령어에 다음 인수를 제공해야 합니다:

- **Path** = `initialize`: 라우트 명령어에서 실행할 경로를 선택합니다.
- **Mint**: 지불에 사용할 SPL 토큰을 정의하는 민트 계정의 주소입니다.
- **Destination Associated Token Address (ATA)**: 토큰을 최종적으로 보낼 연결 토큰 계정의 주소입니다.
- **Period**: 동결 기간이 지속되어야 하는 시간(초)입니다. 최대 30일(2,592,000초)이 될 수 있으며 이 가드를 통해 민팅된 첫 번째 동결된 NFT부터 시작됩니다. 동결 기간은 Candy Machine이 모두 민팅되지 않더라도 동결된 NFT를 결국 해동할 수 있도록 하는 안전 메커니즘을 제공합니다.
- **Candy Guard Authority**: Signer로서 Candy Guard 계정의 권한입니다.

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
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="Amount = 300"  /%}
{% node #mint label="Mint"  /%}
{% node #destination-ata label="Destination ATA" /%}
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

{% node #freeze-period parent="candy-guard-route" x="220" y="14" label="Freeze Period" theme="slate" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}

{% edge from="candy-guard-route" to="freezeEscrow-PDA3" theme="pink" path="straight" y="-10" /%}

{% node #freezeEscrow-PDA3 parent="destination-ata" x="397" y="-10" %}
  Freeze Escrow PDA
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="destination-ata" to="freezeEscrow-PDA3" arrow="none" dashed=true path="straight" /%}

{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

마지막으로, Freeze Escrow PDA 계정은 이 가드를 통해 민팅된 모든 동결된 NFT의 자금을 받습니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="Amount = 300"  /%}
{% node #mint label="Mint"  /%}
{% node #destination-ata label="Destination ATA" /%}
{% node label="..." /%}
{% /node %}

{% node #freezeEscrow-PDA4 parent="destination-ata" x="300" y="-8" theme="slate" %}
  Freeze Escrow PDA
{% /node %}
{% edge from="destination-ata" to="freezeEscrow-PDA4" arrow="none" dashed=true path="straight" /%}

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
{% edge from="mint-candy-guard" to="freezeEscrow-PDA4" theme="pink" toPosition="top"/%}
{% node parent="freezeEscrow-PDA4" y="-250" x="90" theme="transparent" %}
  Transfer 300 tokens

  to the Freeze Escrow's

  Associated Token Address
{% /node %}

{% node parent="mint-candy-guard" y="150" x="2" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Core Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="120" theme="transparent" %}
  Mint Logic
{% /node %}

{% edge from="mint-candy-machine" to="frozen-NFT" path="straight" /%}
{% node #frozen-NFT parent="mint-candy-machine" y="120" x="31" theme="slate" %}
  Frozen NFT
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

‎

{% dialect-switcher title="Freeze Escrow 초기화" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

아래 예시에서는 최대 동결 기간을 15일로 설정하여 Freeze Escrow 계정을 초기화하고 현재 identity를 Candy Guard 권한으로 사용합니다.

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

다음 명령어를 실행하여 Freeze Escrow 계정을 초기화하세요

```sh
sugar freeze initialize
```

다음 매개변수를 사용할 수 있습니다

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

가드 그룹이 있는 candy machine을 사용할 때는 `--label` 매개변수를 사용해야 합니다.
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 동결된 NFT 해동 {% #thaw-a-frozen-nft %}

_경로: `thaw`_

동결된 NFT는 다음 조건 중 하나가 충족되면 누구나 해동할 수 있습니다:

- Candy Machine이 모두 민팅되었습니다.
- Candy Machine이 삭제되었습니다.
- 구성된 동결 기간(최대 30일)이 지났습니다.

Freeze Escrow의 토큰은 모든 NFT가 해동될 때까지 이전할 수 없으므로, 이는 재무부가 가능한 한 빨리 모든 NFT를 해동하도록 하는 인센티브를 만듭니다.

동결된 NFT를 해동하려면 가드의 라우트 명령어에 다음 인수를 제공해야 합니다:

- **Path** = `thaw`: 라우트 명령어에서 실행할 경로를 선택합니다.
- **Mint**: 지불에 사용할 SPL 토큰을 정의하는 민트 계정의 주소입니다.
- **Destination Associated Token Address (ATA)**: 토큰을 최종적으로 보낼 연결 토큰 계정의 주소입니다.
- **NFT Mint**: 해동할 동결된 NFT의 민트 주소입니다.
- **NFT Owner**: 해동할 동결된 NFT의 소유자 주소입니다.
- **NFT Token Standard**: 해동할 동결된 NFT의 토큰 표준입니다.
- **NFT Rule Set** (선택사항): Rule Set이 있는 Programmable NFT를 해동하는 경우, 동결된 NFT의 Rule Set입니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
  Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="-3" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Candy Machine Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="Amount = 300"  /%}
{% node #mint label="Mint"  /%}
{% node #destination-ata label="Destination ATA" /%}
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

{% dialect-switcher title="Freeze Token Payment 가드를 사용하여 Candy Machine 설정하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

아래 예시에서는 현재 identity에 속한 동결된 NFT를 해동합니다.

```ts
route(umi, {
  // ...
  guard: "freezeTokenPayment",
  routeArgs: {
    path: "thaw",
    mint: tokenMint.publicKey,
    destinationAta,
    nftMint: nftMint.publicKey,
    nftOwner: umi.identity.publicKey,
    nftTokenStandard: candyMachine.tokenStandard,
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

다음 명령어를 실행하여 NFT를 해동하세요:

```sh
sugar freeze thaw
```

다음 매개변수를 사용할 수 있습니다

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

가드 그룹이 있는 candy machine을 사용할 때는 `--label` 매개변수를 사용해야 합니다.
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 자금 잠금 해제 {% #unlock-funds %}

_경로: `unlockFunds`_

모든 동결된 NFT가 해동되면 재무부는 Freeze Escrow 계정에서 자금을 잠금 해제할 수 있습니다. 이렇게 하면 토큰이 구성된 Destination ATA 주소로 이전됩니다.

자금을 잠금 해제하려면 가드의 라우트 명령어에 다음 인수를 제공해야 합니다:

- **Path** = `unlockFunds`: 라우트 명령어에서 실행할 경로를 선택합니다.
- **Mint**: 지불에 사용할 SPL 토큰을 정의하는 민트 계정의 주소입니다.
- **Destination Associated Token Address (ATA)**: 토큰을 최종적으로 보낼 연결 토큰 계정의 주소입니다.
- **Candy Guard Authority**: Signer로서 Candy Guard 계정의 권한입니다.

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
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="- Amount"  /%}
{% node #mint label="- Mint" /%}
{% node #destination-ata label="- Destination ATA" /%}
{% node label="..." /%}
{% /node %}
{% edge from="destination-ata" to="token-account" arrow="none" dashed=true arrow="none" /%}

{% node parent="candy-machine" x="600" %}
  {% node #candy-guard-route theme="pink" %}
    Route with

    Path = *unlockFunds*
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}

{% node parent="candy-guard-route" y="-32" x="95" theme="transparent" %}
  Unlock funds

  from the escrow
{% /node %}

{% node #freeze-escrow parent="candy-guard-route" y="100" x="2" label="Freeze Escrow PDA" /%}
{% edge from="freeze-escrow" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="guards" to="candy-guard-route" theme="pink" toPosition="top" /%}

{% node parent="candy-guard" x="300" y="29" %}
{% node #mint-account label="Mint Account" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="mint" to="mint-account" arrow="none" dashed=true arrow="none" /%}
{% edge from="mint-account" to="token-account" /%}

{% node parent="mint-account" y="100" %}
{% node #token-account theme="blue" %}
Token Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="token-account" y="90" x="-40" %}
{% node #destination-wallet label="Destination Wallet" theme="indigo" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program  {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="token-account" to="destination-wallet" arrow="none" /%}
{% edge from="candy-guard-route" to="token-account" theme="pink" /%}
{% node parent="token-account" theme="transparent" x="210" y="-20" %}
Transfer all funds from

the Freeze Escrow Account
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}

{% /diagram %}

‎

{% dialect-switcher title="Freeze Token Payment 가드를 사용하여 Candy Machine 설정하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

아래 예시에서는 현재 identity를 Candy Guard 권한으로 사용하여 Freeze Escrow 계정에서 자금을 잠금 해제합니다.

```ts
route(umi, {
  // ...
  guard: 'freezeTokenPayment',
  routeArgs: {
    path: 'unlockFunds',
    destination,
    candyGuardAuthority: umi.identity,
  },
})
```

API 참조: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [freezeTokenPaymentRouteArgsUnlockFunds](https://mpl-candy-machine.typedoc.metaplex.com/types/FreezeTokenPaymentRouteArgsUnlockFunds.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

다음 명령어를 실행하여 Freeze Escrow 계정에서 자금을 잠금 해제하세요

```sh
sugar freeze unlock-funds
```

다음 매개변수를 사용할 수 있습니다

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

가드 그룹이 있는 candy machine을 사용할 때는 `--label` 매개변수를 사용해야 합니다.
{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## NFT 동결 중지 {% #stop-freezing-nfts %}

Freeze Token Payment 가드 내에서 NFT 동결을 중지할 수 있습니다. 즉, 새로 민팅된 NFT는 더 이상 동결되지 않지만 **기존 동결된 NFT는 동결된 상태로 유지됩니다**.

이를 달성하는 여러 방법이 있으며, 두 가지 범주로 나눌 수 있습니다:

- ☀️ **해동 가능**: 기존 동결된 NFT는 라우트 명령어의 `thaw` 경로를 사용하여 누구나 해동할 수 있습니다.
- ❄️ **해동 불가**: 기존 동결된 NFT는 아직 해동할 수 없으며 "해동 가능" 조건 중 하나가 충족될 때까지 기다려야 합니다.

이를 염두에 두고 NFT 동결을 중지하는 방법과 각 방법이 기존 동결된 NFT의 해동을 허용하는지 여부에 대한 전체 목록은 다음과 같습니다:

- Candy Machine이 모두 민팅됨 → ☀️ **해동 가능**.
- 구성된 동결 기간(최대 30일)이 지남 → ☀️ **해동 가능**.
- Candy Machine 계정이 삭제됨 → ☀️ **해동 가능**.
- Candy Guard 계정이 삭제됨 → ❄️ **해동 불가**.
- Freeze Token Payment 가드가 설정에서 제거됨 → ❄️ **해동 불가**.

## Freeze Escrow와 가드 그룹 {% #freeze-escrows-and-guard-groups %}

다양한 [가드 그룹](/ko/smart-contracts/candy-machine/guard-groups) 내에서 여러 Freeze Token Payment 가드를 사용할 때 Freeze Token Payment 가드와 Freeze Escrow 계정 간의 관계를 이해하는 것이 중요합니다.

Freeze Escrow 계정은 Destination 주소에서 파생된 PDA입니다. 즉, **여러 Freeze Token Payment 가드**가 **동일한 Destination 주소**를 사용하도록 구성되면 모두 **동일한 Freeze Escrow 계정을 공유**합니다.

따라서 동일한 동결 기간을 공유하고 모든 자금이 동일한 에스크로 계정에 수집됩니다. 이는 구성된 Destination 주소당 `initialize` 라우트 명령어를 한 번만 호출하면 된다는 것을 의미합니다. 이는 라우트 명령어가 구성된 Destination 주소당 한 번만 필요함을 의미합니다. `unlockFunds`도 마찬가지입니다. `thaw`의 경우 동일한 에스크로 계정을 공유하는 한 원하는 레이블을 사용할 수 있습니다.

다른 Destination 주소를 가진 여러 Freeze Token Payment 가드를 사용하는 것도 가능합니다. 이 경우 각 Freeze Token Payment 가드는 자체 Freeze Escrow 계정과 자체 동결 기간을 갖습니다.

아래 예시는 세 그룹에 세 개의 Freeze Token Payment 가드가 있는 Candy Machine을 보여줍니다:

- 그룹 1과 2는 동일한 Destination 주소를 공유하므로 동일한 Freeze Escrow 계정을 공유합니다.
- 그룹 3은 자체 Destination 주소를 가지므로 자체 Freeze Escrow 계정을 갖습니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guard Group 1" theme="mint" /%}
{% node #freezeTokenPayment label="Freeze Token Payment" /%}
{% node #amount label="Amount = 300" /%}
{% node #mint label="Mint" /%}
{% node #destination-ata label="Destination ATA A" /%}
{% node label="..." /%}
{% node #guards-2 label="Guard Group 2" theme="mint" /%}
{% node #freezeTokenPayment-2 label="Freeze Token Payment" /%}
{% node #amount-2 label="Amount = 300" /%}
{% node #mint-2 label="Mint" /%}
{% node #destination-2 label="Destination ATA A" /%}
{% node label="..." /%}
{% node #guards-3 label="Guard Group 3" theme="mint" /%}
{% node #freezeTokenPayment-3 label="Freeze Token Payment" /%}
{% node #amount-3 label="Amount = 300" /%}
{% node #mint-3 label="Mint" /%}
{% node #destination-3 label="Destination ATA B" /%}
{% node label="..." /%}
{% /node %}
{% /node %}

{% node #freezeEscrow-PDA-A parent="destination-ata" x="213" y="-23" %}
  Freeze Escrow PDA

  For Destination A
{% /node %}
{% edge from="destination-ata" to="freezeEscrow-PDA-A" arrow="none" dashed=true path="straight" /%}
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
