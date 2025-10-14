---
title: 개요
metaTitle: 개요 | Sugar
description: Candy Machine 관리를 위한 CLI 도구인 Sugar의 자세한 개요입니다.
---

Sugar는 Candy Machine과 상호작용하기 위한 명령줄 도구입니다. Candy Machine의 전체 생명주기를 관리할 수 있게 해주며 다음과 같은 장점을 가집니다:

- 모든 Candy Machine 설정을 포함하는 단일 구성 파일;
- 미디어/메타데이터 파일 업로드 및 Candy Machine 배포의 향상된 성능 &mdash; 이러한 작업은 멀티스레드 시스템을 활용하여 필요한 계산 시간을 현저히 단축합니다;
- 정보 제공적인 오류 메시지와 함께 견고한 오류 처리 및 입력 검증;
- 명령이 중단되어도 상태가 유지됩니다 – 예를 들어, 업로드가 실패하면 업로드를 다시 실행할 수 있고 실패한 것들만 재시도됩니다.

Sugar 설정은 좋아하는 터미널 애플리케이션을 열고 바이너리 파일을 다운로드하는 것만큼 간단합니다.

{% callout %}
Sugar를 사용하여 Candy Machine을 생성하는 방법에 대한 전체 가이드는 [여기](/kr/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine)에서 찾을 수 있습니다.

{% /callout %}

Sugar는 Candy Machine 생성 및 관리를 위한 명령어 모음을 포함합니다. 명령줄에서 다음을 실행하여 전체 명령어 목록을 볼 수 있습니다:

```bash
sugar
```

이는 명령어 목록과 그 간단한 설명을 표시합니다:
```
sugar-cli 2.7.1
Metaplex Candy Machine 생성 및 관리를 위한 명령줄 도구입니다.

USAGE:
    sugar [OPTIONS] <SUBCOMMAND>

OPTIONS:
    -h, --help                     도움말 정보 출력
    -l, --log-level <LOG_LEVEL>    로그 레벨: trace, debug, info, warn, error, off
    -V, --version                  버전 정보 출력

SUBCOMMANDS:
    airdrop       candy machine에서 NFT 에어드랍
    bundlr        bundlr 네트워크와 상호작용
    collection    candy machine의 컬렉션 관리
    config        candy machine 구성 관리
    deploy        캐시 항목을 온체인 candy machine 구성에 배포
    freeze        freeze guard 작업 관리
    guard         candy machine의 가드 관리
    hash          숨겨진 설정을 위한 캐시 파일 해시 생성
    help          이 메시지 또는 주어진 하위 명령의 도움말 출력
    launch        에셋으로부터 candy machine 배포 생성
    mint          candy machine에서 NFT 하나 민팅
    reveal        숨겨진 설정 candy machine에서 NFT 공개
    show          기존 candy machine의 온체인 구성 표시
    sign          candy machine에서 NFT 하나 또는 전체에 서명
    upload        에셋을 스토리지에 업로드하고 캐시 구성 생성
    validate      JSON 메타데이터 파일 검증
    verify        업로드된 데이터 확인
    withdraw      candy machine 계정에서 자금을 인출하여 계정을 닫음
```

특정 명령어(예: `deploy`)에 대한 더 많은 정보를 얻으려면 help 명령어를 사용하세요:

```
sugar help deploy
```

이는 간단한 설명과 함께 옵션 목록을 표시합니다:

```
캐시 항목을 온체인 candy machine 구성에 배포

USAGE:
    sugar deploy [OPTIONS]

OPTIONS:
    -c, --config <CONFIG>
            구성 파일 경로, 기본값은 "config.json" [default: config.json]

        --cache <CACHE>
            캐시 파일 경로, 기본값은 "cache.json" [default: cache.json]

        --collection-mint <COLLECTION_MINT>
            candy machine이 토큰을 민팅할 선택적 컬렉션 주소

    -h, --help
            도움말 정보 출력

    -k, --keypair <KEYPAIR>
            키페어 파일 경로, Sol config를 사용하거나 기본값은 "~/.config/solana/id.json"

    -l, --log-level <LOG_LEVEL>
            로그 레벨: trace, debug, info, warn, error, off

    -p, --priority-fee <PRIORITY_FEE>
            우선순위 수수료 값 [default: 500]

    -r, --rpc-url <RPC_URL>
            RPC Url
```

Ape16Z가 의뢰한 OtterSec의 Sugar 감사 보고서는 [여기](https://docsend.com/view/is7963h8tbbvp2g9)에서 확인할 수 있습니다.