---
title: airdrop
metaTitle: airdrop | Sugar
description: sugar를 사용하여 (p)NFT를 에어드롭하는 명령어.
---

## 사용법

`airdrop` 명령은 명령줄에서 Candy Machine의 NFT를 지갑 목록으로 민팅합니다.

기본적으로 `airdrop_list.json`이라는 파일이 필요하며, 여기에는 지갑 공개 키와 각 지갑이 받아야 하는 NFT의 수량이 포함됩니다. 다음 예에서 `address1`은 2개의 NFT를 받고 `address2`는 7개를 받습니다. 파일은 다음 형식을 가져야 합니다:

```json
{
"address1": 2,
"address2": 7
}
```

완료 후 에어드롭 결과와 발생 가능한 문제가 포함된 `airdrop_results.json` 파일을 찾을 수 있습니다.

{% callout %}

가드가 활성화된 경우 airdrop 명령을 사용할 수 없습니다.

{% /callout %}

기본 `cache.json` 및 `airdrop_list.json`을 사용하는 경우 다음 명령을 사용하여 에어드롭을 시작할 수 있습니다:

```
sugar airdrop
```

그렇지 않으면 `--airdrop-list`로 airdrop_list 파일을 지정하세요:

```
sugar airdrop --airdrop-list <AIRDROP_LIST>
```

기본적으로 sugar는 기본 캐시 파일 `cache.json`을 사용합니다. `--cache`로 캐시 파일 이름을 재정의할 수도 있습니다:

```
sugar mint --cache <CACHE>
```

`--candy-machine`으로 특정 candy machine을 사용하도록 sugar에 지시할 수도 있습니다:

```
sugar mint --candy-machine <CANDY_MACHINE>
```

## 명령 재실행

경우에 따라 blockhash를 찾을 수 없거나 유사한 RPC / 네트워크 관련 이유로 민팅이 실패할 수 있습니다. 에어드롭 결과는 `airdrop_results.json`에 저장됩니다. 명령을 재실행하면 에어드롭 목록과 에어드롭 결과가 비교됩니다.

주의: 경우에 따라 타임아웃이 발생하기 전에 트랜잭션을 확인할 수 없다는 메시지가 표시됩니다. 이러한 경우 탐색기 등에서 NFT가 민팅되었는지 확인해야 합니다.
