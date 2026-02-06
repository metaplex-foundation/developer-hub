---
title: CLIを使用したAuction Houseの管理
metaTitle: CLIを使用したAuction Houseの管理 | Auction House
description: "CLIを使用してAuction Houseを管理する方法"
---

## 前提条件

- `ts-node`
- `git`
- `yarn`

## セットアップ

Auction House CLIを使い始めるには、以下の手順に従ってください。

```sh
git clone https://github.com/metaplex-foundation/metaplex-program-library.git
cd auction-house/cli
```

注意: デフォルトでは、`main`ブランチの先端にある最新のコードを使用します。

次に：

```sh
cd js && yarn install && yarn bootstrap
cd src
```

リポジトリをクローンし、パッケージをインストールしたら、ローカルの`Keypair`が設定されていることを確認してください。これについてサポートが必要な場合は、これらのガイドを参照してください。

- <https://docs.solana.com/cli/install-solana-cli-tools>
- <https://docs.solana.com/wallet-guide/file-system-wallet>

## コマンドの実行

コマンドを実行するには、次を使用します
`ts-node auction-house-cli.ts`

### ヘルプ

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

### 作成

Auction Houseを作成します

次のコマンドでコマンドヘルプを表示できます

```
ts-node auction-house-cli.ts help create_auction_house
```

現在のKeypairを見つけます。たとえば、`~/mywallet.key`またはWindowsの場合は`C:\Users\windowsuser\mywallet.key`にあるとします。Auction Houseを作成するには、次を実行します。

```
ts-node auction-house-cli.ts create_auction_house --keypair ~/mywallet.key -e devnet -sfbp 1000 -ccsp false -rso false
```

この場合、完全に分散化されたオークションハウスを作成したいので、サインオフを要求する必要はありません。`-tm, --treasury-mint <string>`を指定しなかったため、支払いの通貨はSOLになります。
また、以下のオプションは、`~/mywallet.key`の公開鍵として設定されるデフォルトになります

```
-twd, --treasury-withdrawal-destination <string>
-fwd, --fee-withdrawal-destination <string>
```

すべてがうまくいけば、次のように表示されます

```
wallet public key: Gsv13oph2i6nkJvNkVfuzkcbHWchz6viUtEg2vsxQMtM
No treasury withdrawal dest detected, using keypair
No fee withdrawal dest detected, using keypair
No treasury mint detected, using SOL.
Created auction house HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS <--- あなたのオークションハウスキーは異なります
```

このキー`HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS`を保存してください。これはAuction Houseを保持するsolanaアカウントの公開鍵です。後続のすべてのコマンドで、このキーを`-ah`オプションで渡します。

## 表示

オークションハウス用に設定された手数料と財務ウォレットの残高と、その現在の設定オプションを出力します。

次のコマンドでコマンドヘルプを表示できます

```
ts-node auction-house-cli.ts help show
```

`--keypair`を`-k`に変更したことに注意してください。これは省略形ですが、同じように機能します。

```
ts-node auction-house-cli.ts show -k ~/mywallet.key -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS
```

出力は異なりますが、以下のようになります。

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

### 手数料アカウント

上記のShowコマンドでは、Fee Payerアカウントが表示されます。
このアカウントは、販売実行、転送、アカウント作成のためのチェーン上の手数料を支払うために使用できます。この演習では、devnetでSOLをエアドロップしてそのアカウントに資金を提供する方法を教えます。Auction Houseの手数料アカウントは、Auction House権限がトランザクションに署名している場合にのみ使用されます。これは通常、`Requires Sign Off`の場合のみです

```
$ solana airdrop 2 AcWpR41NPMq73FZUspCiXxoLrJnW7zytgHKY5xqtETkU
Requesting airdrop of 2 SOL
Signature: 4qYFoD8GN6TZLDjLsqyyt6mhjYEjwKF36LJCDLtL88nTD3y3bFzXmVFHP6Nczf5Dn4GnmBJYtbqV9tN2WbsYynpX
2 SOL
```

{% callout type="warning" %}

`solana airdrop`コマンドは時々信頼性がありません。コマンドが機能しない場合は、<https://solfaucet.comのエアドロップツールを使用できます。>

{% /callout %}

## 販売

NFTを販売します。

次のコマンドでコマンドヘルプを表示できます

```
ts-node auction-house-cli.ts help sell
```

オークションハウスでミントアドレスによってNFTを1 SOLで販売します。

```
ts-node auction-house-cli.ts sell \
  -k ~/mywallet.key \
  -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS \
  --buy-price 1 \
  --mint F7fejo7cT1fRyJxj1W2aWy3aeJz8iqLU9YvbBAzwJGh2 \
  --token-size 1
```

出力：

```
wallet public key: CCJC2s8FDGAs8GqmngE9gviusEuNnkdUwchcYMZ8ZmHB
wallet public key: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Set 1 F7fejo7cT1fRyJxj1W2aWy3aeJz8iqLU9YvbBAzwJGh2 for sale for 1 from your account with Auction House Ee53kiwLVw5XG98gSLNHoQRi4J22XEhz3zsKYY2ttsb7
```

### サインオフの要求

オークションハウスがそのウォレットのサインオフを要求するように設定されている場合、出品者と同様に、コマンドに提供されます。
これを行うには、`-ak`オプションを使用します。

次のコマンドでコマンドヘルプを表示できます

```
ts-node auction-house-cli.ts help sell
```

オークションハウスのkeypairが組織が管理するサーバーに保存されている本番シナリオでは、トランザクションはクライアントから出品者によって部分的に署名され、Solanaに送信する前にオークションハウスによる署名のためにサーバーに渡される必要があります。

## 購入

SOLをネイティブSOLとして使用する場合、ミントアドレスによってNFTに何らかの価格のSOLでオファーを行います。

次のコマンドでコマンドヘルプを表示できます

```
ts-node auction-house-cli.ts help buy
```

buyコマンドはNFTへのオファーであり、`execute_sale`アクションがトリガーされるまで販売にはなりません。このコマンドは、NFTに2 SOLをオファーします。

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

## 販売の実行

出品者が設定した価格で購入者にNFTを販売します。これには現在、オークションハウス権限、購入者、または出品者が手数料支払者である必要があり、したがってトランザクションに署名する必要があることに注意してください。

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

## その他のアクション

その他のアクションはCLIに文書化されており、`help`と`<command> help`サブコマンドを使用して見つけることができます：

- _Cancel_ - 潜在的な購入者がオファーを取り消します。

- _Show Escrow_ - 特定のウォレットのオークションハウスエスクローアカウントの残高を出力します。

- _Withdraw_ - オークションハウスのユーザーの購入者エスクローアカウントからウォレットに資金を転送します。

- _Deposit_ - オークションハウスのユーザーの購入者エスクローアカウントに資金を追加します。

- _Withdraw from Fee_ - オークションハウス手数料ウォレットからオークションハウス権限に資金を転送します。

- _Withdraw from Treasury_ - オークションハウス財務ウォレットからオークションハウス権限に資金を転送します。

- _Update Auction House_ - 権限や出品者手数料を含むオークションハウス設定を更新します。
