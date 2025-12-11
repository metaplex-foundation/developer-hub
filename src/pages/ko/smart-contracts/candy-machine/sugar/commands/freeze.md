---
title: freeze
metaTitle: freeze | Sugar
description: freeze 명령어.
---

Candy Machine에 freeze 가드가 활성화되어 있으면 `freeze` 명령을 사용하여 다양한 단계를 관리할 수 있습니다.

기본 가드 또는 개별 그룹에서 freeze 가드를 활성화한 후 민팅을 시작하기 전에 초기화해야 합니다. freeze 가드를 초기화하려면 `initialize` 하위 명령을 사용하세요:

```
sugar freeze initialize --period <SECONDS>
```

여기서 `--period`는 민팅된 자산이 동결될 초 단위의 간격을 결정합니다. 이 기간이 지나면 보유자는 자산을 해동할 수 있습니다.

freeze Guard가 `default` 그룹에 없는 경우 `--label <LABEL>`도 추가해야 합니다.

{% callout %}

freeze는 한 번만 초기화할 수 있습니다. 초기화 후에는 기간을 업데이트할 수 없습니다.

{% /callout %}

자산을 해동하려면 `thaw` 하위 명령을 사용할 수 있습니다:

```
sugar freeze thaw <NFT MINT>
```

`--all` 옵션을 사용하여 동일한 Candy Machine의 모든 NFT를 해동할 수도 있습니다:

```
sugar freeze thaw --all
```

모든 NFT가 해동되면 자금을 잠금 해제할 수 있습니다:

```
sugar freeze unlock-funds
```
