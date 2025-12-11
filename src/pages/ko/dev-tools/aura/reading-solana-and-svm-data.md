---
title: Solana 및 SVM 데이터 읽기
metaTitle: Solana 및 SVM 데이터 읽기 | Aura
description: Metaplex Aura로 Solana 및 SVM 데이터를 읽는 방법을 알아보세요.
---

Metaplex Aura 데이터 네트워크는 개발자에게 Solana 및 Eclipse와 같은 다른 SVM 기반 체인에 대한 온체인 상태의 성능적이고 안정적이며 정확한 읽기 액세스를 제공합니다.

인덱서와 RPC 제공업체는 데이터 일관성과 성능을 유지하는 데 상당한 어려움을 겪는 경우가 많습니다. 이는 여러 문제로 인한 것입니다:

- **데이터 일관성**: Solana 노드는 종종 동기화가 해제되고 Geyser 플러그인은 특히 노드 재동기화 중에 업데이트를 건너뛸 수 있습니다. 이는 인덱서가 제공하는 데이터의 불일치로 이어질 수 있습니다.
- **증가하는 스토리지 비용**: 데이터 볼륨이 계속 증가함에 따라 인덱스를 유지하고 관리하는 데 더 많은 스토리지가 필요하고 관련 비용이 증가합니다.
- **사용자 경험**: 단편화된 데이터 가용성은 제공업체 종속으로 이어질 수 있으며, 사용자가 다양한 프로토콜에서 모든 디지털 자산에 액세스하기 위해 여러 RPC 제공업체에 의존하도록 강제합니다.

## 개발 진행 상황

Aura와 그 기능의 개발 진행 상황은 github 저장소 [https://github.com/metaplex-foundation/aura/](https://github.com/metaplex-foundation/aura/)에서 확인할 수 있습니다.