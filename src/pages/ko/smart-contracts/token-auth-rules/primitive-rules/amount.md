---
title: Amount
metaTitle: Amount | Token Auth Rules
description: The Amount primitive rule
---

## Amount

전송되는 토큰 양이 특정 금액과 비교됩니다 (보다 큼, 보다 작음, 또는 같음).

### 필드

* **amount** - 비교할 금액
* **operator** - 사용할 비교 연산: 보다 큼, 보다 작음, 같음
* **field** - 비교할 페이로드 필드

```js
// 이 Rule Set은 5개보다 많은 토큰이 전송될 경우에만 true로 평가됩니다.
const revision: RuleSetRevisionV2 = {
  libVersion: 2,
  name: 'My Rule Set',
  owner,
  operations: {
    transfer: {
      type: 'Amount',
      field: 'Amount',
      operator: '>'
      amount: 5,
    },
  },
}
```
