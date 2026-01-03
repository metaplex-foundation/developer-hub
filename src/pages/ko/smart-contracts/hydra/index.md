---
title: 개요
metaTitle: Hydra 팬아웃 지갑 - 수익 분배 시스템 | Metaplex Docs
description: Hydra 지갑의 고수준 개요를 제공합니다.
---

Hydra는 지갑들의 지갑, 팬아웃 지갑입니다. 중앙 지갑에서 자금 분배에 참여할 수 있는 매우 큰 멤버십 세트를 가능하게 합니다. SOL 및 모든 SPL 토큰과 함께 작동합니다. {% .lead %}

🔗 **유용한 링크:**

- [Hydra UI](https://hydra.metaplex.com/)
- [Hydra UI on Github](https://github.com/metaplex-foundation/hydra-ui)
- [Program GitHub Repository](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/hydra)
- [JS SDK](https://www.npmjs.com/package/@glasseaters/hydra-sdk)
- [Umi Based JS SDK](https://www.npmjs.com/package/@metaplex-foundation/mpl-hydra)
- [Rust Crate](https://crates.io/crates/hydra_wallet)

{% callout %}

Hydra의 PROGRAM ID는 다음과 같습니다:

- Mainnet: `hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg`
- Devnet: `hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg`
- Testnet: Do you want this?

{% /callout %}

## 기본 플로우

Hydra 지갑의 라이프사이클에는 3단계가 있습니다:

1. 생성 - 지갑 생성
2. 멤버 추가 - 멤버를 추가하고 그들의 지분을 지정
3. 분배 - 멤버들의 지분에 따라 자금을 분배

분배 단계는 멤버별로 호출되는 온체인 작업입니다. 자세한 내용은 나중에 다루겠지만, Hydra는 모든 분배를 추적하고 멤버가 항상 자금의 공정한 지분을 받을 수 있도록 보장합니다. 새로운 자금이 Hydra 지갑으로 유입되면, 멤버(또는 다른 자동화된 프로세스)가 분배 작업을 호출하여 해당 멤버에게 적절한 지분의 자금을 지급합니다.

이 단계들에 대해 좀 더 자세히 알아보겠습니다.

## 지갑 생성

Hydra 지갑의 생성자는 **권한자(Authority)**라고 불립니다. 권한자는 지갑의 전역 고유 이름, 분배할 총 지분 수, 멤버십 모델(잠시 후 다룰 예정)을 지정합니다. SDK와 함께 자체 `FanoutClient`를 제공했으며, 이를 권한자의 지갑으로 초기화합니다. Hydra 지갑을 생성하려면 약 XXX Sol이 필요합니다.

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

### SPL 토큰도 허용

다른 특정 SPL 토큰도 허용하려면, 지갑을 초기화한 후 해당 토큰의 공개 키를 지정하여 Hydra 지갑이 해당 토큰들을 허용하도록 업데이트할 수 있습니다.

```ts
const mintPublicKey = 'SPL-Token-Public-Key'

const { fanoutForMint, tokenAccount } = await fanoutSdk.initializeFanoutForMint(
  {
    fanout,
    mint: mintPublicKey,
  }
)
```

## 멤버 추가

Hydra의 첫 번째 버전에는 세 가지 다른 멤버십 모델이 있습니다:

1. **지갑** - 가장 간단한 멤버십 모델입니다. 각 멤버의 공개 주소와 그들이 소유한 지분 수의 목록입니다. 모든 멤버의 지분의 합은 `initializeFanout` 호출에서 지정된 `totalShares`와 같아야 합니다.

```ts
const member = new Keypair();

const { membershipAccount } = await fanoutSdk.addMemberWallet({
  fanout: init.fanout,
  fanoutNativeAccount: init.nativeAccount,
  membershipKey: member.publicKey,
  shares: 10
});

// shares의 합 = totalShares가 될 때까지 멤버 추가
...
```

2. **NFT** - 이 모델에서는 멤버십이 정적 공개 주소 대신 NFT 민트 주소와 연결됩니다. 각 NFT 민트 주소는 지갑 모델과 같이 여전히 다른 지분 수량을 가질 수 있습니다. 이 모델의 가장 큰 장점은 주어진 NFT를 보유한 모든 지갑 소유자에게 향후 분배에 대한 권리를 간단하게 양도할 수 있다는 것입니다.

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

// shares의 합 = totalShares가 될 때까지 멤버 추가
...
```

3. **토큰** - 가장 유연한 멤버십 모델이지만 약간 더 복잡합니다. 이 모델에서 멤버십은 지정된 토큰의 스테이킹된 소유권과 연관됩니다. 토큰 모델로 Hydra 지갑을 생성할 때, SPL 토큰의 민트를 지정하고 해당 토큰을 원하는 비율로 멤버들에게 분배합니다. 그러면 해당 멤버들은 분배 지분을 청구할 수 있도록 토큰을 Hydra 지갑에 스테이킹해야 합니다.

   예를 들어, 1000개의 토큰 공급량을 민팅하고 모든 1000개를 분배하지만 40개만 스테이킹된 경우, 분배는 총 1000개 공급량이 아닌 스테이킹된 40개를 기준으로 계산됩니다. 스테이킹하지 않은 멤버는 0%를 받고, 스테이킹한 멤버는 분배의 `staked / 40`를 받습니다.

   이 모델에는 일부 초기화 문제가 있음을 알고 있으므로, 현재로서는 멤버들이 토큰을 스테이킹할 충분한 시간을 준 후까지 Hydra 지갑에 자금을 지원하지 않는 것을 권장합니다.

```ts
const membershipMintPublicKey = 'SPL-TokenPublicKey'

const { fanout } = await fanoutSdk.initializeFanout({
  totalShares: 0,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.Token,
  mint: membershipMintPublicKey,
})

// 토큰 스테이킹

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

참고: 일부 Hydra 사용 사례는 멤버들에게 멤버십 토큰을 에어드롭하는 것입니다. 이 경우, 멤버들을 대신하여 토큰을 스테이킹할 수 있습니다. 이를 수행하는 가장 효과적인 방법은 `stakeForTokenMemberInstructions` 메서드를 사용하는 것입니다. 아래 예제에서 `membershipMintTokenAccount`는 멤버가 아닌 권한자의 ATA라는 점에 주목하세요. 이 방식으로 멤버십 토큰을 멤버의 개인 ATA가 아닌 멤버의 스테이크 계정으로 단순히 전송합니다.

```ts
// 메모리 키페어로 Hydra를 설정하는 예시.
let authorityWallet = Keypair.generate();
let fanoutSdk = new FanoutClient(
  connection,
  new NodeWallet(new Account(authorityWallet.secretKey))
);
// Hydra 설정 -> 권한자 지갑을 지갑으로 하여 SDK를 구성했으므로 init에 서명자를 전달할 필요가 없습니다.
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

## 자금 분배

분배 메서드는 Hydra 지갑의 생명주기 동안 여러 번 호출될 것으로 예상됩니다. 임의로 큰 멤버십 세트를 가능하게 하면서 처리 및 메모리 비용을 Solana 한도 내에 유지하기 위해, 자금을 분배하려는 멤버(그리고 해당하는 경우 멤버의 NFT 또는 SPL 민트)를 지정해야 합니다.

{% callout type="warning" %}

멤버 지분의 합이 `initializeFanout` 호출에서 지정된 totalShares와 같지 않으면 분배가 실패합니다.

{% /callout %}

Hydra는 분배를 추적하므로, 여러 번 호출해도 자금은 멤버에게 한 번만 분배됩니다. 분배 메서드는 멤버십 모델에 따라 약간씩 다릅니다:

### 지갑

```ts
const member1
.
publicKey = "Member1.publicKey";
const distributionBot = new Keypair();
// 이는 분배 메서드의 호출자로, 봇이나 사용자일 수 있으며,
// 거래 수수료를 지불할 충분한 자금만 있으면 됩니다. 이 코드를 사용하는 경우,
// distributionBot에 sol을 에어드롭하세요.

let distributeToMember1 = await fanoutSdk.distributeWalletMemberInstructions(
  {
    distributeForMint: false,
    member: member1.publicKey,
    fanout: fanout, // 초기화에서
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

위와 동일하지만, distributeToMember1을 다음으로 교체하세요:

```ts
const member1
.
mint = "NFT Mint for Member 1";

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

### 토큰

지갑과 동일하지만, distributeToMember1을 다음으로 교체하세요:

```ts
const membershiptMint
.
publicKey = "SPL-Token-PublicKey";

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

### SPL 토큰 분배

프로세스는 기본적으로 동일하며, 추가로 분배하려는 토큰의 민트를 지정하고 distributeForMint를 true로 설정합니다.

지갑 멤버 모델의 예시:

```ts
const mint
.
publicKey = "SPL-Token-To-Distribute-PublicKey";

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

## 추가 기능

### 생성자로서 메타데이터 서명

Hydra의 주요 사용 사례 중 하나는 NFT의 일부 로열티 지분을 가진 생성자로 Hydra 지갑을 지정하는 것입니다. Hydra 지갑의 권한자가 Hydra 지갑으로 NFT에 서명할 수 있도록 하여 지갑이 NFT 메타데이터에서 검증된 생성자가 되도록 했습니다. NFT 생성의 세부사항은 생략했지만, `init.fanout`을 통해 Hydra 지갑을 생성자로 설정했다고 가정하고, 아래 명령어로 서명할 수 있습니다.

```ts
// 위와 같이 Hydra 생성.

// 로열티 설정
const allCreators = [
  { creator: authorityWallet.publicKey, share: 0 },
  {
    creator: init.fanout,
    publicKey,
    share: 100,
  },
]

// NFT의 생성자로 allCreators를 추가하는 NFT 생성 코드

const instructions: TransactionInstruction[] = []
instructions.push(
  /// NFT 생성 명령어
  /// nft 서명
  ...fanoutSdk.signMetadataInstructions({
    metadata: metadataAccount,
    holdingAccount: init.nativeAccount,
    fanout: init.fanout,
  }).instructions
)

///....솔라나에 명령어 전송
```