---
title: 로컬 검증자 설정
metaTitle: 로컬 검증자 설정 | Metaplex Guides
description: 로컬 개발 환경을 설정하고 로컬 검증자를 사용하는 방법을 배웁니다
# remember to update dates also in /components/guides/index.js
created: '04-19-2025'
updated: '04-19-2025'
---

## 개요

**로컬 검증자**는 개인 노드 역할을 하며, 라이브 블록체인 네트워크에 연결할 필요 없이 애플리케이션을 테스트할 수 있는 로컬 샌드박스 환경을 제공합니다. **모든 네이티브 프로그램이 사전 설치되고** 다양한 기능이 활성화된 Solana 원장의 단순화된 버전인 **완전히 커스터마이징 가능한 로컬 테스트 원장**을 운영합니다.

### 설정

로컬 검증자를 사용하기 시작하려면 운영 체제에 맞는 적절한 명령어를 사용하여 Solana Tools CLI를 설치해야 합니다.

{% dialect-switcher title="설치 명령어" %}

{% dialect title="MacOs & Linux" id="MacOs & Linux" %}

```
sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
```

{% /dialect %}

{% dialect title="Windows" id="Windows" %}

```
cmd /c "curl https://release.solana.com/v1.18.18/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
```

{% /dialect %}

{% /dialect-switcher %}

