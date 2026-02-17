---
title: 청구 가능한 SPL 토큰 에어드롭 생성하기
metaTitle: 청구 가능한 SPL 토큰 에어드롭 생성하기 | Gumdrop 가이드
description: 사용자가 Gumdrop을 사용하여 할당량을 청구하는 SPL 토큰 에어드롭을 생성하는 방법을 알아보세요.
created: '01-06-2025'
updated: '01-06-2025'
---

## 개요

Gumdrop은 청구 가능한 에어드롭을 생성할 수 있는 Solana 프로그램입니다. 토큰을 지갑에 직접 보내는 직접 에어드롭과 달리, Gumdrop은 사용자가 적극적으로 할당량을 청구해야 하는 청구 메커니즘을 생성합니다. 이 접근 방식에는 여러 가지 이점이 있습니다:

- 청구하는 사용자에게만 토큰을 전송하고 청구자가 트랜잭션 비용을 부담하게 하여 비용을 절감합니다
- 다양한 방법을 통한 사용자 신원 확인을 허용합니다
- 배포 방법(지갑, 이메일, SMS, Discord)에 유연성을 제공합니다
- 청구되지 않은 토큰을 회수할 수 있는 기능과 함께 시간 제한 청구를 가능하게 합니다

이 가이드는 Gumdrop을 사용하여 청구 가능한 SPL 토큰 에어드롭을 생성하는 방법을 보여줍니다.

## 작동 원리

1. Gumdrop을 생성할 때 배포 목록에서 머클 트리가 생성됩니다
2. 머클 루트가 Gumdrop 프로그램의 일부로 온체인에 저장됩니다
3. 각 수신자는 트리에서의 위치에서 파생된 고유한 머클 증명을 받습니다
4. 청구할 때 증명이 온체인 루트와 대조하여 확인되어 다음을 보장합니다:
   - 청구자가 원래 배포 목록에 있음
   - 올바른 양의 토큰을 청구하고 있음
   - 이전에 청구하지 않았음

## 전제조건

- Node.js 14
- Solana CLI 도구 설치
- SPL 토큰과 Solana 블록체인에 대한 기본 지식
- 트랜잭션 수수료를 위한 자금이 있는 지갑

## 필수 도구

Gumdrop CLI를 설치하세요:

```bash
git clone https://github.com/metaplex-foundation/gumdrop
yarn install
```

## SPL 토큰 생성

