---
title: guard
metaTitle: guard | Sugar
description: guard 명령어.
---

`guard` 명령은 Candy Machine의 [가드](/ko/smart-contracts/candy-machine/guards) 구성을 관리하는 데 사용됩니다.

Sugar 구성 파일에서 가드 구성을 완료하면 다음을 사용하여 Candy Guard를 추가할 수 있습니다:

```
sugar guard add
```

이 시점에서 `mint authority`가 이제 Candy Guard이므로 `mint` 명령이 작동을 멈춥니다.

Candy Guard 구성을 업데이트하려면 먼저 Sugar 구성 파일에서 필요한 수정을 한 다음 명령을 실행해야 합니다:

```
sugar guard update
```

Candy Machine 가드의 온체인 구성을 출력하려면 다음 명령을 사용하세요:

```
sugar guard show
```

Candy Machine에서 가드를 제거하려면 다음 명령을 사용하세요:

```
sugar guard remove
```

가드를 제거한 후 `mint` 명령을 사용하여 Candy Machine에서 민팅할 수 있습니다.

`remove` 명령은 Candy Guard 계정을 닫지 않습니다. 계정을 닫고 렌트 수수료를 회수하려면 다음 명령을 사용하세요:

```
sugar guard withdraw
```
