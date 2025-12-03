---
title: 개요
metaTitle: 개요 | Fusion
description: Fusion을 사용하여 합성 가능한 NFT에 대한 고수준 개요를 제공합니다.
---

Fusion은 Trifle 프로그램으로 구동되는 NFT 합성 기능입니다. {% .lead %}

Trifle 프로그램은 Token Metadata의 Escrow 확장 위에 구축되었습니다. Trifle PDA를 생성자이자 관리자로 사용하는 Creator Owned Escrow(COE)를 사용합니다. 그 목적은 NFT 소유권 주변에 온체인 추적 및 합성 기능을 추가하는 것입니다. 또한 토큰 소유권 주변의 규칙과 효과를 지정하는 능력을 통해 복잡한 소유권 모델을 생성자가 구현할 수 있습니다.

🔗 **도움이 되는 링크:**

- [Token Metadata Escrow](https://github.com/metaplex-foundation/mpl-token-metadata/tree/main/programs/token-metadata/program/src/processor/escrow)
- [Fusion Program](https://github.com/metaplex-foundation/mpl-trifle/tree/master/programs/trifle)

Trifle 프로그램이 제공하는 계정과 명령어를 살펴보며 더 자세히 알아보겠습니다.

## 계정

### Escrow Constraint Model

Constraint Model은 Trifle 계정으로의 전송을 허용하고 Trifle 계정에서의 전송을 허용하기 위해 평가할 수 있는 제한 및 요구 사항의 집합입니다. 전송 시 계약은 constraint model을 확인하여 TOE로 전송되거나 TOE에서 전송되는 토큰에 대해 수행해야 하는 검사를 결정합니다. 하나의 Constraint Model은 다양한 NFT와 그들의 Trifle 계정을 서비스할 수 있습니다.

Constraint Model은 슬롯으로 정의된 제약 조건의 집합으로 볼 수 있습니다. 각 슬롯은 슬롯 이름, 제약 조건 유형(None/Collection/TokenSet), 그리고 슬롯에서 허용 가능한 토큰 수로 구성됩니다. 제약 조건은 키가 슬롯 이름이고 값이 제약 조건 유형과 토큰 제한인 `HashMap`으로 저장됩니다.

### Trifle

Trifle 계정은 COE가 소유한 토큰을 온체인에서 추적하는 역할을 합니다. 또한 사용되는 Constraint Model에 연결됩니다. Trifle 계정은 Constraint Model의 슬롯 의미론을 반영하는 내부 HashMap으로 토큰을 관리합니다.

## 명령어

### Create Escrow Constraint Model Account

Trifle 계정에 사용할 수 있는 Constraint Model을 생성합니다.

### Create Trifle Account

NFT에서 사용할 Trifle 계정을 생성합니다. Trifle 계정이 확인할 수 있도록 생성 시 필수 Constraint Model 계정을 전달해야 합니다.

### Transfer In

Trifle 계정이 관리하는 Creator Owned Escrow로 토큰을 전송합니다. COE로 표준 spl-token 전송을 수행하는 것이 가능하지만, 이 명령어를 사용하는 것이 Trifle 계정이 소유한 토큰을 관리하고 추적할 수 있는 유일한 방법입니다. 이 명령어는 또한 전송되는 토큰이 유효한지 확인하기 위해 Constraint Model에 대한 검사를 수행합니다.

### Transfer Out

Trifle 계정이 관리하는 Creator Owned Escrow에서 토큰을 전송합니다. 이 명령어는 또한 전송되는 토큰이 제거 허용되는지 확인하기 위해 Constraint Model에 대한 검사를 수행합니다.

### Add None Constraint to Escrow Constraint Model

Constraint Model에 None 제약 조건을 생성합니다. 이때 슬롯 이름과 슬롯에서 허용 가능한 토큰 수가 정의됩니다.

### Add Collection Constraint to Escrow Constraint Model

Constraint Model에 Collection 제약 조건을 생성합니다. 이때 슬롯 이름, 허용 가능한 컬렉션, 그리고 슬롯에서 허용 가능한 토큰 수가 정의됩니다.

### Add Tokens Constraint to Escrow Constraint Model

Constraint Model에 Collection 제약 조건을 생성합니다. 이때 슬롯 이름, 허용 가능한 토큰들, 그리고 슬롯에서 허용 가능한 토큰 수가 정의됩니다.

### Remove Constraint from Escrow Constraint Model

이름으로 지워질 슬롯을 지정하여 Constraint Model에서 제약 조건을 제거합니다.