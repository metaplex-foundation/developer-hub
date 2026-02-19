---
title: 개요
metaTitle: 개요 | Tool
description: Solana의 네이티브 프로그램을 위한 필수 기능 세트를 제공하여 Umi를 보완하도록 설계된 패키지.
---

**mpl-toolbox** 패키지는 Solana의 네이티브 프로그램을 위한 필수 기능 세트를 제공하여 Umi를 보완하도록 설계되었습니다.

{% quick-links %}

{% quick-link title="API 레퍼런스" icon="CodeBracketSquare" target="_blank" href="https://mpl-toolbox.typedoc.metaplex.com/" description="특정한 것을 찾고 계신가요? API 레퍼런스를 살펴보고 답을 찾아보세요." /%}

{% /quick-links %}

## 설치

{% packagesUsed packages=["toolbox"] type="npm" /%}

이 패키지는 Umi 패키지를 사용할 때 기본적으로 포함되지 않으므로 설치하고 사용을 시작하려면 다음 명령을 실행해야 합니다.

```
npm i @metaplex-foundation/mpl-toolbox
```

## 포함된 프로그램

Umi와 다른 Metaplex 제품들이 이미 시작하는 데 필요한 모든 필수 기능을 포함하는 포괄적인 패키지를 제공하지만, 특히 Solana의 네이티브 프로그램을 다룰 때 저수준이지만 중요한 작업에 필요한 헬퍼와 기능은 포함하지 않습니다. 예를 들어, Umi만으로는 SPL System Program을 사용하여 계정을 생성하거나 SPL Address Lookup Table 프로그램에서 Lookup Table을 확장하는 것이 불가능합니다.

그래서 우리는 이러한 저수준 작업을 단순화하는 Solana의 네이티브를 위한 필수 헬퍼 세트를 제공하는 **mpl-toolbox** 패키지를 만들었습니다.

**mpl-toolbox 패키지는 다음 프로그램의 헬퍼를 포함합니다:**

| 프로그램                                                                                | 설명                                                                                                                 |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **SPL System**                                                                          | 계정 생성을 위한 Solana의 네이티브 프로그램.                                                                               |
| **SPL Token and SPL Associated Token**.                                                 | 토큰 관리를 위한 Solana의 네이티브 프로그램.                                                                               |
| **SPL Memo**                                                                            | 트랜잭션에 메모를 첨부하기 위한 Solana의 네이티브 프로그램.                                                                |
| **SPL Address Lookup Table**                                                            | 조회 테이블 관리를 위한 Solana의 네이티브 프로그램.                                                                         |
| **SPL Compute Budget**                                                                  | 컴퓨트 유닛 관리를 위한 Solana의 네이티브 프로그램.                                                                         |
| **MPL System Extras**                                                                   | SPL System 위에 추가적인 저수준 기능을 제공하는 Metaplex 프로그램.                                             |
| **MPL Token Extras**                                                                    | SPL Token 위에 추가적인 저수준 기능을 제공하는 Metaplex 프로그램.                                              |
