---
title: RPC Providers
metaTitle: Metaplex — RPC Providers
description: A list of available RPCs on Solana.
---

## Introduction

Solana makes use of independent nodes which have the responsibility of working to confirm programs and outputs of programs on one of the three Solana clusters, Devnet, Testnet or Mainnet Beta. A cluster is made up of a set of validators that work to confirm transactions. These are owned and operated by individuals. These nodes are also responsible for storing data and transaction history which is shared amongst the nodes. A node can become a validator node if it is being used to vote on valid blocks and if SOL is delegated to the validator identity it can become a leader node. [This](https://solana.com/validators) is the link to the information on how to become a validator.

Not all nodes can become leader nodes or vote to confirm blocks. They still serve the other functionalities of validator nodes, but since they cannot vote they are primarily used to respond to requests on the blockchain. These are RPC nodes. RPC stands for remote procedure call, and these RPC nodes are used to send transactions through the blockchain.

Solana maintains three public API nodes, one for each cluster which are Devnet, Mainnet Beta, and Testnet. These API nodes are what allow users to connect to the cluster. To connect to Devnet users can look at:

```
https://api.devnet.solana.com
```

This is the node for Devnet, and it is rate limited.

In the Mainnet Beta cluster, many developers choose to use their own private RPC node to take advantage of higher rate limits not avalible to them from Solana's public API nodes.

![](https://i.imgur.com/1GmCbcu.png#radius")

For Mainnet Beta in the picture above, from the [Solana Docs](https://docs.solana.com/cluster/rpc-endpoints), we can view the rate limits from using the mainnet api node.

We will proceed to define two types of RPC nodes and then present you with several options. We recommend you choose one based on your project's needs.

## Archive and Nonarchive Nodes

We can divide nodes into two different categories. The first one we will look at are the **Archive nodes**. These can store information of previous blocks. In the case of these archival nodes, we can leverage having access to all previous blocks in several ways. Some of the advantages include being able to view an address's balance history and view any state in the history. Due to the high system requirements of running a full historical node, having private nodes available with this feature is highly beneficial.

Unlike archival nodes, a non-archive node, or just a regular node, will only have access to some of the previous blocks, which is upwards of 100 blocks. We previously mentioned that running an archival node has intensive requirements, but even a non-archive node can become hard to manage. For this reason, users often choose a private RPC provider. Most use cases involving private RPCs in Solana usually revolve around Mainnet-beta uses since this involves real SOL tokens, and there is a higher chance of being rate limited.

## RPCs Available

The following section includes multiple RPC providers.

> **Note**
> This list is in alphabetical order. Please choose the RPC provider that best suits your project's needs. If we are missing a provider, let us know in our discord or submit a PR.

- [Alchemy](https://alchemy.com/?a=metaplex)
- [Ankr](https://www.ankr.com/protocol/public/solana/)
- [Blockdaemon](https://blockdaemon.com/marketplace/solana/)
- [Chainstack](https://chainstack.com/build-better-with-solana/)
- [Figment](https://figment.io/datahub/solana/)
- [GenesysGo](https://genesysgo.com/)
- [GetBlock](https://getblock.io/)
- [NOWNodes](https://nownodes.io/)
- [QuickNode](https://quicknode.com/)
- [RunNode](https://runnode.com/)
- [Syndica](https://syndica.io/)
- [Triton One | RPC Pool](https://www.triton.one/)

### Alchemy

Alchemy offers a free plan with a rate limit of 12 million transactions per month. Their plan is to keep it free for the first 500 people who sign up to use it. Once you sign up, you will have access to the private RPC they provide.

![](https://i.imgur.com/v0AZlqf.png#radius")

From this image you will notice they have a request counter which is setup to help you confirm your RPC is working.

| RPC Info           | Free       | 49 USD/month | Custom |
| ------------------ | ---------- | ------------ | ------ |
| Transactions/month | 12 million | 16 million   | Custom |
| Archival Node      | -          | -            | Yes    |

### Ankr

[Ankr](https://www.ankr.com/rpc/solana) provides a free endpoint without any account creation requirement. This allows you to connect to both devent and mainnet beta.

| RPC Info           | Free | Paid |
| ------------------ | ---- | ---- |
| Requests/sec       | 500  | 4000 |
| Full Archival Node | Yes  | Yes  |

Their dashboard also allows you to test the RPC through several methods such as using the public address of your wallet which you can get from your terminal with:

```ts=
solana address
// output
DZCjxxxxxxxxx
```

And input it into their tester with `getbalance` option chosen for the following result which includes the token balance and time taken to respond:

![](https://i.imgur.com/HCcFoym.png#radius")

### Blockdaemon

[Blockdaemon](https://blockdaemon.com/documentation/guides/solana/solana-nodes/) offers nodes for the three Solana networks and also provide the option of having an archival node with full history or history from past weeks. They have both a free option and a custom option.

![](https://i.imgur.com/1GmCbcu.png#radius")

| RPC Info      | Free | Custom     |
| ------------- | ---- | ---------- |
| Calls/month   | -    | 1+ million |
| Archival Node | -    | Yes        |

### Chainstack

[Chainstack](https://chainstack.com/build-better-with-solana/) offers elastic and dedicated high-performance Solana nodes across a number of cloud locations and providers. Chainstack has a free option, the Developer plan, that allows for 3 million included monthly requests with more included requests available with paid plans.

![](https://i.imgur.com/otznOWo.png)

| RPC Info       | Free      | 50 USD/month | 350 USD/month | 990 USD/month |
| -------------- | --------- | ------------ | ------------- | ------------- |
| Requests/month | 3 million | 20 million   | 140 million   | 400 million   |
| Archival Node  | -         | -            | -             | -             |

### Figment

[Figment](https://www.figment.io/datahub/solana) has a free option of 3 million requests per month and requires filling in an application to request your private RPC. They also offer a paid plan with 15 million requests per month and for higher options you can contact their team.

| RPC Info       | Free      | 50 USD/month | Custom |
| -------------- | --------- | ------------ | ------ |
| Requests/month | 3 million | 15 million   | Custom |
| Archival Node  | -         | -            | -      |

### GenesysGo

GenesysGo has information regarding the setup for your RPC in their [docs](https://docs.genesysgo.com/shadow/). Their free RPC has a limit of 1 request per second. They also offer a premium service that has no rate limiting.

After going through the documentation, you can reserve an account in their [portal](https://portal.genesysgo.net/premium/reserve) and proceed to choose your plan.

| RPC Info      | Free | 325 USDC/month  | 795 USDC/month  |
| ------------- | ---- | --------------- | --------------- |
| Requests/sec  | 1    | 100 + 100 extra | 200 + 200 extra |
| Archival Node | -    | -               | -               |

### GetBlock

[GetBlock](https://getblock.io/) is the blockchain RPC provider that employs a ‘pay per use’ model: its requests have no ‘expiration date’ so that users only pay for the resources they actually use. It supports more than 50 multiple blockchains. GetBlock guarantees the highest rate limit in free tariff, 60 RPS.

After setting up an account, proceed to choose a convenient plan.

![](https://imgur.com/iqO3rE7.png#radius)

| RPC Info       | Free   | Shared                      | Custom    |
| -------------- | ------ | --------------------------- | --------- |
| Requests/month | 40 000 | from 5 million to Unlimited | Unlimited |
| Archival Node  | No     | No                          | Yes       |

GetBlock users can set up an account using nothing but a cryptocurrency wallet.

### NOWNodes

NOWNodes offers a free trial plan with a rate limit of 100 000 requests per month. They also offer a premium service that has no rate limits. Here you can setup your RPC: [Setup](https://account.nownodes.io/auth/login). Once you sign up, you need to create an API key in your account, and you will have access to the private RPC they provide.

You can find Solana full mainnet node in the list of available [nodes](https://nownodes.io/nodes).

| RPC Info       | Free    | 20 USD/month | 200 USD/month | 500 USD/month | By request |
| -------------- | ------- | ------------ | ------------- | ------------- | ---------- |
| Requests/month | 100 000 | 1 000 000    | 30 000 000    | 100 000 000   | Unlimited  |
| Archival Node  | -       | -            | -             | -             | Yes        |

### QuickNode

Another provider is [QuickNode](https://www.quicknode.com?tap_a=67226-09396e&tap_s=2286372-341e1b&utm_source=affiliate&utm_campaign=generic&utm_content=affiliate_landing_page&utm_medium=generic).

To begin using it, you will create an account and go to your dashboard. Once you're there, you'll create an endpoint and choose the appropriate blockchain. We will click on Solana. You will then have the option to choose between one of the three networks that Solana has to offer.

![](https://i.imgur.com/iAD5sUi.png#radius")

This is followed by optional add-ons and finally you get to choose a plan. Currently, QuickNode offers a **Discover** option for free and paid options if you require higher rate limits along with other features such as additional endpoints.

![](https://i.imgur.com/HGvgNOu.png#radius")

| RPC Info      | Free | 49 USD/month | 299 USD/month |
| ------------- | ---- | ------------ | ------------- |
| Requests/sec  | 25   | 100          | 600           |
| Archival Node | Yes  | Yes          | Yes           |

### Runnode

From the [official docs](https://docs.runnode.com/runnode/tutorials/1.-how-to-sign-up-for-an-rpc-endpoint) from Runnode we can find how to setup a private RPC and the plans that they offer.

| RPC Info      | Free | 50 USD/month | 200 USD/month |
| ------------- | ---- | ------------ | ------------- |
| Requests/sec  | 25   | 100          | 600           |
| Archival Node | -    | -            | -             |

![](https://i.imgur.com/zO4kjqG.jpg#radius")

### Syndica

[Syndica](https://www.figment.io/datahub/solana) offers three plans. Their free option has a limit of 1 thousand requests per month.

| RPC Info       | Free | 75 USD/month | 499 USD/month |
| -------------- | ---- | ------------ | ------------- |
| Requests/month | 1000 | 1 million    | Unlimited     |
| Archival Node  | -    | -            | -             |

![](https://i.imgur.com/42O2GVG.png#radius")

### Triton

[Triton](https://triton.one/#/pricing) starts by offering a paid plan at 500 USD per month which provides up to 50 requests per second. They also offer higher rate limits at other price points.

![](https://i.imgur.com/qaUayM6.png#radius")

| RPC Info      | 500 USD/month | 1000 USD/month | 1500 USD/month |
| ------------- | ------------- | -------------- | -------------- |
| Requests/sec  | 25            | 100            | 150            |
| Archival Node | -             | -              | -              |

## Additional Information

If you have any questions or would like to further understand this topic, you are welcome to ask join the [Metaplex Discord](https://discord.gg/YZZAyMFU22) group.
