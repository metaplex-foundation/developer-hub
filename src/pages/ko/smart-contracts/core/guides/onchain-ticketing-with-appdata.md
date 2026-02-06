---
title: Appdata 플러그인을 활용한 이벤트 티켓팅 플랫폼 생성
metaTitle: Core - Appdata 플러그인 예제
description: 이 가이드에서는 Appdata 플러그인을 활용하여 티켓팅 플랫폼을 만드는 방법을 보여줍니다.
updated: '01-31-2026'
keywords:
  - NFT ticketing
  - event tickets
  - AppData plugin
  - digital tickets
about:
  - Ticketing platforms
  - AppData implementation
  - Event management
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - JavaScript
howToSteps:
  - Manager, Event, Ticket 명령어가 있는 Solana 프로그램 생성
  - 장소 검증을 위해 Event 컬렉션에 LinkedAppData 설정
  - 티켓 상태 추적용 AppData가 있는 티켓 Asset 생성
  - 티켓 상태를 읽고 업데이트하는 검증 시스템 구축
howToTools:
  - Anchor 프레임워크
  - mpl-core SDK
  - Solana CLI
---
이 개발자 가이드에서는 새로운 Appdata 플러그인을 활용하여 **발행자 외의 외부 신뢰할 수 있는 소스(예: 장소 관리자)에 의해 검증될 수 있는 디지털 에셋으로 티켓을 생성하는 티켓팅 솔루션을 만듭니다**.
## 소개
### 외부 플러그인
**외부 플러그인**은 동작이 *외부* 소스에 의해 제어되는 플러그인입니다. core 프로그램은 이러한 플러그인에 대한 어댑터를 제공하지만 개발자는 이 어댑터를 외부 데이터 소스로 지정하여 동작을 결정합니다.
각 외부 어댑터는 라이프사이클 이벤트에 라이프사이클 검사를 할당하는 기능이 있어 발생하는 라이프사이클 이벤트의 동작에 영향을 줍니다. 이는 create, transfer, update, burn과 같은 라이프사이클 이벤트에 다음 검사를 할당할 수 있음을 의미합니다:
- **Listen**: 라이프사이클 이벤트가 발생할 때 플러그인에 알리는 "web3" 웹훅. 데이터 추적이나 작업 수행에 특히 유용합니다.
- **Reject**: 플러그인이 라이프사이클 이벤트를 거부할 수 있습니다.
- **Approve**: 플러그인이 라이프사이클 이벤트를 승인할 수 있습니다.
외부 플러그인에 대해 더 알아보려면 [여기](/smart-contracts/core/external-plugins/overview)에서 자세히 읽어보세요.
### Appdata 플러그인
**AppData 플러그인**을 사용하면 에셋/컬렉션 authority가 `data_authority`(외부 신뢰 소스이며 에셋/컬렉션 authority가 결정한 누구에게나 할당 가능)에 의해 작성 및 변경될 수 있는 임의의 데이터를 저장할 수 있습니다. AppData 플러그인을 사용하면 컬렉션/에셋 authority는 신뢰할 수 있는 제3자에게 에셋에 데이터를 추가하는 작업을 위임할 수 있습니다.
새로운 Appdata 플러그인에 익숙하지 않다면 [여기](/smart-contracts/core/external-plugins/app-data)에서 자세히 읽어보세요.
## 일반 개요: 프로그램 설계
이 예에서는 네 가지 기본 작업이 있는 티켓팅 솔루션을 개발합니다:
- **Manager 설정**: 티켓 생성 및 발행을 담당하는 authority 설정.
- **Event 생성**: 컬렉션 에셋으로 이벤트 생성.
- **개별 티켓 생성**: 이벤트 컬렉션의 일부인 개별 티켓 생성.
- **장소 운영 처리**: 티켓 스캔 등 장소 운영자의 작업 관리.
**참고**: 이러한 작업은 티켓팅 솔루션의 기초적인 시작점을 제공하지만 본격적인 구현에는 이벤트 컬렉션 인덱싱을 위한 외부 데이터베이스와 같은 추가 기능이 필요합니다. 그러나 이 예제는 티켓팅 솔루션 개발에 관심 있는 분들에게 좋은 출발점이 됩니다.
### 티켓 스캔을 처리하는 외부 신뢰 소스의 중요성
**AppData 플러그인**과 **Core 표준**이 도입되기 전에는 오프체인 저장 제약으로 인해 에셋의 attribute 변경 관리가 제한적이었습니다. 에셋의 특정 부분에 대한 authority를 위임하는 것도 불가능했습니다.
이 발전은 티켓팅 시스템과 같은 규제된 사용 사례에 획기적입니다. 장소 authority가 **attribute 변경 및 기타 데이터 측면에 대한 완전한 제어권을 부여하지 않고도 에셋에 데이터를 추가**할 수 있게 해주기 때문입니다.
이 설정은 사기 위험을 줄이고 오류에 대한 책임을 장소에서 발행 회사로 이전합니다. 발행 회사는 에셋의 불변 기록을 유지하고 티켓을 사용됨으로 표시하는 것과 같은 특정 데이터 업데이트는 `AppData 플러그인`을 통해 안전하게 관리됩니다.
전체 구현 세부 사항은 영문 문서의 전체 가이드를 참조하세요.
## 결론
축하합니다! 이제 Appdata 플러그인을 사용한 티켓팅 솔루션을 만들 준비가 되었습니다. Core와 Metaplex에 대해 더 알아보려면 [개발자 허브](/smart-contracts/core/getting-started)를 확인하세요.
