---
title: クイックスタート
metaTitle: クイックスタート | Hydra
description: Umi以外のHydra SDKの高レベルな概要を提供します。
---

Hydraを始めるには、プログラミング環境用のパッケージが必要です。

Rustを使用している場合は、こちらでcrateを入手してください：

[hydra_wallet on crates.io](https://crates.io/crates/hydra_wallet)

Javascriptを使用している場合は、こちらでパッケージを入手してください：

[@glasseaters/hydra-sdk on npm](https://www.npmjs.com/package/@glasseaters/hydra-sdk)

## クイックスタート - JS

npmからパッケージをインストールします：

```bash
yarn add @glasseaters/hydra-sdk
```

これは、ウォレット[メンバーシップモデル](/ja/smart-contracts/hydra#メンバーの追加)でHydraをセットアップする方法です。

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

// Hydraウォレットを初期化
const { fanout, nativeAccount } = await fanoutSdk.initializeFanout({
  totalShares: 100,
  name: `Your Globally Unique Wallet Name`,
  membershipModel: MembershipModel.Wallet,
});

// fanoutはあなたのfanout設定アドレスです
// nativeAccountはあなたのアカウントアドレスです

// オンチェーンのHydraウォレットを取得
const fanoutAccount = await fanoutSdk.fetch<Fanout>(
  fanout,
  Fanout
);

console.log(fanoutAccount); // Hydraのすべてのパラメータを表示

// これがあなたのHydraウォレットアドレスです
let HydraAccountKey = fanoutAccount.accountKey // これは上記のnativeAccountと同じです


// Hydra名のみを知っている場合、アカウントキーを取得する方法は以下の通りです
let name = `Your Globally Unique Wallet Name`
let [key, bump] = await fanoutSdk.fanoutKey(name)
let [holdingAccount, bump] = await fanoutSdk.nativeAccount(key)


// メンバーを追加

const member1 = new Keypair();
const { membershipAccount1 } = await fanoutSdk.addMemberWallet({
  fanout: init.fanout,
  fanoutNativeAccount: init.nativeAccount,
  membershipKey: member1.publicKey,
  shares: 10
});

//sum(shares) == 初期化からのtotalSharesになるまで、すべてのメンバーに対して繰り返します
...

// 分配できるようにHydraウォレットにいくらかのSolを送金
await airdrop(connection, HydraAccountKey, 2);

// 分配指示を生成
let distMember1 = await fanoutSdk.distributeWalletMemberInstructions(
  {
    distributeForMint: false,
    member: member1.wallet.publicKey,
    fanout: fanout,
    payer: authorityWallet.publicKey, // これはトランザクションを送信する誰にでも変更可能です
  },
);

// 分配指示を送信
const tx = await fanoutSdk.sendInstructions(
  [...distMember1.instructions],
  [authorityWallet],
  authorityWallet.publicKey
);
if (!!tx.RpcResponseAndContext.value.err) {
  const txdetails = await connection.getConfirmedTransaction(tx.TransactionSignature);
  console.log(txdetails, tx.RpcResponseAndContext.value.err);
}

// Member1のウォレットには0.2 sol多く入っているはずです

```
