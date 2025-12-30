---
title: 자산 전송
metaTitle: 자산 전송 | Token Metadata
description: Token Metadata에서 자산을 전송하는 방법을 알아보세요
---

자산의 소유자는 Token Metadata 프로그램에 **Transfer** 명령어를 보내서 다른 계정으로 전송할 수 있습니다. 이 명령어는 다음 속성을 허용합니다:

- **Authority**: 전송을 인증한 서명자. 일반적으로 이는 자산의 소유자이지만, "[위임된 권한](/ko/smart-contracts/token-metadata/delegates)" 페이지에서 논의된 바와 같이 특정 위임된 권한도 소유자를 대신하여 자산을 전송할 수 있다는 점에 주목하세요.
- **Token Owner**: 자산의 현재 소유자의 공개 키.
- **Destination Owner**: 자산의 새로운 소유자의 공개 키.
- **Token Standard**: 전송되는 자산의 표준. 이 명령어는 자산 전송을 위한 통합 인터페이스를 제공하기 위해 모든 토큰 표준에서 작동합니다. 그렇긴 하지만, 프로그래머블하지 않은 자산은 SPL Token 프로그램의 **Transfer** 명령어를 직접 사용하여 전송할 수 있다는 점을 주목할 가치가 있습니다.

다음은 SDK를 사용하여 Token Metadata에서 자산을 전송하는 방법입니다.

## NFT 전송

{% dialect-switcher title="NFT 전송" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: currentOwner,
  tokenOwner: currentOwner.publicKey,
  destinationOwner: newOwner.publicKey,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## pNFT 전송

다음 코드는 pNFT를 새로운 소유자에게 전송하는 예제입니다.

{% dialect-switcher title="pNFT 전송" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { getMplTokenAuthRulesProgramId } from "@metaplex-foundation/mpl-candy-machine";
import {
  fetchDigitalAssetWithAssociatedToken,
  findTokenRecordPda,
  TokenStandard,
  transferV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
import { publicKey, unwrapOptionRecursively } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";

// NFT 자산 Mint ID
const mintId = publicKey("11111111111111111111111111111111");

// Token 계정과 함께 pNFT 자산 가져오기
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
);

// 목적지 지갑
const destinationAddress = publicKey(
  "22222222222222222222222222222222"
);

// 목적지 지갑의 Token 계정 계산
const destinationTokenAccount = findAssociatedTokenPda(umi, {
  mint: mintId,
  owner: destinationAddress,
});

// 목적지 지갑의 Token Record 계정 계산
const destinationTokenRecord = findTokenRecordPda(umi, {
  mint: mintId,
  token: destinationTokenAccount[0],
});

// pNFT 전송
const { signature } = await transferV1(umi, {
  mint: mintId,
  destinationOwner: destinationAddress,
  destinationTokenRecord: destinationTokenRecord,
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  // pNFT 자산이 인증 규칙을 가지고 있는지 확인
  authorizationRules:
    unwrapOptionRecursively(assetWithToken.metadata.programmableConfig)
      ?.ruleSet || undefined,
  // 인증 규칙 프로그램 ID
  authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
  // 일부 pNFT는 설정된 경우 인증 데이터가 필요할 수 있음
  authorizationData: undefined,
}).sendAndConfirm(umi);

console.log("서명: ", base58.deserialize(signature));
```
{% /dialect %}
{% /dialect-switcher %}