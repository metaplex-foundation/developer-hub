---
title: 快速开始
metaTitle: 快速开始 | Hydra
description: 提供非Umi Hydra SDK的高级概述。
---

要开始使用Hydra，您需要适合您编程环境的包。

如果您使用Rust，可以在这里获取crate：

[https://crates.io/crates/hydra_wallet](https://crates.io/crates/hydra_wallet)

如果您使用Javascript，可以在这里获取包：

[https://www.npmjs.com/package/@glasseaters/hydra-sdk](https://www.npmjs.com/package/@glasseaters/hydra-sdk)

## 快速开始 - JS

从npm安装包：

```bash
yarn add @glasseaters/hydra-sdk
```

以下是使用钱包[成员模型](/zh/smart-contracts/hydra#添加成员)设置Hydra的方法。

```ts
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { airdrop } from "@metaplex-foundation/amman";
import {
  Fanout,
  FanoutClient,
  FanoutMembershipMintVoucher,
  FanoutMembershipVoucher,
  FanoutMint,
  MembershipModel
} from "@glasseaters/hydra-sdk";


const connection = new Connection("devnet", "confirmed");
const authorityWallet = Keypair.generate();

await airdrop(connection, authorityWallet.publicKey, LAMPORTS_PER_SOL * 2);

const fanoutSdk = new FanoutClient(
  connection,
  new NodeWallet(new Account(authorityWallet.secretKey))
);

// 初始化Hydra钱包
const { fanout, nativeAccount } = await fanoutSdk.initializeFanout({
  totalShares: 100,
  name: `Your Globally Unique Wallet Name`,
  membershipModel: MembershipModel.Wallet,
});

// fanout是您的fanout配置地址
// nativeAccount是您的账户地址

// 获取链上的Hydra钱包
const fanoutAccount = await fanoutSdk.fetch<Fanout>(
  fanout,
  Fanout
);

console.log(fanoutAccount); // 显示Hydra的所有参数

// 这是您的Hydra钱包地址
let HydraAccountKey = fanoutAccount.accountKey // 这与上面的nativeAccount相同


// 如果您只知道Hydra名称，以下是获取账户密钥的方法
let name = `Your Globally Unique Wallet Name`
let [key, bump] = await fanoutSdk.fanoutKey(name)
let [holdingAccount, bump] = await fanoutSdk.nativeAccount(key)


// 添加成员

const member1 = new Keypair();
const { membershipAccount1 } = await fanoutSdk.addMemberWallet({
  fanout: init.fanout,
  fanoutNativeAccount: init.nativeAccount,
  membershipKey: member1.publicKey,
  shares: 10
});

// 对所有成员重复此操作，直到sum(shares) == 初始化时的totalShares
...

// 向Hydra钱包发送一些Sol以便分配
await airdrop(connection, HydraAccountKey, 2);

// 生成分配指令
let distMember1 = await fanoutSdk.distributeWalletMemberInstructions(
  {
    distributeForMint: false,
    member: member1.wallet.publicKey,
    fanout: fanout,
    payer: authorityWallet.publicKey, // 这可以改为发送交易的任何人
  },
);

// 发送分配指令
const tx = await fanoutSdk.sendInstructions(
  [...distMember1.instructions],
  [authorityWallet],
  authorityWallet.publicKey
);
if (!!tx.RpcResponseAndContext.value.err) {
  const txdetails = await connection.getConfirmedTransaction(tx.TransactionSignature);
  console.log(txdetails, tx.RpcResponseAndContext.value.err);
}

// Member1的钱包应该多了0.2 sol

```