**참고**: 설치 스크립트는 Solana의 `1.18.18` 버전을 참조합니다. 최신 버전을 설치하거나 다른 설치 방법을 확인하려면 공식 [Solana 문서](https://docs.solanalabs.com/cli/install)를 참조하세요.

### 사용법

CLI를 설치한 후, 간단한 명령어로 로컬 검증자를 시작할 수 있습니다.

```
solana-test-validator
```

시작하면 검증자는 로컬 URL(http://127.0.0.1:8899)에서 액세스할 수 있습니다. 이 URL로 코드를 구성하여 연결을 설정해야 합니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi("http://127.0.0.1:8899")
```

로컬 검증자는 사용자 폴더에 `test-ledger`라는 디렉터리를 생성합니다. 이 디렉터리는 계정과 프로그램을 포함하여 검증자와 관련된 모든 데이터를 보관합니다.

로컬 검증자를 재설정하려면 `test-ledger` 폴더를 삭제하거나 재설정 명령어를 사용하여 검증자를 다시 시작할 수 있습니다.

또한, `solana-logs` 기능은 테스트 중 프로그램 출력을 모니터링하는 데 매우 유용합니다.

## 프로그램 및 계정 관리

로컬 검증자에는 메인넷에서 찾을 수 있는 특정 프로그램과 계정이 포함되어 있지 않습니다. 네이티브 프로그램과 테스트 중에 생성하는 계정만 포함되어 있습니다. 메인넷의 특정 프로그램이나 계정이 필요한 경우, Solana CLI를 사용하여 이들을 다운로드하고 로컬 검증자에 로드할 수 있습니다.

### 계정 및 프로그램 다운로드:

테스트 목적으로 소스 클러스터에서 로컬 검증자로 계정이나 프로그램을 쉽게 다운로드할 수 있습니다. 이를 통해 메인넷 환경을 복제할 수 있습니다.

**계정의 경우:**
```
solana account -u <source cluster> --output <output format> --output-file <destination file name/path> <address of account to fetch>
```
**프로그램의 경우:**
```
solana program dump -u <source cluster> <address of account to fetch> <destination file name/path>
```

### 계정 및 프로그램 로딩:

다운로드한 후, 이러한 계정과 프로그램을 CLI를 사용하여 로컬 검증자에 로드할 수 있습니다. 특정 계정과 프로그램을 로컬 환경에 로드하여 테스트할 준비가 되도록 하는 명령어를 실행할 수 있습니다.

**계정의 경우:**
```
solana-test-validator --account <address to load the account to> <path to account file> --reset
```
**프로그램의 경우**
```
solana-test-validator --bpf-program <address to load the program to> <path to program file> --reset
```

## 익스플로러에서 로컬 트랜잭션 보기

로컬 검증자를 사용하더라도 많은 익스플로러가 로컬 포트에 연결하고 앞서 언급한 `test-ledger` 폴더에 저장된 로컬 원장을 읽을 수 있는 기능을 가지고 있기 때문에 익스플로러 사용을 막지는 않습니다.

이를 수행하는 방법은 두 가지가 있습니다:
- 좋아하는 익스플로러의 로컬 클러스터를 가리키는 트랜잭션 서명에 대한 링크를 생성합니다.
- 웹페이지에서 클러스터를 수동으로 변경한 다음 트랜잭션 링크를 붙여넣습니다.

### 트랜잭션 서명에 대한 링크 생성

Umi로 트랜잭션을 전송하면 서명과 결과라는 두 가지 핵심 정보를 받게 됩니다. 서명은 base58 형식이므로 블록체인에서 읽을 수 있도록 하기 위해 이를 역직렬화해야 합니다.

다음 코드로 이를 수행할 수 있습니다:
```typescript
const signature = base58.deserialize(transaction.signature)[0]
```

서명을 얻으면 선호하는 익스플로러와 함께 다음과 같이 사용할 수 있습니다:

{% totem %}

{% totem-accordion title="Solana Explorer" %}

```typescript
console.log(`Transaction Submitted! https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`)
```

{% /totem-accordion %}

{% totem-accordion title="SolanaFM" %}

```typescript
console.log(`Transaction Submitted! https://solana.fm/tx/${signature}?cluster=localnet-solana`)
```

{% /totem-accordion %}

{% /totem %}

### 클러스터 수동 변경

앞서 언급한 바와 같이, 블록 익스플로러는 사용자가 트랜잭션을 보기 위해 커스텀 RPC를 활용할 수 있게 해줍니다. 로컬 검증자 트랜잭션을 보려면 `클러스터 선택` 모달에서 입력 상자를 찾아 다음 주소를 입력해야 합니다: `http://127.0.0.1:8899`.

참고: [Solana Explorer](https://explorer.solana.com/)는 Custom RPC URL을 선택할 때 자동으로 로컬 검증자 포트로 기본 설정되므로 추가 변경이 필요하지 않습니다.

## "Metaplex" 로컬 검증자 생성

{% callout title="고지사항" %}

안타깝게도 이 가이드의 이 부분은 Bash 스크립트 사용으로 인해 **Linux** 또는 **MacOS** 사용자만 이용할 수 있습니다. 하지만 Windows를 사용하고 있으면서도 자체 Metaplex 검증자를 생성하기 위해 따라하고 싶다면 [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) 또는 [이 스레드](https://stackoverflow.com/questions/6413377/is-there-a-way-to-run-bash-scripts-on-windows)에서 제공하는 솔루션 중 하나를 사용할 수 있습니다!

{% /callout %}

로컬 검증자 설정과 관리의 기본 사항을 바탕으로, **bash 스크립트**를 통해 개인화된 로컬 검증자를 생성하고 관리할 수 있습니다.

예를 들어, 주요 Metaplex 프로그램인 `mpl-token-metadata`, `mpl-bubblegum`, `mpl-core`를 포함하는 `metaplex-local-validator`를 생성할 수 있습니다.

### 디렉터리 설정 및 프로그램 데이터 다운로드

먼저 로컬 검증자에 필요한 프로그램을 저장할 경로 내에 디렉터리를 생성합니다.

```
mkdir ~/.local/share/metaplex-local-validator
```

그다음, 지정된 주소에서 이 디렉터리로 프로그램 데이터를 다운로드합니다.

```
solana program dump -u m metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so
```
```
solana program dump -u m BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so
```
```
solana program dump -u m CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so
```

{% totem %}

{% totem-accordion title="추가 Metaplex 프로그램" %}

| 이름               | 프로그램 ID                                   |
| ------------------ | -------------------------------------------- |
| Auction House      | hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk  |
| Auctioneer         | neer8g6yJq2mQM6KbnViEDAD4gr3gRZyMMf4F2p3MEh  |
| Bubblegum          | BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY |
| Candy Guard        | Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g |
| Candy Machine v3   | CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR |
| Core               | CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d |
| Core Candy Guard   | CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ |
| Core Candy Machine | CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J |
| Gumdrop            | gdrpGjVffourzkdDRrQmySw4aTHr8a3xmQzzxSwFD1a  |
| Hydra              | hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg  |
| Inscriptions       | 1NSCRfGeyo7wPUazGbaPBUsTM49e1k2aXewHGARfzSo  |
| MPL-Hybrid         | MPL4o4wMzndgh8T1NVDxELQCj5UQfYTYEkabX3wNKtb  |
| Token Auth Rules   | auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg  |
| Token Metadata     | metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s  |

{% /totem-accordion %}

{% /totem %}

### 검증자 스크립트 생성

다음으로, 필요한 모든 프로그램을 포함하여 로컬 검증자를 실행하는 과정을 단순화하는 검증자 스크립트를 생성합니다. 검증자 설정을 스크립트화함으로써, 관련된 모든 Metaplex 프로그램을 포함한 개인화된 환경으로 쉽게 테스트를 시작할 수 있습니다.

다음을 사용하여 새 스크립트 파일을 열어 시작합니다:

```
sudo nano /usr/local/bin/metaplex-local-validator
```

**참고**: /usr/local/bin 디렉터리가 존재하지 않으면 `sudo mkdir -p -m 775 /usr/local/bin`을 사용하여 생성할 수 있습니다.

편집기에 다음 코드를 붙여넣고 저장합니다:

```bash
#!/bin/bash

# 검증자 명령어
COMMAND="solana-test-validator -r --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s ~/.local/share/metaplex-local-validator/mpl-token-metadata.so --bpf-program BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY ~/.local/share/metaplex-local-validator/mpl-bubblegum.so --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d ~/.local/share/metaplex-local-validator/mpl-core.so"

# 스크립트에 전달된 추가 인수 추가
for arg in "$@"
do
    COMMAND+=" $arg"
done

# 명령어 실행
eval $COMMAND
```

**참고**: 종료하고 저장하려면 Ctrl + X를 사용한 다음 Y를 눌러 확인하고 Enter를 눌러 저장합니다.

스크립트가 준비되면 실행할 수 있도록 권한을 수정합니다:

```
sudo chmod +x /usr/local/bin/metaplex-local-validator
```

마지막으로, 프로젝트 폴더 내에서 새로운 검증자를 테스트합니다:

```
metaplex-local-validator
```