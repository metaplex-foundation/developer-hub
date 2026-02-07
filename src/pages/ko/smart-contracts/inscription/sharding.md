---
title: Inscription Sharding
metaTitle: Sharding | Inscription
description: Inscription 민팅 시 쓰기 잠금 경합을 방지하는 데 사용되는 방법을 설명합니다.
---

## Solana 쓰기 잠금

## 샤딩된 카운터

이 순위는 새로운 inscription을 생성할 때 쓰기 잠금을 방지하기 위해 32개의 샤드에 저장됩니다. 이 샤딩을 통해 동일한 슬롯에서 최대 32개의 Inscription을 민팅할 수 있어, 리소스 경합을 방지하고 Inscription 트랜잭션이 성공할 가능성을 훨씬 높입니다.
