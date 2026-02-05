---
title: 외부 플러그인
metaTitle: 외부 플러그인 | Metaplex Core
description: Oracle 및 AppData 플러그인을 사용하여 외부 프로그램으로 Core NFT를 확장합니다. 사용자 정의 검증 로직을 추가하고 Asset에 임의의 데이터를 저장합니다.
updated: '01-31-2026'
keywords:
  - external plugins
  - Oracle plugin
  - AppData plugin
  - custom validation
about:
  - External integrations
  - Plugin adapters
  - Custom logic
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 외부 플러그인과 내장 플러그인 중 언제 무엇을 사용해야 하나요?
    a: 사용자 정의 검증 로직(Oracle)이나 제3자 데이터 저장(AppData)이 필요할 때 외부 플러그인을 사용하세요. 동결, 로열티, 속성과 같은 표준 NFT 기능에는 내장 플러그인을 사용하세요.
  - q: 외부 플러그인이 전송을 거부할 수 있나요?
    a: 예. Oracle 플러그인은 외부 계정 상태에 따라 라이프사이클 이벤트(생성, 전송, 업데이트, 소각)를 거부할 수 있습니다. 이를 통해 시간 기반 제한, 가격 기반 규칙 또는 모든 사용자 정의 로직이 가능합니다.
  - q: AppData에 누가 쓸 수 있나요?
    a: Data Authority만 AppData 플러그인에 쓸 수 있습니다. 이는 플러그인 authority와 별개이며 제3자 애플리케이션을 위한 안전한 분할 저장소를 제공합니다.
  - q: 하나의 Asset에 여러 외부 플러그인을 가질 수 있나요?
    a: 예. 단일 Asset에 각각 다른 구성과 authority를 가진 여러 Oracle 또는 AppData 플러그인을 추가할 수 있습니다.
  - q: 외부 플러그인이 DAS에 의해 인덱싱되나요?
    a: 예. JSON 또는 MsgPack 스키마가 있는 AppData는 쉬운 쿼리를 위해 DAS에 의해 자동으로 인덱싱됩니다.
