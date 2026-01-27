---
title: 자산 잠금
metaTitle: 자산 잠금 | Token Metadata
description: Token Metadata에서 자산을 잠금/동결하는 방법을 알아보세요
---

"[위임된 권한](/ko/smart-contracts/token-metadata/delegates#token-delegates)" 페이지에서 언급했듯이, 특정 위임자는 자산을 잠그고 잠금 해제할 수 있어 소유자가 자산을 전송하거나 소각하는 것을 방지할 수 있습니다. 잠긴 자산은 또한 소유자가 위임자의 권한을 취소하는 것을 금지합니다. 이 잠금 메커니즘은 에스크로 계정 없이는 작동할 수 없는 스테이킹과 같은 다양한 유틸리티 사용 사례를 가능하게 합니다. {% .lead %}

아래 표에서는 자산 잠금을 지원하는 모든 토큰 위임자를 나열합니다. 이러한 각 위임자에 대해 자세히 알아보고 승인/취소하는 방법은 해당 섹션에서 확인할 수 있습니다.

| 위임자                                                                        | 잠금/잠금 해제 | 전송 | 소각 | 대상              |
| ------------------------------------------------------------------------------- | ----------- | -------- | ---- | ---------------- |
| [Standard](/ko/smart-contracts/token-metadata/delegates#standard-delegate)                         | ✅          | ✅       | ✅   | pNFT를 제외한 모든 것 |
| [Locked Transfer](/ko/smart-contracts/token-metadata/delegates#locked-transfer-delegate-pnft-only) | ✅          | ✅       | ❌   | pNFT만       |
| [Utility](/ko/smart-contracts/token-metadata/delegates#utility-delegate-pnft-only)                 | ✅          | ❌       | ✅   | pNFT만       |
| [Staking](/ko/smart-contracts/token-metadata/delegates#staking-delegate-pnft-only)                 | ✅          | ❌       | ❌   | pNFT만       |

자산에 승인된 토큰 위임자가 있다고 가정하고, 이제 위임자가 자산을 잠그고 잠금 해제하는 방법을 살펴보겠습니다.

## 자산 잠금

### NFT

자산을 잠그려면, 위임자는 Token Metadata 프로그램의 **Lock** 명령어를 사용할 수 있습니다. 이 명령어는 다음 속성을 받습니다:

- **Mint**: 자산의 Mint 계정 주소.
- **Authority**: 잠금을 승인하는 서명자. 이는 위임된 권한이어야 합니다.
- **Token Standard**: 잠기는 자산의 표준. Token Metadata 프로그램은 명시적으로 이 인수를 필요로 하지 않지만 우리의 SDK는 다른 대부분의 매개변수에 대해 적절한 기본값을 제공할 수 있도록 필요로 합니다.

{% code-tabs-imported from="token-metadata/lock-nft" frameworks="umi,kit" /%}

### pNFT

{% code-tabs-imported from="token-metadata/lock-pnft" frameworks="umi,kit" /%}

## 자산 잠금 해제

### NFT

상호적으로, 위임자는 Token Metadata 프로그램의 **Unlock** 명령어를 사용하여 자산을 잠금 해제할 수 있습니다. 이 명령어는 **Lock** 명령어와 동일한 속성을 받으며 같은 방식으로 사용할 수 있습니다.

{% code-tabs-imported from="token-metadata/unlock-nft" frameworks="umi,kit" /%}

### pNFT

{% code-tabs-imported from="token-metadata/unlock-pnft" frameworks="umi,kit" /%}
