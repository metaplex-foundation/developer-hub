---
title: CLI를 사용하여 Auction House 관리
metaTitle: CLI를 사용하여 Auction House 관리 | Auction House
description: "CLI를 사용하여 Auction House를 관리하는 방법"
---

## 전제 조건

- `ts-node`
- `git`
- `yarn`

## 설정

Auction House CLI를 시작하려면 다음 단계를 따르세요.

```sh
git clone https://github.com/metaplex-foundation/metaplex-program-library.git
cd auction-house/cli
```
참고: 기본적으로 `main` 브랜치의 최신 코드를 사용하게 됩니다.

그런 다음:
```sh
cd js && yarn install && yarn bootstrap
cd src
```

리포지토리를 복제하고 패키지를 설치한 후에는 로컬 `Keypair` 설정이 있는지 확인하세요. 도움이 필요하면 다음 가이드를 참조하세요.

- https://docs.solana.com/cli/install-solana-cli-tools
- https://docs.solana.com/wallet-guide/file-system-wallet

## 명령 실행

명령을 실행하려면 다음을 사용합니다
`ts-node auction-house-cli.ts`

### 도움말

```
ts-node auction-house-cli.ts
Usage: auction-house-cli [options] [command]

Options:
-V, --version                     output the version number
-h, --help                        display help for command

Commands:
show_escrow [options]
withdraw [options]
sell [options]
withdraw_from_treasury [options]
withdraw_from_fees [options]
cancel [options]
execute_sale [options]
buy [options]
deposit [options]
show [options]
create_auction_house [options]
update_auction_house [options]
help [command]                    display help for command

```

### Create

Auction House를 생성합니다

다음 명령으로 명령 도움말을 참조하세요

```
ts-node auction-house-cli.ts help create_auction_house
```

현재 Keypair를 찾으세요. 예를 들어 `~/mywallet.key` 또는 Windows의 경우 `C:\Users\windowsuser\mywallet.key`에 있다고 가정합니다. Auction House를 만들려면 다음을 실행합니다.

```
ts-node auction-house-cli.ts create_auction_house --keypair ~/mywallet.key -e devnet -sfbp 1000 -ccsp false -rso false
```

이 경우 완전히 분산된 경매 하우스를 만들고 싶기 때문에 require sign-off가 필요하지 않습니다. `-tm, --treasury-mint <string>`을 지정하지 않았으므로 지불 통화는 SOL이 됩니다.
또한 아래 옵션은 기본적으로 `~/mywallet.key`의 공개 키로 설정됩니다

```
-twd, --treasury-withdrawal-destination <string>
-fwd, --fee-withdrawal-destination <string>
```

모든 것이 잘 되면 다음이 표시됩니다

```
wallet public key: Gsv13oph2i6nkJvNkVfuzkcbHWchz6viUtEg2vsxQMtM
No treasury withdrawal dest detected, using keypair
No fee withdrawal dest detected, using keypair
No treasury mint detected, using SOL.
Created auction house HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS <--- 경매 하우스 키는 다를 것입니다
```

이 키 `HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS`를 저장하세요. 이것은 Auction House를 보유하는 solana 계정의 공개 키입니다. 이후 모든 명령에서 `-ah` 옵션과 함께 이 키를 전달합니다.

## Show

경매 하우스에 대해 구성된 수수료 및 재무 지갑의 잔액과 현재 설정 옵션을 인쇄합니다.

다음 명령으로 명령 도움말을 참조하세요

```
ts-node auction-house-cli.ts help show
```

`--keypair`를 `-k`로 바꾼 것을 주목하세요. 이것은 약칭이지만 동일하게 작동합니다.

```
ts-node auction-house-cli.ts show -k ~/mywallet.key -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS
```

출력은 다르지만 다음과 유사할 것입니다.

```
No treasury mint detected, using SOL.
-----
Auction House: HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS
Mint: So11111111111111111111111111111111111111112
Authority: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Creator: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Fee Payer Acct: AcWpR41NPMq73FZUspCiXxoLrJnW7zytgHKY5xqtETkU
Treasury Acct: HFW5CY73qN3XK3qEP7ZFxbpBBkQtipPfPQzaDj3mbbY1
Fee Payer Withdrawal Acct: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Treasury Withdrawal Acct: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Fee Payer Bal: 0
Treasury Bal: 0
Seller Fee Basis Points: 1000
Requires Sign Off: false
Can Change Sale Price: false
AH Bump: 255
AH Fee Bump: 252
AH Treasury Bump: 254
```

### 수수료 계정

위의 Show 명령에서 수수료 지불자 계정을 볼 수 있습니다.
이 계정은 판매 실행, 전송 및 계정 생성에 대한 온체인 수수료를 지불하는 데 사용할 수 있습니다. 이 연습에서는 devnet에서 일부 SOL을 에어드롭하여 해당 계정에 자금을 지원하는 방법을 가르쳐 드리겠습니다. Auction House 수수료 계정은 Auction House 권한이 트랜잭션에 서명할 때만 사용됩니다. 이것은 일반적으로 `Requires Sign Off`의 경우에만 해당됩니다

```
$ solana airdrop 2 AcWpR41NPMq73FZUspCiXxoLrJnW7zytgHKY5xqtETkU
Requesting airdrop of 2 SOL
Signature: 4qYFoD8GN6TZLDjLsqyyt6mhjYEjwKF36LJCDLtL88nTD3y3bFzXmVFHP6Nczf5Dn4GnmBJYtbqV9tN2WbsYynpX
2 SOL
```

