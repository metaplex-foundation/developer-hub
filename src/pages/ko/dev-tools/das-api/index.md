---
title: DAS API
metaTitle: 개요 | DAS API
description: Metaplex Digital Asset Standard에 액세스하는 데 사용되는 DAS API 클라이언트입니다.
---

Metaplex Digital Asset Standard (DAS) API는 Solana의 디지털 자산과 상호작용하기 위한 통합 인터페이스로, 세 가지 Metaplex 표준인 Core, Token Metadata, 압축된(Bubblegum) 자산을 모두 지원합니다. 이를 통해 자산 데이터에 쉽게 액세스하고 필터링할 수 있습니다. 특히 다음과 같은 경우에 유용합니다:
- Core Assets의 경우, 플러그인을 자동으로 파생하고 컬렉션의 플러그인 데이터를 포함할 수 있습니다.
- Compressed NFT의 경우, 상세한 계정 데이터가 온체인에 저장되지 않고 RPC 제공자가 관리하는 데이터 저장소에 저장됩니다.
- 오프체인 메타데이터도 표준을 통해 인덱싱되므로 더 적은 호출로 데이터를 가져올 수 있습니다.

이 API는 RPC가 자산 데이터를 제공하기 위해 구현하는 일련의 메서드를 정의합니다. 대부분의 경우 데이터는 Metaplex Digital Asset RPC 인프라를 사용하여 인덱싱됩니다.

## Core 확장

일반 DAS SDK 외에도 [MPL Core](/ko/smart-contracts/core)를 위한 확장이 만들어졌으며, 이는 MPL Core SDK와 함께 사용할 수 있는 올바른 타입을 직접 반환합니다. 또한 컬렉션에서 상속된 자산의 플러그인을 자동으로 파생하고 [DAS-to-Core 타입 변환](/ko/dev-tools/das-api/core-extension/convert-das-asset-to-core)을 위한 함수를 제공합니다.

{% quick-links %}

{% quick-link title="시작하기" icon="InboxArrowDown" href="/das-api/getting-started" description="선택한 언어 또는 라이브러리를 찾고 필수 프로그램을 시작하세요." /%}

{% quick-link title="메서드" icon="CodeBracketSquare" href="/das-api/methods" description="데이터를 가져오기 위한 DAS API 메서드입니다." /%}

{% quick-link title="MPL Core 확장" icon="CodeBracketSquare" href="/ko/dev-tools/das-api/core-extension" description="MPL Core 자산을 쉽게 가져오고 파싱합니다" /%}

{% /quick-links %}
