---
title: 빠른 시작
metaTitle: 빠른 시작 | Hydra
description: non-Umi Hydra SDK의 고수준 개요를 제공합니다.
---

Hydra를 시작하려면 프로그래밍 환경에 맞는 패키지가 필요합니다.

Rust를 사용하는 경우 여기에서 crate를 가져오세요:

[https://crates.io/crates/hydra_wallet](https://crates.io/crates/hydra_wallet)

Javascript를 사용하는 경우 여기에서 패키지를 가져오세요:

[https://www.npmjs.com/package/@glasseaters/hydra-sdk](https://www.npmjs.com/package/@glasseaters/hydra-sdk)

## 빠른 시작 - JS

npm에서 패키지를 설치하세요:

```bash
yarn add @glasseaters/hydra-sdk
```

다음은 지갑 [멤버십 모델](/ko/smart-contracts/hydra#adding-members)로 Hydra를 설정하는 방법입니다.

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

// Hydra 지갑 초기화
const { fanout, nativeAccount } = await fanoutSdk.initializeFanout({
  totalShares: 100,
  name: `Your Globally Unique Wallet Name`,
  membershipModel: MembershipModel.Wallet,
});

// fanout은 당신의 fanout 구성 주소입니다
// nativeAccount는 당신의 계정 주소입니다

// 온체인 Hydra 지갑 검색
const fanoutAccount = await fanoutSdk.fetch<Fanout>(
  fanout,
  Fanout
);

console.log(fanoutAccount); // Hydra의 모든 매개변수를 보여줍니다

// 이것이 당신의 Hydra 지갑 주소입니다
let HydraAccountKey = fanoutAccount.accountKey // 이것은 위의 nativeAccount와 같습니다


// Hydra 이름만 알고 있다면, 계정 키를 검색하는 방법입니다
let name = `Your Globally Unique Wallet Name`
let [key, bump] = await fanoutSdk.fanoutKey(name)
let [holdingAccount, bump] = await fanoutSdk.nativeAccount(key)


// 멤버 추가

const member1 = new Keypair();
const { membershipAccount1 } = await fanoutSdk.addMemberWallet({
  fanout: init.fanout,
  fanoutNativeAccount: init.nativeAccount,
  membershipKey: member1.publicKey,
  shares: 10
});

// 초기화에서 sum(shares) == totalShares가 될 때까지 모든 멤버에 대해 반복
...

// Hydra 지갑에 Sol을 보내어 분배할 수 있도록 합니다
await airdrop(connection, HydraAccountKey, 2);

// 분배 명령어 생성
let distMember1 = await fanoutSdk.distributeWalletMemberInstructions(
  {
    distributeForMint: false,
    member: member1.wallet.publicKey,
    fanout: fanout,
    payer: authorityWallet.publicKey, // 이것은 거래를 보내는 누구든지로 변경될 수 있습니다
  },
);

// 분배 명령어 전송
const tx = await fanoutSdk.sendInstructions(
  [...distMember1.instructions],
  [authorityWallet],
  authorityWallet.publicKey
);
if (!!tx.RpcResponseAndContext.value.err) {
  const txdetails = await connection.getConfirmedTransaction(tx.TransactionSignature);
  console.log(txdetails, tx.RpcResponseAndContext.value.err);
}

// Member1은 지갑에 0.2 sol이 더 있어야 합니다

```