먼저 배포될 SPL 토큰을 생성하세요. [우리 가이드](/ko/guides/javascript/how-to-create-a-solana-token)를 따르거나 [sol-tools.io](https://sol-tools.io/token-tools/create-token)와 같은 도구를 사용할 수 있습니다.

{% callout type="note" title="토큰 양" %}
전체 배포 목록을 커버할 수 있는 충분한 토큰과 테스트를 위한 여분을 발행했는지 확인하세요.
{% /callout %}

## 배포 방법

사용자에게 증명을 배포하기 위해 Gumdrop은 여러 배포 방법을 지원합니다. 지갑 기반 배포는 다음과 같은 이유로 권장됩니다:
- 더 나은 신뢰성
- 더 간단한 구현
- 외부 서비스에 대한 의존성 없음
- 직접 지갑 확인

지갑 배포의 경우 다음 중 하나를 수행해야 합니다:
- 이미 사용 가능한 Discord 봇 중 하나를 사용하여 필요한 증명 데이터가 포함된 청구 URL을 사용자에게 보냅니다.
또는:
1. 지갑 주소별로 인덱싱된 데이터베이스에 청구 데이터를 저장합니다
2. 사용자가 지갑을 연결할 때 청구 데이터를 가져오는 프론트엔드를 생성합니다
3. 청구 데이터를 사용하여 온체인 청구 트랜잭션을 실행합니다

다른 배포 방법들:
- AWS SES를 통한 이메일
- AWS SNS를 통한 SMS
- Discord API를 통한 Discord

## 배포 목록 설정
SPL 토큰을 생성한 후 배포 목록을 생성해야 합니다. 이 목록은 누가 토큰을 청구할 수 있는지와 그 양을 정의합니다. 이 데이터는 다음을 위해 사용됩니다:
1. 각 수신자를 위한 고유한 청구 증명 생성
2. 확인을 위해 루트가 온체인에 저장되는 머클 트리 생성
3. 나열된 수신자만이 정확한 할당량을 청구할 수 있도록 보장

배포 목록이 포함된 JSON 파일을 생성하세요:

```json
[
    {
        "handle": "8SoWVrwJ6vPa3rcdNBkhznR54yJ6iQqPSmgcXVGnwtEu",
        "amount": 10000000
    },
    {
        "handle": "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
        "amount": 5000000
    }
]
```

{% callout title="토큰 양" %}
양은 소수점 없이 지정해야 합니다. 예를 들어, 6개의 소수점을 가진 민트의 10개 토큰을 드롭하려면 10000000 (10 * 10^6)을 지정하세요.
{% /callout %}

`handle`은 다음이 될 수 있습니다:
- 직접 배포를 위한 지갑 주소 **권장**
- AWS SES 배포를 위한 이메일 주소
- AWS SNS 배포를 위한 전화번호
- Discord 배포를 위한 Discord 사용자 ID

## Gumdrop 생성

이전에 다운로드하고 설치한 Gumdrop CLI를 사용하여 에어드롭을 생성하세요. 명령어는 다음과 같습니다:

```bash
ts-node gumdrop-cli.ts create \
  -e devnet \
  --keypair <KEYPAIR_PATH> \
  --distribution-list <PATH_TO_JSON> \
  --claim-integration transfer \
  --transfer-mint <TOKEN_MINT> \
  --distribution-method <METHOD>
```

{% callout type="note" title="Gumdrop 키페어" %}
CLI는 키페어가 포함된 `.log` 폴더를 생성합니다. Gumdrop 계정을 닫고 청구되지 않은 토큰을 회수하는 데 필요하므로 저장하세요.
{% /callout %}

## 청구 인터페이스 호스팅

사용자는 토큰을 청구하기 위한 프론트엔드 인터페이스가 필요합니다. 다음 중 하나를 선택할 수 있습니다:

1. `https://gumdrop.metaplex.com`의 호스팅된 버전 사용

2. 자체 인터페이스 호스팅 **권장**. Gumdrop 프론트엔드를 시작점으로 사용하고 필요에 맞게 사용자 정의할 수 있습니다. 예를 들어, 연결된 지갑을 기반으로 사용자의 청구 데이터를 자동으로 채워 사용자 경험을 대폭 향상시킬 수 있습니다.

출시 전:

1. 작은 배포 목록으로 데브넷에서 테스트
2. 청구 URL과 증명이 올바르게 작동하는지 확인
3. 종료 프로세스 테스트

## Gumdrop 종료

에어드롭 기간이 끝난 후 청구되지 않은 토큰을 회수하세요:

```bash
ts-node gumdrop-cli.ts close \
  -e devnet \
  --base <GUMDROP_KEYPAIR> \
  --keypair <AUTHORITY_KEYPAIR> \
  --claim-integration transfer \
  --transfer-mint <TOKEN_MINT>
```

## 결론

Gumdrop은 청구 기반 메커니즘을 통해 SPL 토큰을 배포하는 강력하고 유연한 방법을 제공합니다. 이 접근 방식은 기존 에어드롭에 비해 여러 가지 장점을 제공합니다:

- **비용 효율성**: 트랜잭션 비용은 배포자가 아닌 청구자가 지불합니다
- **제어된 배포**: 검증된 수신자만이 할당된 토큰을 청구할 수 있습니다
- **복구 가능성**: 에어드롭 기간 후 청구되지 않은 토큰을 회수할 수 있습니다
- **유연성**: 선호하는 채널을 통해 사용자에게 도달하는 다양한 배포 방법

Gumdrop을 구현할 때:
1. 가장 신뢰할 수 있는 경험을 위해 지갑 기반 배포를 선택하세요
2. 메인넷 배포 전에 데브넷에서 철저히 테스트하세요
3. 더 나은 사용자 경험을 위해 커스텀 프론트엔드 구축을 고려하세요
4. 나중에 종료할 수 있도록 Gumdrop 키페어를 저장하세요

이 가이드를 따라하면 사용자에게 원활한 청구 경험을 제공하면서도 제어할 수 있는 안전하고 효율적인 토큰 배포 시스템을 만들 수 있습니다.

## 도움이 필요하신가요?

- 지원을 위해 [Discord](https://discord.gg/metaplex)에 참여하세요
- [Metaplex Gumdrop 문서](https://metaplex.com/docs/legacy-documentation/gumdrop)를 확인하세요
- [소스 코드](https://github.com/metaplex-foundation/gumdrop)를 검토하세요
