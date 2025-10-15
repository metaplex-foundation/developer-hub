---
title: 준비
metaTitle: 준비 | MPL-Hybrid
description: MPL-404 하이브리드를 생성하기 전에 준비하는 방법
---

## MPL-404 계획

MPL-404 에스크로 및 스왑 프로그램을 배포하기 전에 사용할 NFT 컬렉션과 대체 가능한 토큰을 준비해야 합니다. 아직 준비되지 않았다면, 이 페이지의 나머지 부분을 읽은 후에 대체 불가능한 토큰에는 [Metaplex Core](https://developers.metaplex.com/core)를, 대체 가능한 토큰을 생성하기 위해서는 [Token Metadata program](https://developers.metaplex.com/token-metadata)을 사용하는 것을 권장합니다.

에스크로에 자금을 지원하려면 NFT, 대체 가능한 토큰 또는 둘의 조합을 추가해야 합니다. 실제로는 한 유형의 모든 자산으로 에스크로를 채우고 나머지는 모두 배포하는 것이 가장 쉽습니다. 이렇게 하면 에스크로가 균형을 유지합니다.

## 오프체인 메타데이터 URI 형식

MPL-404의 메타데이터 무작위화 기능을 활용하려면 오프체인 메타데이터 URI가 일관되게 정의되고 증가해야 합니다. 일관된 기본 URI는 모든 오프체인 메타데이터 솔루션에서 사용할 수 없습니다. Shadow Drive는 증가하는 URI를 가진 가능한 오프체인 메타데이터 솔루션 중 하나입니다. URI는 다음과 같아야 합니다:

- https://shdw-drive.genesysgo.net/.../0.json
- https://shdw-drive.genesysgo.net/.../1.json

...

- https://shdw-drive.genesysgo.net/.../999999.json

## 스왑 무작위화

현재 MPL-Hybrid 프로그램은 제공된 최소 및 최대 URI 인덱스 사이에서 숫자를 무작위로 선택하고 URI가 이미 사용되었는지 확인하지 않습니다. 따라서 스와핑은 [생일 역설(Birthday Paradox)](https://betterexplained.com/articles/understanding-the-birthday-paradox/)의 영향을 받습니다. 프로젝트가 충분한 스왑 무작위화의 이점을 얻으려면 무작위로 선택할 수 있는 최소 250k 자산 메타데이터를 준비하고 업로드하는 것을 권장합니다. 사용 가능한 잠재적 자산이 많을수록 좋습니다.

## 스왑 수수료와 희귀도에 대한 생각

스왝 수수료는 프로젝트 재무를 채우는 것 이상으로 중요한 역할을 합니다. 스왑 수수료는 희귀도 인플레이션을 방지하기 위해 특성 희귀도와 균형을 맞춰야 합니다. 경험 법칙으로, 수수료가 낮을수록 특성이 더 희귀해야 합니다. 전반적으로 프로젝트는 정적 컬렉션보다 특성이 훨씬 더 희귀하기를 원할 것입니다.