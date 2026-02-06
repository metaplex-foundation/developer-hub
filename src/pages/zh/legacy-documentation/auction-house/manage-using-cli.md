---
title: 使用 CLI 管理拍卖行
metaTitle: 使用 CLI 管理拍卖行 | 拍卖行
description: "如何使用 CLI 管理拍卖行"
---

## 先决条件

- `ts-node`
- `git`
- `yarn`

## 设置

为了开始使用拍卖行 CLI,请按照以下步骤操作。

```sh
git clone https://github.com/metaplex-foundation/metaplex-program-library.git
cd auction-house/cli
```

注意: 默认情况下,您将使用 `main` 分支顶部的最新代码。

然后:

```sh
cd js && yarn install && yarn bootstrap
cd src
```

克隆仓库并安装包后,确保您已设置本地 `Keypair`。如果您需要帮助,请参阅这些指南。

- <https://docs.solana.com/cli/install-solana-cli-tools>
- <https://docs.solana.com/wallet-guide/file-system-wallet>

## 运行命令

要运行命令,您将使用
`ts-node auction-house-cli.ts`

### 帮助

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

### 创建

创建拍卖行

使用以下命令查看命令帮助

```
ts-node auction-house-cli.ts help create_auction_house
```

找到您当前的密钥对,假设它位于 `~/mywallet.key` 或在 Windows 上 `C:\Users\windowsuser\mywallet.key`。要创建拍卖行,您将运行。

```
ts-node auction-house-cli.ts create_auction_house --keypair ~/mywallet.key -e devnet -sfbp 1000 -ccsp false -rso false
```

在这种情况下,我们不需要要求签署,因为我们想要创建一个完全去中心化的拍卖行。由于我们没有指定 `-tm, --treasury-mint <string>`,支付货币将是 SOL。
此外,以下选项将默认设置为 `~/mywallet.key` 的公钥

```
-twd, --treasury-withdrawal-destination <string>
-fwd, --fee-withdrawal-destination <string>
```

如果一切顺利,您将看到

```
wallet public key: Gsv13oph2i6nkJvNkVfuzkcbHWchz6viUtEg2vsxQMtM
No treasury withdrawal dest detected, using keypair
No fee withdrawal dest detected, using keypair
No treasury mint detected, using SOL.
Created auction house HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS <--- 您的拍卖行密钥将不同
```

保存此密钥 `HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS`,因为它是保存您的拍卖行的 solana 账户的公钥。在所有后续命令中,您将使用 `-ah` 选项传递此密钥。

## 显示

打印为拍卖行配置的费用和金库钱包的余额及其当前设置选项。

使用以下命令查看命令帮助

```
ts-node auction-house-cli.ts help show
```

注意我将 `--keypair` 切换为 `-k`,这是简写但效果相同。

```
ts-node auction-house-cli.ts show -k ~/mywallet.key -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS
```

输出将有所不同,但类似于以下内容。

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

### 费用账户

在上面的显示命令中,您看到了一个费用支付者账户。
此账户可用于支付销售执行、转移和账户创建的链上费用。对于本练习,我们将教您如何通过在开发网上空投一些 SOL 来为该账户提供资金。您的拍卖行费用账户仅在拍卖行权限签署交易时使用。这通常仅在 `Requires Sign Off` 的情况下

```
$ solana airdrop 2 AcWpR41NPMq73FZUspCiXxoLrJnW7zytgHKY5xqtETkU
Requesting airdrop of 2 SOL
Signature: 4qYFoD8GN6TZLDjLsqyyt6mhjYEjwKF36LJCDLtL88nTD3y3bFzXmVFHP6Nczf5Dn4GnmBJYtbqV9tN2WbsYynpX
2 SOL
```

{% callout type="warning" %}

`solana airdrop` 命令有时不可靠。如果命令不起作用,您可以使用 <https://solfaucet.com> 上的空投工具。

{% /callout %}

## 出售

将 NFT 挂牌出售。

使用以下命令查看命令帮助

```
ts-node auction-house-cli.ts help sell
```

通过其铸造地址将 NFT 以 1 SOL 的价格在拍卖行上挂牌出售。

```
ts-node auction-house-cli.ts sell \
  -k ~/mywallet.key \
  -ah HsKwc8dQtm8KLxshw67dwsNePkH6wMXo5Lwn1FuKjVYVS \
  --buy-price 1 \
  --mint F7fejo7cT1fRyJxj1W2aWy3aeJz8iqLU9YvbBAzwJGh2 \
  --token-size 1
```

输出:

```
wallet public key: CCJC2s8FDGAs8GqmngE9gviusEuNnkdUwchcYMZ8ZmHB
wallet public key: DCDcpZaJUghstQNMHy9VAPnwQe1cGsHq7fbeqkti4kM3
Set 1 F7fejo7cT1fRyJxj1W2aWy3aeJz8iqLU9YvbBAzwJGh2 for sale for 1 from your account with Auction House Ee53kiwLVw5XG98gSLNHoQRi4J22XEhz3zsKYY2ttsb7
```

### 需要签署

如果拍卖行设置为需要签署其钱包,则卖方也会提供给命令。
使用 `-ak` 选项执行此操作。

使用以下命令查看命令帮助

```
ts-node auction-house-cli.ts help sell
```

在生产场景中,拍卖行的密钥对存储在由托管拍卖行的组织管理的服务器上,交易应由卖方从客户端部分签名,然后在提交到 Solana 之前传递给服务器以由拍卖行签名。

## 购买

通过其铸造地址以某个价格对 NFT 出价,当使用原生 SOL 作为铸造时以 SOL 计价。

使用以下命令查看命令帮助

```
ts-node auction-house-cli.ts help buy
```

购买命令是对 NFT 的报价,在触发 `execute_sale` 操作之前不会导致销售。此命令为 NFT 提供 2 SOL。

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

## 执行销售

以卖方设定的价格将 NFT 出售给买方。请注意,这目前要求拍卖行权限、买方或卖方是费用支付者,因此签署交易。

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

## 其他操作

其他操作记录在 CLI 中,可以使用 `help` 和 `<command> help` 子命令找到:

- _取消_ - 潜在买方撤销他们的报价。

- _显示托管_ - 打印给定钱包的拍卖行托管账户的余额。

- _提取_ - 将资金从用户的买方托管账户转移到拍卖行的钱包。

- _存入_ - 向用户的买方托管账户添加资金以供拍卖行使用。

- _从费用中提取_ - 将资金从拍卖行费用钱包转移到拍卖行权限。

- _从金库中提取_ - 将资金从拍卖行金库钱包转移到拍卖行权限。

- _更新拍卖行_ - 更新任何拍卖行设置,包括其权限或卖方费用。
