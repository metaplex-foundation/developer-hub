---
title: 자산 전송
metaTitle: 자산 전송 | Token Metadata
description: Token Metadata에서 자산을 전송하는 방법을 알아보세요
---

자산의 소유자는 Token Metadata 프로그램에 **Transfer** 명령어를 보내 자산을 다른 계정으로 전송할 수 있습니다. 이 명령어는 다음 속성을 받습니다:

- **Authority**: 전송을 승인하는 서명자. 일반적으로 이는 자산의 소유자이지만 "[위임된 권한](/ko/smart-contracts/token-metadata/delegates)" 페이지에서 논의된 바와 같이 특정 위임된 권한도 소유자를 대신하여 자산을 전송할 수 있다는 점에 주목하세요.
- **Token Owner**: 자산의 현재 소유자의 공개 키.
- **Destination Owner**: 자산의 새 소유자의 공개 키.
- **Token Standard**: 전송되는 자산의 표준. 이 명령어는 자산 전송을 위한 통합된 인터페이스를 제공하기 위해 모든 토큰 표준에서 작동합니다. 하지만 프로그래머블이 아닌 자산은 SPL Token 프로그램의 **Transfer** 명령어를 직접 사용하여 전송할 수 있다는 점에 주목할 가치가 있습니다.

다음은 Token Metadata에서 자산을 전송하기 위해 우리의 SDK를 사용하는 방법입니다.

## NFT 전송

{% code-tabs-imported from="token-metadata/transfer-nft" frameworks="umi,kit" /%}

## pNFT 전송

프로그래머블 NFT(pNFT)는 전송 중에 처리해야 하는 추가 인증 규칙을 가질 수 있습니다. 명령어는 자동으로 Token Record 계정을 처리합니다.

{% code-tabs-imported from="token-metadata/transfer-pnft" frameworks="umi,kit" /%}

### 고급 pNFT 전송

복잡한 인증 규칙을 가진 pNFT의 경우 추가 매개변수를 제공해야 할 수 있습니다.

{% code-tabs-imported from="token-metadata/transfer-pnft-advanced" frameworks="umi,kit" /%}
