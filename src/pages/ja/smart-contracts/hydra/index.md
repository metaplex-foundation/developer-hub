---
title: 概要
metaTitle: 概要 | Hydra
description: Hydraウォレットの高レベルな概要を提供します。
---

Hydraはウォレットのウォレットであり、ファンアウトウォレット（fanout wallet）とも言えます。これにより、中央ウォレットからの資金分配に参加できる極めて大きなメンバーシップセットが可能になります。SOLおよびあらゆるSPLトークンで動作します。 {% .lead %}

🔗 **役立つリンク:**

- [Hydra UI](https://hydra.metaplex.com/)
- [GitHub上のHydra UI](https://github.com/metaplex-foundation/hydra-ui)
- [プログラムGitHubリポジトリ](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/hydra)
- [JS SDK](https://www.npmjs.com/package/@glasseaters/hydra-sdk)
- [UmiベースのJS SDK](https://www.npmjs.com/package/@metaplex-foundation/mpl-hydra)
- [Rust Crate](https://crates.io/crates/hydra_wallet)

{% callout %}

HydraのプログラムIDは以下の通りです:

- Mainnet: `hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg`
- Devnet: `hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg`
- Testnet: これが必要ですか？

{% /callout %}

## 基本的なフロー

Hydraウォレットのライフサイクルには3つのフェーズがあります：

1. 作成 - ウォレットの作成
2. メンバー追加 - メンバーを追加し、シェアを指定
3. 分配 - シェアに応じてメンバーに資金を分配

分配フェーズは、メンバー単位で呼び出されるオンチェーン操作です。詳細については後ほど説明しますが、Hydraはすべての分配を追跡し、メンバーが常に資金の公正なシェアを受け取れるようにします。Hydraウォレットに新しい資金が流入すると、メンバー（または他の自動化プロセス）が分配操作を呼び出して、指定されたメンバーに適切なシェアの資金を分配します。

これらのステップをもう少し詳しく見ていきましょう。

## ウォレットの作成

Hydraウォレットの作成者は**Authority（権限者）**として知られています。Authorityは、ウォレットのグローバルにユニークな名前、分配される総シェア数、およびメンバーシップモデル（これについては後で説明します）を指定します。SDKには独自の`FanoutClient`を提供しており、Authorityのウォレットでこれを初期化します。Hydraウォレットを作成するには約XXX Solが必要です。

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

### SPLトークンも受け入れる

他の特定のSPLトークンも受け入れたい場合は、ウォレットを初期化した後に、指定されたトークンのpublic keyを指定してHydraウォレットを更新できます。

```ts
const mintPublicKey = 'SPL-Token-Public-Key'

const { fanoutForMint, tokenAccount } = await fanoutSdk.initializeFanoutForMint(
  {
    fanout,
    mint: mintPublicKey,
  }
)
```

## メンバーの追加

Hydraの初回バージョンでは、3つの異なるメンバーシップモデルが提供されています：

1. **ウォレット** - これは最もシンプルなメンバーシップモデルです。各メンバーのパブリックアドレスと所有シェア数のリストです。すべてのメンバーのシェアの合計は、`initializeFanout`呼び出しで指定された`totalShares`と等しくなければなりません。

```ts
const member = new Keypair();

const { membershipAccount } = await fanoutSdk.addMemberWallet({
  fanout: init.fanout,
  fanoutNativeAccount: init.nativeAccount,
  membershipKey: member.publicKey,
  shares: 10
});

// シェアの合計 = totalSharesになるまでメンバーを追加
...
```

1. **NFT** - このモデルでは、メンバーシップは静的なパブリックアドレスではなく、NFTミントアドレスに紐付けられます。各NFTミントアドレスは、ウォレットモデルと同様に異なる数のシェアを持つことができます。このモデルの最大の利点は、指定されたNFTを保有するウォレット所有者に対して、将来の分配への権利を簡単に譲渡できることです。

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

// シェアの合計 = totalSharesになるまでメンバーを追加
...
```

1. **トークン** - これは最も柔軟なメンバーシップモデルですが、少し複雑です。このモデルでは、メンバーシップは指定されたトークンのステーク済み所有権に関連付けられます。トークンモデルでHydraウォレットを作成する際、SPLトークンのミントを指定し、それらのトークンをメンバーに配布します（任意の割合で）。その後、メンバーは分配のシェアを請求するために、トークンをHydraウォレットにステークする必要があります。

   例えば、1000トークンの供給量をミントしてすべて配布したが、そのうち40トークンのみがステークされた場合、分配は総供給量の1000トークンではなく、ステークされた40トークンに基づいて計算されます。ステークしないメンバーは0％を受け取り、ステークしたメンバーは`ステーク済み / 40`の分配を受け取ります。

   このモデルにはいくつかの初期化問題があることを認識しているため、現在のところ、メンバーがトークンをステークする十分な時間を与えるまで、Hydraウォレットに資金を供給しないことをお勧めします。

```ts
const membershipMintPublicKey = 'SPL-TokenPublicKey'

const { fanout } = await fanoutSdk.initializeFanout({
  totalShares: 0,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.Token,
  mint: membershipMintPublicKey,
})

// トークンのステーキング

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

注意：一部のHydraの使用例では、メンバーシップトークンをメンバーにエアドロップしています。この場合、メンバーの代わりにトークンをステークしたい場合があります。これを行う最も効果的な方法は、`stakeForTokenMemberInstructions`メソッドを使用することです。下記の例では、`membershipMintTokenAccount`がメンバーではなくAuthorityのATAであることに注意してください。この方法では、メンバーシップトークンをメンバーのメンバーシップミント用の個人ATAではなく、メンバーのステークアカウントに送信しています。

```ts
// インメモリkeypairでHydraを設定する例
let authorityWallet = Keypair.generate();
let fanoutSdk = new FanoutClient(
  connection,
  new NodeWallet(new Account(authorityWallet.secretKey))
);
// Hydraのセットアップ -> SDKをauthority Walletをウォレットとして設定したため、initに署名者を渡す必要はありません
const { fanout } = await fanoutSdk.initializeFanout({
  totalShares: 0,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.Token,
  mint: membershipMint.publicKey
});

...
const ixs = await fanoutSdk.stakeForTokenMemberInstructions(
  {
    shares: supply * .1,
    fanout: fanout,
    membershipMintTokenAccount: tokenAcct,
    membershipMint: membershipMint.publicKey,
    fanoutAuthority: authorityWallet.publicKey,
    member: member.publicKey,
    payer: authorityWallet.publicKey
  }
);
```

## 資金の分配

Distributeメソッドは、Hydraウォレットの生涯にわたって何度も呼び出されることが期待されます。処理とメモリコストをSolanaの制限内に収めながら、任意に大きなメンバーシップセットを可能にするため、資金を分配したいメンバー（および該当する場合はメンバーのNFTまたはSPLミント）を指定する必要があります。

{% callout type="warning" %}

メンバーシェアの合計が`initializeFanout`呼び出しで指定されたtotalSharesと等しくない場合、分配は失敗します。

{% /callout %}

Hydraは分配を追跡するため、これを複数回呼び出すことができ、資金はメンバーに一度だけ分配されます。Distributeメソッドは、メンバーシップモデルによって若干異なります：

### ウォレット

```ts
const member1.publicKey = "Member1.publicKey";
const distributionBot = new Keypair();
// これはDistributeメソッドの呼び出し元で、ボットまたはユーザーが可能です。
// トランザクション手数料を支払うのに十分な資金があればよいです。この
// コードを使用している場合は、distributionBotにsolをエアドロップしてください。

let distributeToMember1 = await fanoutSdk.distributeWalletMemberInstructions(
  {
    distributeForMint: false,
    member: member1.publicKey,
    fanout: fanout, // 初期化から
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

上記と同じですが、distributeToMember1を以下に置き換えます：

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

### トークン

ウォレットと同じですが、distributeToMember1を以下に置き換えます：

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

### SPLトークンの分配

プロセスは基本的に同じで、分配したいトークンのミントを追加で指定し、distributeForMintをtrueに設定します。

ウォレットメンバーモデルの例：

```ts
const mint.publicKey = "SPL-Token-To-Distribute-PublicKey";

let distributeToMember1 = await fanoutSdk.distributeWalletMemberInstructions(
  {
    distributeForMint: true,
    member: member1.publicKey,
    fanout: builtFanout.fanout,
    payer: distributionBot.publicKey,
    fanoutMint: mint.publicKey
  },
);

```

## 追加機能

### クリエイターとしてのメタデータ署名

Hydraの主要な使用例の一つは、HydraウォレットをNFTのロイヤリティシェアを持つクリエイターとして指定することです。HydraウォレットのAuthorityが、HydraウォレットとしてNFTに署名できるようにし、ウォレットがNFTメタデータの検証済みクリエイターになるようにしました。NFTの作成の詳細は省略していますが、`init.fanout`経由でHydraウォレットをクリエイターとして設定したと仮定して、以下の指示で署名できます。

```ts
// 上記のようにHydraを作成

// ロイヤリティの設定
const allCreators = [
  { creator: authorityWallet.publicKey, share: 0 },
  {
    creator: init.fanout,
    publicKey,
    share: 100,
  },
]

// NFT作成コード - allCreatorsをNFTのクリエイターとして追加

const instructions: TransactionInstruction[] = []
instructions.push(
  /// NFT作成指示
  /// nftに署名
  ...fanoutSdk.signMetadataInstructions({
    metadata: metadataAccount,
    holdingAccount: init.nativeAccount,
    fanout: init.fanout,
  }).instructions
)

///....instructionsをsolanaに送信
```
