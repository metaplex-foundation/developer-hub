---
title: 자산 소각
metaTitle: 자산 소각 | Token Metadata
description: Token Metadata에서 자산을 소각하는 방법을 알아보세요
---

자산의 소유자는 Token Metadata 프로그램의 **Burn** 명령어를 사용하여 자산을 소각할 수 있습니다. 이는 자산과 연관된 모든 가능한 계정을 닫고 닫힌 계정에 이전에 보유된 다양한 임대료 면제 수수료를 소유자에게 이전합니다. 이 명령어는 다음 속성을 받습니다:

- **Authority**: 소각을 승인하는 서명자. 일반적으로 이는 자산의 소유자이지만 "[위임된 권한](/ko/smart-contracts/token-metadata/delegates)" 페이지에서 논의된 바와 같이 특정 위임된 권한도 소유자를 대신하여 자산을 소각할 수 있다는 점에 주목하세요.
- **Token Owner**: 자산의 현재 소유자의 공개 키.
- **Token Standard**: 소각되는 자산의 표준. 이 명령어는 자산 소각을 위한 통합된 인터페이스를 제공하기 위해 모든 토큰 표준에서 작동합니다. 하지만 프로그래머블이 아닌 자산은 SPL Token 프로그램의 **Burn** 명령어를 직접 사용하여 소각할 수 있다는 점에 주목할 가치가 있습니다.

**Burn** 명령어에 의해 닫히는 정확한 계정들은 소각되는 자산의 토큰 표준에 따라 달라집니다. 다음은 각 토큰 표준에 대한 계정을 요약한 표입니다:

| Token Standard                 | Mint | Token                      | Metadata | Edition | Token Record | Edition Marker                    |
| ------------------------------ | ---- | -------------------------- | -------- | ------- | ------------ | --------------------------------- |
| `NonFungible`                  | ❌   | ✅                         | ✅       | ✅      | ❌           | ❌                                |
| `NonFungibleEdition`           | ❌   | ✅                         | ✅       | ✅      | ❌           | ✅ 모든 인쇄본이 소각된 경우        |
| `Fungible` 및 `FungibleAsset`  | ❌   | ✅ 모든 토큰이 소각된 경우    | ❌       | ❌      | ❌           | ❌                                |
| `ProgrammableNonFungible`      | ❌   | ✅                         | ✅       | ✅      | ✅           | ❌                                |

SPL Token 프로그램이 이를 허용하지 않기 때문에 Mint 계정은 절대 닫히지 않는다는 점에 주목하세요.

다음은 Token Metadata에서 자산을 소각하기 위해 우리의 SDK를 사용하는 방법입니다.

## NFT 소각

{% code-tabs-imported from="token-metadata/burn-nft" frameworks="umi,kit,shank,anchor" /%}

## pNFT 소각

`pNFT`는 명령어가 작동하기 위해 추가 계정들이 전달되어야 할 수 있습니다. 여기에는 다음이 포함될 수 있습니다:

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% code-tabs-imported from="token-metadata/burn-pnft" frameworks="umi,kit,shank,anchor" /%}
