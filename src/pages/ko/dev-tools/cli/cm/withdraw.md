---
title: "인출"
metaTitle: "MPLX CLI - 캔디 머신 인출"
description: "MPLX CLI를 사용하여 MPL Core 캔디 머신을 인출하고 삭제하여 렌트 SOL을 회수합니다."
---

`mplx cm withdraw` 명령어는 캔디 머신을 인출하고 삭제하여 남은 SOL 잔액을 회수하고 온체인 계정을 정리합니다. 이 작업은 되돌릴 수 없으며 캔디 머신이 더 이상 필요하지 않을 때 사용해야 합니다. 이미 민팅된 NFT는 영향을 받지 않습니다.

{% callout title="되돌릴 수 없음" type="warning" %}
이 명령은 되돌릴 수 없습니다. 실행하면 캔디 머신이 파괴되고 다시 만들 수 없습니다.
{% /callout %}

## 사용법

```bash
# 현재 디렉토리에서 캔디 머신 인출
mplx cm withdraw

# 주소로 특정 캔디 머신 인출
mplx cm withdraw --address <candy_machine_address>

```

사용할 수 있는 선택적 플래그:

- `--address`: 캔디 머신 주소 직접 지정
- `--force`: *위험* 확인 프롬프트 건너뛰기 (극도로 주의해서 사용)

### ⚠️ 되돌릴 수 없는 작업

- **영구 삭제**: 캔디 머신 계정이 영구적으로 삭제됩니다
- **복구 불가**: 되돌리거나 복원할 수 없습니다
- **데이터 손실**: 모든 온체인 구성 및 상태가 손실됩니다
- **민팅된 NFT**: 기존 민팅된 NFT는 영향을 받지 않습니다

### 🛡️ 모범 사례

**계획:**

- 인출 시기를 신중하게 계획
- 팀원과 조율

**실행:**

- 모든 매개변수 재확인
- 연습을 위해 데브넷 사용

## 관련 명령어

- [`mplx cm fetch`](/ko/dev-tools/cli/cm/fetch) - 인출 전 상태 확인
- [`mplx cm create`](/ko/dev-tools/cli/cm/create) - 새 캔디 머신 생성
- [`mplx cm validate`](/ko/dev-tools/cli/cm/validate) - 인출 전 검증
- [`solana balance`](https://docs.solana.com/cli) - 회수된 잔액 확인
