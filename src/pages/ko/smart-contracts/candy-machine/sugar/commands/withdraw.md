---
title: withdraw
metaTitle: withdraw | Sugar
description: withdraw 명령어.
---

Candy Machine의 민팅이 완료되면 온체인에 저장된 데이터에 대한 렌트 비용으로 사용된 자금을 회수할 수 있습니다. 다음을 실행하여 인출을 시작할 수 있습니다:

```
sugar withdraw --candy-machine <CANDY MACHINE ID>
```

여기서 `<CANDY MACHINE ID>`는 Candy Machine ID(공개 키)입니다 — `deploy` 명령에서 제공하는 ID입니다.

현재 키페어와 연결된 모든 Candy Machine에서 자금을 인출하는 것도 가능합니다:

```
sugar withdraw
```

또는 현재 키페어의 모든 Candy Machine과 관련 자금을 나열할 수 있습니다:

```
sugar withdraw --list
```

{% callout %}

Candy Machine이 계정을 비우면 작동을 멈추므로 라이브 Candy Machine의 렌트를 인출해서는 안 됩니다.

{% /callout %}