---
**외부 플러그인**은 고급 기능을 위해 Core Asset을 외부 프로그램에 연결합니다. 사용자 정의 검증 로직에는 Oracle 플러그인을, 제3자 앱이 읽고 쓸 수 있는 임의 데이터 저장에는 AppData 플러그인을 사용하세요. {% .lead %}
{% callout title="배우게 될 내용" %}
- 외부 플러그인 아키텍처 이해(어댑터 + 플러그인)
- 라이프사이클 검사 구성(생성, 전송, 업데이트, 소각)
- 안전한 데이터 저장을 위한 data authority 설정
- Oracle과 AppData 플러그인 중 선택
{% /callout %}
## 요약
외부 플러그인은 외부 프로그램 기능으로 Core Asset을 확장합니다. 두 부분으로 구성됩니다: Asset/Collection에 연결된 **플러그인 어댑터**와 데이터 및 검증을 제공하는 **외부 플러그인**(Oracle 계정 또는 AppData 저장소).
- Authority 관리 플러그인(update authority 제어)
- 라이프사이클 검증 지원: 승인, 거부 또는 수신
- Data Authority가 플러그인 데이터 쓰기 권한 제어
- Asset 및 Collection과 작동
## 범위 외
내장 플러그인([플러그인 개요](/smart-contracts/core/plugins) 참조), Oracle 프로그램 생성([Oracle 가이드](/smart-contracts/core/guides/oracle-plugin-example) 참조), Token Metadata 확장.
## 빠른 시작
**바로가기:** [Oracle 플러그인](/smart-contracts/core/external-plugins/oracle) · [AppData 플러그인](/smart-contracts/core/external-plugins/app-data) · [외부 플러그인 추가](/smart-contracts/core/external-plugins/adding-external-plugins)
1. 플러그인 유형 선택: Oracle(검증) 또는 AppData(데이터 저장)
2. 외부 계정 생성/배포(Oracle) 또는 data authority 구성(AppData)
3. Asset 또는 Collection에 플러그인 어댑터 추가
## 외부 플러그인이란?
외부 플러그인은 [Authority 관리](/smart-contracts/core/plugins#authority-managed-plugins)이며, **어댑터**와 **플러그인** 2부분으로 구성됩니다. **플러그인 어댑터**는 Asset/Collection에 할당되어 외부 플러그인에서 데이터와 검증을 전달받을 수 있습니다. 외부 플러그인은 **플러그인 어댑터**에 데이터와 검증을 제공합니다.
## 라이프사이클 검사
각 외부 플러그인에는 발생하려는 라이프사이클 이벤트의 동작에 영향을 미치는 라이프사이클 이벤트에 라이프사이클 검사를 할당하는 기능이 있습니다. 사용 가능한 라이프사이클 검사:
- Create
- Transfer
- Update
- Burn
각 라이프사이클 이벤트에 다음 검사를 할당할 수 있습니다:
- Can Listen
- Can Reject
- Can Approve
### Can Listen
라이프사이클 이벤트가 발생했음을 플러그인에 알리는 web3 유형 웹훅입니다. 데이터 추적이나 발생한 이벤트를 기반으로 다른 작업을 수행하는 데 유용합니다.
### Can Reject
플러그인이 라이프사이클 이벤트 작업을 거부할 수 있습니다.
### Can Approve
플러그인이 라이프사이클 이벤트를 승인할 수 있습니다.
## Data Authority
외부 플러그인에는 프로젝트가 해당 특정 플러그인에 데이터를 안전하게 저장할 수 있는 데이터 영역이 있을 수 있습니다.
외부 플러그인의 Data Authority만 외부 플러그인의 데이터 섹션에 쓸 수 있습니다. 플러그인의 Update Authority는 Data Authority이기도 하지 않는 한 권한이 없습니다.
## 플러그인
### Oracle 플러그인
Oracle 플러그인은 web 2.0-3.0 워크플로우에서 단순성을 위해 설계되었습니다. Oracle 플러그인은 authority가 설정한 라이프사이클 이벤트 사용을 거부할 수 있는 MPL Core Asset 외부의 온체인 Oracle 계정에 액세스할 수 있습니다. 외부 Oracle 계정은 언제든지 업데이트하여 라이프사이클 이벤트의 권한 부여 동작을 변경할 수 있어 동적인 경험을 제공합니다.
Oracle 플러그인에 대해 [여기](/smart-contracts/core/external-plugins/oracle)에서 자세히 읽을 수 있습니다.
### AppData 플러그인
AppData 플러그인은 Asset에 안전하고 분할된 데이터 저장을 제공합니다. 각 AppData 플러그인에는 해당 데이터 섹션에 대한 쓰기를 독점적으로 제어하는 Data Authority가 있습니다. 사용자 데이터, 게임 상태 또는 애플리케이션별 메타데이터를 저장하는 제3자 앱에 유용합니다.
AppData 플러그인에 대해 [여기](/smart-contracts/core/external-plugins/app-data)에서 자세히 읽을 수 있습니다.
## 외부 플러그인 vs 내장 플러그인
| 기능 | 외부 플러그인 | 내장 플러그인 |
|---------|------------------|------------------|
| 데이터 저장 | 외부 계정 또는 온자산 | 온자산만 |
| 사용자 정의 검증 | ✅ 완전한 제어 | ❌ 사전 정의된 동작 |
| 동적 업데이트 | ✅ 외부 계정 업데이트 | ✅ 플러그인 업데이트 |
| 복잡성 | 높음(외부 프로그램) | 낮음(내장) |
| 사용 사례 | 사용자 정의 로직, 제3자 앱 | 표준 NFT 기능 |
## FAQ
### 외부 플러그인과 내장 플러그인 중 언제 무엇을 사용해야 하나요?
사용자 정의 검증 로직(Oracle)이나 제3자 데이터 저장(AppData)이 필요할 때 외부 플러그인을 사용하세요. 동결, 로열티, 속성과 같은 표준 NFT 기능에는 내장 플러그인을 사용하세요.
### 외부 플러그인이 전송을 거부할 수 있나요?
예. Oracle 플러그인은 외부 계정 상태에 따라 라이프사이클 이벤트(생성, 전송, 업데이트, 소각)를 거부할 수 있습니다. 이를 통해 시간 기반 제한, 가격 기반 규칙 또는 모든 사용자 정의 로직이 가능합니다.
### AppData에 누가 쓸 수 있나요?
Data Authority만 AppData 플러그인에 쓸 수 있습니다. 이는 플러그인 authority와 별개이며 제3자 애플리케이션을 위한 안전한 분할 저장소를 제공합니다.
### 하나의 Asset에 여러 외부 플러그인을 가질 수 있나요?
예. 단일 Asset에 각각 다른 구성과 authority를 가진 여러 Oracle 또는 AppData 플러그인을 추가할 수 있습니다.
### 외부 플러그인이 DAS에 의해 인덱싱되나요?
예. JSON 또는 MsgPack 스키마가 있는 AppData는 쉬운 쿼리를 위해 DAS에 의해 자동으로 인덱싱됩니다.
## 용어집
| 용어 | 정의 |
|------|------------|
| **플러그인 어댑터** | 외부 플러그인에 연결하는 Asset에 첨부된 온체인 구성 요소 |
| **외부 플러그인** | 기능을 제공하는 외부 계정(Oracle) 또는 데이터 저장소(AppData) |
| **라이프사이클 검사** | 이벤트를 승인, 거부 또는 수신할 수 있는 검증 |
| **Data Authority** | AppData에 독점적인 쓰기 권한이 있는 주소 |
| **Oracle 계정** | 검증 결과를 저장하는 외부 계정 |
## 관련 페이지
- [Oracle 플러그인](/smart-contracts/core/external-plugins/oracle) - 사용자 정의 검증 로직
- [AppData 플러그인](/smart-contracts/core/external-plugins/app-data) - 제3자 데이터 저장
- [외부 플러그인 추가](/smart-contracts/core/external-plugins/adding-external-plugins) - 코드 예제
- [내장 플러그인](/smart-contracts/core/plugins) - 표준 플러그인 기능
