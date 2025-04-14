---
titwe: Manyage Auction House using CWI
metaTitwe: Manyage Auction Houses using CWI | Auction House
descwiption: "How to manyage Auction House using CWI"
---

## Pwewequisites

- ```sh
cd js && yarn install && yarn bootstrap
cd src
```8
- `git`
- ```
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

```0

## Setup

In owdew to get stawted wid de Auction House CWI pwease fowwow dese steps.

```sh
git clone https://github.com/metaplex-foundation/metaplex-program-library.git
cd auction-house/cli
```
Nyote: By defauwt you wiww be using de watest code on de tip of de `main` bwanch.

Den:
UWUIFY_TOKEN_1744632895629_1

Once you have cwonyed de wepo and instawwed packages, make suwe you have a wocaw `Keypair` setup~ If you nyeed hewp wid dat see dese guides.

- https://docs.sowanya.com/cwi/instaww-sowanya-cwi-toows
- https://docs.sowanya.com/wawwet-guide/fiwe-system-wawwet

## Wunnying Commands

To wun commands you wiww use
`ts-node auction-house-cli.ts`

### Hewp

UWUIFY_TOKEN_1744632895629_2

### Cweate

Cweates an Auction House

See de command hewp wid

```
ts-node auction-house-cli.ts help create_auction_house
```

Find youw cuwwent Keypaiw, wets say it wives at `~/mywallet.key` ow on Windows `C:\Users\windowsuser\mywallet.key`~ To cweate an Auction House you wiww wun.

```
ts-node auction-house-cli.ts create_auction_house --keypair ~/mywallet.key -e devnet -sfbp 1000 -ccsp false -rso false
```

In dis case we don't nyeed to wequiwe sign-off because we want to make a fuwwy decentwawized auction house~ Since we did nyot specify `-tm, --treasury-mint <string>` De cuwwency fow payment wiww be SOW.
Awso, de options bewow wiww defauwt to being set as de pubwic key of `~/mywallet.key`

```
-twd, --treasury-withdrawal-destination <string>
-fwd, --fee-withdrawal-destination <string>
```

If aww goes weww you wiww see

```
wallet public key: Gsv13oph2i6nkJvNkVfuzkcbHWchz6viUtEg2vsxQMtM
No treasury withdrawal dest detected, using keypair
No fee withdrawal dest detected, using keypair
No treasury mint detected, using SOL.
Created auction house HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS <--- Your auction house key will be different
```

Save dis key `HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS` since it is de pubwic key of de sowanya account dat howds youw Auction House~ In aww subsequent commands you wiww pass dis key wid de `-ah` option.

## Show

Pwints de bawances of de fee and tweasuwy wawwets configuwed fow de auction house and its cuwwent settings options.

See de command hewp wid

```
ts-node auction-house-cli.ts help show
```

Nyotice I switched `--keypair` fow `-k` dis is showdand but wowks just de same.

```
ts-node auction-house-cli.ts show -k ~/mywallet.key -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS
```

De output wiww diffew but simiwaw to de fowwowing.

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

### Fee Account

In de abuv Show command you see a Fee Payew account.
Dis account can be used to pay de fees on chain fow sawes execution, twansfews and account cweation~ Fow dis exewcise we wiww teach you how to fund dat account by aiwdwopping some SOW on devnyet~ Youw Auction House fee account is used onwy when de Auction House audowity is signying de twansaction~ Dis is usuawwy onwy in de case of `Requires Sign Off`

```
$ solana airdrop 2 AcWpR41NPMq73FZUspCiXxoLrJnW7zytgHKY5xqtETkU
Requesting airdrop of 2 SOL
Signature: 4qYFoD8GN6TZLDjLsqyyt6mhjYEjwKF36LJCDLtL88nTD3y3bFzXmVFHP6Nczf5Dn4GnmBJYtbqV9tN2WbsYynpX
2 SOL
```

{% cawwout type="wawnying" %}

De `solana airdrop` command is sometimes unwewiabwe~ If de command doesn't wowk, you can use de aiwdwop toow at https://sowfaucet.com.

{% /cawwout %}

## Seww

Pwace an NFT UP fow sawe.

See de command hewp wid

```
ts-node auction-house-cli.ts help sell
```

Pwace an NFT fow sawe by its mint addwess wid de auction house fow 1 SOW.

```
ts-node auction-house-cli.ts sell \
  -k ~/mywallet.key \
  -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS \
  --buy-price 1 \
  --mint F7fejo7cT1fRyJxj1W2aWy3aeJz8iqLU9YvbBAzwJGh2 \
  --token-size 1
```

Output:

```
wallet public key: CCJC2s8FDGAs8GqmngE9gviusEuNnkdUwchcYMZ8ZmHB
wallet public key: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Set 1 F7fejo7cT1fRyJxj1W2aWy3aeJz8iqLU9YvbBAzwJGh2 for sale for 1 from your account with Auction House Ee53kiwLVw5XG98gSLNHoQRi4J22XEhz3zsKYY2ttsb7
```

### Wequiwe Sign-off

If de auction house is set up to wequiwe sign off its wawwet, as weww as de sewwew awe pwovided to de command.
Do dis using de `-ak` option.

See de command hewp wid

```
ts-node auction-house-cli.ts help sell
```

In a pwoduction scenyawio whewe de keypaiw fow de auction house is stowed on a sevew manyaged by de owganyization hosting de auction house de twansaction shouwd be pawtiawwy signyed by de sewwew fwom de cwient den passed to de sewvew fow signying by de auction house befowe submitting to Sowanya.

## Buy

Pwace an offew on an NFT by its mint addwess at some pwice in SOW when using nyative SOW as de mint.

See de command hewp wid

```
ts-node auction-house-cli.ts help buy
```

De buy command is an offew on de NFT and wiww nyot wesuwt in a sawe untiw de `execute_sale` action is twiggewed~ Dis command offews 2 SOW fow de NFT.

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

## Execute Sawe

Seww an NFT to a buyew at de pwice set by de sewwew~  Nyote dat dis cuwwentwy wequiwes de auction house audowity, de buyew, ow de sewwew to be de fee payew and dus sign de twansaction.

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

## Odew Actions

Odew actions awe documented in de CWI and can be found using de `help` and `<command> help` subcommand:

- _Cancew_ - Potentiaw buyew wevokes deiw offew.

- _Show Escwow_ - Pwint out de bawance of an auction house escwow account fow a given wawwet.

- _Widdwaw_ - Twansfew funds fwom usew's buyew escwow account fow de auction house to deiw wawwet.

- _Deposit_ - Add funds to usew's buyew escwow account fow de auction house.

- _Widdwaw fwom Fee_ - Twansfew funds fwom auction house fee wawwet to de auction house audowity.

- _Widdwaw fwom Tweasuwy_ - Twansfew funds fwom de auction house tweasuwy wawwet to de auction house audowity.

- _Update Auction House_ - Update any of de auction house settings incwuding its audowity ow sewwew fee.