{% callout type="warning" %}

`solana airdrop` 명령은 때때로 신뢰할 수 없습니다. 명령이 작동하지 않으면 https://solfaucet.com에서 에어드롭 도구를 사용할 수 있습니다.

{% /callout %}

## Sell

NFT를 판매용으로 올립니다.

다음 명령으로 명령 도움말을 참조하세요

```
ts-node auction-house-cli.ts help sell
```

민트 주소로 경매 하우스에 1 SOL에 NFT를 판매용으로 올립니다.

```
ts-node auction-house-cli.ts sell \
  -k ~/mywallet.key \
  -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS \
  --buy-price 1 \
  --mint F7fejo7cT1fRyJxj1W2aWy3aeJz8iqLU9YvbBAzwJGh2 \
  --token-size 1
```

출력:

```
wallet public key: CCJC2s8FDGAs8GqmngE9gviusEuNnkdUwchcYMZ8ZmHB
wallet public key: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Set 1 F7fejo7cT1fRyJxj1W2aWy3aeJz8iqLU9YvbBAzwJGh2 for sale for 1 from your account with Auction House Ee53kiwLVw5XG98gSLNHoQRi4J22XEhz3zsKYY2ttsb7
```

### Require Sign-off

경매 하우스가 승인을 요구하도록 설정된 경우 판매자와 마찬가지로 지갑이 명령에 제공됩니다.
`-ak` 옵션을 사용하여 이를 수행합니다.

다음 명령으로 명령 도움말을 참조하세요

```
ts-node auction-house-cli.ts help sell
```

경매 하우스의 키쌍이 조직이 호스팅하는 서버에 저장되는 프로덕션 시나리오에서 트랜잭션은 클라이언트에서 판매자가 부분적으로 서명한 다음 Solana에 제출하기 전에 경매 하우스가 서명하기 위해 서버로 전달되어야 합니다.

## Buy

네이티브 SOL을 민트로 사용할 때 SOL의 일부 가격으로 민트 주소로 NFT에 제안을 합니다.

다음 명령으로 명령 도움말을 참조하세요

```
ts-node auction-house-cli.ts help buy
```

buy 명령은 NFT에 대한 제안이며 `execute_sale` 작업이 트리거될 때까지 판매로 이어지지 않습니다. 이 명령은 NFT에 대해 2 SOL을 제안합니다.

```
ts-node auction-house-cli.ts buy \
  -k ~/mywallet.key \
  -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS \
  --buy-price 2 \
  --token-size 1 \
  --mint 7v8kcqCHLih31bp2xwMojGWTMdrcFfzZsYXNbiLiRYgE
wallet public key: 3DikCrEsfAVHv9rXENg2Hdmc16L71EjveQEF4NbSfRak
wallet public key: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Made offer for  2
```

## Execute Sale

판매자가 설정한 가격으로 구매자에게 NFT를 판매합니다. 현재 이를 위해서는 경매 하우스 권한, 구매자 또는 판매자가 수수료 지불자가 되어 트랜잭션에 서명해야 합니다.

```
$ ts-node auction-house-cli.ts execute_sale
  -k ~/mywallet.key \
  -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS \
  --buy-price 2 \
  --mint DCqt9QQ3ot3qv53EhWrYAWFuh4XgSvFJvLRjgsDnhLTp \
  --buyer-wallet 3DikCrEsfAVHv9rXENg2Hdmc16L71EjveQEF4NbSfRak \
  --seller-wallet CCJC2s8FDGAs8GqmngE9gviusEuNnkdUwchcYMZ8ZmHB \
  --token-size 1
wallet public key: CCJC2s8FDGAs8GqmngE9gviusEuNnkdUwchcYMZ8ZmHB
wallet public key: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Accepted 1 DCqt9QQ3ot3qv53EhWrYAWFuh4XgSvFJvLRjgsDnhLTp sale from wallet CCJC2s8FDGAs8GqmngE9gviusEuNnkdUwchcYMZ8ZmHB to 3DikCrEsfAVHv9rXENg2Hdmc16L71EjveQEF4NbSfRak for 2 from your account with Auction House HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS
```

## 기타 작업

다른 작업은 CLI에 문서화되어 있으며 `help` 및 `<command> help` 하위 명령을 사용하여 찾을 수 있습니다:

- _Cancel_ - 잠재적 구매자가 제안을 철회합니다.

- _Show Escrow_ - 주어진 지갑에 대한 경매 하우스 에스크로 계정의 잔액을 인쇄합니다.

- _Withdraw_ - 경매 하우스에 대한 사용자의 구매자 에스크로 계정에서 지갑으로 자금을 전송합니다.

- _Deposit_ - 경매 하우스에 대한 사용자의 구매자 에스크로 계정에 자금을 추가합니다.

- _Withdraw from Fee_ - 경매 하우스 수수료 지갑에서 경매 하우스 권한으로 자금을 전송합니다.

- _Withdraw from Treasury_ - 경매 하우스 재무 지갑에서 경매 하우스 권한으로 자금을 전송합니다.

- _Update Auction House_ - 권한 또는 판매자 수수료를 포함한 경매 하우스 설정을 업데이트합니다.
