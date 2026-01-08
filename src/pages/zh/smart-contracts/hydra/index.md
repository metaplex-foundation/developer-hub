---
title: 概述
metaTitle: Hydra 扇出钱包概述 | Metaplex Solana
description: 提供Hydra钱包的高级概述。
---

Hydra是一个钱包的钱包，也可以称为扇出钱包（fanout wallet）。它允许极大的成员集参与从中央钱包分配资金。支持SOL和任何SPL代币。 {% .lead %}

🔗 **有用链接：**

- [Hydra UI](https://hydra.metaplex.com/)
- [GitHub上的Hydra UI](https://github.com/metaplex-foundation/hydra-ui)
- [程序GitHub仓库](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/hydra)
- [JS SDK](https://www.npmjs.com/package/@glasseaters/hydra-sdk)
- [基于Umi的JS SDK](https://www.npmjs.com/package/@metaplex-foundation/mpl-hydra)
- [Rust Crate](https://crates.io/crates/hydra_wallet)

{% callout %}

Hydra的程序ID如下：

- Mainnet: `hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg`
- Devnet: `hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg`
- Testnet: 需要此地址吗？

{% /callout %}

## 基本流程

Hydra钱包的生命周期有三个阶段：

1. 创建 - 创建钱包
2. 添加成员 - 添加成员并指定份额
3. 分配 - 根据份额向成员分配资金

分配阶段是一个按成员调用的链上操作。我们稍后会详细介绍，但Hydra会跟踪所有分配，确保成员始终收到其公平份额的资金。当新资金流入Hydra钱包时，成员（或其他自动化进程）调用分配操作，将适当份额的资金分配给指定成员。

让我们更详细地了解这些步骤。

## 创建钱包

Hydra钱包的创建者被称为**Authority（权限者）**。Authority指定钱包的全局唯一名称、要分配的总份额数以及成员模型（稍后介绍）。SDK提供了自己的`FanoutClient`，您可以使用Authority的钱包初始化它。创建Hydra钱包需要约XXX Sol。

```ts
const connection = new Connection('devnet', 'confirmed')
let fanoutSdk: FanoutClient

authorityWallet = Keypair.generate()

fanoutSdk = new FanoutClient(
  connection,
  new NodeWallet(new Account(authorityWallet.secretKey))
)

const init = await fanoutSdk.initializeFanout({
  totalShares: 100,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.Wallet,
})
```

### 也接受SPL代币

如果您还想接受其他特定的SPL代币，可以在初始化钱包后，使用指定代币的公钥更新Hydra钱包。

```ts
const mintPublicKey = 'SPL-Token-Public-Key'

const { fanoutForMint, tokenAccount } = await fanoutSdk.initializeFanoutForMint(
  {
    fanout,
    mint: mintPublicKey,
  }
)
```

## 添加成员

Hydra的初始版本提供了三种不同的成员模型：

1. **钱包** - 这是最简单的成员模型。它是每个成员的公共地址及其拥有的份额数列表。所有成员份额的总和必须等于`initializeFanout`调用中指定的`totalShares`。

```ts
const member = new Keypair();

const { membershipAccount } = await fanoutSdk.addMemberWallet({
  fanout: init.fanout,
  fanoutNativeAccount: init.nativeAccount,
  membershipKey: member.publicKey,
  shares: 10
});

// 继续添加成员直到份额总和 = totalShares
...
```

2. **NFT** - 在此模型中，成员资格与NFT铸币地址绑定，而不是静态公共地址。每个NFT铸币地址可以像钱包模型一样拥有不同数量的份额。此模型的最大优势是可以轻松地将未来分配的权利转让给持有指定NFT的钱包所有者。

```ts

const nftMintPublicKey = "nftMintPublicKey";

const init = await fanoutSdk.initializeFanout({
  totalShares: 100,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.NFT,
});

const { membershipAccount } = await fanoutSdk.addMemberNft({
  fanout: init.fanout,
  fanoutNativeAccount: init.nativeAccount,
  membershipKey: nftMintPublicKey,
  shares: 10
});

// 继续添加成员直到份额总和 = totalShares
...
```

3. **代币** - 这是最灵活的成员模型，但稍微复杂一些。在此模型中，成员资格与指定代币的质押所有权关联。使用代币模型创建Hydra钱包时，您指定SPL代币铸币并将这些代币分发给成员（以任意比例）。然后成员必须将其代币质押到Hydra钱包才能认领其分配份额。

   例如，如果您铸造了1000个代币供应量并全部分发，但只有40个代币被质押，则分配将基于质押的40个代币计算，而不是总供应量的1000个代币。未质押的成员获得0%，质押的成员获得`质押量 / 40`的分配。

   我们意识到此模型存在一些初始化问题，因此目前建议在给予成员足够时间质押代币之前，不要向Hydra钱包注入资金。

```ts
const membershipMintPublicKey = 'SPL-TokenPublicKey'

const { fanout } = await fanoutSdk.initializeFanout({
  totalShares: 0,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.Token,
  mint: membershipMintPublicKey,
})

// 代币质押

const ixs = await fanoutSdk.stakeTokenMemberInstructions({
  shares: supply * 0.1,
  fanout: fanout,
  membershipMintTokenAccount: tokenAcctMember,
  membershipMint: membershipMint.publicKey,
  member: member.publicKey,
  payer: member.publicKey,
})

const tx = await fanoutSdk.sendInstructions(
  ixs.instructions,
  [member],
  member.publicKey
)
if (!!tx.RpcResponseAndContext.value.err) {
  const txdetails = await connection.getConfirmedTransaction(
    tx.TransactionSignature
  )
  console.log(txdetails, tx.RpcResponseAndContext.value.err)
}

const stake = await membershipMint.getAccountInfo(ixs.output.stakeAccount)
```

注意：某些Hydra用例中，成员资格代币会空投给成员。在这种情况下，您可能希望代表成员质押代币。最有效的方法是使用`stakeForTokenMemberInstructions`方法。

## 分配资金

Distribute方法预计在Hydra钱包的整个生命周期中被多次调用。为了在保持处理和内存成本在Solana限制内的同时允许任意大的成员集，您需要指定要分配资金的成员（以及成员的NFT或SPL铸币，如适用）。

{% callout type="warning" %}

如果成员份额总和不等于`initializeFanout`调用中指定的totalShares，分配将失败。

{% /callout %}

Hydra会跟踪分配，因此您可以多次调用此方法，资金只会分配给成员一次。Distribute方法根据成员模型略有不同。

### 钱包

```ts
const member1.publicKey = "Member1.publicKey";
const distributionBot = new Keypair();
// 这是Distribute方法的调用者，可以是机器人或用户。
// 只需要有足够的资金支付交易费用。如果使用此代码，
// 请向distributionBot空投sol。

let distributeToMember1 = await fanoutSdk.distributeWalletMemberInstructions(
  {
    distributeForMint: false,
    member: member1.publicKey,
    fanout: fanout, // 从初始化获取
    payer: distributionBot.publicKey,
  },
);

const tx = await fanoutSdk.sendInstructions(
  [...distMember1.instructions],
  [distributionBot],
  distributionBot.publicKey
);
if (!!tx.RpcResponseAndContext.value.err) {
  const txdetails = await connection.getConfirmedTransaction(tx.TransactionSignature);
  console.log(txdetails, tx.RpcResponseAndContext.value.err);
}
```

### NFT

与上面相同，但将distributeToMember1替换为：

```ts
const member1.mint = "NFT Mint for Member 1";

let distributeToMember1 = await fanoutSdk.distributeNftMemberInstructions(
  {
    distributeForMint: false,
    member: member1.publicKey,
    membershipKey: member1.mint,
    fanout: fanout,
    payer: distributionBot.publicKey,
  },
);
```

### 代币

与钱包相同，但将distributeToMember1替换为：

```ts
const membershiptMint.publicKey = "SPL-Token-PublicKey";

let distributeToMember1 = await fanoutSdk.distributeTokenMemberInstructions(
  {
    distributeForMint: false,
    membershipMint: membershipMint.publicKey,
    fanout: fanout,
    member: member1.publicKey,
    payer: distributionBot.publicKey,
  }
);
```

## 附加功能

### 作为创作者签名元数据

Hydra的一个主要用例是将Hydra钱包指定为NFT的创作者，并拥有版税份额。我们允许Hydra钱包的Authority代表Hydra钱包签名NFT，使钱包成为NFT元数据的已验证创作者。
